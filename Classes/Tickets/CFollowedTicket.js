import { CTicket } from './CTicket';

import { convertFresh } from '../../Utils/convertFresh';
import * as TEMPLATE_TYPE from '../../constants/template';




export class  CFollowedTicket extends CTicket {
  constructor(ticket) {
    super(ticket); // appelle le constructeur parent avec le paramètre
    if (ticket.hasOwnProperty('PRODUCT') && ticket.PRODUCT !== '') {
      this.setProduct(ticket.PRODUCT);
    }
  }

  //si le ticket est encore en demande génrale
  isFollowingActivated() {
      return this.getType() !== 'Demande Générale';
  }

}
