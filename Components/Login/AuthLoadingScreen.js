import React from 'react'
import { View, ActivityIndicator, StatusBar, AsyncStorage} from 'react-native'

//import globalStyle from '../../Styles/globalStyle'

class AuthLoadingScreen extends React.Component {
    constructor() {
      super();
      this._bootstrapAsync();
    }
  
    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
  
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      //this.props.navigation.navigate(userToken ? 'App' : 'Auth');
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