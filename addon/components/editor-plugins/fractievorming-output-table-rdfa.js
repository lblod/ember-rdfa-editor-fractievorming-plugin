import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-output-table-rdfa';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  sortedMandatarissen: computed('mandatarissen.[]', function(){
    return this.mandatarissen.sort((a,b) => a.isBestuurlijkeAliasVan.gebruikteVoornaam.trim().localeCompare(b.isBestuurlijkeAliasVan.gebruikteVoornaam.trim()));
  })
});
