
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



  // creation user
  doCreateUserWithEmailAndPassword = (email, password) => {
    return new Promise(
      (resolve, reject) => {
        this.auth.createUserWithEmailAndPassword(email, password).then((user) => {
          resolve(user);
        }, function(error) {
          reject(error);
        });
      });
  }


  doSignInWithEmailAndPassword = (email, password) => {
    //console.log(this.auth);
    console.log("TENTATIVE CONNEXION :" + email + "   :   " +password);
    return new Promise(
      (resolve, reject) => {
      this.auth.signInWithEmailAndPassword(email, password).then((user) => {
        resolve(user);
      }, function (error) {
        reject(error);
      });
    });
  }

  
  doSignOut = () => {
     return this.auth.signOut();
  }


  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);


  // retourne l'idToken du user connecte
  doGetIdToken = () => {
    //console.log("LE TOKE EST DEMANDE")
    return new Promise(
      (resolve, reject) => {
        this.auth.currentUser.getIdToken(true).then((idToken) => {
          //console.log("IDTOKEN RESOLU :" +idToken);
          resolve(idToken);
        }).catch(function (error) {
          reject(error);
        });
      });
  }


  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      //console.log("SUSCRIBE RIGHTS : " + this.unsuscribreUserRights);
      if (authUser) {
          var idTokenUser = 'merde';
          //recuperation idToken
          this.doGetIdToken()
          .then(token => {
             idTokenUser = token;
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
                        name = (typeof doc.data().lastName !== 'undefined') ? doc.data().lastName : '';
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
                      idToken : idTokenUser
                    };
                    console.log("USER :  ", authUser.email);
                    next(authUser);
                  }, function(error) {
                    //this.unsuscribreUserRights();
                    console.log("ERREUR ONSNAPSHOT : " + error);
                  })
                }).catch(function (error) {
                  idTokenUser = '';
                    console.log(error);
      
                  });
      } else {
        console.log("FALLBACK");
        fallback();
      }
    });





  // verifie si user admin
  isHeAdmin = (user) => {
    console.log("isHeAdmin : "+ user.email);
    console.log("isHeAdmin : "+ user.uid);
    return new Promise(
      (resolve, reject) => {
        this.user(user.uid).get().then(function(doc) {
          if (doc.exists) {
              console.log("Document data:", doc.data().admin);
              resolve(doc.data());
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
              reject("Erreur recuperation statut admin du user");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
          reject(error);
      });
      });
  }


  // *** User API ***

  //user = uid => this.db.ref(`users/${uid}`);


  user  = uid => this.db.collection("users").doc(uid);

  users = () => this.db.ref('users');

  }
  
  export default Firebase;