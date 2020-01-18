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
    

    this.product['startdate'] = this.product['data']["Offer Close Date"];

    if (this.product['data'].hasOwnProperty("Knockout Level")) {
      let ar = (this.product['data']["Knockout Level"]).split('|');

      this.product['levelAutocall'] = Number(Numeral(ar[0]).value())+1;
     } else {
      this.product['levelAutocall'] = 0;
     } 
  
     
     if (this.getDescription().includes("semi-annual observation")) {
      this.product['freqAutocall'] = "6M";
     } else if (this.getDescription().includes("annual observation")) {
      this.product['freqAutocall'] = "1Y";
     } else if (this.getDescription().includes("monthly observation")){
        this.product['freqAutocall'] = "1M";
     } else if (this.getDescription().includes("quarterly observation")){
      this.product['freqAutocall'] = "3M";
     } else if (this.getDescription().includes("daily observation")){
      this.product['freqAutocall'] = "1D";
     }

     if (this.product.data.hasOwnProperty("Sales Commision")){
       this.product['UF'] = this.product['data']['Sales Commision'];
     } 

     this.product['ISIN'] = this.product['data']['ISIN'];
     
 }


  getProductTile() {

    return this.product.data.hasOwnProperty("Title") ? this.product['data']['Title'] : super.getProductName();
  }

  getDescription(nb = 1) {
    return nb === 1 ? this.product['data']["Product Description 1"] : (this.product['data']["Product Description 2"] === '' ? this.product['data']["Product Description 1"] : this.product['data']["Product Description 2"]);
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
