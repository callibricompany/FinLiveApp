import { CWorkflowTicket } from './CWorkflowTicket';
import { CAutocall } from '../Products/CAutocall';
import { convertFresh } from '../../Utils/convertFresh';
import * as TEMPLATE_TYPE from '../../constants/template';

import Moment from 'moment';


export class  CSouscriptionTicket extends CWorkflowTicket {
  constructor(ticket) {
   
    super(ticket.product); // appelle le constructeur parent avec le paramètre
    //console.log(ticket.product);
    //console.log(Object.keys(ticket));
    
    this.broadcast = ticket.broadcast;
    this.souscription = ticket;
    this.subscripters = [];
    // "source": 2,
    // "due_by": "2032-12-10T00:00:00Z",
    // "responder_id": null,
    // "ticket_cc_emails": [],
    // "requester_id": 2043036539987,
    // "nr_due_by": null,
    // "nr_escalated": false,
    // "tags": [],
    // "fr_escalated": false,
    // "updated_at": "2020-07-05T14:55:42Z",
    // "description_text": "Aucune instruction particulière",
    // "email_config_id": null,
    // "id": 374,
    // "fr_due_by": "2020-07-06T14:55:39Z",
    // "description": "<div>Aucune instruction particulière</div>",
    // "ticket_id": 374,
    // "is_escalated": false,
    // "subject": "Athéna 8 ans sur Cac 40 / mensuel",
    // "priority": 1,
    // "cc_emails": [],
    // "to_emails": null,
    // "attachments": [],
    // "reply_cc_emails": [],
    // "created_at": "2020-07-05T14:55:42Z",
    // "status": 2,

 
  }

  isMine(user){
    //console.log(this.getRequester());
    return (this.getRequester().codeTS === user.getCodeTS());
  }

  getBroadcastId() {
    return this.broadcast.id;
  }

  getSouscriptionId() {
    return this.souscription.id;
  }




  getMessage() {
    //return this.broadcast['custom_fields'].cf_message;
    return this.broadcast['description_text'];
  }

  getBeginDate() {
    return Moment(this.broadcast['custom_fields'].cf_broad_begindate, "YYYY-MM-DD").toDate();
  }
  
  getEndDate() {
    //return Moment(this.broadcast['custom_fields'].cf_broad_enddate, "YYYY-MM-DD").toDate();
    return Moment(this.broadcast['due_by']).toDate();
  }

  isBroadcastAlive() {
    return (Date.now() < this.getEndDate());
  }
  getBroadcastAmount() {
   return this.broadcast['custom_fields'].cf_broad_amount;
  }


 
  getRequester() {
    // console.log(Object.keys(this.broadcast));
    return this.broadcast.requester.userInfo;
  }
  getRequesterOrg() {
    return this.broadcast.requester.userOrg;
  }

  getSouscriptionAmount() {
    return this.souscription['custom_fields'].cf_ps_nominal;
  }
  setSouscriptionAmount(amount) {
    this.souscription['custom_fields']['cf_ps_nominal'] = amount;
  }

  getSouscriptionUF() {
    let uf = 0
    if (this.souscription['custom_fields'].hasOwnProperty('cf_rtro')) {
      uf = this.souscription['custom_fields']['cf_rtro'] === null ? super.getUF() : this.souscription['custom_fields'].cf_rtro/100;
    } else {
      uf = super.getUF();
    }
    // console.log("UF : " + uf);
    return uf;
  }

  getSouscriptionUFAssoc() {
    let uf = 0
    if (this.souscription['custom_fields'].hasOwnProperty('cf_rtro_asso')) {
      uf = this.souscription['custom_fields']['cf_rtro_asso'] === null ? super.getUFAssoc() : this.souscription['custom_fields'].cf_rtro_asso/100;
    } else {
      uf = super.getUFAssoc();
    }
    // console.log("UFAssoc : " + uf);
    return uf;
  }

  setSouscriptionUF(UF) {
    this.souscription['custom_fields'].cf_rtro = UF;
  }

  setSouscriptionUFAssoc(UFAssoc) {
    this.souscription['custom_fields'].cf_rtro_asso = UFAssoc;
  }
  
  /**
   *  GESTION DES SUBSCRIPTERS : MONTANT, QUI SONT-ILS, ETC...
   */

  setSubscripters(subscripters) {
    this.subscripters = subscripters;
  }
  getSubscripters() {
    return this.subscripters;
  }
}