import Moment from 'moment';
import * as TEMPLATE_TYPE from '../../constants/template';
import { CObject } from '../CObject';

//classe mere de tous les objets financiers, immos, arts, etc...
export class CProduct extends CObject { 
    constructor(product) {
      super(product);
      this.product = this.object['data'];

      this.finalNominal = -1;
      this.isEditable = true;
    }
    
 
    setFinalNominal(nominal) {
      this.finalNominal = nominal;
    }

    getFinalNominal() {
      return this.finalNominal;

    }

    setEditable(editable) {
      this.isEditable = editable;
    }

    isEditableProduct() {
      return this.isEditable;
    }

    updateProduct(product) {
      this._constructorProduct(product);
      this.product = this.object['data'];
      
      //console.log(this.product);
    }

    getInternalCode() {
      return this.product['code'];
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

    setUF(UF) {
      this.product.UF = UF;
    }

    setUFAssoc(UFAssoc) {
      this.product.UFAssoc = UFAssoc;
    }

    getISIN() {
      let name = "[X]";
  
      if (this.product.hasOwnProperty("ISIN")) {
        name = this.product.ISIN;
      }
  
      return name;
    }

    getPrice() {
      let price = 0;
  
      if (this.product.hasOwnProperty("price")) {
        price = this.product.price;
      }
  
      return price;
    }

    getNominal() {
      let name = 1000000;
  
      if (this.product.hasOwnProperty("nominal")) {
        name = this.product.nominal;
      }
  
      return name;
    }
    /////////////////////////

    //      DATES

    /////////////////////////

    getIssueDate() {

      return Moment(this.product.startdate, "YYYYMMDD").toDate();
    }

    getEndDate() {
      return Moment(this.product.enddate, "YYYYMMDD").toDate();
    }

    getNextOpenDay(d='') {
        if (d === '') {}
    }

}