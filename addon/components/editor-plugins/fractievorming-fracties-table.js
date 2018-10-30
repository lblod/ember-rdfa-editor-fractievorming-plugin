import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-fracties-table';

export default Component.extend({
  layout,

  actions: {
    createFractie(fractie){
      this.set('createNewFractie', true);
    },

    onCancelCreate(fractie){
      this.set('createNewFractie', false);
    },

    onCreateFractie(fractie){
      //TODO: add bestuursorgaan
      this.fracties.pushObject(fractie);
      this.set('createNewFractie', false);
    },

    onRemove(fractie){
      this.fracties.removeObject(fractie);
      this.onRemoveFractie(fractie);
    }
  }
});
