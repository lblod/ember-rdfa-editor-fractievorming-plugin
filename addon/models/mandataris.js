import { A } from '@ember/array';
import EmberObject from '@ember/object';
import uuid from 'uuid/v4';
export default EmberObject.extend({
  uri: null,
  rangorde: 0,
  isBestuurlijkeAliasVan: null,
  bekleedt: null,
  status: null,
  start: null,
  einde: null,
  heeftLidmaatschap: null,

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: "http://data.vlaanderen.be/ns/mandaat#Mandataris",
    rangorde: "http://data.vlaanderen.be/ns/mandaat#rangorde",
    start: "http://data.vlaanderen.be/ns/mandaat#start",
    einde: "http://data.vlaanderen.be/ns/mandaat#einde",
    bekleedt: "http://www.w3.org/ns/org#holds",
    isBestuurlijkeAliasVan: "http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan",
    heeftLidmaatschap: "http://www.w3.org/ns/org#hasMembership"
  }
});
