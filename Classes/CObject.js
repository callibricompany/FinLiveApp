import * as TEMPLATE_TYPE from '../constants/template';





export class CObject { 
    constructor(object,  template = TEMPLATE_TYPE.PSLIST) {
        //console.log("OBJECT CONSTRCUTIR : " + typeof object);
        //object !== 'undefined' ? this._constructorProduct(object,  template) : null;

        this._constructorProduct(object,  template) ;
    }

    _constructorProduct(object, template) {
        this.object= {};
        //copie des datas au format correct
        //console.log(Object.keys(object));
       
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

    isFavorite() {
      return false;
    }
    setTemplate(template) {
      this.object['template'] = template;
      this.object['toFavorites']['code'] = template === TEMPLATE_TYPE.PSLIST ? this.object.code : this.object.id;
    }

    getTemplate() {
      return this.object['template'];
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

      //set l'objet
      setObject(obj) {
        this.object = obj;
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