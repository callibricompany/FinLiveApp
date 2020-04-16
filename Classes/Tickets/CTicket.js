import * as TEMPLATE_TYPE from '../../constants/template';
import { CAutocall } from '../Products/CAutocall';
import { CObject } from '../CObject';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import Moment from 'moment';
import { setColor } from '../../Styles/globalStyle.js';



//classe mere de tous les objets tickets
export class CTicket extends CObject { 

    
    constructor(ticket) {
      super(ticket);

      this.ticket = this.object['data'];
  
 
      
      //statut FD
      this.status = CTicket.STATUS().filter(({id}) => id === this.ticket.status)[0];

      //manage product on ticket 
      this.product = null;

      //conversations
      this.conversations = [];
      
    }
   

    setConversations(conversations) {
      //console.log(conversations);
      this.conversations = conversations;
    }

    getConversations() {
      return this.conversations;
    }

    getNotes() {
      let notes = [];

      this.conversations.forEach((c) => {
        if (c.source === 2000 || c.source === 15) {
          //console.log(c);
          notes.push(c);
        } 
      });
 
      return notes;
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

    setPriority(priority) {
      this.ticket['priority'] = priority;
    }

    //est-ce que le ticket a été vu ou pas 
    hasBeenSeen() {
      if (!this.ticket['cf_seen']){
        this.ticket['cf_seen'] = false;
      }
      return this.ticket.cf_seen;
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
       "name": "????",
       "id": 0,
       "color" : "goldenrod"
     },
     {
       "name": "En attent????",
       "id": 1,
       "color" : "mediumaquamarine"
     },
     {
       "name": "En cours", //ouvert
       "id": 2,
       "color" : "transparent"
     },
     {
       "name": "Pending",
       "id": 3,
       "color" : "gainsboro"
     },
     {
       "name": "Résolu",
       "id": 4,
       "color" : "khaki"
     },
     {
       "name": "Fermé",
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
       "name": "Normale",
       "id": 2,
       "color" : setColor(''),
     },
     {
       "name": "Accélérée",
       "id": 3,
       "color" : "pink"
     },
     {
       "name": "Urgente",
       "id": 4,
       "color" : "red"
     }
   ];
   return data;
  }

  static compareLastUpdateDown(a, b) {
    let comparison = -1;

    if (a.getLastUpdateDate() < b.getLastUpdateDate()) {
      comparison = 1;
    } 
    return comparison;
  }

  static compareLastUpdateUp(a, b) {
    let comparison = -1;

    if (a.getLastUpdateDate() > b.getLastUpdateDate()) {
      comparison = 1;
    } 
    return comparison;
  }

  static compareCeationDateDown(a, b) {
    let comparison = -1;

    if (a.getCreationDate() < b.getCreationDate()) {
      comparison = 1;
    } 
    return comparison;
  }

  static compareCeationDateUp(a, b) {
    let comparison = -1;

    if (a.getCreationDate() > b.getCreationDate()) {
      comparison = 1;
    } 
    return comparison;
  }

  static compareDueDateDown(a, b) {
    let comparison = -1;

    if (a.getDueBy() < b.getDueBy()) {
      comparison = 1;
    } 
    return comparison;
  }

  static compareDueDateUp(a, b) {
    let comparison = -1;

    if (a.getDueBy() > b.getDueBy()) {
      comparison = 1;
    } 
    return comparison;
  }
}

