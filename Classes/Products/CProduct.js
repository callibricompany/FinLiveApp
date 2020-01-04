import Moment from 'moment';
import * as TEMPLATE_TYPE from '../../constants/template';
import { CObject } from '../CObject';

//classe mere de tous les objets financiers, immos, arts, etc...
export class CProduct extends CObject { 
    constructor(product, userId) {
      super(product, userId);
      this.product = this.object['data'];


    }
    
 
    updateProduct(product) {
      this._constructorProduct(product);
      this.product = this.object['data'];
      //console.log("CProduct : ");
      //console.log(this.product);
    }




    getAuctionType() {
      let name = "Placement Privé";
      if (this.product.hasOwnProperty('cf_cpg_choice')){
  
        name = this.product['cf_cpg_choice'];
      }
      return name;
    }



    getProductName() {

      return "Produit financier";
    }



    setProductDescription(object) {


    }

    getUnderlying() {
      return this.product.underlying;
    }

    getNominal() {
      return this.product.nominal;
    }

    getCurrency() {
      return this.product.currency;
    }

    getUF() {
      let uf = 0
      if (this.product.hasOwnProperty('UF')) {
        uf = this.product.UF;
      }
      return uf;
    }

    getUFAssoc() {
      let uf = 0
      if (this.product.hasOwnProperty('UFAssoc')) {
        uf = this.product.UFAssoc;
      }
      return uf;
    }


    /////////////////////////

    //      DATES

    /////////////////////////

    getStartDate() {

      return Moment(this.product.startdate, "YYYYMMDD").toDate();
    }

    getEndDate() {
      return Moment(this.product.enddate, "YYYYMMDD").toDate();
    }

    getNextOpenDay(d='') {
        if (d === '') {}
    }

}