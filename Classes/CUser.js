
/*

Object {
  "company": "CGP Chapon 2",
  "email": "pierre.savarzeix@gmail.com",
  "firstName": "Pierre",
  "lastName": "Savarzeix",

  "params": Object {
    "issuersReject": Array [
      "sg",
    ],
  },

*/


export class CUser { 
    constructor(user) {

        //object !== 'undefined' ? this._constructorProduct(object,  template) : null;

        this.user = user;
    }

    getId() {
      let id = -1;
      if (this.user.hasOwnProperty('id') && this.user['id'] !== '' ) {
        id = this.user['id'];
      }
      return  id;
    }

   isAdmin () {
    return  (this.user.hasOwnProperty('admin') && this.user['admin']);
   }
   isSupervisor () {
    return  (this.user.hasOwnProperty('supervisor') && this.user['supervisor']);
   }
   isValidated () {
    return  (this.user.hasOwnProperty('validated') && this.user['validated']);
   }
   isIndependant () {
    return  (this.user.hasOwnProperty('independant') && this.user['independant']);
   }

   getCompany() {
     return this.user.hasOwnProperty('company') ? this.user['company'] : "";
   }
   getPhone() {
    return this.user.hasOwnProperty('phone') ? this.user['phone'] : "";
  }
   getOrganization() {
     let org = 'FL';
     if (this.user.hasOwnProperty('organization') && this.user['organization'] !== '' ) {
       org = this.user['organization'];
     }
    return  org;
  }

  getCodeTS() {
    return this.user.hasOwnProperty('codeTS') ? this.user['codeTS'] : "";
  }

  getFirstName() {
    return this.user.hasOwnProperty('firstName') ? this.user['firstName'] : "";
  }

  getLastName() {
    return this.user.hasOwnProperty('lastName') ? this.user['lastName'] : "";
  }
  getName() {
    return this.getFirstName() + ' ' + this.getLastName();
  }
  getEmail() {
    return this.user.hasOwnProperty('email') ? this.user['email'] : "";
  }
  
  getFreshdeskCode() {
    return this.user.hasOwnProperty('codeTS') ? this.user['codeTS'] : "";
  }

  isIssuerRejected(issuer) {
    let resp = false;

    if (this.user.hasOwnProperty('params')  && this.user['params'].hasOwnProperty('issuersReject') && this.user['params']['issuersReject'].indexOf(issuer) !==-1) {
      resp = true;
    }
    return resp;
  }

  //////////////////
  //
  //  ISSUER
  //////////////////
  getIssuersRejectedCount(){
    let nb = 0;
    if (this.user.hasOwnProperty('params')  && this.user['params'].hasOwnProperty('issuersReject')) {
      nb = this.user['params']['issuersReject'].length;
    }
    return nb;
  }

  setIssuerAsRejected(issuer) {
    if (this.user.hasOwnProperty('params')) {
      if (this.user['params'].hasOwnProperty('issuersReject')) {
        //on verifie s'il existe deja dans la liste ou pas
        if (this.user['params']['issuersReject'].indexOf(issuer) === -1) {
          this.user['params']['issuersReject'].push(issuer);
        }
      } else {

        this.user['params']['issuersReject'] = [issuer];   
      }
    } else {
      let obj = {};
      obj['issuersReject'] = [issuer];
      this.user['params']= obj;
    }
    //console.log(this.user);
  }

  removeIssuerAsRejected(issuer) {
    console.log(this.user);
    if (this.user.hasOwnProperty('params')) {
      if (this.user['params'].hasOwnProperty('issuersReject')) {
        let index = this.user['params']['issuersReject'].indexOf(issuer);
        if (index !== -1) {
          this.user['params']['issuersReject'].splice(index, 1);
        }
      }
    } 
    //console.log(this.user);
  }


  //////////////////
  //
  //  AVATAR
  //////////////////
  getAvatar(){
    let avatar = null;
      if (this.user.hasOwnProperty('avatarLink')) {
        avatar = this.user['avatarLink'];
      }
    return avatar;
  }
  setAvatar(uri){
      this.user['avatarLink'] = uri;

  }

  //////////////////
  //
  //  FRIENDS
  //////////////////
  isFriend(uid) {
    let friend = false;
     
    if (this.user.hasOwnProperty('params')) {
      if (this.user['params'].hasOwnProperty('friends')) {
        friend = this.user['params']['friends'].indexOf(uid) !== -1;
      }
    }
    return friend;
  }

  addFriend(friend) {
    if (this.user.hasOwnProperty('params')) {
      if (this.user['params'].hasOwnProperty('friends')) {
        //on verifie s'il existe deja dans la liste ou pas
        if (this.user['params']['friends'].indexOf(friend) === -1) {
          this.user['params']['friends'].push(friend);
        }
      } else {

        this.user['params']['friends'] = [friend];   
      }
    } else {
      let obj = {};
      obj['friends'] = [issuer];
      this.user['params']= obj;
    }
  }

  removeFriend(friend) {
    if (this.user.hasOwnProperty('params')) {
      if (this.user['params'].hasOwnProperty('friends')) {
        let index = this.user['params']['friends'].indexOf(friend);
        if (index !== -1) {
          this.user['params']['friends'].splice(index, 1);
        }
      }
    } 

  }
}