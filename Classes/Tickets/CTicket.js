import * as TEMPLATE_TYPE from '../../constants/template';
import { CAutocall } from '../Products/CAutocall';
import { CObject } from '../CObject';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import Moment from 'moment';
import { setColor } from '../../Styles/globalStyle.js';
import { getContentTypeFromExtension } from '../../Utils';



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

      //fichiers
      this.files = [];
      
    }
   

    //getAllIssuer
    getAllIssuer() {
      issuersList = [];

      if (this.object['data'].hasOwnProperty('quoteRequest') && this.object['data']['quoteRequest'].hasOwnProperty('issuersSelected')){

        issuersList =this.object['data'].quoteRequest.issuersSelected;
      }

      return issuersList;
    }



    //renvoie le nombre d'issuer qui quote
    getQuoteRequestsIssuersCount() {
      let nb = 0;
      if (this.object['data'].hasOwnProperty('quoteRequest') && this.object['data']['quoteRequest'].hasOwnProperty('issuersSelected')){
          nb = this.object['data'].quoteRequest.issuersSelected.length;
      }
      return nb;
    }

    //verifie si le prix est en cours
    isIssuerProcessing(index) {
      let isProcessing = true;
      if (this.object['data'].hasOwnProperty('quoteRequest') && this.object['data']['quoteRequest'].hasOwnProperty('processing') && this.object['data'].quoteRequest.processing.length >= index){
        isProcessing = this.object['data'].quoteRequest.processing[index];
      }
      return isProcessing;
    }

    //renvoie le code de l'issuer
    getIssuerCode(index) {
      let code = "";
      if (this.object['data'].hasOwnProperty('quoteRequest') && this.object['data']['quoteRequest'].hasOwnProperty('issuersSelected') && this.object['data'].quoteRequest.issuersSelected.length >= index){
          code = this.object['data'].quoteRequest.issuersSelected[index];
      }
      return code;
    }

    //renvoie le nom de l'issuer
    getIssuerName(allIssuers, index) {
      let name = "[XXX]";
      let code = this.getIssuerCode(index);
      if (code !== "") {
        let issuer = allIssuers.filter(({id}) => id === code);
        if (issuer != null && issuer.length === 1) {
          name = issuer[0].name;
        }
      } 
      

      return name;
    }
    //renvoie le url de l'icone de l'issuer
    getIssuerIcon(allIssuers, index) {
      let name = "https://firebasestorage.googleapis.com/v0/b/auth-8722c.appspot.com/o/issuers%2Ficon.jpg?alt=media&token=80d81efb-505d-4753-8bac-b2b607509e0f"; //icone finlive
      let code = this.getIssuerCode(index);
      if (code !== "") {
        let issuer = allIssuers.filter(({id}) => id === code);
        if (issuer != null && issuer.length === 1) {
          name = issuer[0].icon;
        }
      } 
      

      return name;
    }
    
    // getResponseIssuerCode(position) {
    //   return this.object['data'].hasOwnProperty('quoteRequest') ? (this.object['data'].quoteRequest.responseIssuersCode.length >= (position +1)) ? this.object['data'].quoteRequest.responseIssuersCode[position] : []: [];
    // }
    // getResponseIssuerTermSheet(position) {
    //   return this.object['data'].hasOwnProperty('quoteRequest') ? (this.object['data'].quoteRequest.responseIssuersTermSheet.length >= (position +1)) ? this.object['data'].quoteRequest.responseIssuersTermSheet[position] : []: [];
    // }
    // getResponseIssuerQuote(position) {
    //   return this.object['data'].hasOwnProperty('quoteRequest') ? (this.object['data'].quoteRequest.responseIssuersQuote.length >= (position +1)) ? this.object['data'].quoteRequest.responseIssuersQuote[position].quote : []: [];
    // }

    //reponse du premier issuer
    getResponseIssuer(field, index) {
      let resp = null;
      let code = this.getIssuerCode(index);
      
      if (code !== '' && this.object['data'].hasOwnProperty('quoteRequest') && this.object['data']['quoteRequest'].hasOwnProperty('responseIssuersCode')) {
        let lastIndexOfIssuer = this.object['data']['quoteRequest'].responseIssuersCode.lastIndexOf(code);
        if (lastIndexOfIssuer !== -1) {
          if (this.object['data']['quoteRequest'].hasOwnProperty(field)) {
              resp = this.object['data']['quoteRequest'][field][lastIndexOfIssuer];
          }
        }
      }
      return resp;
      //return this.object['data'].hasOwnProperty('quoteRequest') ? (this.object['data'].quoteRequest.responseIssuersExpiryDate.length >= (position +1)) ? this.object['data'].quoteRequest.responseIssuersExpiryDate[position] : 0 : 0;
    }

    setConversations(conversations) {
      //console.log(conversations);
      this.conversations = conversations;
    }

    getConversations() {
      return this.conversations;
    }

    //les notes serves a recreer l'activite du ticket
    getNotes() {
      let notes = [];

      this.conversations.forEach((c) => {
        if (c.source === 2 || c.source === 15) {
          //console.log(c);
          if (c.private){
            notes.push(c);
          }
        } 
      });
      if (notes.length > 1) {
        notes.sort(CTicket.compareNoteDateUp);
      }
      return notes;
    }

    //retourne tous les fichiers liés au ticket
    getFiles() {
      if (this.files.length > 1) {
        this.files.sort(CTicket.compareNoteDateUp);
      }
      return this.files;
    }


    //on analyse les conversations pour le whatsapp
    getChat() {
      let chat = [];

      this.conversations.forEach((c) => {
        if (c.source === 0) {
          //console.log(c);
          //on verie les ifchiers attachés
          if (c.hasOwnProperty('attachments') && c['attachments'].length > 0) {
            c['attachments'] = c['attachments'].map((conver, index) => {

              if (conver.content_type === 'application/octet-stream') {
                let cType = getContentTypeFromExtension(conver.name.split('.').pop());
                if (cType !== 'none') {
                  //console.log(cType);
                  conver.content_type = cType;
                  
                }
              }
              conver.type = Math.random() > 0.5 ? 'DIVERS' : 'TERMSHEET';
              
              this.files.push(conver);
              return conver;
            });
            //console.log(c['attachments']);
            
          }
         
          chat.push(c);
        } 
      });
      if (chat.length > 1) {
        chat.sort(CTicket.compareNoteDateUp);
      }
      return chat;
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

    getAgentEmail() {
      //console.log(this.object);
      let agentEmail = "";
      if (this.ticket.hasOwnProperty('agentInfo')) {
        agentEmail = this.ticket['agentInfo'].contact['name'];
      }

      return agentEmail;
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


    getFrDueBy() {
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

    getNominal() {

      return this.ticket['custom_fields']['cf_ps_nominal'] === null ? 0 : this.ticket['custom_fields']['cf_ps_nominal'];
    }

    getFinalNominal() {
      //return this.finalNominal;
      return super.getFinalNominal();
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

  static compareNoteDateUp(a, b) {
    let comparison = -1;

    if (a.updated_at < b.updated_at) {
      comparison = 1;
    } 
    return comparison;
  }
}

