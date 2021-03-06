
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import getEnvVars from '../environment';
const {     APIKEY, AUTHDOMAIN, DATABASEURL, PROJECTID, STORAGEBUCKET, MESSAGINGSENDERID } = getEnvVars();


const firebase = require("firebase");

import { sortResults } from '../Utils/convertFresh'

import * as ROLES from '../constants/roles';



//const dataForge = require('data-forge');


const devConfig = {
  apiKey: APIKEY, 
  authDomain: AUTHDOMAIN, 
  databaseURL: DATABASEURL, 
  projectId: PROJECTID, 
  storageBucket: STORAGEBUCKET, 
  messagingSenderId: MESSAGINGSENDERID, 
}



const prodConfig = {
  apiKey: APIKEY, 
  authDomain: AUTHDOMAIN, 
  databaseURL: DATABASEURL, 
  projectId: PROJECTID, 
  storageBucket: STORAGEBUCKET, 
  messagingSenderId: MESSAGINGSENDERID, 
};

//const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
const config = devConfig;

class Firebase {
    constructor() {
      try {
        app.initializeApp(config);
        app.firestore().settings({ experimentalForceLongPolling: true });
      }
      catch (error){
        console.log('ERREUR FIREBASE : '+error);
      }
      this.auth = app.auth();
      this.db = app.firestore();
      this.lastPricesList = [];
      this.isAllPricesLoaded = false;
      //this.unsuscribreUserRights = null;

      this.ticketListenner = null;
    }



  // creation user
  doCreateUserWithEmailAndPassword = (email, password) => {
    return new Promise(
      (resolve, reject) => {
        this.auth.createUserWithEmailAndPassword(email, password).then((user) => {
          user.user.sendEmailVerification().then(function() {
            console.log("Email de validation envoyé");
            resolve(user);
          }).catch(function(error) {
            reject(error);
          });
          
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
    if (this.ticketListenner !== null) {
      this.ticketListenner();
    }

     this.unsuscribreUserRights();
    
     return this.auth.signOut();
  }


  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);


  reauthenticate = (currentPassword) => {
        var user = this.auth.currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
  }
  doChangePassword = (currentPassword, newPassword) => {
    return new Promise(
      (resolve, reject) => {
        this.reauthenticate(currentPassword)
        .then(() => {
          var user = firebase.auth().currentUser;
          user.updatePassword(newPassword)
          .then(() => {
            console.log("Password updated!");
            resolve("Success");
          })
          .catch((error) => { 
            console.log(error); 
            reject(error);
          });
        })
        .catch((error) => { 
          console.log(error); 
          reject(error);
        });
      });
  }

  doChangeEmail = (currentPassword, newEmail) => {
    return new Promise(
      (resolve, reject) => {
        this.reauthenticate(currentPassword)
        .then(() => {
          var user = firebase.auth().currentUser;
          user.updateEmail(newEmail)
          .then(() => {
            console.log("Email updated!");
            resolve("Success");
          })
          .catch((error) => { 
            console.log(error); 
            reject(error);
          });
        })
        .catch((error) => { 
          console.log(error); 
          reject(error);
        });
      });
  }


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
          var idTokenUser = '';
          //console.log("AUTHUSER EMAIL VERIF : " + authUser.emailVerified);
          var emailVerified = authUser.emailVerified;
          //recuperation idToken
          this.doGetIdToken()
          .then(token => {
             idTokenUser = token;
                this.unsuscribreUserRights = this.user(authUser.uid)
                    .onSnapshot(function(doc) {
                      

                      const roles = [];
                      let name = '';
                      let firstName= '';
                      let email = '';
                      let codeTS = '';
                      let company = '';
                      let organization = '';
                      let phone = '';
                      //console.log(Object.keys(doc));
                      //table documents de user non vide
                      // console.log("==============================================");
                      // console.log("===================  BONJOUR  ================");
                      // console.log(doc.data());
                      // console.log("==============================================");
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
                        email = (typeof doc.data().email !== 'undefined') ? doc.data().email : '';
                        firstName = (typeof doc.data().firstName !== 'undefined') ? doc.data().firstName : '';
                        codeTS = (typeof doc.data().codeTS !== 'undefined') ? doc.data().codeTS : '';
                        company = (typeof doc.data().company !== 'undefined') ? doc.data().company : '';
                        organization = (typeof doc.data().organization !== 'undefined') ? doc.data().organization : '';
                        phone = (typeof doc.data().phone !== 'undefined') ? doc.data().phone : '';

                      }    
                      
                      
                      // merge auth and db user
                      authUser = {
                        uid: authUser.uid,
                        email: email,
                        name: name,
                        firstName: firstName,
                        codeTS: codeTS,
                        company: company,
                        organization: organization,
                        phone: phone,
                        roles : roles,
                        idToken : idTokenUser,
                        emailVerified 
                      };
                      //console.log("USER :  ", authUser.email);

                      next(authUser);
                  }, function(error) {
                    
                    console.log("ERREUR ONSNAPSHOT : " + error);
                    fallback();
                  })
                }).catch(function (error) {
                  idTokenUser = '';
                    console.log("onAuthListener : " + error);
      
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




  //charge l'etat des categories
  getCategoriesState() {
    return new Promise((resolve, reject) => {

      this.db.collection("parameters").doc("FLDatas").get()
      .then((doc) => {
        resolve(doc.data().underlyingActivated);
      })
      .catch((error) => {
        console.log("Erreur retrour getCategoriesState : " + error);
        reject(error);
      }); 
    });
  }
  
  //charge tous les sous-jacents
  getUsersList() {
      return new Promise((resolve, reject) => {

        this.db.collection("users").get()
        .then((users) => {
          let result =[];
          users.forEach((user) => {
            u = user.data();
            u.id = user.id;
            result.push(u);
          });
          
          resolve(result);
        })
        .catch((error) => {
          console.log("Erreur retrour requete : " + error);
          reject(error);
        }); 
      });
  }

    //charge tous les sous-jacents
    updateTable(tableName, docId, fieldName, newFieldValue) {
      return new Promise((resolve, reject) => {

        var ref = this.db.collection(tableName).doc(docId);
        let obj = {};
        obj[fieldName] = newFieldValue;

       
        ref.update(obj)
        .then(function() {
            resolve("ok");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
            reject(error);
        });
   });
  }

  //where('requester_id', '==', idFresh)
  //orderBy("updated_at", "desc")
   //charge les tickets
    onTicketListenner = (next, fallback, idFresh) => {
      this.ticketListenner = this.db.collection("tickets").where('requester_id', '==', idFresh).onSnapshot(function(querySnapshot) {
        var tickets = [];
        querySnapshot.forEach(function(doc) {
          if (doc.data().requester_id === idFresh) {
            tickets.push(doc.data());
          }
        });
        //console.log("PASSE PAR FIREBASE");
        tickets = sortResults(tickets, 'updated_at', false);
        next(tickets);
        //reject("Erreur retour snapshot ticket list from datastore");      
      });
      fallback();
    }
    

 



  // *** User API ***

  //user = uid => this.db.ref(`users/${uid}`);


  user  = uid => this.db.collection("users").doc(uid);

  users = () => this.db.ref('users');

  }
  
  export default Firebase;