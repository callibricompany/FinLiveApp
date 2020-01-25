import WORKFLOW from '../../Data/workflow.json'
import * as TEMPLATE_TYPE from '../../constants/template';
import { CAutocall } from '../Products/CAutocall';
import { CObject } from '../CObject';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import Moment from 'moment';
import { setColor } from '../../Styles/globalStyle.js';


//classe mere de tous les objets tickets
export class CTicket extends CObject { 

    
    constructor(ticket, template) {
      
      super(ticket, template);
      //this.object = ticket;
      
      this.ticket = this.object['data'];
  
 
      
      //statut FD
      this.status = CTicket.STATUS().filter(({id}) => id === this.ticket.status)[0];

      //manage product on ticket 
      this.product = null;


    }
   



    getId() {
      return this.ticket.id;
    }


    getType() {
      return this.ticket.type;
    }

    getAgentName() {
      let agentName = "Non affecté";
      if (this.ticket.hasOwnProperty('agentInfo')) {
        agentName = this.ticket['agentInfo'].contact['name'];
      }

      return agentName;
    }

    getProduct() {

      return this.product;
    }

    getProductType() {
          return this.ticket.type;
    }



    getSubject() {
      return this.ticket.subject;
    }
    getDescription() {
      return this.ticket.description_text;
    }


    getFirstAnswerDate() {
      return new Date(this.ticket.fr_due_by);
    }
    getLastUpdateDate() {
      return new Date(this.ticket.updated_at);
    }

    getCreationDate() {
      return Moment(this.ticket['created_at']).toDate();
    }

    getDueBy(){
      return Moment(this.ticket['due_by']).toDate();
    }


    getStatus() {
      return this.status;
    }

    getPriority() {
      //priorite FD
       return CTicket.PRIORITY().filter(({id}) => id === this.ticket.priority)[0];
    }



    getDescription() {
      return this.ticket.description_text;
    }

    getCompanyId() {
      return this.ticket.company_id;
    }

    getCurrency() {
      return this.product.getCurrency();
    }

       
   static STATUS () {
    let data = [
     {
       "name": "Ouvert",
       "id": 0,
       "color" : "goldenrod"
     },
     {
       "name": "En attente",
       "id": 1,
       "color" : "mediumaquamarine"
     },
     {
       "name": "", //ouvert
       "id": 2,
       "color" : "transparent"
     },
     {
       "name": "Fermé",
       "id": 3,
       "color" : "gainsboro"
     },
     {
       "name": "Attente client",
       "id": 4,
       "color" : "khaki"
     },
     {
       "name": "Attente tiers",
       "id": 5,
       "color" : "linen"
     }
   ];
   return data;
  }

  static PRIORITY () {
    let data = [
     {
       "name": "Faible",
       "id": 1,
       "color" : "green"
     },
     {
       "name": "Normal",
       "id": 2,
       "color" : setColor(''),
     },
     {
       "name": "Accéléré",
       "id": 3,
       "color" : "pink"
     },
     {
       "name": "Urgent",
       "id": 4,
       "color" : "red"
     }
   ];
   return data;
  }
  }

