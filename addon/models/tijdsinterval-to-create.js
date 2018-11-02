import uuid from 'uuid/v4';
import EmberObject from '@ember/object';

export default EmberObject.extend({
  uri: null,
  begin: null,
  einde: null,

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: 'http://purl.org/dc/terms/PeriodOfTime',
    begin: 'http://data.vlaanderen.be/ns/generiek#begin',
    einde: 'http://data.vlaanderen.be/ns/generiek#einde'
  },

  init() {
    this._super(...arguments);
    if (! this.uri)
      this.set('uri', `http://data.lblod.info/id/tijdsintervallen/${uuid()}`);
  }
});
