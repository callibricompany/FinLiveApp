//decrypte un objet autocall

import { CAutocall } from "./CAutocall";
import Moment from 'moment';
import Numeral from 'numeral';
import FREQUENCYLIST from "../../Data/frequencyList.json";


export class CAutocallSRP extends CAutocall {
  constructor(autocall, userId='') {
    super(autocall, userId); // appelle le constructeur parent avec le paramètre

    
    //tranposition des champs SRP en finlive
    this.product['UF'] = 0;
    this.product['UFAssoc'] = 0;
    this.product['cf_cpg_choice'] = "Appel public à l'épargne";

    //console.log(this.product);
    if (this.product.data.hasOwnProperty("Capital Protection") && this.product['data']["Capital Protection"] !== "0.0%"){
      this.product["barrierPDI"] = Numeral(this.product['data']["Capital Protection"]).format('0.00'); 
    } else {
      this.product["barrierPDI"] = Numeral(this.product['data']["Barrier Level"]).add(1).format('0.00'); 
    }
    this.product["date"] = this.product['data']["Strike Date"];
    this.product['finaldate'] = this.product['data']["Final Valuation Date"];
    this.product['enddate']  = this.product['data']["Maturity Date"];
    this.product['startdate'] = this.product['data']["Offer Close Date"];

    this.product['underlying'] = this.object['data']['Underlying'];

    let cpn = this.product['data']["Digital Coupon"];
    this.product['coupon'] = Numeral(cpn.substring(0, cpn.length - 4)).format('0.00'); 

 }

  getProductTile() {
    return this.product.data.hasOwnProperty("Title") ? this.product['data']['Title'] : super.getProductName();
  }

  getDescription(nb = 1) {
    return nb === 1 ? this.product['data']["Product Description 1"] : this.product['data']["Product Description 2"];
  }

  getIssuer(){
    return this.product['data']["Issuer(s)"];
  }

  getDistributor(){
    return this.product['data']["Distributor Group"];
  }

  getURIDescription() {
    return this.product['data']["downloadLink"];
  }
  
 }
