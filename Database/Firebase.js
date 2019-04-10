
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as ROLES from '../constants/roles';

const devConfig = {
        apiKey: 'AIzaSyDY7vk5tEGQ3ZeI8iaEn2iAaD6DAhOHyb0',
        authDomain: 'auth-8722c.firebaseapp.com',
        databaseURL: 'https://auth-8722c.firebaseio.com',
        projectId: 'auth-8722c',
        storageBucket: 'auth-8722c.appspot.com',
        messagingSenderId: '452038208493'
}

const prodConfig = {
  apiKey: process.env.REACT_APP_DEV_API_KEY,
  authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
  projectId: process.env.REACT_APP_DEV_PROJECT_ID,
  storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
};

//const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
const config = devConfig;

class Firebase {
    constructor() {
      app.initializeApp(config);
      this.auth = app.auth();
      this.db = app.firestore();
      

      //this.unsuscribreUserRights = null;
    }



  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) => {
    console.log("TENTATIVE CREATION  :" + email + "   :   " +password);
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  doSignInWithEmailAndPassword = (email, password) => {
    //console.log(this.auth);
    console.log("TENTATIVE CONNEXION :" + email + "   :   " +password)
    return this.auth.signInWithEmailAndPassword(email, password);
    /*.then((userData) =>
      {

        console.log("passe ici ensuite")
        return userData;
      }
    ).catch((error) =>
        {
          return error;
    });*/
  }

  
  doSignOut = () => {
     return this.auth.signOut();
  }


  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      //console.log("onAuth Listener firebase : "+authUser);
      //console.log("SUSCRIBE RIGHTS : " + this.unsuscribreUserRights);
      if (authUser) {
         this.unsuscribreUserRights = this.user(authUser.uid)
            .onSnapshot(function(doc) {
              

              const roles = [];
              let name = '';
              let firstName= '';
              let zohocode = '';
              let company = '';
              let organization = '';
              let phone = '';
              //table documents de user non vide
              if (typeof doc.data() !== 'undefined') {
                // ajoute les roles
                if (doc.data().supervisor) {
                  roles.push(ROLES.SUPERVISOR);
                }
                if (doc.data().independant) {
                  roles.push(ROLES.INDEPENDANT);
                }
                if (doc.data().validated) {
                  roles.push(ROLES.VALIDATED);
                }
                if (doc.data().expert) {
                  roles.push(ROLES.EXPERT);
                }
                if (doc.data().admin) {
                  roles.push(ROLES.ADMIN);
                } 

                //check si les champs sont presents
                name = (typeof doc.data().name !== 'undefined') ? doc.data().name : '';
                firstName = (typeof doc.data().firstName !== 'undefined') ? doc.data().firstName : '';
                zohocode = (typeof doc.data().zohocode !== 'undefined') ? doc.data().zohocode : '';
                company = (typeof doc.data().company !== 'undefined') ? doc.data().company : '';
                organization = (typeof doc.data().organization !== 'undefined') ? doc.data().organization : '';
                phone = (typeof doc.data().phone !== 'undefined') ? doc.data().phone : '';


              }            
              
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              name: name,
              firstName: firstName,
              zoho: zohocode,
              company: company,
              organization: organization,
              phone: phone,
              roles : roles,
            };
            //console.log("USER :  ", authUser);
            next(authUser);
          }, function(error) {
            //this.unsuscribreUserRights();
            console.log("ERREUR ONSNAPSHOT : " + error);
          })
      } else {
        console.log("FALLBACK");
        fallback();
      }
    });

  // *** User API ***

  //user = uid => this.db.ref(`users/${uid}`);


  user  = uid => this.db.collection("users").doc(uid);

  users = () => this.db.ref('users');

  }
  
  export default Firebase;