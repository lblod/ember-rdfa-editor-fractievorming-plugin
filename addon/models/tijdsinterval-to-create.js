import EmberObject from '@ember/object';

export default EmberObject.extend({
  uri: null,
  begin: null,
  einde: null,
  init() {
    this._super(...arguments);
    if (! this.uri)
      this.set('uri', `http://data.lblod.info/id/tijdsintervallen/${uuid()}`);
  }
});
