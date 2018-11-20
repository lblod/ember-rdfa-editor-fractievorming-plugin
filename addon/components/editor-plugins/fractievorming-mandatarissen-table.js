import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-mandatarissen-table';

export default Component.extend({
  layout,

  actions: {
    remove(mandataris){
      this.mandatarissen.removeObject(mandataris);
    },
    addMandataris(){
      this.set('addMandatarisMode', true);
    },
    cancelAddMandataris(){
      this.set('addMandatarisMode', false);
    },
    saveAddMandataris(mandataris){
      this.mandatarissen.pushObject(mandataris);
      this.set('addMandatarisMode', false);
    }
  }
});
