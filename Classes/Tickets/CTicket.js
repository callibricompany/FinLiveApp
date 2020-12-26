import * as TEMPLATE_TYPE from '../../constants/template';
import { CAutocall } from '../Products/CAutocall';
import { CObject } from '../CObject';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import Moment from 'moment';
import { setColor } from '../../Styles/globalStyle.js';
import { getContentTypeFromExtension } from '../../Utils';

import { CUsers } from '../CUsers';




const urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

//classe mere de tous les objets tickets
export class CTicket  { 

    
    constructor(ticket) {
      //super(ticket);
      this.ticket = ticket;
      
      //statut FD
      this.status = CTicket.STATUS().filter(({id}) => id === this.ticket.status)[0];

      //manage product on ticket 
      this.product = null;

      //conversations
      this.conversations = [];

      //fichiers
      this.files = [];

      this.type = "TICKET";
    }

    getType() {
      return this.type;
    }
    setType(type) {
      this.type = type;
    }
    
   
    //renvoie tout un texte qui sera filtré avec le search 
    getFilterText() {

      var textToFilter =  this.product != null ? this.product.getFilterText() : '' +
                          this.getAllIssuer().toString() +
                          this.getCampaign() +
                          this.getSubject() +
                          this.getDescription() +
                          this.getStatus() + 
                          this.getPriority() +
                          this.getType();
      return textToFilter.toLowerCase();
    }


    /**
     * CODE FRESHDESK DU PROPRIETAIRE DU TICKET
     */
    getRequesterId() {
      return this.ticket['requester_id'];
    }

    getRequesterName() {
      let name = '';
      if (this.ticket.hasOwnProperty('requester') && this.ticket['requester'].hasOwnProperty('userInfo') 
          &&  this.ticket['requester']['userInfo'].hasOwnProperty('firstName') &&  this.ticket['requester']['userInfo'].hasOwnProperty('lastName')) {
            name = this.ticket['requester']['userInfo']['firstName'] + ' ' + this.ticket['requester']['userInfo']['lastName'];
      } else {
        name = this.getRequesterId();
      }
      return name;
    }
    /**
     * CODE FRESHDESK DE l'AGENT EN CHARGE DU TICKET
     */
    getResponderId() {
      return this.ticket['responder_id'];
    }

    //getAllIssuer
    getAllIssuer() {
      issuersList = [];

      if (this.ticket.hasOwnProperty('quoteRequest') && this.ticket['quoteRequest'].hasOwnProperty('issuersSelected')){

        issuersList =this.ticket.quoteRequest.issuersSelected;
      }

      return issuersList;
    }



    //renvoie le nombre d'issuer qui quote
    getQuoteRequestsIssuersCount() {
      let nb = 0;
      if (this.ticket.hasOwnProperty('quoteRequest') && this.ticket['quoteRequest'].hasOwnProperty('issuersSelected')){
          nb = this.ticket.quoteRequest.issuersSelected.length;
      }
      return nb;
    }

    //verifie si le prix est en cours
    isIssuerProcessing(index) {
      let isProcessing = true;
      if (this.ticket.hasOwnProperty('quoteRequest') && this.ticket['quoteRequest'].hasOwnProperty('processing') && this.ticket.quoteRequest.processing.length >= index){
        isProcessing = this.ticket.quoteRequest.processing[index];
      }
      return isProcessing;
    }

    //renvoie le code de l'issuer
    getIssuerCode(index) {
      let code = "";
      if (this.ticket.hasOwnProperty('quoteRequest') && this.ticket['quoteRequest'].hasOwnProperty('issuersSelected') && this.ticket.quoteRequest.issuersSelected.length >= index){
          code = this.ticket.quoteRequest.issuersSelected[index];
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

    isMine() {
      return true;
    }
    
    // getResponseIssuerCode(position) {
    //   return this.ticket.hasOwnProperty('quoteRequest') ? (this.ticket.quoteRequest.responseIssuersCode.length >= (position +1)) ? this.ticket.quoteRequest.responseIssuersCode[position] : []: [];
    // }
    // getResponseIssuerTermSheet(position) {
    //   return this.ticket.hasOwnProperty('quoteRequest') ? (this.ticket.quoteRequest.responseIssuersTermSheet.length >= (position +1)) ? this.ticket.quoteRequest.responseIssuersTermSheet[position] : []: [];
    // }
    // getResponseIssuerQuote(position) {
    //   return this.ticket.hasOwnProperty('quoteRequest') ? (this.ticket.quoteRequest.responseIssuersQuote.length >= (position +1)) ? this.ticket.quoteRequest.responseIssuersQuote[position].quote : []: [];
    // }

    //reponse du premier issuer
    getResponseIssuer(field, index) {
      let resp = null;
      let code = this.getIssuerCode(index);
      
      if (code !== '' && this.ticket.hasOwnProperty('quoteRequest') && this.ticket['quoteRequest'].hasOwnProperty('responseIssuersCode')) {
        let lastIndexOfIssuer = this.ticket['quoteRequest'].responseIssuersCode.lastIndexOf(code);
        if (lastIndexOfIssuer !== -1) {
          if (this.ticket['quoteRequest'].hasOwnProperty(field)) {
              resp = this.ticket['quoteRequest'][field][lastIndexOfIssuer];
          }
        }
      }
      return resp;
      //return this.ticket.hasOwnProperty('quoteRequest') ? (this.ticket.quoteRequest.responseIssuersExpiryDate.length >= (position +1)) ? this.ticket.quoteRequest.responseIssuersExpiryDate[position] : 0 : 0;
    }

    /**
     *  CONVERSATIONS
     */


    getNumberOfConversations() {      
        return this.conversations.length;
    }

    setConversations(conversations) {
      //on enregistre les conversations et on les trie
      //console.log(conversations);
      this.conversations = conversations;
    }

    getConversations() {
      return this.conversations;
    }

    //les notes serves a recreer l'activite du ticket
    getNotes() {
      let notes = [];
      this.conversations.forEach((conv) => {
          if (conv['mandatoryForNotes']) {
            conv['conversation'].forEach((c) => {
                if (c.source === 2 || c.source === 15) {
                  //console.log(c);
                  if (c.private){
                    notes.push(c);
                  }
                } 
            });
          }
      });
      if (notes.length > 1) {
        notes.sort(CTicket.compareNoteDateUp);
      }
      return notes;
    }


    linkify(text) {
        return text.replace(urlRegex, function(url) {
            return '<a href="' + url + '">' + url + '</a>';
        });
    }
    //retourne tous les fichiers liés au ticket
    getFiles() {

      let id = 10000000;
      //on charge tous les fichiers de toutes les conversations
      this.files = [];

      this.conversations.forEach((conv) => {
        let conversation = conv['conversation'];
        conversation.forEach((c) => {
          if (c.source === 0) {
            //console.log(c);
            //on verie les ifchiers attachés
            if (c.hasOwnProperty('attachments') && c['attachments'].length > 0) {
              c['attachments'].map((conver, index) => {
  
                if (conver.content_type === 'application/octet-stream') {
                  let cType = getContentTypeFromExtension(conver.name.split('.').pop());
                  if (cType !== 'none') {
                    //console.log(cType);
                    conver.content_type = cType;
                    
                  } else {
                    conver.type = 'DIVERS';
                  }
                } else {
                  switch(conver.content_type) {
                    case 'application/pdf' : 
                      conver.type = 'PDF';
                      break;
                    case 'application/msword' :
                      conver.type = 'WORD';
                      break;
                    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                      conver.type = 'WORD';
                      break;
                    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                      conver.type = 'EXCEL';
                      break;
                    case 'application/vnd.ms-excel' :
                      conver.type = 'EXCEL';
                      break;                      
                    default :
                      conver.type = conver.content_type;
                      break;
                  }
                 
                }
                
                
                this.files.push(conver);
                //return conver;
              });
              //console.log(c['attachments']);
              
            }
          } else if (c.source === 2 || c.source === 15) {
            //console.log(c);
            if (c.body.includes("href=")){

                //   "content_type": "application/pdf",
              //   "created_at": "2020-07-27T07:32:11Z",
              //   "id": 2043131326963,
              //   "name": "Mark-To-Model Validation of ECO5E Index.pdf",
              //   "size": 589006,
              //   "type": "PDF",
              // }
              let url = c.body.match(urlRegex);
              if (url != null && url.length > 0) {
                let conver = {}

                conver['attachment_url'] = url;
                conver['content_type'] = "application/octet-stream";
                conver['created_at'] = c.created_at;
                conver['updated_at'] = c.updated_at;
                conver['size'] = 0;
                conver['name'] = "unknown.";
                conver['type'] = "unknown";
                conver['id'] = id;
                id = id + 1;
                if (url[0].includes(".pdf")) {
                  conver['type'] = "PDF";
                  conver['content_type'] = "application/pdf";
                }
                if(c.body.includes("TermSheet indicative")) {
                  conver['name'] = "TermSheet indicative.";
                }
                
                var http = new XMLHttpRequest();
                http.open('HEAD', url[0], true); // true = Asynchronous
                http.onreadystatechange = function() {
                    if (this.readyState == this.DONE) {
                        if (this.status === 200) {
                            fileSize = this.getResponseHeader('content-length');
                            conver['size'] = fileSize;
                            console.log('fileSize = ' + fileSize);
                            //
                            // ok here is the only place in the code where we have our request result and file size ...
                            // the problem is that here we are in the middle of anonymous function nested into another function and it does not look pretty
                            // this stupid ASYNC pattern makes me hate Javascript even more than I already hate it :)
                            //
                            //
                        }
                    }
                };
                http.send();

                this.files.push(conver);
              }
            }
          } 

        });
      });


      if (this.files.length > 1) {
        this.files.sort(CTicket.compareNoteDateUp);
      }
      return this.files;
    }



    //on analyse les conversations pour le whatsapp
    getChat(idTicket = this.getId()) {
      let chat = [];
     
      this.conversations.map((conv, indexConversation) => {


        if (conv['id'] === idTicket) {
            
            let c = conv['conversation'];
            let minDate = new Date();
            c.map((reply, index) => {
              if (reply.hasOwnProperty('source') && reply.source === 0) {
                let mess = {};
                mess['_id'] = index + 2;
                let text = reply.body_text;
                //supression des retours de lignes a la fin
                mess['text'] = text.replace(/(^\s*(?!.+)\n+)|(\n+\s+(?!.+)$)/g, "").trim();
                let user = {};
                //console.log(reply.user_id);
                user['_id'] = CUsers.ME.getCodeTS() === reply.user_id ? 1 : 2
                if (((conv['type'] === 'TICKET_SOUSCRIPTION') || (conv['type'] === 'TICKET_BROADCAST')) && (this.subscripters != null) && this.subscripters.hasOwnProperty('user') && (this.subscripters.user.length > indexConversation - 2)) {                  
                  
                    user['userInfo'] = null;
                    user['userOrg'] = null;
                    let found = false;
                    this.subscripters.user.forEach((s) => {
                      if (s.userInfo.codeTS === reply.user_id) {
                        user['userInfo'] = s.userInfo;
                        user['name'] = s.userInfo.firstName + " " + s.userInfo.lastName;
                        user['userOrg'] = s.userOrg;
                        found = true;
                      }
                    })
                    if (!found) {
                      user['name'] = "Agent Finlive";
                    }
                }
                
                mess['user'] = user;
                mess['createdAt'] = Moment(reply.updated_at).toDate();
                mess['updated_at'] = mess['createdAt'];


                //on rajoute les attachments
                if (reply.hasOwnProperty('attachments')) {
                  mess['attachments'] = reply.attachments;
                }
                //mess['image'] = "https://picsum.photos/200";
                
                // {
                //   _id: 3,
                //   text: 'Alouette',
                //   createdAt: new Date(),
                //   user: {
                //     _id: 2,
                //     name: 'FinLive',
                //   },
                // },

                //on utilise mindate pour plcer le premier message systeme
                minDate = minDate < mess['updated_at'] ? minDate : mess['updated_at'] ;
                chat.push(mess);
              }
            });

            //on remplit le type de la conversation
            let textToIntroduceChat = 'Bienvenue dans les conversations FinLive';
            if (this.isShared()) {
              if (conv['type'] === 'TICKET_PRODUCT') {
                
                textToIntroduceChat = this.isMine(CUsers.ME) ? 'Coversation avec mon contact FinLive' : 'Conversation ' + this.getRequesterName() + ' / FinLive';
              } else if (conv['type'] === 'TICKET_BROADCAST') {
                textToIntroduceChat = 'Conversation de groupe sur le produit';
              }  else if (conv['type'] === 'TICKET_SOUSCRIPTION') {
                if (this.isMine(CUsers.ME)) {
                  if (conv.hasOwnProperty('userInfo')) {
                    textToIntroduceChat = 'Conversation avec ' + conv['userInfo']['firstName'] + ' ' + conv['userInfo']['lastName'];
                  }
                } else {
                  textToIntroduceChat = 'Conversation avec ' + this.getRequesterName();
                }
              }
            }
            chat.unshift({
              _id: 1,
              text: textToIntroduceChat ,
              //createdAt: minDate,
              //updated_at: minDate,
              system: true,
            });


          }
         });

          if (chat.length > 1) {
            chat.sort(CTicket.compareNoteDateUp);
          }
          //console.log(chat);
          return chat;
    }


    getId() {
      return this.ticket.id;
    }


    getTicketType() {
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

    getProductCode() {
      let code = '';
      if (this.ticket.hasOwnProperty('custom_fields') && this.ticket['custom_fields'].hasOwnProperty('cf_product_code')) {
        code = this.ticket['custom_fields']['cf_product_code'];
      }
      return code;
    }
    getProduct() {

      return this.product;
    }
    setProduct(product) {

      this.product = product;
    }


    isShared() {
      
      return this.ticket['custom_fields']['cf_ps_shared'] === null ? false : this.ticket['custom_fields']['cf_ps_shared'];
    }


    getCampaign(){
      //console.log(this.ticket['custom_fields']['cf_cpg_choice']);
      return this.ticket['custom_fields']['cf_cpg_choice'];
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

    /**
     * verifie si le ticket peut être annulé
     */
    isCancellable() {
      if (this.isClosed()) {
        return false;
      }
      //console.log("Ticket #"+ this.getId() + " est à moi : " + this.isMine(CUsers.ME));
      if (this.isMine(CUsers.ME)) {
        return true;
      }
      return false;
    }
    /**
     * verifie si le ticket est fermé
     */
    isClosed() {
      return this.status.id === 5;
    }
    getStatus() {
      return this.status;
    }
    setStatus(status) {
      this.ticket['status'] = 5;
      this.status = CTicket.STATUS().filter(({id}) => id === status)[0];
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

