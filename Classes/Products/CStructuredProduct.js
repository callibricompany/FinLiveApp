import { CFinancialProduct } from './CFinancialProduct';
import { object } from 'prop-types';
import Moment from 'moment';



export class CStructuredProduct extends CFinancialProduct {
    constructor(structuredproduct, source='products') {
      super(structuredproduct, source); 
      this.nominal = 1000000;
      this.strikingDate = "";
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
                if (whichDateNumber in Object.keys(allDatesObsOfUdl)) {
                    d = allDatesObsOfUdl[whichDateNumber];
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


}
