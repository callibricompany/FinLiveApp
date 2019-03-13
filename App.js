import React from 'react'
import Navigation from './Navigation/Navigation'
import UserProvider from './Context/UserProvider'

export default class App extends React.Component {
  render() {
    return (
      <UserProvider>
        <Navigation/>
      </UserProvider>
    );
  }
}

/*class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign in!" onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}





  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}




}
*/


