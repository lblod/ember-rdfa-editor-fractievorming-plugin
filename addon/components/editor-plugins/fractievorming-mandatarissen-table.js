import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/fractievorming-mandatarissen-table';
import createOnafhankelijkeFractie from '../../utils/create-onafhankelijke-fractie';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  //this is reformatted since probably more user friendly
  personenMandatenLidmaatschap: computed('mandatarissen', function(){
    return this.mandatarissen.reduce((personenMandaten, m) => {
      let pm = personenMandaten.find( pm => pm.persoon.id == m.isBestuurlijkeAliasVan.id);
      if(!pm){
        //assumes all mandanten of 1 persoon belong to 1 fractie
        personenMandaten.push({'persoon': m.isBestuurlijkeAliasVan, 'mandatarissen': [ m ], 'lidmaatschap': m.heeftLidmaatschap});
      }
      else
        pm.mandatarissen.push(m);
      return personenMandaten;
    }, []);
  }),

  actions: {
    changeFractie(personenMandatenLidmaatschap, fractie){
      let fractieToSet = fractie;
      if(fractieToSet.fractietype.isOnafhankelijk){
        fractieToSet = createOnafhankelijkeFractie([ this.bestuursorgaan ]);
      }
      personenMandatenLidmaatschap.mandatarissen.forEach(m => m.heeftLidmaatschap.set('binnenFractie', fractieToSet));
    }
  }


});
