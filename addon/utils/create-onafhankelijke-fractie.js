import Fractie from '../models/fractie';
import Fractietype from '../models/fractietype';
export default function createOnafhankelijkeFractie(bestuursorganenInTijd = []) {
    return Fractie.create({
      naam: 'Onafhankelijk',
      bestuursOrganenInTijd: bestuursorganenInTijd,
      fractietype: Fractietype.create({type: 'Onafhankelijk'})});
}
