import uuid from 'uuid/v4';
import EmberObject from '@ember/object';

export default EmberObject.extend({
  uri: null,
  naam: null,
  fractietype: null,
  bestuursorganenInTijd: null,
  bestuurseenheid: null,

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: 'http://data.vlaanderen.be/ns/mandaat#Fractie',
    naam: 'http://www.w3.org/ns/regorg#legalName',
    fractietype: 'http://mu.semte.ch/vocabularies/ext/isFractietype',
    bestuursorganenInTijd: 'http://www.w3.org/ns/org#memberOf',
    bestuurseenheid: 'http://www.w3.org/ns/org#linkedTo'
  },

  init() {
    this._super(...arguments);
    if (! this.uri)
      this.set('uri', `http://data.lblod.info/id/fracties/${uuid()}`);
  }
});
