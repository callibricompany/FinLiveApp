import { CTicket } from './CTicket';
import { CAutocall } from '../Products/CAutocall';
import Moment from 'moment';
import * as TEMPLATE_TYPE from '../../constants/template';



export class  CBroadcastTicket extends CTicket {
    constructor(ticket) {
      super(ticket); // appelle le constructeur parent avec le paramètre

      //on revoit le template au cas ou 
      
      /*if (this.getTemplate() === TEMPLATE_TYPE.PSLIST) {
        if ((this.object['data']['custom_fields']).hasOwnProperty('cf_type')){
          if (this.object['data']['custom_fields']['cf_type'] === "Produit structuré") {
            this.setTemplate(TEMPLATE_TYPE.PSBROADCAST);
          }
        }
      }*/
      this.setTemplate(TEMPLATE_TYPE.PSBROADCAST);
      this.product = this._buildProduct();

      
    }


    //construit l'objet autocall a partir des infos données dans les champs SRP
    _buildProduct() {
      switch(this.getTemplate()) {
        case TEMPLATE_TYPE.PSBROADCAST : 
          return new CAutocall(this.ticket.product);
          //this.underlying.setUserId(this.object.getUserId());
          break;


        default : 
          return null;
          break;
      }
    }






    getMessage() {
      return this.ticket['custom_fields'].cf_message;
    }

    getBeginDate() {
      return Moment(this.ticket['custom_fields'].cf_broad_begindate, "YYYY-MM-DD").toDate();
    }
    
    getEndDate() {
      return Moment(this.ticket['custom_fields'].cf_broad_enddate, "YYYY-MM-DD").toDate();
    }

    isBroadcastAlive() {

      return (Date.now() < this.getEndDate());
    }
    getBroadcastAmount() {
      return this.ticket['custom_fields'].cf_broad_amount;
    }
    
    

}