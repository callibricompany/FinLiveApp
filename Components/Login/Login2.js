
import {
  ImageBackground,
  KeyboardAvoidingView,
  AsyncStorage,
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  Text
} from 'react-native';
import { Thumbnail, Item,Body,Title, Content, List, ListItem, InputGroup, Input, Icon, Picker, Button } from 'native-base';
import React, {Component} from 'react';
import ButtonSubmit from './ButtonSubmit'
import LogoComponent  from '../LogoComponent'
import Dimensions from 'Dimensions';
import { withFirebase } from '../../Database';
import { withNavigation } from 'react-navigation';
import { withAuthorization } from '../../Session';

import { compose, hoistStatics } from 'recompose';


// import Signup from './Signup';
//import Account from './Main'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const Login2 = () => (
    
    <LoginForm />
 
);

class LoginFormBase extends Component {

  constructor(props){
    super(props);
    // We have the same props as in our signup.js file and they serve the same purposes.
    this.state = {
      loading: false,
      email: '',
      password: '',
      loggedIn: false
    }

    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }
  
  //focus next text input : putain de galere
  focusNextField = (id) => {
    //this.inputs[id].focus();
    this.inputs[id]._root.focus();
  }


  //verif si email correct
  checkEmailValidity = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    if (reg.test(this.state.email) === false){
        Alert.alert('VERIFIER VOTRE EMAIL', 'Adresse mail non valide');
        return false;
    }

    if (this.state.password.length < 6){
      Alert.alert('VERIFIER VOTRE MOT DE PASSE', 'Il doit contenir au moins 6 caractères');
      return false;
    }
    
    return true;
  }

  //login a la base firebase
  login = () => { 
    this.setState({
      loading: true
    });
    //console.log("PASSE PAR LOG IN");
    this.props.firebase
      .doSignInWithEmailAndPassword(this.state.email, this.state.password)
      .then((authUser) => {
        console.log("user id : " + authUser.user.uid);
        
        this.props.firebase.isHeAdmin(authUser.user).then((userData) => {
            //console.log("RETOUR TEST ADMIN : " + data.admin);
            if (!userData.validated) {
              this.props.navigation.navigate('WaitingRoom'); 
            } else {
              userData.admin ? this.props.navigation.navigate('AppAdmin') : this.props.navigation.navigate('App');
            }
            return true;
        })
        .catch((error) => {
            console.log("RETOUR TEST ADMIN ERREUR : " + error);
            this.setState({loading: false});
            return false;
        })
        

      })
      .catch((error) => {
              //console.log("erreur connexio n signIn : " + error);
              this.setState({loading: false});
              Alert.alert('EREEUR DE CONNEXION',  ''+ error);
              return false;
      });


  }

  // Go to the signup page
  goToRegister = () => {
    this.props.navigation.navigate('Register');
  }

  // Go to the signup page
  goToPasswordRecovery = () => {
    //this.props.navigator.push({component: Signup});
    //this.props.navigation.navigate('App');
      this.props.navigation.navigate('WaitingRoom');
  }



  render() {
    //console.log("RENDER LOGIN : " + this.state.loading)
 

    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ?
    <View style={styles.style_activityIndicator}>
    <ActivityIndicator size="large"/>
    </View> :
        <View style={{flex: 1}}>
            <ImageBackground
                style={styles.picture} 
                //source={{uri: 'https://picsum.photos/g/400/600?random'}}
                backgroundColor="#F9FAFC"
            />
            
     
            <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>  
            <ScrollView keyboardShouldPersistTaps="always">
             <View style={styles.container}>
                <LogoComponent />
                </View>
                <View style={styles.container}>
                    <InputGroup>
                    <Item style={{width: 0.9*DEVICE_WIDTH}}>
                        <Icon name="ios-mail" style={{color : "#9A9A9A"}}/>
                        <Input
                        //onChangeText={(text) => this.setState({email: text})}
                        onChangeText={e => {this.setState({ email: e })}}
                        value={this.state.email.toLowerCase()}
                        keyboardType='email-address'
                        clearButtonMode="always"
                        placeholder={"Adresse mail"} 
                        blurOnSubmit={ false }
                        onSubmitEditing={() => {
                          this.focusNextField('password');
                        }}
                        returnKeyType={ "next" }
                        ref={ input => {
                          this.inputs['email'] = input;
                        }}
                        />
                        
                    </Item>
                    </InputGroup>
                
                    <InputGroup>
                    <Item style={{width: 0.9*DEVICE_WIDTH}}>
                        <Icon name="ios-unlock"  style={{color : "#9A9A9A"}}/>
                        <Input
                        onChangeText={e => {this.setState({ password: e })}}
                        //value={this.state.password}
                        secureTextEntry={true}
                        clearButtonMode="always"
                        placeholder={"Mot de passe"} 
                        //onSubmitEditing={() => this.login()}
                        blurOnSubmit={ true }
                        returnKeyType={ "done" }
                        ref={ input => {
                          this.inputs['password'] = input;
                        }}
                        />
                    </Item>
                    </InputGroup>
                    
             
            </View>
            <View style={styles.container}>
               {/* <ButtonSubmit 
                    onPress={this.login} 
                    onCheckEmail={this.checkEmailValidity.bind(this)}
                    text={'SE CONNECTER'}
               />*/}
                <Button rounded 
                    style={{backgroundColor : '#85B3D3', width: 0.9*DEVICE_WIDTH, justifyContent:'center', alignItems: 'center',marginLeft: 0.05*DEVICE_WIDTH}}
                    onPress={this.login}
                    >
                        <Text style={styles.text_button}>SE CONNECTER</Text>
                </Button>
            </View>
            <View style={styles.container_buttons}>
                <Button light rounded 
                    style={{width: 0.45*DEVICE_WIDTH, justifyContent:'center',marginRight: 5}}
                    onPress={this.goToRegister}
                    >
                        <Text style={styles.text_button}>Créer un compte</Text>
                </Button>
                <Button light rounded
                    style={{width: 0.45*DEVICE_WIDTH,  justifyContent:'center', marginLeft: 5}}
                    onPress={this.goToPasswordRecovery}
                >
                        <Text style={styles.text_button}>Identifiants</Text>
                </Button>
            </View>
           
            </ScrollView>
            </KeyboardAvoidingView>
        </View>
        ;

    
        return (
            //<SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
                {content}
                </View>
           
            //</SafeAreaView>
        );
  }


}


const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        //marginTop: STATUSBAR_HEIGHT,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    style_activityIndicator: {
      flex: 9,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: '#F5FCFF',
    },
    text: {
        color: 'aquamarine',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        marginTop: 20,
        fontSize: 40,
      },
    picture: {
          flex: 1,
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.25,
          position: "absolute",
          width: null,
          height: null,
          resizeMode: 'cover',
        },
    container_buttons: {
            flex: 1,
            paddingTop:30,
            paddingBottom: 60,
           // top: -95,
            // width: 0.2*DEVICE_WIDTH,
            flexDirection: 'row',
            justifyContent: 'center',
          },
    text_button: {
            color: 'black',
            backgroundColor: 'transparent',
            alignItems:'center',
            justifyContent:'center',
            fontSize: 14,
          },
  });

  const condition = authUser => !!authUser;
//const LoginForm = withNavigation(withFirebase(LoginFormBase));
const LoginForm = withNavigation(withFirebase(LoginFormBase));
export default Login2;
export { LoginForm };


const composed = compose(
  //withNavigation,
  //withFirebase,
  withAuthorization,
  
 );
 
 //export default HomeScreen;
 //export default hoistStatics(composed)(Login2);
 //export default withAuthorization(Login2);
