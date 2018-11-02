import Fractie from '../models/fractie-to-create';
import Fractietype from '../models/fractietype-to-create';
export default function initOnafhankelijkeFractieToCreate(bestuurseenheid, bestuursorganenInTijd = []) {
    return Fractie.create({
      naam: 'Onafhankelijk',
      bestuurseemheid: bestuurseenheid,
      bestuursOrganenInTijd: bestuursorganenInTijd,
      fractietype: Fractietype.create({type: 'Onafhankelijk'})});
}
