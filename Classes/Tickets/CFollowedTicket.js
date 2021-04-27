import { CTicket } from './CTicket';

import { convertFresh } from '../../Utils/convertFresh';
import * as TEMPLATE_TYPE from '../../constants/template';




export class  CFollowedTicket extends CTicket {
  constructor(ticket) {
    super(ticket); // appelle le constructeur parent avec le paramètre

  }

  //si le ticket est encore en demande génrale
  isFollowingAcived() {
      return this.getType() !== 'Demande Générale';
  }

}
