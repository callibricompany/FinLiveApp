//decrypte un objet autocall

import { CProduct } from "./CProduct";
import Moment from 'moment';
import FREQUENCYLIST from "../../Data/frequencyList.json";


export class CAutocall extends CProduct {
  constructor(autocall, userId='') {
    super(autocall, userId); // appelle le constructeur parent avec le paramètre

    
    //tant que Pierre ne rajoute l'UF dans le calcul sur serveur on le rajoute
    if (!this.product.hasOwnProperty('UF')) {
      this.product['UF'] = 0.03;
    }
    if (!this.product.hasOwnProperty('UFAssoc')) {
      this.product['UFAssoc'] = 0.001;
    }
    if (!this.product.hasOwnProperty('cf_cpg_choice')) {
      this.product['cf_cpg_choice'] = "Placement Privé";
    }

    this.setProductName();
    this.underLyingName = "[UDL]";

    this._checkDates();
  }



  updateProduct(product) {
    //console.log("CAutocall : ");
    super.updateProduct(product);
    //console.log("CAutocall apres super : ");
    this.setProductName();
    this._checkDates();
  }

  //determination du nom du produit
  setProductName() {
    // determination du nom du produit
    /*
    if(!this.product.hasOwnProperty('product')) {
      //console.log("passe la ");
      if (this.product['barrierPhoenix'] !== 1) { //phoenix
        this.product['isMemory'] ? this.product['product'] = 'memoryPhoenix' : this.product['product'] = 'classicPhoenix';
      } else { //c'est un autocall
      this.product['isIncremental'] ?  
                                (this.product['airbagLevel'] === this.product['barrierPDI'] || this.product['airbagLevel'] === (1 + this.product['barrierPDI'])/2) ?  this.product['product'] = 'airbagAutocall'
                                                                        :  this.product['product'] = 'incrementalAutocall'
                            : this.product['product'] = 'classicAutocall';
      }
    }
    */

    if (!this.product.hasOwnProperty("product")) {
      //console.log("passe la ");
      if (this.product["barrierPhoenix"] !== 1) {
        //phoenix
        this.product["product"] = "phoenix";
      } else {
        //c'est un autocall
        this.product["product"] = "athena";
      }
    } else if (this.product["product"] === 'autocall') {
        //c'est un autocall on lui change de nom
        this.product["product"] = "athena";
    }
  }

  getDescription() {
    let desc =
      this.getProductName() +
      this.getFrequencyAutocallTitle() +
      this.getFullUnderlyingName() +
      this.getUnderlyingTicker() +
      this.getMaturityName() +
      this.getBarrierPDI() +
      this.getBarrierPhoenix() +
      (this.isAirbag() ? "airbag" : null) +
      this.getDegressiveStep() +
      this.getDegressivity() +
      this.product["code"];

    return desc;
  }

  getProduct() {
    return this.product;
  }

  getResultAuction() {
    let result = [];

    let obj = {};
    let i = 1;

    if (this.product.hasOwnProperty("broker1name")) {
      obj["emetteur"] = this.product.broker1name;
      obj["couponAutocall"] = this.product.couponautocall1;
      obj["couponPhoenix"] = this.product.couponphoenix1;
      obj["id"] = i;
      result.push(obj);
      i = i + 1;
    }
    obj = {};
    if (this.product.hasOwnProperty("broker2name")) {
      obj["emetteur"] = this.product.broker2name;
      obj["couponAutocall"] = this.product.couponautocall2;
      obj["couponPhoenix"] = this.product.couponphoenix2;
      obj["id"] = i;
      result.push(obj);
      i = i + 1;
    }
    obj = {};
    if (this.product.hasOwnProperty("broker3name")) {
      obj["emetteur"] = this.product.broker3name;
      obj["couponAutocall"] = this.product.couponautocall3;
      obj["couponPhoenix"] = this.product.couponphoenix3;
      obj["id"] = i;
      result.push(obj);
      i = i + 1;
    }

    return result;
  }


  /////////////////////////

  //      DATES

  /////////////////////////
  _checkDates() {
    if (!this.product.hasOwnProperty('startdate')){
      this.product['startdate'] = Moment(this.product.date, "YYYYMMDD").add(14, 'days').format("YYYYMMDD");
    }

    if (!this.product.hasOwnProperty('enddate')){
      let m = this.getMaturityInMonths();
      this.product['enddate'] = Moment(this.product.startdate, "YYYYMMDD").add(m, 'months').format("YYYYMMDD");
    }

    if (!this.product.hasOwnProperty('finaldate')){
      let m = this.getMaturityInMonths();
      this.product['finaldate'] = Moment(this.product.date, "YYYYMMDD").add(m, 'months').format("YYYYMMDD");
    }
  }

  getStartDate() {
    return Moment(this.product.startdate, "YYYYMMDD").toDate();
  }

  getStrikingDate() {
    return Moment(this.product.date, "YYYYMMDD").toDate();
  }

  getMaturityDate() {
    return Moment(this.product.enddate, "YYYYMMDD").toDate();
  }

  getLastConstatDate() {
    return Moment(this.product.finaldate, "YYYYMMDD").toDate();
  }

  getNextImportantDate() {

  }
  

  isStruck () {
    struck = false;
    //console.log("Date striking : "+this.getStrikingDate());
    //console.log("Date now : "+Date.now());
    strikingDateMoinsUn = Moment(this.getStrikingDate()).add(1, 'days').toDate();
    if (strikingDateMoinsUn < Date.now()) {
      struck = true;
    }
    return struck;
  }

  //determine le nom du sous
  getUnderlyingTicker() {
    let name = "[UDL]";

    if (this.product.hasOwnProperty("underlying")) {
      name = this.product.underlying;
    }

    return name;
  }

  //renvoie le nom long du sous jacent
  getFullUnderlyingName(categories = "") {
    if (categories === "") {
      let name = "[UDL]";

      if (this.product.hasOwnProperty("underlying")) {
        name = this.product.hasOwnProperty("underlyingName")
          ? this.product.underlyingName
          : this.product.underlying;
      }

      return name;
    }

    //if (this.underLyingName === "[UDL]") {
      let underlyings = categories.filter(({ codeCategory }) => codeCategory === "PS")[0].subCategory;

      let index = underlyings.findIndex(udl => udl.underlyingCode === this.product.underlying);
      if (index !== -1) {
        this.underLyingName =underlyings[underlyings.findIndex(udl => udl.underlyingCode === this.product.underlying)].subCategoryName;
      } else {
        this.underLyingName = "[UDL]";
      }
   
    return this.underLyingName;
  }


  //retourne le nom commercial du produit
  getProductTypeName() {
    let name = this.product.product;
    if (name.toLowerCase().includes("reverse")) {
      name = "Réverse convertible";
    } else if (name.toLowerCase().includes("autocall") || name.toLowerCase().includes("athena")  || name.toLowerCase().includes("athéna")) {

        name = "Athéna";
      
    } else if (name.toLowerCase().includes("phoenix")) {
        name = "Phoenix";

    }

    /*let ps = STRUCTUREDPRODUCTS.filter(({id}) => id === name);
      if (ps.length !== 0) {
        name = ps[0].name;
        if (name === )
      }*/

    return name;
  }


  //retourne le nom commercial du produit
  getProductName() {
    let name = this.product.product;
    if (name.toLowerCase().includes("reverse")) {
      name = "Réverse convertible";
    } else if (name.toLowerCase().includes("autocall") || name.toLowerCase().includes("athena")  || name.toLowerCase().includes("athéna")) {
      if (this.isIncremental()) {
        name = "Athéna";
      } else {
        name = "Athéna";
      }
    } else if (name.toLowerCase().includes("phoenix")) {
      if (this.isMemory()) {
        name = "Phoenix mémoire";
      } else {
        name = "Phoenix";
      }
    }

    /*let ps = STRUCTUREDPRODUCTS.filter(({id}) => id === name);
      if (ps.length !== 0) {
        name = ps[0].name;
        if (name === )
      }*/

    return name;
  }

  //retourne le nom commercial du produit
  getProductShortName() {
    let name = "";

    if (this.product.hasOwnProperty("product")) {
      name = this.product.product;
    }

    return name;
  }

  //renvoie la maturité
  getMaturityName() {
    let name = "[MTY]";

    if (this.product.hasOwnProperty("maturity")) {
      name = this.product.maturity.substring(
        0,
        this.product.maturity.length - 1
      );
      let ans = " ans";
      if (name <= 1) {
        ans = " an";
      }
      name = name + ans;
    }

    return name;
  }

  //renvoie la maturité du produit en mois
  getMaturityInMonths() {
    let mat = 0;
    if (this.product.hasOwnProperty("maturity")) {
      mat =
        Number(
          this.product.maturity.substring(0, this.product.maturity.length - 1)
        ) * 12;
    }
    return mat;
  }



  //renvoie le coupon annualisé
  getCouponTitle() {
    let name = "[CPN]";

    if (this.product.hasOwnProperty("coupon")) {
      name = this.product.coupon;
    }

    return name;
  }

  //renvoie la monnaie
  getCurrency() {
    let name = "[XXX]";

    if (this.product.hasOwnProperty("currency")) {
      name = this.product.currency;
    }

    return name;
  }

  //renvoie la degressivite des niveaux de rappels
  getDegressivity() {
    let name = 0;

    if (this.product.hasOwnProperty("degressiveStep")) {
      name = this.product.degressiveStep;
    }

    return name;
  }

 

  //renvoie si airbag ou semi-airbag
  getAirbagTitle() {
    let name = "Non airbag";

    if (this.isAirbag()) {
      name = "Airbag";
    }
    if (this.isSemiAirbag()) {
      name = "Semi-airbag";
    }

    return name;
  }

  //renvoie le code airbag : NA, SA ou FA
  getAirbagCode() {
    let name = "NA";
    if (this.isAirbag()) {
      name = "FA";
    }
    if (this.isSemiAirbag()) {
      name = "SA";
    }
    return name;
  }

  //renvoie le niveau airbag
  getAirbagLevel() {
    let name = 1;
    if (this.product.hasOwnProperty("airbagLevel")) {
      name = this.product.airbagLevel;
    }
    return name;
  }

  //renvoie la barriere Phoenix
  getBarrierPhoenix() {
    let name = 0;
    if (this.product.hasOwnProperty("barrierPhoenix")) {
      name = this.product.barrierPhoenix;
    }
    return name;
  }

  //renvoie le coupon phoenix
  getCouponPhoenix() {
    let name = 0;
    if (this.product.hasOwnProperty("couponPhoenix")) {
      name = this.product.couponPhoenix;
    }
    return name;
  }

  //determine la frequence du phoenix
  getFrequencyPhoenixTitle() {
    let name = "[FREQ]";

    if (this.product.hasOwnProperty("freqPhoenix")) {
      name = this.product.freqPhoenix;
      let freq = FREQUENCYLIST.filter(({ id }) => id === name);
      if (freq.length !== 0) {
        name = freq[0].name;
      }
    }

    return name;
  }

  //determine la frequence du phoenix
  getFrequencyPhoenixNumber() {
    let name = 1;

    if (this.product.hasOwnProperty("freqPhoenix")) {
      name = this.product.freqPhoenix;
      let freq = FREQUENCYLIST.filter(({ id }) => id === name);
      if (freq.length !== 0) {
        name = freq[0].freq;
      }
    }

    return name;
  }

  //determine la frequence de rappel
  getFrequencyAutocallTitle() {
    let name = "[FREQ]";

    if (this.product.hasOwnProperty("freqAutocall")) {
      name = this.product.freqAutocall;
      let freq = FREQUENCYLIST.filter(({ id }) => id === name);
      if (freq.length !== 0) {
        name = freq[0].name;
      }
    }

    return name;
  }

  //determine la frequence de rappel
  getFrequencyAutocallNumber() {
    let name = 1;

    if (this.product.hasOwnProperty("freqAutocall")) {
      name = this.product.freqAutocall;
      let freq = FREQUENCYLIST.filter(({ id }) => id === name);
      if (freq.length !== 0) {
        name = freq[0].freq;
      }
    }

    return name;
  }

  //la frequence de rappel
  getFrequencyAutocall() {
    return this.product.freqAutocall;
  }

  //renvoie le coupon phoenix
  getCouponAutocall() {
    let name = 0;
    if (this.product.hasOwnProperty("couponAutocall")) {
      name = this.product.couponAutocall;
    }
    return name;
  }

  //renvoie le coupon autocall
  getAutocallLevel() {
    let name = 0;
    if (this.product.hasOwnProperty("levelAutocall")) {
      name = this.product.levelAutocall;
    }
    return name;
  }

  //renvoie la degreesivité par an
  getDegressiveStep() {
    let name = 0;
    if (this.product.hasOwnProperty("degressiveStep")) {
      name = this.product.degressiveStep;
    }
    return name;
  }

  //renvoie la barriere PDI
  getBarrierPDI() {
    let name = 0;
    if (this.product.hasOwnProperty("barrierPDI")) {
      name = this.product.barrierPDI;
    }
    return name;
  }

  //renvoie le titre en nombre d'annes de non rappel
  getNNCPLabel() {
    let name = "[XX]";
    if (this.product.hasOwnProperty("noCallNbPeriod")) {
      let y = this.product.noCallNbPeriod / 12;
      name = y === 1 ? " 1 an" : y + " ans";
    }
    return name;
  }

  //renvoie le titre en nombre d'annes de non rappel
  getNNCP() {
    let name = 12;
    if (this.product.hasOwnProperty("noCallNbPeriod")) {
      name = this.product.noCallNbPeriod;
    }
    return name;
  }

  //verifie si c'est airbag ou semi-airbag
  isAirbag() {
    let response = false;
    if (
      this.product.hasOwnProperty("airbagLevel") &&
      this.product.hasOwnProperty("levelAutocall") &&
      this.product.hasOwnProperty("barrierPDI")
    ) {
      let PDI = this.product.barrierPDI;
      let autocallLevel = this.product.levelAutocall;
      let airbag = this.product.airbagLevel;
      let degressive = this.product.degressiveStep;
      let mat = this.getMaturityInMonths() / 12;

      if (autocallLevel !== airbag) {
        response = true;
      }
    }

    return response;
  }

  //verifie s'il est full airbeg
  isFullAirbag() {
    let response = false;
    if (
      this.product.hasOwnProperty("airbagLevel") &&
      this.product.hasOwnProperty("levelAutocall") &&
      this.product.hasOwnProperty("barrierPDI")
    ) {
      let PDI = this.product.barrierPDI;
      let autocallLevel = this.product.levelAutocall;
      let airbag = this.product.airbagLevel;

      if (PDI === airbag) {
        response = true;
      }
    }
    return response;
  }

  //verifie s'il est semi-airbag
  isSemiAirbag() {
    let response = false;
    if (
      this.product.hasOwnProperty("airbagLevel") &&
      this.product.hasOwnProperty("levelAutocall") &&
      this.product.hasOwnProperty("barrierPDI")
    ) {
      let PDI = this.product.barrierPDI;
      let autocallLevel = this.product.levelAutocall;
      let airbag = this.product.airbagLevel;

      if ((PDI + autocallLevel) / 2 === airbag) {
        response = true;
      }
    }
    return response;
  }

  //verifie si c'est c'est un phoenix
  isPhoenix() {
    return this.product.barrierPhoenix !== this.product.levelAutocall;
  }

  //verifie si c'est c'est un phoenix mémoire
  isMemory() {
    let res = false;
    if (this.product.hasOwnProperty("isMemory")) {
      res = this.product.isMemory;
    }
    return res;
  }

  //verifie si c'est c'est un phoenix mémoire
  isIncremental() {
    let res = false;
    if (this.product.hasOwnProperty("isIncremental")) {
      res = this.product.isIncremental;
    }
    return res;
  }

  //verifie si c'est c'est un PDI US
  isPDIUS() {
    let res = false;
    if (this.product.hasOwnProperty("isPDIUS")) {
      res = this.product.isPDIUS;
    }
    return res;
  }


  //calcule les dates et les niveaux de paiements et les niveaux de coupons
  getPhoenixDatas() {
        let phoenixDatas = [];
        if (this.isPhoenix()){
              
            let freq = this.getFrequencyAutocallNumber();
            let mat = this.getMaturityInMonths();

            let numberOfDates = mat / freq;
            //console.log("nb red ates : " + numberOfDates);
            let obj = {};
            let currentYear = 0;
            let incrementalMultiplier = 1;
            for (let i = 0; i < numberOfDates; i++) {
              currentYear = Math.trunc(i / freq);
              obj = {};
              d = Moment(this.getStrikingDate(), "YYYYMMDD").add((i+1) * freq, 'months');
              obj["date"] = d;
              obj["level"] = Number(this.getBarrierPhoenix());
              obj["coupon"] = Number(this.getCouponPhoenix())*freq/12;
              
              phoenixDatas.push(obj);
            }
        }
        return phoenixDatas;
  }

    //calcule les dates et les niveaux de paiements et les niveaux de rappels et de coupons
  getAutocallDatas() {

    //Nombres de dates : 20  -  Nombre NNCall : 4  -  Freq : 6         DS : 3

      callableDatas = [];
      let freq = this.getFrequencyAutocallNumber();
      let mat = this.getMaturityInMonths();
      let numberOfDates = mat / freq;
      
      let numberWithNoCall = this.getNNCP()/ freq;
      
      
      let obj = {};
      let ds = Number(this.getDegressivity());
      let currentYear = 0;
      let incrementalMultiplier = 1;
      //console.log("Nombres de dates : " +numberOfDates + "  -  Nombre NNCall : " + numberWithNoCall + "  -  Freq : " + freq + "         DS : "+ds);
      for (let i = numberWithNoCall; i <= numberOfDates; i++) {
        currentYear = Number(freq* i / 12);
        obj = {};
        d = Moment(this.getStrikingDate(), "YYYYMMDD").add(i * freq, 'months');
        obj["date"] = d;
        obj["level"] = Number(this.getAutocallLevel()) - currentYear * ds/100;
        if (i === numberOfDates) {
          obj["level"] = Math.min(obj["level"], Number(this.getAirbagLevel()))
        }
        incrementalMultiplier = this.isMemory() ? currentYear : freq/12;
        obj["coupon"] = this.isPhoenix() ? 1 : (1+(incrementalMultiplier * Number(this.getCouponTitle())));
        
        callableDatas.push(obj);
      }
      return callableDatas;
  }
}
