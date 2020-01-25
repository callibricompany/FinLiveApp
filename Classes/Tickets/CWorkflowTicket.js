import { CTicket } from './CTicket';
import { CAutocall } from '../Products/CAutocall';




export class  CWorkflowTicket extends CTicket {
  constructor(ticket, template) {
    super(ticket, template); // appelle le constructeur parent avec le paramètre
    switch(ticket.type) {
      case "Produit structuré": 
        //determination de l'étape 
        this.steps = null;


    
        //this.product = new CAutocall(this.ticket.data);

        
        break;
      default : 
        
        break;
    }

    //determination de l'étape  suivante
    this.firstCode = '';
    this.lastStep = '';
    this.currentStep = ticket.currentStep[0];

  }
  isUserTrigger() {
    return this.currentStep.userTrigger;
  }
  //retourne le nombre de choix possible
  getNumberOfChoices() {
  let numberOfPotentialSteps = this.currentStep.length;
  return numberOfPotentialSteps + (this.isUserTrigger() ? 1 : 0) ;
}

  getUnsolvedCodeStep() {
    return this.currentStep.stepUnsolved;
  }

  getCurrentCodeStep() {
    return this.currentStep.codeStep;
  }

  //calcule l'a position ou l'on se trouve dans les steps
  getStepPosition() {
    let i = 1;
    let curr = JSON.parse(JSON.stringify(this.currentStep));
    while(curr.codeStep !== this.firstCode) {
      curr = this.steps.filter(({nextCodeStep}) => nextCodeStep === curr.codeStep)[0];
    }
    return i;
  }
  //calcule le nombre maximums de steps restants
  getCurrentStepsDepth() {
    return this._getStepsDepth(this.getCurrentCodeStep());
  }
  _getStepsDepth(code) {
    //retrouve le code du step
    let steps = this.steps.filter(({codeStep}) => codeStep === code);
    
    steps.forEach((s) => {
      console.log(s);
        if (s.nextCodeStep === 'PPEND') {
          return 0;
        } else {
          let tabMax =[];
          tabMax.push(this._getStepsDepth(s.nextCodeStep) + 1);  //recursivité
          return (Math.max(tabMax) +1);
        }
    })
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
}