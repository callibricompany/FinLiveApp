import React from 'react'
import { View, ActivityIndicator, StatusBar, AsyncStorage} from 'react-native'


//import globalStyle from '../../Styles/globalStyle'

class AuthLoadingScreen extends React.Component {
    constructor() {
      super();
      this._bootstrapAsync();
    }
  
    // recupere le token user et en fonction redirige vers l'ecran d'autentification
    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
  
      //en fonction de l'existence du token redirige vers le bon ecran
      //this.props.navigation.navigate(userToken ? 'App' : 'Auth');
      console.log("User token : " + userToken)
      this.props.navigation.navigate('App');
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