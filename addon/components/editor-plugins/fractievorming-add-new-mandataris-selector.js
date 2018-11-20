import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-add-new-mandataris-selector';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  layout,

  search: task(function *(searchData){
    searchData = searchData.trim().toLowerCase();
    yield timeout(100);
    let mandatarissen = this.mandatarissen.filter(m => m.isBestuurlijkeAliasVan.achternaam.toLowerCase().indexOf(searchData) > -1);
    return mandatarissen;
  }),

  actions: {
    select(mandataris){
      this.set('_mandataris', mandataris);
      this.onSelect(mandataris);
    }
  }
});
