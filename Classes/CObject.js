import * as TEMPLATE_TYPE from '../constants/template';


export class CObject { 
    constructor(object, userId='', template = TEMPLATE_TYPE.PSLIST) {
      
        this._constructorProduct(object, userId, template);
        
    }

    _constructorProduct(object, userId, template = TEMPLATE_TYPE.PSLIST) {
        this.object= {};
        //copie des datas au format correct
        if (!object.hasOwnProperty('toFavorites')) {
          //reconstruction de l'objet style envoie dans homepage
          this.object['category'] = object.category;
          this.object['code'] = object.underlying;
          this.object['isOrg'] = false;
          this.object['template'] = template;
          this.object['isFavorite'] = false;
          this.object['data'] = object;
          
         
    
          let toFavorites = {};
          toFavorites['active'] = false;
          toFavorites['code'] = object.code;
          toFavorites['label'] = '';
          toFavorites['source'] = 'sp';
          toFavorites['userId'] = "";
          toFavorites['id'] = userId;
          this.object['toFavorites'] = toFavorites;
      
        } else {
    
          this.object = object;
          
    
        }
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