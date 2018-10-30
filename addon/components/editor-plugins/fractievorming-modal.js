import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-modal';

export default Component.extend({
  layout,
  displayMandatarissen: true,

  actions: {
    showMandatarissen(){
      this.set('displayMandatarissen', true);
    },

    showFracties(){
      this.set('displayMandatarissen', false);
    },

    onRemoveFractie(fractie){
      this.mandatarissen.forEach(m =>  {
        if(m.heeftLidmaatschap.binnenFractie.uri == fractie.uri)
          m.heeftLidmaatschap.set('binnenFractie', null);
      });
    }
  }
});
