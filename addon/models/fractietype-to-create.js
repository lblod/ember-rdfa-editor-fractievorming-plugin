import EmberObject from '@ember/object';
import { equal } from '@ember/object/computed';

export default EmberObject.extend({
  uri: null,
  label: null,

  isOnafhankelijk: equal('uri', 'http://data.vlaanderen.be/id/concept/Fractietype/Onafhankelijk'),
  isSamenwerkingsverband: equal('uri', 'http://data.vlaanderen.be/id/concept/Fractietype/Samenwerkingsverband'),

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: 'http://mu.semte.ch/vocabularies/ext/Fractietype',
    label: 'http://www.w3.org/2004/02/skos/core#prefLabel'
  },

  init(args) {
    this._super(...arguments);
    if (args.type == 'Onafhankelijk' || args.uri == 'http://data.vlaanderen.be/id/concept/Fractietype/Onafhankelijk'){
      this.set('uri', 'http://data.vlaanderen.be/id/concept/Fractietype/Onafhankelijk');
      this.set('label', 'Onafhankelijk');
    }
    else{
      this.set('uri', 'http://data.vlaanderen.be/id/concept/Fractietype/Samenwerkingsverband');
      this.set('label', 'Samenwerkingsverband');
    }
  }
});
