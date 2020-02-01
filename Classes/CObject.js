import * as TEMPLATE_TYPE from '../constants/template';




export class CObject { 
    constructor(object,  template = TEMPLATE_TYPE.PSLIST) {
     
        //!object ? this._constructorProduct(object,  template) : null;
        this._constructorProduct(object,  template) ;
    }

    _constructorProduct(object, template = TEMPLATE_TYPE.PSLIST) {
        this.object= {};
        //copie des datas au format correct
        
        if (!object.hasOwnProperty('toFavorites')) {
          //reconstruction de l'objet style envoie dans homepage
          this.object['category'] = object.category;
          this.object['code'] = template === TEMPLATE_TYPE.PSLIST ? object.underlying : object.id;
          this.object['isOrg'] = false;
          this.object['template'] = template;
          this.object['isFavorite'] = false;
          this.object['data'] = object;
          
         
    
          let toFavorites = {};
          toFavorites['active'] = false;
          toFavorites['code'] = template === TEMPLATE_TYPE.PSLIST ? object.code : object.id;
          toFavorites['label'] = '';
          toFavorites['source'] = 'sp';
          toFavorites['userId'] = "";
          toFavorites['id'] = CObject.UID;
          this.object['toFavorites'] = toFavorites;
      
        } else {
    
          this.object = object;
          
    
        }
      }

    setTemplate(template) {
      this.object['template'] = template;
      this.object['toFavorites']['code'] = template === TEMPLATE_TYPE.PSLIST ? this.object.code : this.object.id;
    }

    getTemplate() {
      return this.object['template'];
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

      getUserId (userId) {
        return this.object['toFavorites']['userId'];
      }
  
      setFavorite(fav) {
        this.object['toFavorites'] = fav.toFavorites;
        this.object['isFavorite'] = fav.isFavorite;
      }
  
      //retourne l'objet
      getObject() {
        return this.object;
      }

      //determine si de l'organisation
      isOrg() {
        let name = false;

        if (this.object.hasOwnProperty("isOrg")) {
          name = this.product.underlying;
        }

        return name;
      }
}