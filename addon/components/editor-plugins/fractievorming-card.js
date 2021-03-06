import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-card';

import FractieToCreate from '../../models/fractie-to-create';
import FractietypeToCreate from '../../models/fractietype-to-create';
import initOnafhankelijkeFractieToCreate from '../../utils/init-onafhankelijke-fractie-to-create';
import LidmaatschapToCreate from '../../models/lidmaatschap-to-create';
import TijdsintervalToCreate from '../../models/tijdsinterval-to-create';
import RdfaContextScanner from '@lblod/ember-rdfa-editor/utils/rdfa-context-scanner';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import SerializationHelper from '../../mixins/serialization-helper';
/**
* Card displaying a hint of the Date plugin
*
* @module editor-fractievorming-plugin
* @class FractievormingCard
* @extends Ember.Component
*/
export default Component.extend(SerializationHelper, {
  layout,
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

  bestuursorgaanUri: reads('rdfaEditorFractievormingPlugin.bestuursorgaanUri'),

  async setProperties() {
    let bestuurseenheid = ( await this.store.query('bestuurseenheid',
                                           { 'filter[bestuursorganen][heeft-tijdsspecialisaties][:uri:]': this.bestuursorgaanUri }
                                                 )).firstObject;
    this.set('bestuurseenheid', bestuurseenheid);

    let bestuursorgaan = (await this.store.query('bestuursorgaan',
                                                  { 'filter[:uri:]': this.bestuursorgaanUri }
                                                )).firstObject;
    this.set('bestuursorgaan', bestuursorgaan);
  },

  loadData: task(function *(){
    yield this.setProperties();
    if(this.info.editMode)
      yield this.loadDataEditMode();
    else
      yield this.loadDataInitialMode();
  }),

  tableReset: task(function *(){
     yield this.setProperties();
     yield this.loadDataInitialMode();
  }),

  async loadDataEditMode(){
    let triples = this.serializeTableToTriples(this.info.domNodeToUpdate);
    let mandatarissen = await this.instantiateMandatarissen(triples);
    mandatarissen.map(m => this.linkMandatarisFractie(triples, m));
    let fracties = mandatarissen.reduce((fracties, m) => {
      let fractie = m.heeftLidmaatschap && m.heeftLidmaatschap.binnenFractie;
      if(fractie && !fracties.find(f => f.uri == fractie.uri) && !fractie.fractietype.isOnafhankelijk)
        fracties.push(fractie);
      return fracties;
    }, []);
    this.set('mandatarissen', mandatarissen);
    this.set('fracties', A([...fracties, initOnafhankelijkeFractieToCreate(this.bestuurseenheid, [this.bestuursorgaan])]));
  },

  async loadDataInitialMode(){
    let table = this.getMandatarisTableNode();
    if(!table)
      return;

    let triples = this.serializeTableToTriples(table);
    if(triples.length == 0)
      return;

    let mandatarissen = await this.instantiateMandatarissen(triples);
    let fracties = await this.createFractiesProposals(mandatarissen);

    await Promise.all(mandatarissen.map(async m => await this.linkMandatarisFractieProposal(fracties, m)));

    this.set('mandatarissen', mandatarissen);
    this.set('fracties', fracties);
  },

  async linkMandatarisFractieProposal(fracties, mandataris){
    if(mandataris.heeftLidmaatschap && mandataris.heeftLidmaatschap.binnenFractie)
      return mandataris;

    let lijstnaam = await mandataris.isBestuurlijkeAliasVan.isKandidaatVoor.firstObject.lijstnaam;
    let fractie = fracties.find(f =>  f.naam == lijstnaam);
    let lidmaatschap = LidmaatschapToCreate.create({
      binnenFractie: fractie || initOnafhankelijkeFractieToCreate(this.bestuurseenheid, [this.bestuursorgaan]),
      lidGedurende: TijdsintervalToCreate.create({begin: new Date().toISOString() }) //TODO: make autopropsal
    });

    mandataris.set('heeftLidmaatschap', lidmaatschap);

    return mandataris;
  },

  linkMandatarisFractie(triples, mandataris){
    const lidmaatschapUri = (triples.find((t) => t.predicate === mandataris.rdfaBindings.heeftLidmaatschap && t.subject == mandataris.uri) || {}).object;
    if(lidmaatschapUri){
      const lidmaatschap = LidmaatschapToCreate.create({
        uri: lidmaatschapUri
      });

      mandataris.set('heeftLidmaatschap', lidmaatschap);

      const fractieUri = (triples.find((t) => t.predicate === lidmaatschap.rdfaBindings.binnenFractie
                                       && t.subject == lidmaatschapUri) || {}).object;
      if(fractieUri){
        const fractie = FractieToCreate.create({
          uri: fractieUri,
          bestuurseenheid: this.bestuurseenheid,
          bestuursorganenInTijd: [ this.bestuursorgaan ]
        });
        fractie.set('naam', (triples.find((t) => t.predicate === fractie.rdfaBindings.naam && t.subject == fractie.uri) || {}).object);

        lidmaatschap.set('binnenFractie', fractie);
        const fractieTypeUri = triples.find((t) => t.predicate === fractie.rdfaBindings.fractietype && t.subject == fractie.uri).object;
        if(fractieTypeUri){
          let fractietype = FractietypeToCreate.create({uri: fractieTypeUri});
          fractie.set('fractietype', fractietype);
        }
      }

      const lidGedurendeUri = (triples.find((t) => t.predicate === lidmaatschap.rdfaBindings.lidGedurende
                                            && t.subject == lidmaatschapUri) || {}).object;
      if(lidGedurendeUri){
        let tijdsInterval = TijdsintervalToCreate.create({uri: lidGedurendeUri});

        const beginValue = (triples.find((t) => t.predicate === tijdsInterval.rdfaBindings.begin
                                         && t.subject == lidGedurendeUri) || {}).object;
        tijdsInterval.set('begin', beginValue);

        lidmaatschap.set('lidGedurende', tijdsInterval);
      }

    }
  },

  async createFractiesProposals(mandatarissen){
    let fracties = A();

    //take the new ones (based on list)
    for(let mandataris of mandatarissen){
      let lijstNaam = await mandataris.isBestuurlijkeAliasVan.isKandidaatVoor.firstObject.lijstnaam;
      if(!fracties.find(f => f.naam == lijstNaam)){
        let fractie = FractieToCreate.create({
          naam: lijstNaam,
          bestuurseenheid: this.bestuurseenheid,
          bestuursorganenInTijd: [ this.bestuursorgaan ],
          fractietype: FractietypeToCreate.create({})
        });
        fracties.pushObject(fractie);
      }
    }

    //needs onafhankelijke
    fracties.pushObject(initOnafhankelijkeFractieToCreate(this.bestuurseenheid, [ this.bestuursorgaan ]));
    return fracties;
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if(this.bestuursorgaanUri)
      this.loadData.perform();
  },

  createWrappingHTML(innerHTML){
    return `<div property="ext:fractievormingTable">${innerHTML}</div>`;
  },

  actions: {
    resetTable(){
      this.tableReset.perform();
    },
    insert(){
      const html = this.createWrappingHTML(document.getElementById(this.outputId).innerHTML);
      this.hintsRegistry.removeHintsAtLocation(this.location, this.hrId, this.info.who);
      this.get('editor').replaceNodeWithHTML(this.info.domNodeToUpdate, html);
    },
    togglePopup(){
       this.toggleProperty('popup');
    },

    toggleNieuweStijl(){
      this.toggleProperty('nieuweStijl');
    }
  }
});
