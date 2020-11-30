import { CProduct2 } from "./CProduct2";
import moment from 'moment';


export class CFinancialProduct extends CProduct2 {
  constructor(financialproduct) {
    super(financialproduct); 
  }

  //verifie si les dates ont été fixé ou s'il d'agit de dates flottantes
  areDatesFixed() {
    let datesFixed = false;
    if (this.product.hasOwnProperty("DATE_EFFECTIVE_STRING") && this.product['DATE_EFFECTIVE_STRING'] !== "") {
        datesFixed = true;
    }
    return datesFixed;
  }

  //a quelle date les dates ont été fixé 
  whenDatesHaveBeenFixed() {
    let dateEffective = "UNKNOWN";
    if (this.product.hasOwnProperty("DATE_EFFECTIVE_STRING") && this.product['DATE_EFFECTIVE_STRING'] !== "") {
        dateEffective = Moment(this.product["DATE_EFFECTIVE_STRING"], "YYYYMMDD").toDate();
    }
    return dateEffective;
  }

    //renvoie la monnaie
    getCurrency() {
        return this.product.hasOwnProperty("CURRENCY") ? this.product["CURRENCY"] : 'EUR';
    }
}