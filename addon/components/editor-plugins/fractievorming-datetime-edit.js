import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-datetime-edit';
import moment from 'moment';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'div',
  layout,
  hours: computed('datetimeStr', {
    get(){
      return moment(this.datetimeStr).hours();
    },
    set(k, v){
      this.setDatetime(this.date, v, this.minutes);
      return v;
    }
  }),

  minutes: computed('datetimeStr', {
    get(){
      return moment(this.datetimeStr).minutes();
    },
    set(k, v){
      this.setDatetime(this.date, this.hours, v);
      return v;
    }
  }),

  date: computed('datetimeStr', {
    get(){
      return moment(this.datetimeStr).format('LL');
    },
    set(k, v){
      this.setDatetime(v, this.hours, this.minutes);
      return v;
    }
  }),

  setDatetime(date, hours, minutes){
    return this.set('datetimeStr', moment(date).hours(hours || 0).minutes(minutes || 0).toISOString());
  },

  dateFormat: 'DD/MM/YYYY',

  datetimePlaceholder: computed('datetimeStr', 'placeholder', function(){
    return moment(this.placeholder || moment().toISOString()).format('DD/MM/YYYY');
  })
});
