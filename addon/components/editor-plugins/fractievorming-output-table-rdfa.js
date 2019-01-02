import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-output-table-rdfa';
import { computed } from '@ember/object';
export default Component.extend({
  layout,
  sortedMandatarissen: computed('mandatarissen.[]', function(){
    return this.mandatarissen.sort((a,b) => this.sortFractie(a, b) || this.sortName(a, b));
  }),

  sortName: (a, b) => {
    return a.isBestuurlijkeAliasVan.achternaam.trim().localeCompare(b.isBestuurlijkeAliasVan.achternaam.trim());
  },

  sortFractie: (a, b) => {
    return a.heeftLidmaatschap.binnenFractie.naam.trim().localeCompare(b.heeftLidmaatschap.binnenFractie.naam.trim());
  }
});
