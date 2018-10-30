import Model from 'ember-data/model';
import { collect } from '@ember/object/computed';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep: collect.apply(this,['id', 'aantalNaamstemmen', 'plaatsRangorde']),
  uri: attr(),
  aantalNaamstemmen: attr(),
  plaatsRangorde: attr(),
  isResultaatVan: belongsTo('persoon', { inverse: null }),
  isResultaatVoor: belongsTo('kandidatenlijst', { inverse: null }),
  gevolg: belongsTo('verkiezingsresultaat-gevolg-code', { inverse: null }),
  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: "http://data.vlaanderen.be/ns/mandaat#Verkiezingsresultaat",
    aantalNaamstemmen: "http://data.vlaanderen.be/ns/mandaat#aantalNaamstemmen",
    plaatsRangorde: "http://data.vlaanderen.be/ns/mandaat#plaatsRangorde",
    isResultaatVan: "http://data.vlaanderen.be/ns/mandaat#isResultaatVan",
    isResultaatVoor: "http://data.vlaanderen.be/ns/mandaat#isResultaatVoor"
  }
});
