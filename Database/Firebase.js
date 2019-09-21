
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import getEnvVars from '../environment';
const {     APIKEY, AUTHDOMAIN, DATABASEURL, PROJECTID, STORAGEBUCKET, MESSAGINGSENDERID } = getEnvVars();


const firebase = require("firebase");

import { sortResults } from '../Utils/convertFresh'

import * as ROLES from '../constants/roles';

import { getUserAllInfo } from '../API/APIAWS';

const dataForge = require('data-forge');


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
    if (this.ticketListenner != null) {
      this.ticketListenner();
    }

    //this.unsuscribreUserRights();
    console.log("SIGNOUT 3");
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
                      let codeTS = '';
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
                        codeTS = (typeof doc.data().codeTS !== 'undefined') ? doc.data().codeTS : '';
                        company = (typeof doc.data().company !== 'undefined') ? doc.data().company : '';
                        organization = (typeof doc.data().organization !== 'undefined') ? doc.data().organization : '';
                        phone = (typeof doc.data().phone !== 'undefined') ? doc.data().phone : '';
                      }    
                      
                    
                      //on recupere les infos du serveur
                      //console.log("LANCEMENT RECUP USER DTAS : "+ idTokenUser );
                      
                      /*getUserAllInfo(idTokenUser)
                      .then((userDatas) => {
                        //console.log("BELLE RECUP DES USER DATAS : "+ userDatas["data"]);
                        //console.log(userDatas.length);
                        //this.onRegisterSuccess();
                      })
                      .catch(error => {
                        //console.log("ERREUR RECUPERATION DES INFOS USER " + error);
                        alert('ERREUR RECUPERATION DES INFOS USER', '' + error);
                      }) */
                      
                      // merge auth and db user
                      authUser = {
                        uid: authUser.uid,
                        email: authUser.email,
                        name: name,
                        firstName: firstName,
                        codeTS: codeTS,
                        company: company,
                        organization: organization,
                        phone: phone,
                        roles : roles,
                        idToken : idTokenUser
                      };
                      console.log("USER :  ", authUser.email);

                      next(authUser);
                  }, function(error) {
                    
                    console.log("ERREUR ONSNAPSHOT : " + error);
                    fallback();
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
  getUnderlyingList() {
      return new Promise((resolve, reject) => {

        this.db.collection("parameters").doc("FLDatas").collection("underlying").get()
        .then((querySnapshot) => {
          resolve(querySnapshot);
        })
        .catch((error) => {
          console.log("Erreur retrour requete : " + error);
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