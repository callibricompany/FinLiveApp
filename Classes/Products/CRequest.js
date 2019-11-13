//classe mere de tous les objets qui vont servir à l'élaboration 
//d'une requete au serveur et à l'élaboration des criteres de recherches

export class CRequest { 
    constructor() {
      
    }


    updateProduct (newProduct) {
      this.product = newProduct;
    }

    refreshUF (UF, UFAssoc) {
      this.product["UF"].value = UF;
      this.product["UFAssoc"].value = UFAssoc;
    }


    getProduct() {
      return this.product;
    }
  }