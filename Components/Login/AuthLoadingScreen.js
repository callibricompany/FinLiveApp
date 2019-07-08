import React from 'react'
import { View, ActivityIndicator, StatusBar, AsyncStorage} from 'react-native'
import firebase from 'firebase'
import { withFirebase } from '../../Database';
import { withAuthorization } from '../../Session';


//import globalStyle from '../../Styles/globalStyle'

class AuthLoadingScreen extends React.Component {
    constructor(props) {
      super(props);

      
      //this._bootstrapAsync();
      //this._checkIfAlreadyConnected();
    }

    _checkIfAlreadyConnected = () => {
        if (this.props.firebase) {
          console.log("DATABASE : OK");
          if (this.props.firebase.authUser) {
            console.log("USER DEJA CONNECTE : " + this.props.firebase.authUser.userEmail);
            this.props.navigation.navigate('App');
          } else {
            console.log("AUCUN USER CONNECTE");
            this.props.navigation.navigate('Login');
          }
        } else {
          console.log("DATABASE : KO");
        }


    }



    // recupere le token user et en fonction redirige vers l'ecran d'autentification
    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      const userEmail = await AsyncStorage.getItem('userEmail');
  
      //en fonction de l'existence du token redirige vers le bon ecran
      //this.props.navigation.navigate(userToken ? 'App' : 'Auth');
      
      if (userToken === null){
        console.log("User token absent : " + this.props.firebase.authUser)
        this.props.navigation.navigate('Login');
      }
      else {
        console.log("User token : " + (userToken));
        console.log("User email : " + userEmail);
        //this.props.navigation.navigate('App');
        this.props.navigation.navigate('Login');
      }
      
    };
    componentDidMount() {
      
     // console.log(this.props);

    }

    // Render any loading content that you like here
    render() {
      
      return (
        <View>
          <ActivityIndicator />
          <StatusBar barStyle="dark-content" />
        </View>
      );
    }
  }

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AuthLoadingScreen);
