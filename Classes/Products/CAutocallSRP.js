//decrypte un objet autocall

import { CAutocall2 } from "./CAutocall2";
import Moment from 'moment';
import Numeral from 'numeral';





export class CAutocallSRP extends CAutocall2 {
  constructor(autocall) {
    super(autocall, 'structuredproducts'); // appelle le constructeur parent avec le paramètre

    //console.log(autocall['UNIQUE_ID'] + "  " + autocall['IS_FAVORITE']);

    //tranposition des champs SRP en finlive
    this.UFAssoc = 0;
    this.UF = autocall['data']['data']["Sales Commision"] !== "" ? autocall['data']['data']["Sales Commision"] : 0;
    //this.typeAuction = "Appel public à l'épargne";
    this.setAuctionType("APE");
    this.setIssuer(autocall['data']['data']["Issuer(s)"]);
    this.setDistributor(autocall['data']['data']["Distributor Group"]);
    this.setDescription_1(autocall['data']['data']["Product Description 1"]);
    this.setDescription_2(autocall['data']['data']["Product Description 2"] === '' ? autocall['data']['data']["Product Description 1"] : autocall['data']['data']["Product Description 2"]);
    this.marketingDocument = autocall['data']['data']["downloadLink"];
    if (autocall.data.hasOwnProperty("Capital Protection") && autocall['data']['data']["Capital Protection"] !== "0.0%"){
      this.barrierPDI = Numeral(autocall['data']['data']["Capital Protection"]).format('0.00'); 
    } else {
      let b = autocall['data']['data']["Barrier Level"];
      this.barrierPDI = Numeral(b === "" ? 0 : b).add(1).format('0.00'); 
    }
    
    autocall["date"] = autocall['data']['data']["Strike Date"];
    autocall['finaldate'] = autocall['data']['data']["Final Valuation Date"];
    //autocall['enddate']  = autocall['data']['data']["Maturity Date"];
    //autocall['startdate'] = autocall['data']['data']["Offer Close Date"];

    this.setIssuingDate(Moment(autocall['data']['data']["Offer Close Date"], 'YYYYMMDD'));
    this.setEndIssueDate(Moment(autocall['data']['data']["Maturity Date"], 'YYYYMMDD'));
    this.setStrikingDate(Moment(autocall['data']['data']["Strike Date"], 'YYYYMMDD'));

    this.setUniqueId(autocall["code"]);

    this.underlying = autocall['data']['Underlying'];
    this.addUnderlyings(this.underlying);

    this.couponAPE = 0;
    if (autocall['data']['data'].hasOwnProperty("Digital Coupon") && autocall['data']['data']["Digital Coupon"] !== "") {
      let cpn = autocall['data']['data']["Digital Coupon"];
      //cpn = cpn.replace('.',',');
      //numeral.locale('fr');
      cpn = Numeral(cpn.substring(0, cpn.length - 4)).format('0.0000');
      cpn = cpn > 1 ? cpn/100 : cpn; 
      //console.log("COUPON : "+ cpn + "   -  "+autocall['data']['data']["Digital Coupon"]);
      this.couponAPE = cpn; 
    } else {
      if (autocall['data']['data'].hasOwnProperty('Payout') && autocall['data']['data']['Payout'] != null && autocall['data']['data']['Payout'] !== "") {
        let arrayPayout = autocall['data']['data']['Payout'].split("|");

        let numericArrayPayou = [];
        arrayPayout.forEach(element => {
          numericArrayPayou.push(Numeral(element).format('0.0000') - 1);
        });
        var duration  = this.getEndIssueDate() - this.getStrikingDate();
        var durationDate = new Date(duration); // miliseconds from epoch
        var nbOfYears = Math.abs(durationDate.getUTCFullYear() - 1970);

        this.couponAPE = Math.max(...numericArrayPayou)/nbOfYears;
      } 
    }
  

    if (autocall['data']['data'].hasOwnProperty("Knockout Level")) {
      let ar = (autocall['data']['data']["Knockout Level"]).split('|');

      this.levelAutocall = Number(Numeral(ar[0]).value())+1;
     } else {
      this.levelAutocall= 0;
     } 
  
     
     if (this.getDescription().includes("semi-annual observation")) {
      this.freqAutocall  = "6M";
     } else if (this.getDescription().includes("annual observation")) {
      this.freqAutocall  = "1Y";
     } else if (this.getDescription().includes("monthly observation")){
      this.freqAutocall  = "1M";
     } else if (this.getDescription().includes("quarterly observation")){
      this.freqAutocall  = "3M";
     } else if (this.getDescription().includes("daily observation")){
      this.freqAutocall  = "1D";
     }

     if (autocall.data.hasOwnProperty("Sales Commision")){
       this.UF = autocall['data']['data']['Sales Commision'];
     } 

     this.isinCode = autocall['data']['data']['ISIN'];

     autocall['data']['data'].hasOwnProperty("Title") ? this.setShortName(autocall['data']['data']['Title']) : null;
     

     //this.setFavorite(autocall['data'].hasOwnProperty("IS_FAVORITE") ? autocall['data']["IS_FAVORITE"] : false);
     this.setFavorite(autocall.hasOwnProperty("IS_FAVORITE") ? autocall["IS_FAVORITE"] : false);

     
 }

  getURIDescription() {
    return this.marketingDocument;
  }

  getCoupon() {
    return this.couponAPE;
  }
  
 }
