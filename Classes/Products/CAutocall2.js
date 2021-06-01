//decrypte un objet autocall

import { CStructuredProduct } from "./CStructuredProduct";
import Moment from 'moment';
import FREQUENCYLIST from "../../Data/frequencyList.json";




export class CAutocall2 extends CStructuredProduct {

  static AUTOCALL_TYPE =  ['AUTOCALL_INCREMENTAL','PHOENIX','PHOENIX_MEMORY','REVERSE'];


  constructor(autocall, source='products') {
    super(autocall, source); // appelle le constructeur parent avec le paramètre

    if (source === 'products') {
        //M:8Y_U:CAC_BPDI:0.6_S:1.0_LA:1.0_FA:1Y_DS:0.0_NNCP:12_AL:1.0_PDIUS:False_GP:-1.0_FP:1Y_BP:1.0_IM:True_UF:0.03_UFA:0.002_TA:PP_IP:1
        let code = this.getProductCodeDetail();
        var res = code.split("_");
        res.forEach((r) => {
          var u = r.split(":");
          switch(u[0]) {
            case 'M' :
              this.maturity = u[1];
              break;
            case 'U' :
              this.underlying = u[1];
              break;
            case 'BPDI' :
              this.barrierPDI = Number(u[1]);
              break;
            case 'S' :
              this.strike = Number(u[1]);
              break;
            case 'LA' :
              this.autocallLevel = Number(u[1]);
              break;
            case 'FA' :
              this.freqAutocall = u[1];
              break;
            case 'DS' :
              this.degressiveStep = Number(u[1]);
              break;          
            case 'NNCP' :
              this.noCallNbPeriod = Number(u[1]); //en mois
              break;
            case 'TA' :
              this.typeAirbag = u[1]; //Number(u[1]);
              break;
            case 'PSIUS' :
              this.isPDIUS = u[1];
              break;
            case 'GP' :
              this.gearingPut = u[1];
              break;
            case 'FP' :
              this.freqPhoenix = u[1];
              break;
            case 'BP' :
              this.barrierPhoenix = Number(u[1]);
              break;
            case 'IM' :
              this.isMemoryBool = u[1] === 'True' ? true : false;
              break;
            default :
              break;
          }
        });
        
        //initialisation d'autres variables
        console.log(this.getShortName());

        this.probability = {};
        this.calculateProbabilities();
    }
  }


  calculateProbabilities() {
    this.probability['PROB_COUPON_TOUCHED'] = Math.round(Math.floor(Math.random() * (95 - 55 + 1)) + 55);
    this.probability['PROB_PAIR_REFUND'] = Math.round(Math.random() *(100 - this.probability['PROB_COUPON_TOUCHED'] ));
    this.probability['PROB_PDI_ACTIVATED'] = 100 - this.probability['PROB_COUPON_TOUCHED'] - this.probability['PROB_PAIR_REFUND'];
  }
  getProbability(probName) {
    return this.probability[probName];
  }

  updateProduct(product) {
    //console.log("CAutocall : ");
    super.updateProduct(product);
    //console.log("CAutocall apres super : ");
    this.setProductName();
    this._checkDates();
    this.calculateProbabilities();
    
  }



  // getDescription() {
  //   let desc =
  //     this.getProductName() +
  //     this.getFrequencyAutocallTitle() +
  //     this.getFullUnderlyingName() +
  //     this.getUnderlyingTickers() +
  //     this.getMaturityName() +
  //     this.getBarrierPDI() +
  //     this.getBarrierPhoenix() +
  //     (this.isAirbag() ? "airbag" : '') +
  //     this.getDegressiveStep() +
  //     this.getDegressivity() ;
  //     //(this.product.hasOwnProperty('code') ? this.product["code"] : '');

  //   return desc;
  // }






  getNextImportantDate() {

  }

  //renvoie le coupon annualisé
  getCoupon() {
    // "ISSUING_PRICE": 1,
    // "PRICING_DATE": "20201124_131143",
    // "RAW_RESPONSE": 0.08475914633377839,
    // "RESPONSE": 0.048687210697203394,
    // "UF": 0.03,
    // "UFAssoc": 0.002,
    // "VALIDITY_DATE": "20201125_173000",
    // "dCOUPON/dPRICE": 0.694794050514971,
      let coupon = this.getFromPricing("RESPONSE");
      if (coupon === -1) {
        coupon = 0;
      }
      return coupon;
  }



  //renvoie la degressivite des niveaux de rappels
  getDegressivity() {
    return this.degressiveStep;
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
    return this.typeAirbag;
  }

  //renvoie le niveau airbag
  getAirbagLevel() {
    let airbagCode = this.getAirbagCode();
    switch(airbagCode) {
      case 'FA' : return this.getBarrierPDI();
      case 'SA' : return this.getBarrierPDI();
      default : return this.getAutocallLevel();
    }
  }

  //renvoie la barriere Phoenix
  getBarrierPhoenix() {
    return this.barrierPhoenix;
  }

  //renvoie le coupon phoenix
  getCouponPhoenix() {
    return this.getFromPricing("PHOENIX_COUPON_PA");
  }

  //determine la frequence du phoenix
  getFrequencyPhoenixTitle() {
    let freq = FREQUENCYLIST.filter(({ id }) => id === this.getFrequencyPhoenix());
    if (freq.length !== 0) {
      return freq[0].name;
    }
 
    return "[FREQ]";
  }

  //determine la frequence du phoenix
  getFrequencyPhoenixNumber() {
    let freq = FREQUENCYLIST.filter(({ id }) => id === this.getFrequencyPhoenix());
    if (freq.length !== 0) {
      return freq[0].freq;
    }
 
    return 1;
  }

  //la frequence de phoenix
  getFrequencyPhoenix() {
    return this.freqPhoenix;
  }

  //determine la frequence de rappel
  getFrequencyAutocallTitle() {
   let freq = FREQUENCYLIST.filter(({ id }) => id === this.getFrequencyAutocall());
    if (freq.length !== 0) {
      return freq[0].name;
    }
 
    return "[FREQ]";
  }

  //determine la frequence de rappel
  getFrequencyAutocallNumber() {
    let freq = FREQUENCYLIST.filter(({ id }) => id === this.getFrequencyAutocall());
    if (freq.length !== 0) {
      return freq[0].freq;
    }
 
    return 1;
  }

  //la frequence de rappel
  getFrequencyAutocall() {
    return this.freqAutocall;
  }

  //renvoie le coupon phoenix
  getCouponAutocall() {
    return this.getFromPricing("AUTOCALL_COUPON_PA") 
  }

  //renvoie le coupon autocall
  getAutocallLevel() {
    return this.autocallLevel;
  }

  //renvoie la degreesivité par an
  getDegressiveStep() {
    return this.degressiveStep;
  }

  //renvoie la barriere PDI
  getBarrierPDI() {
    return this.barrierPDI;
  }

  //renvoie le titre en nombre d'annes de non rappel
  getNNCPLabel() {
    let name = "[XX]";

    let y = this.getNNCP() / 12;
    name = y === 1 ? " 1 an" : y + " ans";
  
    return name;
  }

  //renvoie le titre en nombre d'annes de non rappel
  getNNCP() {
    return this.noCallNbPeriod;
  }

  //verifie si c'est airbag ou semi-airbag
  isAirbag() {
    return this.isFullAirbag() || this.isSemiAirbag();
  }

  //verifie s'il est full airbeg
  isFullAirbag() {
    
    return this.getAirbagCode() === 'FA';
  }

  //verifie s'il est semi-airbag
  isSemiAirbag() {

    return this.getAirbagCode() === 'SA';
  }

  //verifie si c'est c'est un phoenix
  isPhoenix() {
      return this.getProductCode().includes('PHOENIX');
    //return this.barrierPhoenix !== this.autocallLevel;
  }

  //verifie si c'est c'est une reverse
  isReverse() {
    return this.autocallLevel === 99.99;
  }

  //verifie si c'est c'est un phoenix mémoire
  isMemory() {
    return this.isMemoryBool;
  }


  //verifie si c'est c'est un PDI US
  isPDIUS() {
    return this.isPDIUS;
  }


 //calcule les dates et les niveaux de paiements et les niveaux de rappels et de coupons
  getAutocallDatas(formula) {
    
    let datas = [];
    let today = new Date(Date.now());
    if (this.product.hasOwnProperty("PAYMENTS")) {
        let pdates = this.product["PAYMENTS"];

        pdates.forEach((p) => {
            let obj = {};
            if (p.hasOwnProperty('PAYOFF') && p.hasOwnProperty('DATES_STRING')) {
                p['PAYOFF'].forEach((payoff) => {
                    if (payoff.hasOwnProperty('FORMULA') && payoff.hasOwnProperty('LEVEL') && payoff.hasOwnProperty('OBSERVATIONS') && payoff.hasOwnProperty('COUPON') && payoff['FORMULA'] === formula) {
                        let maxKeyNumber = 0;
                        let minKeyNumber = 99999;
                        Object.keys(payoff['OBSERVATIONS']).forEach((k) => {
                            Number(k) > maxKeyNumber ? maxKeyNumber = Number(k) : null;
                            Number(k) < minKeyNumber ? minKeyNumber = Number(k) : null;
                        });

                        obj["date"]  = this.getObservationDate(maxKeyNumber);
                        obj["perf"] = 1;
                        if (obj["date"] < today) { //il faut calculer la perf
                          obj["perf"] = getPerformance(payoff['OBSERVATIONS']);
                        }
                        obj["coupon"] = payoff['COUPON'];
                        obj["level"] = payoff['LEVEL'];
                        obj["payments"] =  Moment(p['DATES_STRING'], 'YYYYMMDD_HHmmss').toDate();
                        datas.push(obj);
                    }
               })
            }
            //paymentDates.push(Moment(p['DATES_STRING'], 'YYYYMMDD').toDate());                
        })
    }  
    if (Object.keys(datas).length > 0) {
      datas.sort((a, b) => a['date'] - b['date']);
    }
    return datas;
  }

  //check if is already closed
  isAlreadyCalled() {
    var called = false;

    var datas = this.getAutocallDatas('AUTOCALL');
    datas.forEach((data) => {
      if (data['perf'] > data['level']) {
        called = true;
      }

    });
    return called;
  }

  //check if is already closed
  getDataFromCalled () {
    var dataCalled = {};

    var datas = this.getAutocallDatas('AUTOCALL');
    var found = false;
    datas.forEach((data) => {

      if (!found) {
        if (data['perf'] >= data['level']) {
          found = true;
          dataCalled = data;
        }
      }
    });
    return dataCalled;
  }

  
}
