import { CTicket } from './CTicket';

export class  CPPTicket extends CTicket {
    constructor(ticket, userId="") {
      super(ticket, userId); // appelle le constructeur parent avec le paramètre
    }

}