import { CTicket } from './CTicket';

import { convertFresh } from '../../Utils/convertFresh';
import * as TEMPLATE_TYPE from '../../constants/template';




export class  CWorkflowTicket extends CTicket {
  constructor(ticket) {
    super(ticket); // appelle le constructeur parent avec le paramètre
    //console.log(ticket);

    switch(ticket.type) {
      case "Produit structuré": 
        //on remet le bon template
        //this.setTemplate(TEMPLATE_TYPE.TICKET);
        //console.log(this.ticket);
        if (this.getCampaign()=== "Placement Privé") {
          //this.setTemplate(TEMPLATE_TYPE.PSPP);
          this.steps = JSON.parse(JSON.stringify(CWorkflowTicket.WORKFLOW.filter(({codeOperation}) => codeOperation === 'pp')));
          this.steps = this.steps.filter(({Shared}) => Shared === (this.isShared() ? '1' : '0'));
          this.steps = this.steps.filter(({specific}) => specific === (this.isAutomatic() ? '0' : '1'));        
        }

        //convertFresh(this.ticket['custom_fields']);
        //this.product = new CAutocall2(convertFresh(ticket['custom_fields']));
        //this.product = new CAutocall2('2020-12-02T17:58:38.973Z262523912');
        
        break;
      default : 
        break;
    }


    //this.currentStep = ticket.currentStep[0];
    this.currentStep = ticket.currentStep[0];
    //console.log(this.currentStep);
    //console.log(this.steps);
    //this.setType("WORKFLOW_TICKET");
 
  }

  isAutomatic() {
    let automatic = this.ticket['custom_fields']['cf_ps_mode'] === null ? 'Specifique' : this.ticket['custom_fields']['cf_ps_mode'];
    //console.log(this.getId() + " - EST AUTOMATIQUE : " + automatic);
    return automatic === "Automatique";
  }

  getWorkflowName() {
    if (this.currentStep.codeOperation === 'pp') {
        return 'Placement privé';
    }
    return "Appel public à l'épargne";
  }

  isUserTrigger() {
    return this.currentStep.userTrigger;
  }
  //retourne le nombre de choix possible
  getNumberOfChoices() {
  let numberOfPotentialSteps = this.currentStep.length;
  return numberOfPotentialSteps + (this.isUserTrigger() ? 1 : 0) ;
}

  getUnsolvedStep() {
    return this.currentStep.stepUnsolved;
  }

  getSolvedStep() {
    return this.currentStep.stepSolved;
  }

  getCurrentCodeStep() {
    return this.currentStep.codeStep;
  }

  //calcule l'a position ou l'on se trouve dans les steps
  getCurrentLevel() {

    return Number(this.currentStep.level);
  }

  //calcule le nombre maximums de steps restants
  getStepsToGoCount() {

    return (this.getStepDepth() - Number(this.currentStep.level) - 1);
  }

  //calcule le nombre maximums de steps 
  getStepDepth() {
    let s = [
      ...new Set(this.steps.map(x => x.level))
    ];

    
    //return Math.max(...toto);
    //return this._getStepsDepth(this.getCurrentCodeStep());
    
    // if (this.getCurrentCodeStep() === 'PPSDSE' || this.getCurrentCodeStep() === 'PPSDRO') {//offre echue ou refusée
    //   return 6;
    // }
    return s.length;
  }

  /*_getStepsDepth(code) {
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

  }*/
 
  getUF() {
    // console.log("PASSSA par retro CTICKET : "+this.ticket['custom_fields']['cf_rtro']);
    return this.ticket['custom_fields']['cf_rtro'] === null ? 0 : this.ticket['custom_fields']['cf_rtro']/100;

  }

  getUFAssoc(){
    return this.ticket['custom_fields']['cf_rtro_asso'] === null ? 0 : this.ticket['custom_fields']['cf_rtro_asso']/100;
  }

 getUFInCurrency() {

   return this.getUF()*this.getNominal()/100;
 }

 getUFAssocInCurrency() {

  return this.getUFAssoc()*this.getNominal()/100;
}


  

}
