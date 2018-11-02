import Fractie from '../models/fractie-to-create';
import Fractietype from '../models/fractietype-to-create';
export default function initOnafhankelijkeFractieToCreate(bestuursorganenInTijd = []) {
    return Fractie.create({
      naam: 'Onafhankelijk',
      bestuursOrganenInTijd: bestuursorganenInTijd,
      fractietype: Fractietype.create({type: 'Onafhankelijk'})});
}
