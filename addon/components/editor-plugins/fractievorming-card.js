import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-card';
import Mandataris from '../../models/mandataris';
import Fractie from '../../models/fractie';
import Fractietype from '../../models/fractietype';
import createOnafhankelijkeFractie from '../../utils/create-onafhankelijke-fractie';
import Lidmaatschap from '../../models/lidmaatschap';
import RdfaContextScanner from '@lblod/ember-rdfa-editor/utils/rdfa-context-scanner';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';

/**
* Card displaying a hint of the Date plugin
*
* @module editor-fractievorming-plugin
* @class FractievormingCard
* @extends Ember.Component
*/
export default Component.extend({
  layout,

  expandedExt: 'http://mu.semte.ch/vocabularies/ext/',
  oudMandaatPredicate: 'http://mu.semte.ch/vocabularies/ext/oudMandaat',
  outputId: computed('id', function() {
    return `output-fractie-tabel-${this.elementId}`;
  }),
  store: service(),
  rdfaEditorFractievormingPlugin: service(),

  /**
   * Region on which the card applies
   * @property location
   * @type [number,number]
   * @private
  */
  location: reads('info.location'),

  /**
   * Unique identifier of the event in the hints registry
   * @property hrId
   * @type Object
   * @private
  */
  hrId: reads('info.hrId'),

  /**
   * The RDFa editor instance
   * @property editor
   * @type RdfaEditor
   * @private
  */
  editor: reads('info.editor'),

  /**
   * Hints registry storing the cards
   * @property hintsRegistry
   * @type HintsRegistry
   * @private
  */
  hintsRegistry: reads('info.hintsRegistry'),

  bestuursorgaan: reads('rdfaEditorFractievormingPlugin.bestuursorgaan'),

  //TODO: load only when clicking
  //TODO: pass bestuursorgaan to components
  //TODO: fetch bestuurseenheid
  //TODO: edit mode
  //TODO: lid gedurende
  //TODO:  uri mandataris is NOK!!
  //TODO: bestuursorganenintijd
  //TODO: error on create fractie -> tordfa seria
  loadData: task(function *(){
    let table = this.getMandatarisTableNode();
    if(!table)
      return;
    let triples = this.serializeTableToTriples(table);
    if(triples.length == 0)
      return;

    let mandatarissen = yield this.instantiateMandatarissen(triples);
    let fracties = yield this.createFractiesProposals(mandatarissen);

    yield Promise.all(mandatarissen.map(async m => await this.linkMandatarisFractie(fracties, m)));

    this.set('mandatarissen', mandatarissen);
    this.set('fracties', fracties);
  }),


  async linkMandatarisFractie(fracties, mandataris){
    if(mandataris.heeftLidmaatschap && mandataris.heeftLidmaatschap.binnenFractie)
      return mandataris;

    let lijstnaam = await mandataris.isBestuurlijkeAliasVan.isKandidaatVoor.firstObject.lijstnaam;
    let fractie = fracties.find(f =>  f.naam == lijstnaam);
    //TODO: tijdsinterval
    let lidmaatschap = Lidmaatschap.create({binnenFractie: fractie || createOnafhankelijkeFractie([this.bestuursorgaan])});

    mandataris.set('heeftLidmaatschap', lidmaatschap);

    return mandataris;
  },

  async createFractiesProposals(mandatarissen){
    let fracties = A();
    for(let mandataris of mandatarissen){
      let lijstNaam = await mandataris.isBestuurlijkeAliasVan.isKandidaatVoor.firstObject.lijstnaam;
      if(!fracties.find(f => f.naam == lijstNaam)){
        let fractie = Fractie.create({naam: lijstNaam,
                                      bestuursorganenInTijd: [ this.bestuursorgaan ],
                                      fractietype: Fractietype.create({})});
        fracties.pushObject(fractie);
      }
    }

    //needs onafhankelijke
    fracties.pushObject(createOnafhankelijkeFractie([ this.bestuursorgaan ]));
    return fracties;
  },

  async instantiateMandatarissen(triples){
    const resources = triples.filter((t) => t.predicate === "a");
    const mandatarissen = A();
    for (let resource of resources) {
      if(!this.isResourceNewMandataris(resource, triples, mandatarissen))
        continue;
      mandatarissen.pushObject(await this.buildMandatarisFromTriples(triples.filter((t) => t.subject === resource.subject)));
    }
    return mandatarissen;
  },

  async buildMandatarisFromTriples(triples) {
    function setPropIfTripleFound(triples, obj, prop) {
      const triple = triples.find((t) => t.predicate === obj.rdfaBindings[prop]);
      if (triple) {
        obj.set(prop, triple.object.trim());
      }
    }
    const mandataris = Mandataris.create({ uri: triples[0].subject});
    setPropIfTripleFound(triples, mandataris, 'rangorde');
    setPropIfTripleFound(triples, mandataris, 'start');
    setPropIfTripleFound(triples, mandataris, 'einde');
    const mandaatURI = triples.find((t) => t.predicate === mandataris.rdfaBindings.bekleedt);
    if (mandaatURI) {
      const mandaat = await this.store.query('mandaat', { filter:{':uri:': mandaatURI.object}});
      mandataris.set('bekleedt', mandaat.get('firstObject'));
    }
    const persoonURI = triples.find((t) => t.predicate === mandataris.rdfaBindings.isBestuurlijkeAliasVan);
    if (persoonURI) {
      const persoon = await this.store.query('persoon',
                                             {
                                               filter: {
                                                 ':uri:': persoonURI.object,
                                                 'is-kandidaat-voor': { 'rechtstreekse-verkiezing': {'stelt-samen': {':uri:': this.bestuursorgaan}}}
                                               },
                                               include: 'is-kandidaat-voor'
                                             });
      mandataris.set('isBestuurlijkeAliasVan', persoon.get('firstObject'));
    }
    return mandataris;
  },

  isResourceNewMandataris(resource, triples, loadedMandatarissen){
    return resource.object === 'http://data.vlaanderen.be/ns/mandaat#Mandataris' &&
      ! loadedMandatarissen.some( (m) => m.uri === resource.subject) &&
      ! triples.some((t) => t.predicate === this.oudMandaatPredicate && t.object === resource.subject);
  },

  serializeTableToTriples(table){
    const contextScanner = RdfaContextScanner.create({});
    const contexts = contextScanner.analyse(table).map((c) => c.context);
    return Array.concat(...contexts);
  },

  getMandatarisTableNode(){
    return  document.querySelectorAll("[property='ext:mandatarisTabelInput']")[0]
      ||  document.querySelectorAll(`[property='${this.expandedExt}/mandatarisTabelInput']`)[0];
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.loadData.perform();
  },

  actions: {
    insert(){
      const html = document.getElementById(this.outputId).innerHTML;
      if (this.info.node) {
        this.hintsRegistry.removeHintsAtLocation(this.location, this.hrId, this.info.who);
        this.get('editor').replaceNodeWithHTML(this.info.node, html);
      }
      else {
        let mappedLocation = this.hintsRegistry.updateLocationToCurrentIndex(this.hrId, this.location);
        this.hintsRegistry.removeHintsAtLocation(this.location, this.hrId, this.info.who);
        this.get('editor').replaceNodeWithHTML(this.info.domNodeToUpdate, html);
      }
    },
    togglePopup(){
       this.toggleProperty('popup');
    }
  }
});
