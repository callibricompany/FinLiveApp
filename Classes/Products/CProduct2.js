import Moment from 'moment';



//classe mere de tous les objets financiers, immos, arts, etc...
export class CProduct2 { 

    constructor(product, source='products') {
      this.product = product;
      this.product['DB_TABLE_NAME'] = source;
      this.source = source;
   
      if (this.source === 'products')  {
        this.typeAuction = this.getFromPricing("TYPE_AUCTION");
        this.UFAssoc = this.getFromPricing("UFAssoc");
        this.UF = this.getFromPricing("UF");
        this.nominal = this.getFromPricing("NOMINAL");
        this.targetNominal = this.getFromPricing("NOMINAL_TARGET") === -1 ? this.nominal : this.getFromPricing("NOMINAL_TARGET");
      } else if (this.source === 'structuredproducts') {
        this.product['TYPE'] = 'STRUCTURED_PRODUCT_SRP';
      }
    
      this.description_1 = "";
      this.description_2 = "";

      //necessary for sharing product
      this.friends = [];
      this.endSharingDate = null;
    }

    //renvoie tout un texte qui sera filtré avec le search 
    getFilterText() {
      var textToFilter = "";
      var textToFilter =  this.getUniqueId() +
                          this.getShortName() +
                          this.getNominal() +
                          this.getProductCode() +
                          this.getProductType() +
                          this.getAuctionType() +
                          this.getProductName() +
                          this.getDistributor() +
                          this.getIssuer()
      return textToFilter.toLowerCase();
    }
    
    //renvoie l'identifiant unique du produit
    getUniqueId() {
      return this.product.hasOwnProperty("UNIQUE_ID") ? this.product["UNIQUE_ID"] : 10000000*Math.random();
    }

    setUniqueId(id) {
      this.product["UNIQUE_ID"]  = id;
    }

    
    getShortName() {
      return this.product.hasOwnProperty("SHORT_NAME") ? this.product["SHORT_NAME"] : "[UNKNOWN NAME]";
    }

    setShortName(name) {
      this.product["SHORT_NAME"]= name;
    }


    getNominal() {
      return this.nominal;
    }

    setNominal(nominal) {
      this.nominal = nominal;
      this.setToPricing("NOMINAL", nominal);
    }
    
    getTargetNominal() {
      return this.targetNominal;
    }

    setTargetNominal(nominal) {
      this.targetNominal = nominal;
      this.setToPricing("NOMINAL_TARGET", nominal);
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
        //on prend le dernier pricing
        if (whichPricing === -1) {
          whichPricing = this.product["PRICINGS"].length - 1;
          
        }

        var pricing = this.product["PRICINGS"][whichPricing];
        if (pricing.hasOwnProperty(field)) {
          resp = pricing[field];
        }
      }
      //console.log(field + " : " + resp);
      return resp;
    }
    setToPricing(field, value, whichPricing=-1) {
      if (this.product.hasOwnProperty("PRICINGS")) {
        //on prend le dernier pricing
        if (whichPricing === -1) { 
            whichPricing = this.product["PRICINGS"].length - 1;
          
        } 
        var pricing = this.product["PRICINGS"][whichPricing];
        if (pricing.hasOwnProperty(field)) {
          pricing[field] = value;
        }
      }
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
    getType() {
      return this.getProductType();
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
      this.setToPricing("TYPE_AUCTION", auctionType);
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
      this.setToPricing("UF", UF);
    }

    setUFAssoc(UFAssoc) {
      this.UFAssoc = UFAssoc;
      this.setToPricing("UFAssoc", UFAssoc);
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
          if (this.getProductType() === 'STRUCTURED_PRODUCT_SRP') {
            name = this.getShortName();
          } else {
            name = "UNKNOWN";
          }
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
          if (this.getProductType() === 'STRUCTURED_PRODUCT_SRP') {
            name = this.getShortName();
          } else {
            name = "UNKNOWN";
          }
          break;
      }

      return name;
  }

  getDescription(nb=1) {
    return nb === 1 ? this.getDescription_1() : this.getDescription_2();
  }
  getDescription_1() {
    return this.description_1;
  }
  setDescription_1(desc) {
    this.description_1 = desc;
  }
  getDescription_2() {
    return this.description_2;
  }
  setDescription_2(desc) {
    this.description_2 = desc;
  }

     /////////////////////////

    //      SHARING DATA

    /////////////////////////

    setFriends(friends) {
      this.friends = friends;
    }

    getFriends() {
      return this.friends;
    }

 

    setEndSharingDate(endSharingDate) {
      this.endSharingDate = endSharingDate;
    }

    getEndSharingDate() {
      return this.endSharingDate === null ? new Date(Date.now()) : this.endSharingDate;
    }


     /////////////////////////

    //     ISSUER AND DISTRIBUTOR

    /////////////////////////
    setIssuer(issuer) {
      this.product["ISSUER"] = issuer;
    }

    getIssuer() {
      return this.product.hasOwnProperty("ISSUER") ? this.product["ISSUER"] : "";
    }

    setDistributor(distributor) {
      this.product["DISTRIBUTOR"] = distributor;
    }

    getDistributor() {
      return this.product.hasOwnProperty("DISTRIBUTOR") ? this.product["DISTRIBUTOR"] : "";
    }

}