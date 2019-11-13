

//classe mere de tous les objets financiers, immos, arts, etc...
export class CProduct { 
    constructor(product) {
      this.product = product;
    }
    
    getProductName() {

      return "Produit financier";
    }

    updateProduct(product) {
      this.product = product;
      console.log("CProduct : ");
      console.log(this.product);
    }

    getUnderlying() {
      return this.product.underlying;
    }

    getNominal() {
      return this.product.nominal;
    }

    getCurrency() {
      return this.product.currency;
    }

    getUF() {
      let uf = 0
      if (this.product.hasOwnProperty('UF')) {
        uf = this.product.UF;
      }
      return uf;
    }

    getUFAssoc() {
      let uf = 0
      if (this.product.hasOwnProperty('UFAssoc')) {
        uf = this.product.UFAssoc;
      }
      return uf;
    }

    getCriteria() {
      return {};
    }
  }