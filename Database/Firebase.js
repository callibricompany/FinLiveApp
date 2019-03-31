
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


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
      this.db = app.database();
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

  
  doSignOut = () => this.auth.signOut();


  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);



  // *** User API ***

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');

  }
  
  export default Firebase;