import React from 'react';
import { View, ScrollView, Button, Text, AsyncStorage, SafeAreaView } from 'react-native';
import { Title } from 'native-base';
import AlertAsync from 'react-native-alert-async';
import { withFirebase } from '../Database';
//import { AuthUserContext } from '../Session';
import { withUser } from '../Session/withAuthentication';
import { withAuthorization } from '../Session';
import { compose, hoistStatics } from 'recompose';
import { globalStyle } from '../Styles/globalStyle'




class ProfileScreen extends React.Component {


  constructor(props) {
    super(props)

  }

  static navigationOptions = {
    header: (
      <SafeAreaView style={globalStyle.header_safeviewarea}>
        <View style={globalStyle.header_left_view} />
        <View style={globalStyle.header_center_view} >
          <Title style={globalStyle.header_center_text_big}>Profil</Title>
        </View>
        <View style={globalStyle.header_right_view} />
      </SafeAreaView>
    )
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  };

  _deconnexionDB = () => {
    console.log("Debut deconnxion ...");
    this.props.firebase.doSignOut()
    .then(() => {
      console.log("Déconnexion firebase : ok");
      return true;
    })
    .catch((error) => {
            console.log("Erreur de deconnxion firebase : " + error);
            Alert.alert('EREEUR DE DECONNEXION DB',  ''+ error);
            return false;
    });
  }

  _signOutAlert = async () => {
    const choice = await AlertAsync(
      'Se déconnecter',
      'Confirmez-vous votre déconnexion ?',
      [
       // {text: 'Confirmer', onPress: () => this._signOutAsync()},
       {text: 'Confirmer', onPress: () => this._deconnexionDB()},
        {text: 'Annuler', onPress: () => 'non et non'},
      ],
      {
        cancelable: true,
        onDismiss: () => 'no',
      },
    );

  
    if (choice === 'yes') {
      //await this._signOutAsync();
    }
  };


  render() {
    console.log("RENDER PROFILE SCRRENN : " + this.props.authUser);
    return (
      <ScrollView style={{flex: 1}}>
          <Text>{this.props.authUser.firstName} {this.props.authUser.name}</Text>
          <Text>{this.props.authUser.email}</Text>
          <Text>{this.props.authUser.codeTS}</Text>
          <Text>{this.props.authUser.roles}</Text>
          {this.props.authUser.roles ? this.props.authUser.roles.map((role)=> <Text key={role}>{role}</Text>) : <Text></Text>}    
        <Button title="Me déconnecter" onPress={this._signOutAlert} />
    
    
       </ScrollView>
    );
  }
}

const condition = authUser => authUser != null;

const composedFB = compose(
  withAuthorization(condition),
  withFirebase,
  withUser,
  
);  


export default hoistStatics(composedFB)(ProfileScreen);

//export default withUser(ProfileScreen);
//export default withFirebase(withAuthentication(ProfileScreen));*/

//export default withFirebase(ProfileScreen);

/*
         <AuthUserContext.Consumer>
          {authUser => authUser ? <View>
                          <Text>{authUser.firstName} {authUser.name}</Text>
                          <Text>{authUser.roles} </Text>
                        </View> : <Text> </Text>
                      }
          </AuthUserContext.Consumer>

*/