import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-add-new-mandataris';
import LidmaatschapToCreate from '../../models/lidmaatschap-to-create';
import TijdsintervalToCreate from '../../models/tijdsinterval-to-create';

export default Component.extend({
  tagName: 'tr',
  layout,

  initLidmaatschap(mandataris){
    if(mandataris.heeftLidmaatschap && mandataris.heeftLidmaatschap.binnenFractie)
      return;
    
    let lidmaatschap = LidmaatschapToCreate.create({
      lidGedurende: TijdsintervalToCreate.create({begin: new Date().toISOString() }) //TODO: make autopropsal
    });

    mandataris.set('heeftLidmaatschap', lidmaatschap);
  },

  actions: {
    select(mandataris){
      this.initLidmaatschap(mandataris);
      this.set('selectedMandataris', mandataris);
    },
    save(){
      this.onSave(this.selectedMandataris);
      this.set('selectedMandataris', null);
    },
    cancel(){
      this.set('selectedMandataris', null);
      this.onCancel();
    }
  }
});
