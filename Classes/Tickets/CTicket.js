import WORKFLOW from '../../Data/workflow.json'

import { CAutocall } from '../Products/CAutocall';

import Numeral from 'numeral'
import 'numeral/locales/fr'



//classe mere de tous les objets tickets
export class CTicket { 

    
    constructor(ticket, userId="") {
      this.ticket = ticket;
      this.userIdFirestore = userId;

      //determination de l'étape 
      this.step = WORKFLOW.filter(({codeStep}) => codeStep === this.ticket.currentStep[0].codeStep)[0];

      //determination de l'étape  suivante
      this.nextStep = WORKFLOW.filter(({codeStep}) => codeStep === this.ticket.currentStep[0].nextCodeStep)[0];
      
      //priorite FD
      this.priority = CTicket.PRIORITY().filter(({id}) => id === this.ticket.priority)[0];
      
      //statut FD
      this.status = CTicket.STATUS().filter(({id}) => id === this.ticket.status)[0];

      //manage underlying 
      switch(ticket.type) {
        case CTicket.TYPE_PS(): 
          this.underlying = new CAutocall(this.ticket.data);
          this.underlying.setUserId(userId);
          break;
        default : 
          this.underlying = null;
          break;
      }
    }
   

  setUserId(userId) {//user Id de firestore
    this.userIdFirestore = userId;

  }
  
  getUserId() {//user Id de firestore
    return this.userIdFirestore;

  }

   static TYPE_PS () {
     return "Produit structuré";
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
        "name": "",
        "id": 1,
        "color" : "transparent"
      },
      {
        "name": "pressé",
        "id": 2,
        "color" : "transparent"
      },
      {
        "name": "urgent",
        "id": 3,
        "color" : "pink"
      },
      {
        "name": "urgentissime",
        "id": 4,
        "color" : "red"
      }
    ];
    return data;
   }

   getId() {
     return this.ticket.id;
   }
   getResultAuction() {
    return this.getUnderlying().getResultAuction();
   }
   getSteps() {
     let steps = this.ticket.currentStep;
     if (this.getCurrentCodeStep() === 'PPACO') { //il faut rajouter les offres des emetteurs
       steps = [];
       i = 0;
       //recuperation de toutes les offres
       this.getResultAuction().forEach((res) => {
          steps[i] = JSON.parse(JSON.stringify(this.ticket.currentStep[1]));
          steps[i].stepSolved = res.emetteur + " : " + Numeral(res.couponAutocall).format('0.00%');
          steps[i].emetteur = res.emetteur;
          steps[i].couponAutocall = res.couponAutocall;
          steps[i].couponPhoenix = res.couponPhoenix;
          i = i +1;
       });
       steps[i] = this.ticket.currentStep[0];
       steps[i+1] = this.ticket.currentStep[2];

     }
     return steps;
   }

   getType() {
     return this.ticket.type;
   }

   getAgentName() {
     let agentName = "Non affecté";
     if (this.ticket.hasOwnProperty('')) {
       agentName = this.ticket['agentInfo'].contact['name'];
     }

     return agentName;
   }

   getUnderlying() {

     return this.underlying;
   }

   getUnderlyingType() {
        return this.ticket.type;
   }

   //retourne le nombre de choix possible
   getNumberOfChoices() {
     let numberOfPotentialSteps = this.ticket.currentStep.length;
     return numberOfPotentialSteps + (this.isUserTrigger() ? 1 : 0) ;
   }

    getCurrentStep() {
      return this.step.stepUnsolved;
    }
    getCurrentCodeStep() {
      return this.step.codeStep;
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

    getStatus() {
      return this.status;
    }

    getPriority() {
      return this.priority;
    }

    isUserTrigger() {
      return this.step.userTrigger;
    }


  }

