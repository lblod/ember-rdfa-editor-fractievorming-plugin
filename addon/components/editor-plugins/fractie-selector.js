import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractie-selector';

export default Component.extend({
  layout,
  didReceiveAttrs(){
    let fractieToSet = this.fractie;
    if(this.fractie && this.fractie.fractietype.isOnafhankelijk)
      fractieToSet = this.fracties.find(f => f.fractietype.isOnafhankelijk);
    this.set('_fractie', fractieToSet);
    this.set('_fracties', this.fracties);
  },
  actions: {
    select(fractie){
      this.set('_fractie', fractie);
      this.onSelect(fractie);
    }
  }
});
