import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-fracties-table-row';
import Fractie from '../../models/fractie';
import Fractietype from '../../models/fractietype';
import createOnafhankelijkeFractie from '../../utils/create-onafhankelijke-fractie';

export default Component.extend({
  layout,
  tagName: 'tr',

   didReceiveAttrs() {
     this._super(...arguments);
     if(this.creating){
       this.set('fractie',  Fractie.create({}));
     }
   },

  actions: {
    create(fractie){
      this.onCreate(fractie);
      this.set('creating', false);
    },
    edit(){
      this.set('editing', true);
    },
    save(){
      this.set('editing', false);
    },
    remove(fractie){
      this.onRemove(fractie);
    },
    cancel(){
      this.set('editing', false);
    },
    cancelCreate(){
      this.set('fractie', null);
      this.set('creating', false);
      this.onCancelCreate();
    }
  }
});
