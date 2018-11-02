import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-mandatarissen-table-row';
import initOnafhankelijkeFractieToCreate from '../../utils/init-onafhankelijke-fractie-to-create';

export default Component.extend({
  tagName: 'tr',
  layout,

  actions: {
    changeFractie(fractie){
      let fractieToSet = fractie;
      if(fractieToSet && fractieToSet.fractietype.isOnafhankelijk){
        fractieToSet = initOnafhankelijkeFractieToCreate(this.bestuurseenheid, [ this.bestuursorgaan ]);
      }
      this.mandataris.heeftLidmaatschap.set('binnenFractie', fractieToSet);
    }

  }
});
