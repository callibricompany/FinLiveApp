import { CTicket } from './CTicket';
import { CAutocall } from '../Products/CAutocall';
import Moment from 'moment';
import * as TEMPLATE_TYPE from '../../constants/template';

export class  CBroadcastTicket extends CTicket {
    constructor(ticket, userId="") {
      super(ticket, userId); // appelle le constructeur parent avec le paramètre

      /*if (!this.object.hasOwnProperty('template')) {
          this.object['template'] = TEMPLATE_TYPE.PSBROADCAST;
      }*/

      this.product = this.buildProduct(this.ticket.data);

      
    }


    //construit l'objet autocall a partir des infos données dans les champs SRP
    buildProduct(product) {
      switch(this.object.template) {
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