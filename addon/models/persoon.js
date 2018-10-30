import Model from 'ember-data/model';
import { collect } from '@ember/object/computed';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep: collect.apply(this,['id', 'achternaam', 'alternatieveNaam', 'gebruikteVoornaam']),

  achternaam: attr(),
  alternatieveNaam: attr(),
  gebruikteVoornaam: attr(),
  identificator: belongsTo('identificator', { inverse: null }),
  geslacht: belongsTo('geslacht-code', { inverse: null }),
  isAangesteldAls: hasMany('mandataris', { inverse: 'isBestuurlijkeAliasVan' }),
  isKandidaatVoor: hasMany('kandidatenlijst', { inverse: 'kandidaten' }),
  verkiezingsresultaten: hasMany('verkiezingsresultaat', { inverse: null})
});
