import { CFinancialProduct } from './CFinancialProduct';
import { object } from 'prop-types';
import Moment from 'moment';



export class CStructuredProduct extends CFinancialProduct {
    constructor(structuredproduct, source='products') {
      super(structuredproduct, source); 
      this.nominal = 1000000;
      this.strikingDate = "";

      this.spots = {};
    }

    

    //retourne le prix d'emission
    getIssuingPrice() {
        let issuingPrice = this.getFromPricing("ISSUING_PRICE");
        if (issuingPrice === -1) {
            issuingPrice = 1;
        }
        return issuingPrice;
    }

    //compte le nombre de sous-jacents du produit
    getUnderlyingsCount() {
        let nb = 0;
        if (this.product.hasOwnProperty("UNDERLYINGS_LIST")) {
            nb = Object.keys(this.product["UNDERLYINGS_LIST"]).length;
        }
        return nb;
    }
    //determine le nom du sous
    getUnderlyingTickers() {
        let name = "UNKNOWN";
        if (this.product.hasOwnProperty("UNDERLYINGS_LIST")) {
            if (Object.keys(this.product["UNDERLYINGS_LIST"]).length === 1 ) {
                return Object.keys(this.product["UNDERLYINGS_LIST"])[0];
            } else if (Object.keys(this.product["UNDERLYINGS_LIST"]).length > 1 ) {
                return Object.keys(this.product["UNDERLYINGS_LIST"]);
            }
        }
        //console.log("getUnderlyingTickers : " + name);
        return name;
    }


    //renvoie le nom long du sous jacent
    getFullUnderlyingNames(categories = "") {
        let name = "UNKNOWN";
        if (this.product.hasOwnProperty("UNDERLYINGS_LIST")) {
            if (Object.values(this.product["UNDERLYINGS_LIST"]).length === 1 ) {
                return Object.values(this.product["UNDERLYINGS_LIST"])[0];
            } else if (Object.values(this.product["UNDERLYINGS_LIST"]).length > 1 ) {
                return Object.values(this.product["UNDERLYINGS_LIST"]);
            }
        }

        return name;
    }

    getFullUnderlyingName() {
        var underlyings  = this.getFullUnderlyingNames();
        if (Array.isArray(underlyings)) {
            return underlyings[0];
        } else {
            return underlyings;
        }
    }

    addUnderlyings(underlying) {
        if (this.product.hasOwnProperty("UNDERLYINGS_LIST")) {
            let udl = this.product["UNDERLYINGS_LIST"];
            if (Array.isArray(udl)) {
                udl.push(underlying);
                this.product["UNDERLYINGS_LIST"] = udl;
            } else {
                this.product["UNDERLYINGS_LIST"] = [udl, underlying];
            }
        } else {
            this.product["UNDERLYINGS_LIST"] = [underlying];
        }
    }

    //renvoie true si le produit est déja striké
    isStruck () {
        //regarder si les dates sont fixes et si la dates de strike est passé 
        struck = false;

        return struck;
    }

    //check si c'est mono ou multi
    isMono() {
        let mono = true;
        if (this.product.hasOwnProperty("UNDERLYINGS_LIST")) {
            if (Object.values(this.product["UNDERLYINGS_LIST"]).length > 1 ) {
                mono = false;
            } 
        }
   
        return mono;
    }

    //renvoie sous forme de tableau toutes les dates de paiement
    getPaymentDates() {
        let paymentDates = [];
        if (this.product.hasOwnProperty("PAYMENTS")) {
            let pdates = this.product["PAYMENTS"];
    
            pdates.forEach((p) => {
                paymentDates.push(Moment(p['DATES_STRING'], 'YYYYMMDD').toDate());                
            })
        }  
        
        return paymentDates;
    }

    //renvoie sous forme de tableau toutes les dates d'observation
    getObservationDatesAsDict() {
        let obsDates = {};
        if (this.product.hasOwnProperty("UNDERLYINGS")) {
            //on passe sur tous les sous-jacents
            Object.keys(this.product["UNDERLYINGS"]).forEach((udl) => { 
                let allDatesObsOfUdl = this.product["UNDERLYINGS"][udl];
                for (const [key, dateObs] of Object.entries(allDatesObsOfUdl)) {
                    if ("DATES_STRING" in dateObs) {
                        if (Array.isArray(dateObs['DATES_STRING'])) {
                            dateObs['DATES_STRING'].forEach((dArray) => {
                                let dateToAdd = Moment(dArray, 'YYYYMMDD').toDate();
                                if (obsDates.hasOwnProperty(key)) {
                                    if (Array.isArray(obsDates[key])) {
                                        if (!obsDates[key].includes(dateToAdd)) {
                                            obsDates[key].push(dateToAdd);
                                        }
                                    } 
                                } else {
                                    let datesArray = [];
                                    datesArray.push(dateToAdd);    
                                    obsDates[key] = datesArray;
                                }
                            });
                        } else {
                            let dateToAdd = Moment(dateObs['DATES_STRING'], 'YYYYMMDD').toDate();
                            if (!obsDates.hasOwnProperty(key)) {
                                obsDates[key] = dateToAdd;
                            } 
                        }
                    }
                }
                //console.log(Object.keys(allDatesObsOfUdl));
            });
            
        }  
        return obsDates;
    }

    //renvoie sous forme de tableau toutes les dates d'observation
    getObservationDates() {
        let obsDates = [];
        if (this.product.hasOwnProperty("UNDERLYINGS")) {
            //on passe sur tous les sous-jacents
            Object.keys(this.product["UNDERLYINGS"]).forEach((udl) => { 
                let allDatesObsOfUdl = this.product["UNDERLYINGS"][udl];
                Object.values(allDatesObsOfUdl).forEach((d) => {
                    if ("DATES_STRING" in d) {
                        if (Array.isArray(d['DATES_STRING'])) {
                            d['DATES_STRING'].forEach((dArray) => {
                                let dateToAdd = Moment(dArray, 'YYYYMMDD').toDate();
                                if (obsDates.includes(dateToAdd) === false) {
                                    obsDates.push(dateToAdd);   
                                }  
                            });
                        } else {
                            let dateToAdd = Moment(d['DATES_STRING'], 'YYYYMMDD').toDate();
                            if (obsDates.includes(dateToAdd) === false) {
                                obsDates.push(dateToAdd);   
                            }  
                        }
                    }
                    

                });
                //console.log(Object.keys(allDatesObsOfUdl));
            });
            
        }  
        return obsDates;
    }
    getObservationDate(whichDateNumber) {
        let obsDate = "";
        if (this.product.hasOwnProperty("UNDERLYINGS")) {
            //on passe sur tous les sous-jacents
            Object.keys(this.product["UNDERLYINGS"]).forEach((udl) => { 
                let allDatesObsOfUdl = this.product["UNDERLYINGS"][udl];
                if (String(whichDateNumber) in Object.keys(allDatesObsOfUdl)) {
                    var d = allDatesObsOfUdl[String(whichDateNumber)];
                    if ("DATES_STRING" in d) {
                        if (Array.isArray(d['DATES_STRING'])) {
                            obsDate = Moment(d['DATES_STRING'][0], 'YYYYMMDD').toDate();
                        } else {
                            obsDate = Moment(d['DATES_STRING'], 'YYYYMMDD').toDate();
                        }
                    }
                }
                //console.log(Object.keys(allDatesObsOfUdl));
            });
            
        }  
        return obsDate;
    }

    //renvoie la maturité
    getMaturityName() {
        let name = "[MTY]";

        let obsDates = this.getObservationDates();
        if (obsDates.length > 0) {
            let d = new Date(Math.max(...obsDates));
            name = Moment(d).toNow(true);
        }

        return name;
    }

    //renvoie la maturité du produit en mois
    getMaturityInMonths() {
        let nbMonths = 0;

        let obsDates = this.getObservationDates();
        if (obsDates.length > 0) {
            let d = Moment(new Date(Math.max(...obsDates)));
            let dNow = Moment(new Date(Date.now()));
            nbMonths = Moment.duration(d.diff(dNow)).asMonths();
        }

        return Math.round(nbMonths);
    }

    getIssueDate() {
        let dateIssuing = new Date(Date.now());
        if (this.product.hasOwnProperty('DATE_START_ISSUING')) {
            dateIssuing = Moment(this.product['DATE_START_ISSUING'], "YYYYMMDD").toDate();
        }
        else {
            if (this.areDatesFixed() ===  false) {
                //il faut reaclculer la date effective a partir de la dfate effective relative
                if (this.product.hasOwnProperty('DATE_EFFECTIVE_RELATIVE') && this.product['DATE_EFFECTIVE_RELATIVE'] !== "") {
                    let relativeDate = this.product['DATE_EFFECTIVE_RELATIVE'];
                    let period = relativeDate.substring(relativeDate.length - 1, relativeDate.length);
                    period = period !== 'M' ? period.toLowerCase() : null;
                    dateIssuing =  Moment(dateIssuing).add(relativeDate.substring(0, relativeDate.length - 1), period).toDate();
                }
            } else {
                //on prend la date effective
                dateIssuing = Moment(this.product['DATE_EFFECTIVE_STRING'], "YYYYMMDD").toDate();
            }
        } 
        return dateIssuing;
    }

    setIssuingDate(dateIssuing) {
        this.product['DATE_START_ISSUING'] = Moment(dateIssuing).format("YYYYMMDD");
    }

    getStrikingDate() {
        let strikingDate = [];
        if (this.product.hasOwnProperty("UNDERLYINGS")) {
            //on passe sur tous les sous-jacents
            Object.keys(this.product["UNDERLYINGS"]).forEach((udl) => { 
                if (0 in this.product["UNDERLYINGS"][udl]) {
                    if("DATES_STRING" in this.product["UNDERLYINGS"][udl][0]) {
                        if (Array.isArray(this.product["UNDERLYINGS"][udl][0]['DATES_STRING'])) {
                            this.product["UNDERLYINGS"][udl][0]['DATES_STRING'].forEach((d) => {
                                strikingDate.push(Moment(d, "YYYYMMDD").toDate());
                            });

                        } else {
                            strikingDate.push(Moment(this.product["UNDERLYINGS"][udl][0]['DATES_STRING'], "YYYYMMDD").toDate());
                        }
                    }
                }
            });
            
        }  

        if (strikingDate.length > 0) {
            return new Date(Math.max(...strikingDate));
        } else {
            if (this.strikingDate != null && this.strikingDate !== "") {
                return this.strikingDate;
            } else {
                return new Date(Date.now());
            }
        }
        
    }

    getStrikingLevels() {
        let strikingLevel = {};
        if (this.product.hasOwnProperty("UNDERLYINGS")) {
            //on passe sur tous les sous-jacents
            Object.keys(this.product["UNDERLYINGS"]).forEach((udl) => { 
                strikingLevel[udl] = 1;
                if (0 in this.product["UNDERLYINGS"][udl]) {
                    if("FIXING" in this.product["UNDERLYINGS"][udl][0]) {
                        if (Array.isArray(this.product["UNDERLYINGS"][udl][0]['FIXING'])) {

                            let strikingLevels = this.product["UNDERLYINGS"][udl][0]['FIXING'];
                            let formula = 'AVG';
                            if ("FUNCTION" in this.product["UNDERLYINGS"][udl][0]) {
                                formula = this.product["UNDERLYINGS"][udl][0]['FUNCTION'];
                            }
                            switch(formula) {
                                case 'AVG' :
                                    strikingLevel[udl] = eval(strikingLevels.join('+'))/strikingLevels.length;
                                    break;
                                case 'MIN' :
                                    strikingLevel[udl] = Math.min(strikingLevels);
                                    break;
                                case 'MAX' :
                                    strikingLevel[udl] = Math.max(strikingLevels);
                                    break;
                                default :
                                    break;
                            }

                        } else {
                            strikingLevel[udl] = this.product["UNDERLYINGS"][udl][0]['FIXING'];
                        }
                    }
                }
            });
            
        }  
        //console.log(strikingLevel);
        return strikingLevel;
        
    }

    setStrikingDate(strikingDate) {
        this.strikingDate = strikingDate;
        if (this.product.hasOwnProperty("UNDERLYINGS")) {
            //on passe sur tous les sous-jacents
            Object.keys(this.product["UNDERLYINGS"]).forEach((udl) => { 
                if (0 in this.product["UNDERLYINGS"][udl]) {
                    if("DATES_STRING" in this.product["UNDERLYINGS"][udl][0]) {
                        if (Array.isArray(this.product["UNDERLYINGS"][udl][0]['DATES_STRING'])) {
                            this.product["UNDERLYINGS"][udl][0]['DATES_STRING'] = [Moment(strikingDate, "YYYYMMDD")];
                        } else {
                            this.product["UNDERLYINGS"][udl][0]['DATES_STRING'] = Moment(strikingDate, "YYYYMMDD");
                        }
                    }
                }
            });
        }  
    }

    //renvoie les niveaux de fixing avec calcul d'un niveau donné
    getLevels(observation, useSpots=false) {
        let strikingLevel = {};
        if (this.product.hasOwnProperty("UNDERLYINGS")) {
            //on passe sur tous les sous-jacents
            Object.keys(this.product["UNDERLYINGS"]).forEach((udl) => { 
                strikingLevel[udl] = 1;
                if (observation in this.product["UNDERLYINGS"][udl]) {
                    if("FIXING" in this.product["UNDERLYINGS"][udl][observation]) {
                        if (Array.isArray(this.product["UNDERLYINGS"][udl][observation]['FIXING'])) {

                            let strikingLevels = this.product["UNDERLYINGS"][udl][observation]['FIXING'];
                            let formula = 'AVG';
                            if ("FUNCTION" in this.product["UNDERLYINGS"][udl][observation]) {
                                formula = this.product["UNDERLYINGS"][udl][observation]['FUNCTION'];
                            }
                            switch(formula) {
                                case 'AVG' :
                                    strikingLevel[udl] = eval(strikingLevels.join('+'))/strikingLevels.length;
                                    break;
                                case 'MIN' :
                                    strikingLevel[udl] = Math.min(strikingLevels);
                                    break;
                                case 'MAX' :
                                    strikingLevel[udl] = Math.max(strikingLevels);
                                    break;
                                default :
                                    break;
                            }

                        } else {
                            strikingLevel[udl] = this.product["UNDERLYINGS"][udl][observation]['FIXING'];
                        }
                    } else {
                        if (Object.keys(this.spots).length > 0 && useSpots) {
                            strikingLevel[udl] = this.spots[udl];
                        }
                    }
                }
            });
            
        }  
        //console.log(strikingLevel);
        return strikingLevel;
        
    }

    
    //renvoie la date de fin du produit
    getEndIssueDate() {
        let endIssuingdate = new Date(Date.now());
        //on checke si elle est  renseignée
        if (this.product.hasOwnProperty('DATE_END_ISSUING')) {
            endIssuingdate = Moment(this.product['DATE_END_ISSUING'], "YYYYMMDD").toDate();
        } else {
            //on prend la dernière date de paieemnt
            let paimentsDates = this.getPaymentDates();
            endIssuingdate = new Date(Math.max(...paimentsDates));
        }

        return endIssuingdate;
    }
    setEndIssueDate(dateEndIssuing) {
        this.product['DATE_END_ISSUING'] = Moment(dateEndIssuing).format("YYYYMMDD");
    }

    //renvoie la dernière date d'obeservation
    getLastConstatDate() {
        let lastObsDate = new Date(Date.now());

        let obsDates = this.getObservationDates();
        if (obsDates.length > 0) {
            lastObsDate = new Date(Math.max(...obsDates));
        }

        return lastObsDate;
    }

    setSpots(spots) {
        this.spots = spots;
    }

    //renvoie la performance actuelle
    getPerformances() {
        //on verifie si les spots sont corrects et complets
        var perf = {};
        perf['GLOBAL_PERF'] = 1; 
        if (Object.keys(this.spots).length === 0) {
            return perf;
        }

        if (this.getUnderlyingsCount() !== Object.keys(this.spots).length) {
            return perf;
        }

        var today = Date.now();
        var spreadDates = -1;
        let firstObsAfterToday = {};
        //on recupere toutes les valeurs 
        let obs = this.getObservationDatesAsDict();
        
        if (this.product.hasOwnProperty("PAYMENTS")) {
            for (const [key, paiement] of Object.entries(this.product["PAYMENTS"])) {

                if (paiement.hasOwnProperty('PAYOFF')) {
                    paiement['PAYOFF'].forEach((p) => {
                        if (p.hasOwnProperty('OBSERVATIONS')){
                            
                            var max = 0;
                            var min = 9999;
                            Object.keys(p['OBSERVATIONS']).forEach((num) => {
                                if (Number(num) > max ){
                                    max = Number(num)
                                }
                                if (Number(num) < min ){
                                    min = Number(num)
                                }
                            });
     
                            let spd = obs[String(max)] - today;
                            if (spd > 0 && (spd < spreadDates || spreadDates === -1)) {
                                spreadDates = spd;
                                firstObsAfterToday = p['OBSERVATIONS'];
                            }

        
                        }
                    });
                }
            }
        } 
        
        //on passe sur la prchaine perf et on voit  ce que ca donne en  terme  de performance
        console.log(firstObsAfterToday );
        if (Object.keys(firstObsAfterToday).length > 0) {
            var max = 0;
            var min = 9999;
            Object.keys(firstObsAfterToday).forEach((num) => {
                if (Number(num) > max ){
                    max = Number(num)
                }
                if (Number(num) < min ){
                    min = Number(num)
                }
            });

            let minObs = this.getLevels(min, true);
            let maxObs = this.getLevels(max, true);


            var perfByUdl = {};
            perf['GLOBAL_PERF'] = 1; 
            Object.keys(minObs).forEach((udl) => {
                perfByUdl[udl] = maxObs[udl] / minObs[udl];
            });
            switch(firstObsAfterToday[max]) {
                case 'BSK' :
                    perf['GLOBAL_PERF'] = eval(Object.values(perfByUdl).join('+'))/Object.values(perfByUdl).length;   
                    break;
                case 'WO' :
                    perf['GLOBAL_PERF'] = Math.min(Object.values(perfByUdl));
                    break;
                case 'BO' :
                    perf['GLOBAL_PERF'] = Math.max(Object.values(perfByUdl));
                    break;
                default :
                    break;
            }
            perf = Object.assign({}, perf, perfByUdl);

        }

        //console.log(obs);
        return perf;
    }


}
