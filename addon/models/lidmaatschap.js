import uuid from 'uuid/v4';
import EmberObject from '@ember/object';
import { belongsTo } from 'ember-data/relationships';

export default EmberObject.extend({
  binnenFractie: null,
  lidGedurende: null,

  rdfaBindings: {
    class: 'http://www.w3.org/ns/org#Membership',
    binnenFractie: 'http://www.w3.org/ns/org#organisation',
    lidGedurende: 'http://www.w3.org/ns/org#memberDuring'
  },

  init() {
    this._super(...arguments);
    if (! this.uri)
      this.set('uri', `http://data.lblod.info/id/lidmaatschappen/${uuid()}`);
  }
});
