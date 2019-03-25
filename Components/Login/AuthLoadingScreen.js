import React from 'react'
import { View, ActivityIndicator, StatusBar, AsyncStorage} from 'react-native'
import firebase from 'firebase'


//import globalStyle from '../../Styles/globalStyle'

class AuthLoadingScreen extends React.Component {
    constructor() {
      super();
      this._bootstrapAsync();
    }
  
    componentWillMount () {
      firebase.initializeApp({
        apiKey: 'AIzaSyDY7vk5tEGQ3ZeI8iaEn2iAaD6DAhOHyb0',
        authDomain: 'auth-8722c.firebaseapp.com',
        databaseURL: 'https://auth-8722c.firebaseio.com',
        projectId: 'auth-8722c',
        storageBucket: 'auth-8722c.appspot.com',
        messagingSenderId: '452038208493'
      });
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log(user);
        } else {
          console.log("Pas de user");
        }
      });
      
    }

    // recupere le token user et en fonction redirige vers l'ecran d'autentification
    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      const userEmail = await AsyncStorage.getItem('userEmail');
  
      //en fonction de l'existence du token redirige vers le bon ecran
      //this.props.navigation.navigate(userToken ? 'App' : 'Auth');
      
      if (userToken === null){
        console.log("User token absent")
        this.props.navigation.navigate('Login');
      }
      else {
        console.log("User token : " + (userToken));
        console.log("User email : " + userEmail);
        this.props.navigation.navigate('App');
        //this.props.navigation.navigate('Login');
      }
      
    };
  
    // Render any loading content that you like here
    render() {
      return (
        <View>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      );
    }
  }

  export default AuthLoadingScreen