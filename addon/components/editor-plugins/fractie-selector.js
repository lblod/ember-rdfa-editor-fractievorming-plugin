import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractie-selector';

export default Component.extend({
  layout,
  didReceiveAttrs(){
    let fractieToSet = this.fractie;
    //we only refer to one onafhankelijke fractie in list (even if it spans multiple)
    if(this.fractie && this.fractie.fractietype.isOnafhankelijk)
      fractieToSet = this.fracties.find(f => f.fractietype.isOnafhankelijk);
    this.set('_fractieUri', (fractieToSet || {}).uri);
    this.set('_fracties', this.fracties);
  },
  actions: {
    select(fractieUri){
      let fractie = this.fracties.find(f => f.uri == fractieUri);
      this.set('_fractieUri', (fractie || {}).uri);
      this.onSelect(fractie);
    }
  }
});
