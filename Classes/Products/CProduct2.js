import Moment from 'moment';




//classe mere de tous les objets financiers, immos, arts, etc...
export class CProduct2 { 
    constructor(product) {
      this.product = product;

      this.typeAuction = this.getFromPricing("TYPE_AUCTION");
      this.UFAssoc = this.getFromPricing("UFAssoc");
      this.UF = this.getFromPricing("UF");
      this.nominal = this.getFromPricing("NOMINAL");
      //super(product);
    }
    
    //renvoie l'identifiant unique du produit
    getUniqueId() {
      return this.product.hasOwnProperty("UNIQUE_ID") ? this.product["UNIQUE_ID"] : 10000000*Math.random();
    }

    
    getShortName() {
      return this.product.hasOwnProperty("SHORT_NAME") ? this.product["SHORT_NAME"] : "[UNKNOWN NAME]";
    }


    getNominal() {
      return this.nominal;
    }

    setNominal(nominal) {
      this.nominal = nominal;
    }

    //verifie si le prix du produit est valide ou a expiré
    isPriceValid() {
      let isValid = true;
      let arrayDate = [];
      if (this.product.hasOwnProperty("PRICINGS")) {
        Object.values(this.product["PRICINGS"]).forEach((pricing) => { 
          if (pricing.hasOwnProperty('VALIDITY_DATE')) {
            arrayDate.push(Moment(pricing['VALIDITY_DATE'], 'YYYYMMDD_HHmmss').toDate());
          }
        });
      }
      if (arrayDate.length > 0 && (new Date(Math.max(...arrayDate)) < new Date(Date.now()))) {
        isValid = false;
      }
      
      return isValid;
    }

    //renvoie la derniere date de pricing finlive
    getLastFinlivePricingDate() {
      let lastDate = new Date(Date.now);
      let arrayDate = [];
      if (this.product.hasOwnProperty("PRICINGS")) {
        Object.values(this.product["PRICINGS"]).forEach((pricing) => { 
          if (pricing.hasOwnProperty('PRICING_DATE')) {
            arrayDate.push(Moment(pricing['PRICING_DATE'], 'YYYYMMDD_HHmmss').toDate());
          }
        });
      }
      if (arrayDate.length > 0) {
        lastDate = new Date(Math.max(...arrayDate));
      }

      return lastDate;
    }

    //renvoie la date de validité du pricing FinLive
    getFinliveValidityPricingDate() {
      let lastDate = new Date(Date.now);
      let arrayDate = [];
      if (this.product.hasOwnProperty("PRICINGS")) {
        Object.values(this.product["PRICINGS"]).forEach((pricing) => { 
          if (pricing.hasOwnProperty('VALIDITY_DATE')) {
            arrayDate.push(Moment(pricing['VALIDITY_DATE'], 'YYYYMMDD_HHmmss').toDate());
          }
        });
      }
      if (arrayDate.length > 0) {
        lastDate = new Date(Math.max(...arrayDate));
      }

      return lastDate;
    }

    //renvoie un  element du pricing
    getFromPricing(field, whichPricing=-1) {
      let resp = -1;
      
      if (this.product.hasOwnProperty("PRICINGS")) {
        if (whichPricing === -1) {
          let arrayKeys = Object.keys(this.product["PRICINGS"]);
          //on prend le dernier pricing
          if (arrayKeys != null && arrayKeys.length > 0) {
            whichPricing = Math.max(arrayKeys);
          }
        }
        var pricing = this.product["PRICINGS"][whichPricing];
        if (pricing.hasOwnProperty(field)) {
          resp = pricing[field];
        }
      }
      return resp;
    }
    
    //renvoie le json du produit
    getProductJSON() {
      return this.product;
    }

    //le produit a été mis en favorie par le user
    isFavorite() {
      return this.product.hasOwnProperty("IS_FAVORITE") ? this.product["IS_FAVORITE"] : false;
    }
    setFavorite(isFavorite) {
      this.product["IS_FAVORITE"] = isFavorite;
    }

    //renvoie le type de produit
    getProductType() {
      return this.product.hasOwnProperty("TYPE") ? this.product["TYPE"] : 'UNKNOWN';
    }

    //retourne le nom commercial du produit
    getProductCode() {
      return this.product.hasOwnProperty("CODE_PRODUCT") ? this.product["CODE_PRODUCT"] : 'UNKNOWN';
    }

    //retourne le code unique du produit
    getProductCodeDetail() {
      return this.product.hasOwnProperty("CODE_PRODUCT_DETAIL") ? this.product["CODE_PRODUCT_DETAIL"] : 'UNKNOWN';
    }

    //type de vente du produit : PP, APE, OTC, ....
    getAuctionType() {
      return this.typeAuction;
    }
    setAuctionType(auctionType) {
      this.typeAuction = auctionType;
    }

    //gestions des marges liés au produit (sa marge + celle d'une eventuelle association)
    getUF() {
      return this.UF;
    }

    getUFAssoc() {
      return this.UFAssoc;
    }

    setUF(UF) {
      this.UF = UF;
    }

    setUFAssoc(UFAssoc) {
      this.UFAssoc = UFAssoc;
    }

    //retroune l'ISIN
    getISIN() {
      return this.product.hasOwnProperty("ISIN") ? this.product["ISIN"] : 'UNKNOWN';
    }

    //retourne le type de produit
    getProductTypeName() {
      let name = "";
      switch(this.getProductCode()) {
        case 'AUTOCALL_CLASSIC' :
          name = "Athéna";
          break;
        case 'AUTOCALL_INCREMENTAL' :
          name = "Athéna";
          break;
        case 'PHOENIX' :
          name = "Phoenix";
          break;
        case 'PHOENIX_MEMORY' :
          name = "Phoenix";
          break;
        case 'REVERSE' :
          name = "Réverse convertible";
          break;
        default : 
          name = "UNKNOWN";
          break;
      }

      return name;
    }
    
  //retourne le nom  du produit
  getProductName() {
      let name = "";
      switch(this.getProductCode()) {
        case 'AUTOCALL_CLASSIC' :
          name = "Athéna";
          break;
        case 'AUTOCALL_INCREMENTAL' :
          name = "Athéna";
          break;
        case 'PHOENIX' :
          name = "Phoenix";
          break;
        case 'PHOENIX_MEMORY' :
          name = "Phoenix mémoire";
          break;
        case 'REVERSE' :
          name = "Réverse convertible";
          break;
        default : 
          name = "UNKNOWN";
          break;
      }

      return name;
  }

}