import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-fracties-table';
import FractieToCreate from '../../models/fractie-to-create';
import FractietypeToCreate from '../../models/fractietype-to-create';

export default Component.extend({
  layout,

  actions: {
    createFractie(){
      this.set('fractieToCreate', FractieToCreate.create({
        bestuurseenheid: this.bestuurseenheid,
        bestuursorganenInTijd: [ this.bestuursorgaan ],
        fractietype: FractietypeToCreate.create({})
      }));
      this.set('createNewFractie', true);
    },

    onCancelCreate(){
      this.set('fractieToCreate', null);
      this.set('createNewFractie', false);
    },

    onCreateFractie(fractie){
      this.fracties.pushObject(fractie);
      this.set('createNewFractie', false);
    },

    onRemove(fractie){
      this.fracties.removeObject(fractie);
      this.onRemoveFractie(fractie);
    }
  }
});
