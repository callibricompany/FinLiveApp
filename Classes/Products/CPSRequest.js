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
          'title': 'TYPE DE DEMANDE',
          'isActivated': true,
          'isLocked': false,
          'isMandatory': true,
        },
        'type': {
          'value': 'autocall',
          'valueLabel': 'Autocall',
          'defaultValueLabel': 'Optimisé',
          'title': 'CHOIX DU PRODUIT',
          'isActivated': true,
          'isLocked': false,
          'isMandatory': true,
        },
        'underlying': {
          'value': ['CAC'],
          'valueLabel': 'CAC 40',
          'defaultValueLabel': 'Optimisé',
          'title': 'SOUS-JACENT',
          'isActivated': true,
          'isLocked': false,
          'isMandatory': true,
        },
        'maturity': {
          'value': [8, 10],
          'valueLabel': '8 à 10 ans',
          'defaultValueLabel': 'Optimisé',
          'title': 'MATURITE',
          'isActivated': true,
          'isLocked': false,
          'isMandatory': false,
        },
        'barrierPDI': {
          'value': 0.6,
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'title': 'PROTECTION DU CAPITAL',
          'valueLabel': Numeral(0.6-1).format('0%'),
          'isLocked': false,
          'isMandatory': false,
        },
        'freq': {
          'value': "1Y",
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'title': 'FREQUENCE',
          'valueLabel': '1 an',
          'isLocked': false,
          'isMandatory': false,
        },
        'barrierPhoenix': {
          'value': 0.8,
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': "Protégé jusqu'à : " + Numeral(-0.2).format('0%'),
          'title': 'OPTIONS COUPONS',
          'isLocked': false,
          'isMandatory': false,
        },
        'airbagLevel': {
          'value': "NA", //NA : pas d airbag   SA : semi-airbag   FA : full airbag
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': 'Aucun airbag',
          'title': 'OPTIONS AUTOCALL',
          'isLocked': false,
          'isMandatory': false,
        },
        'nncp': {
          'value': 12, //12 mois
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': '1 an',
          'title': '1er RAPPEL',
          'isLocked': false,
          'isMandatory': false,
        },
        'isMemory': {
          'value': false,
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': '',
          'title': 'EFFET MEMOIRE',
          'isMandatory': false,
          'isLocked': false,
        },
  
        //pas encore d'ecran
        'degressiveStep': {
          'value': 0,
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': '',
          'title': 'DEGRESSIVITE',
          'isLocked': false,
          'isMandatory': false,
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
        'isIncremental': {
          'value': false,
          'isActivated': false,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': 'Non Incrémental',
          'title': 'Non Incréméntal',
          'isMandatory': false,
          'isLocked': false,
        },
  
        //pas de choix pour le user
        'nominal': {
          'value': 100000,
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'isMandatory': false,
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
          'isMandatory': true,
        },
        'UFAssoc': {
          'value': 0.002,
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'isMandatory': true,
        },
      };

      this.updateProduct(p);
      this.autocall = null;
    }

    getValue(criteria) {
      value = 0;
      if (this.product.hasOwnProperty(criteria)) {
        value = this.product[criteria].value;
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

    /*isUpdated() {
      isUpdated = false;
      
      console.log("passe plutot la");
      for (let k of Object.keys(this.product)) {
        if (isUpdated === false) {
          isUpdated = this.product[k].isUpdated;
        }
      }
 
      return isUpdated;
    }*/

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


    setRequestFromCAutocall (autocall) {
      //console.log("SOUS JACENT : " + autocall.getUnderlyingTicker());
      this.autocall = autocall;
      p = {
        'typeAuction': {
          'value': autocall.getInvestmentType() === 'Placement Privé' ? 'PP' : 'APE',
          'valueLabel': 'Placement Privé',
          'defaultValueLabel': 'Optimisé',
          'title': 'TYPE DE DEMANDE',
          'isActivated': true,
          'isLocked': false,
          'isMandatory': true,
          'isUpdated': false,
        },
        'type': {
          'value': autocall.getProductShortName(),
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
        'airbagLevel': {
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
          'value': autocall.isPhoenixMemory(),
          'isActivated': true,
          'defaultValueLabel': 'Optimisé',
          'valueLabel': '',
          'title': 'EFFET MEMOIRE',
          'isMandatory': false,
          'isLocked': false,
          'isUpdated': false,
        },
  
        //pas encore d'ecran
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
      };
   

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
        this.product['airbagLevel'].isLocked = true;
        this.product['airbagLevel'].defaultValueLabel = 'Non compatible';
      } else if (this.product['type'].value.includes('autocall')) {
        this.product['barrierPhoenix'].isLocked = true;
        this.product['barrierPhoenix'].defaultValueLabel = 'Non compatible';
      }
    }

    getCriteria() {
      let criteria = {};
      this.product.underlying.isActivated ? criteria['underlying'] = this.product.underlying.value : null;
      criteria['freqAutocall'] =  this.product.freq.isActivated ? this.product.freq.value : "3M";
      criteria['noCallNbPeriod'] =  this.product.freq.isActivated ? this.product.nncp.value : 12;

      //autocall
      criteria['isIncremental'] =  this.product.type.value === 'autocall' ? this.product.isIncremental.value : false;
      
      //gestion du stepdown et du non airbag et barrier coupon
      if (this.product.type.value === 'autocall') {
        let ds = this.product.degressiveStep.value;
        let ds_array = [0, 2, 5];
        if (ds_array.indexOf(ds) !== -1) {
          criteria['degressiveStep'] =  this.product.degressiveStep.value;
        }
        criteria['barrierPhoenix'] =  1;
      } else if (this.product.type.value === 'phoenix') {
        if (this.product.barrierPhoenix.isActivated) {
          let bp = this.product.barrierPhoenix.value;
          let bp_array = [0.5, 0.7, 0.9];
          if (bp_array.indexOf(bp) !== -1) {
            criteria['barrierPhoenix'] =  this.product.barrierPhoenix.value;
          }
        } else { //on prend le max des barrieres phoenix
          criteria['barrierPhoenix'] =  0.9;
        }

        criteria['degressiveStep'] =  0;
        criteria['airbagLevel'] =  1;
      }

      //airbag
      criteria['airbagLevel'] =  1;


      //gestion du PDI : les barrieres testes sont 0.4 0.6 et 0.8
      if (this.product.barrierPDI.isActivated) {
        let bpdi = this.product.barrierPDI.value;
        let bdi_array = [0.4, 0.6, 0.8];
        if (bdi_array.indexOf(bpdi) !== -1) {
          criteria['barrierPDI'] =  this.product.barrierPDI.value;
          //on voit aussi si airbag est selectionne
          if (this.product.airbagLevel.isActivated && this.product.type.value === 'autocall' && this.product.airbagLevel.value !== 'NA') {
            if (this.product.airbagLevel.value === 'FA') {
              criteria['airbagLevel'] =  this.product.barrierPDI.value;
            } else if (this.product.airbagLevel.value === 'SA') {
              criteria['airbagLevel'] =  (1 + this.product.barrierPDI.value)/2;
            }
          }
        } else {
          //criteria.splice(criteria.indexOf('airbagLevel'), 1); //supprime le critere
          if (this.product.airbagLevel.value !== 'NA') {
            delete criteria['airbagLevel'];
          }
        }
      } else { //on prend le max des PDI max
        criteria['barrierPDI'] =  0.8;
        if (this.product.airbagLevel.isActivated && this.product.type.value === 'autocall' && this.product.airbagLevel.value !== 'NA') {
          if (this.product.airbagLevel.value === 'FA') {
            criteria['airbagLevel'] =  0.8;
          } else if (this.product.airbagLevel.value === 'SA') {
            criteria['airbagLevel'] =  0.9;
          }
        }
      }
      criteria['isPDIUS'] =  this.product.barrierPDI.isActivated  ? this.product.isPDIUS.value : false;


      //memoire phoenix
      criteria['isMemory'] =  this.product.type.value === 'phoenix'  ? this.product.isMemory.value : false;
      
      return criteria;
    }
  }