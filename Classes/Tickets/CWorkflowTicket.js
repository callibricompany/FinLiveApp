import { CTicket } from './CTicket';
import { CAutocall } from '../Products/CAutocall';
import { convertFresh } from '../../Utils/convertFresh';
import * as TEMPLATE_TYPE from '../../constants/template';


export class  CWorkflowTicket extends CTicket {
  constructor(ticket) {
    super(ticket); // appelle le constructeur parent avec le paramètre
    //console.log("constructeur workflow");
    if (ticket.id === 152) {
      console.log(ticket.currentStep);
    }
    switch(ticket.type) {
      case "Produit structuré": 
        //on remet le bon template
        this.setTemplate(TEMPLATE_TYPE.TICKET);

        if (ticket['currentStep'][0].codeOperation === 'pp') {
          this.setTemplate(TEMPLATE_TYPE.PSPP);
          this.steps = JSON.parse(JSON.stringify(CWorkflowTicket.WORKFLOW.filter(({codeOperation}) => codeOperation === 'pp')));

          this.firstCode = 'PPDVB';
          this.lastStep = 'PPEND';

          //si c'est en mode automatique il enleve les deux premier steps
          if (this.isAutomatic()) {
            
              this.firsCode = 'PPDCC';
              this.steps.shift();
              this.steps.shift();
              this.steps = this.steps.map((step, index) => {
                step.level = step.level- 2;
                return step; 
              });
              //console.log(this.steps);
          }

          
          
        }
        //convertFresh(this.ticket['custom_fields']);
        this.product = new CAutocall(convertFresh(ticket['custom_fields']));
        
        break;
      default : 
        
        break;
    }

    //determination de l'étape  suivante
    this.firstCode = '';
    this.lastStep = '';
    this._previousStepsTab = [];

    //this.currentStep = ticket.currentStep[0];
    this.currentStep = this.steps.filter(({ codeStep }) => codeStep === ticket.currentStep[0].codeStep)[0];
    //console.log(this.currentStep);
    this.previousSteps=[];

 
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

    return this.currentStep.level;
  }

  //calcule le nombre maximums de steps restants
  getStepsToGoCount() {

    return (this.getStepDepth() - this.currentStep.level - 1);
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
    return this.ticket['custom_fields']['cf_rtro'] === null ? 0 : this.ticket['custom_fields']['cf_rtro'];

  }

  getUFAssoc(){
    return this.ticket['custom_fields']['cf_rtro_asso'] === null ? 0 : this.ticket['custom_fields']['cf_rtro_asso'];
  }

 getUFInCurrency() {

   return this.getUF()*this.getNominal()/100;
 }

 getUFAssocInCurrency() {

  return this.getUFAssoc()*this.getNominal()/100;
}

  getCurrency() {
    return this.ticket['custom_fields']['cf_devise'] === null ? 0 : this.ticket['custom_fields']['cf_devise'];
    
  }
  

  

}


class CWFTree {

    constructor(tree) {
      this.tree = tree;
    }

}