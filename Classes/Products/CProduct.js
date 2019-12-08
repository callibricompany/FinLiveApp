import * as TEMPLATE_TYPE from '../../constants/template';

//classe mere de tous les objets financiers, immos, arts, etc...
export class CProduct { 
    constructor(product) {
      this._constructorProduct(product);


    }
    
    _constructorProduct(product) {
      this.object= {};
      //copie des datas au format correct
      if (!product.hasOwnProperty('data')) {
        //reconstruction de l'objet style envoie dans homepage
        this.object['category'] = product.category;
        this.object['code'] = product.underlying;
        this.object['isOrg'] = false;
        this.object['template'] = TEMPLATE_TYPE.LIST;
        this.object['isFavorite'] = false;
        this.object['data'] = product;
        this.product = product;
       
  
        let toFavorites = {};
        toFavorites['active'] = false;
        toFavorites['code'] = product.code;
        toFavorites['label'] = '';
        toFavorites['source'] = 'sp';
        toFavorites['userId'] = "";
        toFavorites['id'] = "";
        this.object['toFavorites'] = toFavorites;
    
      } else {
  
        this.object = product;
        //tant que Pierre ne rajoute l'UF dans le calcul sur serveur on le rajoute
        this.product = product.data;
        if (!this.product.hasOwnProperty('UF')) {
          this.product['UF'] = 0.03;
        }
        if (!this.product.hasOwnProperty('UFAssoc')) {
          this.product['UFAssoc'] = 0.001;
        }
        if (!this.product.hasOwnProperty('cf_cpg_choice')) {
          this.product['cf_cpg_choice'] = "Placement Privé";
        }
  
      }
    }


    updateProduct(product) {
      this._constructorProduct(product);
      console.log("CProduct : ");
      console.log(this.product);
    }



    //verifie si ce produit est dans la liste des favoris
    isFavorite(favoriteList) {
      /*let isFavorite = false;
    
      favoriteList.forEach((fav) => {
        if (isEqual(fav.data, this.product)) {
          //isFavorite = this.item.isFavorite && this.item.toFavorites.active;
          isFavorite = true;
        }
      });
      //remise a jour de l'objet item en fonction de ce qui a été trouve dans favorites
      this.object.isFavorite = isFavorite;
      this.object.toFavorites.active = isFavorite;*/
      return this.object['isFavorite'];
      

    }

    setUserId (userId) {
      this.object['toFavorites']['userId'] = userId;
    }

    setFavorite(fav) {
      this.object['toFavorites'] = fav.toFavorites;
      this.object['isFavorite'] = fav.isFavorite;
    }

    //retourne l'objet
    getObject() {
      return this.object;
    }

    getProductName() {

      return "Produit financier";
    }



    setProductDescription(object) {


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

  }