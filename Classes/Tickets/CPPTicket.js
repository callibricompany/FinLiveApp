import { CWorkflowTicket } from './CWorkflowTicket';
import * as TEMPLATE_TYPE from '../../constants/template';




export class  CPPTicket extends CWorkflowTicket {
    constructor(ticket) {
      super(ticket, TEMPLATE_TYPE.PSPP); // appelle le constructeur parent avec le paramètre

      this.steps = CWorkflowTicket.WORKFLOW.filter(({codeOperation}) => codeOperation === 'pp');
      this.firstCode = 'PPDVB';
      this.lastStep = 'PPEND';
   
      
    }


}

/*

Object {
    "codeOperation": "ape",
    "codeStep": "APEACO",
    "freshdeskStep": "Acceptation de la meilleure offre (APEACO)",
    "nextCodeStep": "APESDRO",
    "operation": "Appel public à l'épargne",
    "stepSolved": "Offre refusée",
    "stepUnsolved": "Acceptation de la meilleure offre",
    "userTrigger": true,
  },

  */
