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
    this._previousStepsTab = [];
    this.currentStep = ticket.currentStep[0];
    this.previousSteps=[];
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
    return this.currentStep.level;
  }

  //calcule le nombre maximums de steps restants
  getCurrentStepsDepth() {
    let toto = [
      ...new Set(this.steps.map(x => x.level))
    ];
    return Math.max(...toto);
    //return this._getStepsDepth(this.getCurrentCodeStep());
  }
  _getStepsDepth(code) {
    //retrouve le code du step
    let steps = this.steps.filter(({codeStep}) => codeStep === code);

    console.log("=========================  " + this.firstCode + " ==== " + this.lastStep);
    this.previousSteps.push(code);
    let tabMax =[];
    steps.forEach((s) => {
        console.log(s);
        
        console.log(this.previousSteps);
        if (s.nextCodeStep === this.firstCode || s.nextCodeStep === this.lastStep || this.previousSteps.includes(s.nextCodeStep)) {
          tabMax.push(0);
        } else {
          console.log(this.counter+"/  "+code +  "  : " + JSON.stringify(tabMax));
          tabMax.push((this._getStepsDepth(s.nextCodeStep) + 1));  //recursivité
        }
        
    })
    console.log(tabMax);
    return (Math.max(...tabMax));

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