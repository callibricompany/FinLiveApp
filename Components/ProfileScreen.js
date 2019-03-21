import React from 'react'
import { View, Button, StatusBar, AsyncStorage} from 'react-native'
import AlertAsync from 'react-native-alert-async'


import { globalStyle } from '../Styles/globalStyle'


class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Profil'
  }

  constructor(props) {
    super(props)

  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  };

  _signOutAlert = async () => {
    const choice = await AlertAsync(
      'Se déconnecter',
      'Confirmez-vous votre déconnexion ?',
      [
        {text: 'Confirmer', onPress: () => this._signOutAsync()},
        {text: 'Annuler', onPress: () => 'non et non'},
      ],
      {
        cancelable: true,
        onDismiss: () => 'no',
      },
    );
  
    if (choice === 'yes') {
      await this._signOutAsync();
    }
  };


  render() {
    return (
      <View style={globalStyle.container}>
        <Button title="Me déconnecter" onPress={this._signOutAlert} />
      </View>
    );
  }
}

export default ProfileScreen
