import EmberObject from '@ember/object';
import { collect } from '@ember/object/computed';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default EmberObject.extend({
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep: collect.apply(this,['id', 'naam', 'bindingEinde', 'bindingStart']),

  naam: attr(),
  bindingEinde: attr('date'),
  bindingStart: attr('date'),
  bestuurseenheid: belongsTo('bestuurseenheid', { inverse: 'bestuursorgaan' }),
  classificatie: belongsTo('bestuursorgaan-classificatie-code', { inverse: null }),
  isTijdsspecialisatieVan: belongsTo('bestuursorgaan', { inverse: 'heeftTijdsspecialisaties' }),
  wordtSamengesteldDoor: belongsTo('rechtstreekse-verkiezing', { inverse: 'steltSamen' }),
  heeftTijdsspecialisaties: hasMany('bestuursorgaan', { inverse: 'isTijdsspecialisatieVan' }),
  bevat: hasMany('mandaat', { inverse: 'bevatIn' })
});
