import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-add-new-mandataris';
import { task } from 'ember-concurrency';
import RdfaContextScanner from '@lblod/ember-rdfa-editor/utils/rdfa-context-scanner';
import MandatarisToCreate from '../../models/mandataris-to-create';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'tr',
  layout,
  store: service(),

  //TODO: a blunt copy pasta
  getMandatarisTableNode(){
    return  document.querySelectorAll("[property='ext:mandatarisTabelInput']")[0]
      ||  document.querySelectorAll(`[property='${this.expandedExt}/mandatarisTabelInput']`)[0];
  },

  serializeTableToTriples(table){
    const contextScanner = RdfaContextScanner.create({});
    const contexts = contextScanner.analyse(table).map((c) => c.context);
    return Array.concat(...contexts);
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
    const mandataris = MandatarisToCreate.create({ uri: triples[0].subject});
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
                                                 'is-kandidaat-voor': { 'rechtstreekse-verkiezing': {'stelt-samen': {':uri:': this.bestuursorgaan.uri}}}
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

  loadData: task(function *(){
    let table = this.getMandatarisTableNode();
    if(!table)
      return;

    let triples = this.serializeTableToTriples(table);
    if(triples.length == 0)
      return;

    let mandatarissen = yield this.instantiateMandatarissen(triples);

    this.set('mandatarissen', mandatarissen);
  }),

  didReceiveAttrs() {
    this._super(...arguments);
    this.loadData.perform();
  },

  actions: {
    select(mandataris){
      this.set('selectedMandataris', mandataris);
    },
    save(){
      this.onSave(this.selectedMandataris);
      this.set('selectedMandataris', null);
    },
    cancel(){
      this.set('selectedMandataris', null);
      this.onCancel();
    }
  }
});
