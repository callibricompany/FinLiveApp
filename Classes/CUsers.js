import { CUser } from './CUser';





export class CUsers {
    constructor(users, myId) {

        this.users = [];
        users.forEach((u) => {
            if (u.id !== myId) {
                this.users.push(new CUser(u));
            } else { //c'est moi
            this.myUser = new CUser(u);
            }
        });

    }

    getUsersFromMyOrg() {
        let userFromMyOrg = [];
        let myOrg = this.myUser.getOrganization();

        this.users.forEach((u) => {
            if (u.getOrganization() === myOrg) {
                userFromMyOrg.push(u);
            }
        });

        return userFromMyOrg;
    }

    getUsersFriends(me) {
        let usersFriend = [];
        

        this.users.forEach((u) => {
            if (me.isFriend(u.getId())) {
                usersFriend.push(u);
            }
        });

        return usersFriend;
    }

    getUsersFromName(searchingText) {
        let usersFriend = [];
        
        this.users.forEach((u) => {
            if (u.getName().toLowerCase().includes(searchingText.toLowerCase())) {
                usersFriend.push(u);
            }
        });

        return usersFriend;
    }

    
    
    getUserListFromUid(uidArray) {
     
        let usersFriend = [];
        if (uidArray != null && uidArray.length > 0) {
            this.users.forEach((u) => {
                if (uidArray.indexOf(u.getId()) !== -1) {
                    usersFriend.push(u);
                }
            });
        }

        return usersFriend;
      }

    

      getUserFromCodeTS(codeTS) {
      
        let user = null;
        this.users.forEach((u) => {
            
            if (codeTS === u.getCodeTS()) {
                user = u;
            }
        });

        return user;
      }

      getUserUIDFromCodeTS(codeTS) {
      
        let UID = '';
        let user = null;
        this.users.forEach((u) => {
            //console.log(codeTS + " : "+u.getCodeTS());
            if (codeTS === u.getCodeTS()) {
                user = u;
            }
        });
        if (user != null) {
            UID = user.getId();
        }
        return UID;
      }
    
}