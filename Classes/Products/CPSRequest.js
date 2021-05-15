//classe mere de tous les objets financiers, immos, arts, etc...
import { CRequest } from './CRequest';
import Numeral from 'numeral'
import 'numeral/locales/fr'





export class CPSRequest extends CRequest { 
    constructor() {
      super();
      p = {
        'typeAuction': {
          'value': 'PP',
          'valueLabel': 'Placement Privé',
          'defaultValueLabel': 'Optimisé',
          'title': 'PLACEMENT',
          'isActivated': true,
          'isLocked': false,
          'isMandatory': true,
          'icon' : 'ios-contact',
          'icon2' : 'ios-contacts',
        },
        'type': {
          'value': 'AUTOCALL_INCREMENTAL',
          'valueLabel': 'Athéna',
          'defaultValueLabel': 'Optimisé',
          'title': 'PRODUIT',
          'isActivated': true,
          'isLocked': false,
          'isMandatory': true,
          'icon': 'beaker-outline',
        },
        'underlying': {
          'value': ['CAC'],
          'valueLabel': 'CAC 40',
          'defaultValueLabel': 'Optimisé',
          'title': 'SOUS-JACENT',
          'isActivated': true,
          'isLocked': false,
          'isMandatory': true,
          'icon' : 'basket-fill',
        },
        'maturity': {
          'value': [8, 10],
          'valueLabel': '8 à 10 ans',
          'defaultValueLabel': 'Optimisé',
          'title': 'MATURITE',
          'isActivated': true,
          'isLocked': false,
          'isMandatory': true,
          'icon' : 'calendar',
        },
        'barrierPDI': {
          'value': 0.6,
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'title': 'CAPITAL',
          'valueLabel': "Protégé jusqu'à " + Numeral(0.6-1).format('0%'),
          'isLocked': false,
          'isMandatory': false,
          'icon' : 'shield',
        },
        'freq': {
          'value': "1Y",
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'title': 'FREQUENCE',
          'valueLabel': 'annuelle',
          'isLocked': false,
          'isMandatory': false,
          'icon' : 'alarm-multiple',
        },
        'autocallLevel': {
          'value': 1,
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'title': 'NIVEAU DE RAPPEL',
          'valueLabel': Numeral(1).format('0%'),
          'isLocked': true,
          'isMandatory': true,
          'icon' : 'gavel',
        },
        
        'barrierPhoenix': {
          'value': 1,
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': "Protégé jusqu'à : " + Numeral(0).format('0%'),
          'title': 'COUPONS',
          'isLocked': false,
          'isMandatory': false,
          'icon' : 'shield-half-full',
        },
        'typeAirbag': {
          'value': "NA", //NA : pas d airbag   SA : semi-airbag   FA : full airbag
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': 'Aucun airbag',
          'title': 'AIRBAG',
          'isLocked': false,
          'isMandatory': false,
          'icon' : 'airbag',
        },
        'nncp': {
          'value': 12, //12 mois
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': '1 an',
          'title': '1er RAPPEL',
          'isLocked': false,
          'isMandatory': false,
          'icon' : 'clock-start',
        },
        'isMemory': {
          'value': true,
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': 'Effet mémoire',
          'title': 'MEMOIRE',
          'isMandatory': true,
          'isLocked': false,
          'icon' : 'memory',
        },
  
        //pas encore d'ecran
        'degressiveStep': {
          'value': 0,
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': 'Sans stepdown',
          'title': 'DEGRESSIVITE',
          'isLocked': false,
          'isMandatory': false,
          'icon': 'trending-down',
        },
        'isPDIUS': {
          'value': false,
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': '',
          'title': 'AMERICAIN',
          'isMandatory': false,
          'isLocked': false,
        },
        /*'isIncremental': {
          'value': false,
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': 'Non Incrémental',
          'title': 'Non Incréméntal',
          'isMandatory': false,
          'isLocked': false,
        },*/
  
        //pas de choix pour le user
        'nominal': {
          'value': 1000000,
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'isMandatory': true,
        },
        'currency': {
          'value': 'EUR',
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'isMandatory': false,
        },
        'UF': {
          'value': 0.03,
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': Numeral(0.03).format('0.00%'),
          'title': 'MARGE',
          'isMandatory': false,
          'isLocked': false,
          'icon': 'margin',
        },
        'coupon': {
          'value': 0.03,
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': Numeral(0.03).format('0.00%'),
          'title': 'COUPON P.A.',
          'isMandatory': false,
          'isLocked': false,
          'icon': 'ticket-percent',
        },
        'UFAssoc': {
          'value': 0.002,
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': Numeral(0.002).format('0.00%'),
          'isMandatory': true,
        },
        'PREVIOUS_PRODUCT_PRICED': {
          'value': "",
          'isActivated': true,
          'defaultValueLabel': "",
          'valueLabel': "",
          'isMandatory': false,
        },
        'optimizer': {
          'value': "CPN",
          'isActivated': true,
          'defaultValueLabel': "CPN",
          'valueLabel': "CPN",
          'isMandatory': true,
        },
      };

      this.updateProduct(p);
      this.autocall = null;
    }
   
    isMandatory(criteria) {
      value = false;
      if (this.product.hasOwnProperty(criteria)) {
        value = this.product[criteria].isMandatory;
      }
      return value;
    }

    isActivated(criteria) {
      value = false;
      if (this.product.hasOwnProperty(criteria)) {
        value = this.product[criteria].isActivated;
      }
      return value;
    }
    setActivation(criteria, toActivate) {
      this.product[criteria].isActivated = toActivate;
    }

    getIcon(criteria) {
      value = '';
      if (this.product.hasOwnProperty(criteria)) {
        value = this.product[criteria].icon;
      }
      return value;
    }
    getValue(criteria) {
      value = 0;
      if (this.product.hasOwnProperty(criteria)) {
        value = this.product[criteria].value;
      }
      return value;
    }

    getValueLabel(criteria) {
      value = 0;
      if (this.product.hasOwnProperty(criteria)) {
        value = this.product[criteria].valueLabel;
      }
      return value;
    }

    getTitle(criteria) {
      value = '';
      if (this.product.hasOwnProperty(criteria)) {
        value = this.product[criteria].title;
      }
      return value;
    }

    isUpdated(criteria='') {
      isUpdated = false;


      if (criteria === '') {
        for (let k of Object.keys(this.product)) {
          if (isUpdated === false) {
            isUpdated = this.product[k].isUpdated;
          }
        }
   
        return isUpdated;
      }

      //console.log("passe la : " +criteria);
      isUpdated = false;
      if (this.product.hasOwnProperty(criteria)) {
        //console.log(this.product[criteria]);
        isUpdated = this.product[criteria].isUpdated;
      }
      return isUpdated;
    }



      //renvoie le titre en nombre d'annes de non rappel
    getNNCPLabel() {
      
      let y =  this.product['nncp'].value/12;
      return y === 1 ? " 1 an" : y + " ans";

    }

    setCriteria(criteria, value, valueLabel) {
      this.product[criteria].value = value;
      this.product[criteria].valueLabel = valueLabel;
      this.product[criteria].isUpdated = true;
    }

    setTitle(criteria, title) {
      this.product[criteria].title = title;
    }

    _fillCriteria(criteria, value, valueLabel) {
      this.product[criteria].value = value;
      this.product[criteria].valueLabel = valueLabel;
      this.product[criteria].isActivated = true;
    }

    setRequestFromCAutocall (autocall) {
      //console.log("SOUS JACENT : " + autocall.getUnderlyingTicker());
      this.autocall = autocall;
      this._fillCriteria('typeAuction', autocall.getAuctionType() ,autocall.getAuctionType());
      this._fillCriteria('type', autocall.getProductCode(), autocall.getProductName());
      this._fillCriteria('underlying', [autocall.getUnderlyingTickers()], autocall.getUnderlyingTickers());
      this._fillCriteria('maturity', [autocall.getMaturityInMonths()/12, autocall.getMaturityInMonths()/12], autocall.getMaturityName());
      this._fillCriteria('barrierPDI', autocall.getBarrierPDI(), "Protégé jusqu'à " + Numeral(autocall.getBarrierPDI()-1).format('0%'));
      this._fillCriteria('freq', autocall.getFrequencyAutocall(), autocall.getFrequencyAutocallTitle());
      this._fillCriteria('barrierPhoenix', autocall.getBarrierPhoenix(), "Protégé jusqu'à : " + Numeral(autocall.getBarrierPhoenix() - 1).format('0%'));
      this._fillCriteria('typeAirbag', autocall.getAirbagCode(), autocall.getAirbagTitle());
      this._fillCriteria('nncp', autocall.getNNCP(), "1er rappel dans "+autocall.getNNCPLabel());
      this._fillCriteria('isMemory', autocall.isMemory(), autocall.isMemory() ? 'Effet mémoire' : 'Non mémoire');
      this._fillCriteria('degressiveStep', autocall.getDegressivity(), autocall.getDegressivity() === 0 ? '' : 'Stepdown ' + Numeral(autocall.getDegressivity()).format('0%') + " / an");
      this._fillCriteria('UF', autocall.getUF(), autocall.getUF());
      this._fillCriteria('coupon', autocall.getCoupon(), autocall.getCoupon());
      this._fillCriteria('UFAssoc', autocall.getUFAssoc(), autocall.getUFAssoc());
      this._fillCriteria('nominal', autocall.getNominal(), autocall.getNominal());
 

      
      /*
      p = {
        'typeAuction': {
          'value': autocall.getAuctionType() === 'Placement Privé' ? 'PP' : 'APE',
          'valueLabel': 'Placement Privé',
          'defaultValueLabel': 'Optimisé',
          'title': 'TYPE DE DEMANDE',
          'isActivated': true,
          'isLocked': false,
          'isMandatory': true,
          'isUpdated': false,
        },
        'type': {
          'value': autocall.getProductCode(),
          'valueLabel': autocall.getProductName(),
          'defaultValueLabel': 'Optimisé',
          'title': 'CHOIX DU PRODUIT',
          'isActivated': true,
          'isLocked': false,
          'isMandatory': true,
          'isUpdated': false,
        },
        'underlying': {
          'value': [autocall.getUnderlyingTicker()],
          'valueLabel': autocall.getUnderlyingTicker(),
          'defaultValueLabel': 'Optimisé',
          'title': 'SOUS-JACENT',
          'isActivated': true,
          'isLocked': false,
          'isMandatory': true,
          'isUpdated': false,
        },
        'maturity': {
          'value': [autocall.getMaturityInMonths()/12, autocall.getMaturityInMonths()/12],
          'valueLabel': autocall.getMaturityName(),
          'defaultValueLabel': 'Optimisé',
          'title': 'MATURITE',
          'isActivated': true,
          'isLocked': false,
          'isMandatory': false,
          'isUpdated': false,
        },
        'barrierPDI': {
          'value': autocall.getBarrierPDI(),
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'title': 'PROTECTION DU CAPITAL',
          'valueLabel': Numeral(autocall.getBarrierPDI()-1).format('0%'),
          'isLocked': false,
          'isMandatory': false,
          'isUpdated': false,
        },
        'freq': {
          'value': autocall.getFrequencyAutocall(),
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'title': 'FREQUENCE',
          'valueLabel': '1 an',
          'isLocked': false,
          'isMandatory': false,
          'isUpdated': false,
        },
        'barrierPhoenix': {
          'value': autocall.getBarrierPhoenix(),
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': "Protégé jusqu'à : " + Numeral(-0.2).format('0%'),
          'title': 'OPTIONS COUPONS',
          'isLocked': false,
          'isMandatory': false,
          'isUpdated': false,
        },
        'typeAirbag': {
          'value': autocall.getAirbagCode(), //NA : pas d airbag   SA : semi-airbag   FA : full airbag
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': 'Aucun airbag',
          'title': 'OPTIONS AUTOCALL',
          'isLocked': false,
          'isMandatory': false,
          'isUpdated': false,
        },
        'nncp': {
          'value': autocall.getNNCP(), //12 mois
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': '1 an',
          'title': '1er RAPPEL',
          'isLocked': false,
          'isMandatory': false,
          'isUpdated': false,
        },
        'isMemory': {
          'value': autocall.isMemory(),
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': '',
          'title': 'EFFET MEMOIRE',
          'isMandatory': false,
          'isLocked': false,
          'isUpdated': false,
        },
  
        'degressiveStep': {
          'value': autocall.getDegressivity(),
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': '',
          'title': 'DEGRESSIVITE',
          'isLocked': false,
          'isMandatory': false,
          'isUpdated': false,
        },
        'isPDIUS': {
          'value': autocall.isPDIUS(),
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': '',
          'title': 'AMERICAIN',
          'isMandatory': false,
          'isLocked': false,
          'isUpdated': false,
        },
        'isIncremental': {
          'value': autocall.isIncremental(),
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': 'Non Incrémental',
          'title': 'Non Incréméntal',
          'isMandatory': false,
          'isLocked': false,
          'isUpdated': false,
        },
  
        //pas de choix pour le user
        'nominal': {
          'value': 100000,
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'isMandatory': false,
          'isUpdated': false,
        },
        'currency': {
          'value': autocall.getCurrency(),
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'isMandatory': false,
          'isUpdated': false,
        },
        'UF': {
          'value': autocall.getUF(),
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'isMandatory': true,
          'isUpdated': false,
           'title': 'RETROCESSIONS'
        },
        'UFAssoc': {
          'value': autocall.getUFAssoc(),
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'isMandatory': true,
          'isUpdated': false,
          'title': 'RETROCESSIONS'
        },
        'coupon': {
          'value': autocall.getCoupon(),
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': Numeral(0.03).format('0.00%'),
          'title': 'COUPON MIN',
          'isMandatory': true,
          'isUpdated': false,
          'icon': 'ticket-percent',
        },
      };*/
   

      this.updateProduct(p);
    }
    
    
    refreshFields () {
    //on délocke tout
      Object.keys(this.product).forEach((p) => {
        //console.log(this.product[p].value);
        this.product[p].isLocked = false;
        this.product[p].defaultValueLabel = 'Optimisé';
      });

      //on active ou desactive certains parametres 
      if (this.product['type'].value.includes('phoenix')){ //effet airbag, degressivite desactive
        this.product['typeAirbag'].isLocked = true;
        this.product['typeAirbag'].defaultValueLabel = 'NA';
      } else if (this.product['type'].value.includes('athena')) {
        this.product['barrierPhoenix'].isLocked = true;
        this.product['barrierPhoenix'].defaultValueLabel = 'NA';
      }
    }



    getCriteria() {
      let criteria = {};

      this.product.underlying.isActivated ? criteria['underlying'] = this.product.underlying.value : null;
      criteria['optimizer'] = this.product.optimizer.value;
      criteria['levelAutocall'] =   this.product.autocallLevel.value;
      criteria['freqAutocall'] =  this.product.freq.isActivated ? this.product.freq.value : "1Y";
      criteria['noCallNbPeriod'] =  this.product.nncp.isActivated ? this.product.nncp.value : 12;
      criteria['coupon'] =  this.product.coupon.value;
      criteria['maturity'] =  this.product.maturity.isActivated ? this.product.maturity.value : ['8Y'];
      criteria['typeAirbag'] =  this.product.typeAirbag.value;
      //type de placement
      criteria['typeAuction'] =  this.product.typeAuction.value;
      criteria['nominal'] =  this.product.nominal.value;
      //autocall
      //criteria['isIncremental'] =  this.product.type.value === 'athena' ? this.product.isIncremental.value : false;
      
      //gestion du stepdown et du non airbag et barrier coupon
      
      /*AUTOCALL_CLASSIC', 
                'AUTOCALL_INCREMENTAL',
                'PHOENIX',
                'PHOENIX_MEMORY',
                'REVERSE',
                "UNKNOWN"]*/
      criteria['barrierPhoenix'] =  1;
      if (this.product.type.value === 'AUTOCALL_CLASSIC' || this.product.type.value === 'AUTOCALL_INCREMENTAL') {
        let ds = this.product.degressiveStep.value;
        let ds_array = [0, 2, 5];
        //if (ds_array.indexOf(ds) !== -1) {
          criteria['degressiveStep'] =  this.product.degressiveStep.value;
        //}
        criteria['barrierPhoenix'] =  1;
      } else if (this.product.type.value === 'PHOENIX' || this.product.type.value === 'PHOENIX_MEMORY') {
        if (this.product.barrierPhoenix.isActivated) {
          let bp = this.product.barrierPhoenix.value;
          let bp_array = [0.5, 0.7, 0.9];
          //if (bp_array.indexOf(bp) !== -1) {
            criteria['barrierPhoenix'] =  this.product.barrierPhoenix.value;
          //}
        } else { //on prend le max des barrieres phoenix
          criteria['barrierPhoenix'] =  0.9;
        }

        criteria['degressiveStep'] =  0;
        criteria['typeAirbag'] =  'NA';
      }

      //airbag
      //criteria['typeAirbag'] =  1;


      //gestion du PDI : les barrieres testes sont 0.4 0.6 et 0.8
      if (this.product.barrierPDI.isActivated) {
          criteria['barrierPDI'] =  this.product.barrierPDI.value;
      } else { //on prend le max des PDI max
        criteria['barrierPDI'] =  0.8;
        /*if (this.product.typeAirbag.isActivated && this.product.type.value === 'athena' && this.product.typeAirbag.value !== 'NA') {
          if (this.product.typeAirbag.value === 'FA') {
            criteria['typeAirbag'] =  0.8;
          } else if (this.product.typeAirbag.value === 'SA') {
            criteria['typeAirbag'] =  0.9;
          }
        }*/
      }
      criteria['isPDIUS'] =  this.product.barrierPDI.isActivated  ? this.product.isPDIUS.value : false;
      //this.product.barrierPDI.isActivated ? criteria['barrierPDI'] =  this.product.barrierPDI.value : null;
      criteria['UF'] = this.product.UF.value;
      criteria['UFAssoc'] = this.product.UFAssoc.value;
      criteria['degressiveStep'] = this.product.degressiveStep.value;
      this.product.isPDIUS.isActivated ? criteria['isPDIUS'] =  this.product.isPDIUS.value : false;
      //memoire phoenix
      //criteria['isMemory'] =  this.product.type.value === 'phoenix'  ? this.product.isMemory.value : false;
      criteria['isMemory'] =  this.product.isMemory.value;
      criteria['PREVIOUS_PRODUCT_PRICED'] = this.product.PREVIOUS_PRODUCT_PRICED.value;
      criteria['nominal'] = this.product.nominal.value;

      //criteria['nominal'] = this.product.nominal.value;
      
      return criteria;
    }
  }