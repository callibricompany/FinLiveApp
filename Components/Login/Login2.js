
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  Text,
  TextInput,
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5  from 'react-native-vector-icons/FontAwesome5';

import React from 'react';


import { withFirebase } from '../../Database';
import { withNavigation } from 'react-navigation';
import { withAuthorization } from '../../Session';
import { withUser } from '../../Session/withAuthentication';
import { ifIphoneX, getConstant, isAndroid, sizeByDevice } from '../../Utils/';

import { compose, hoistStatics } from 'recompose';

import logoImg from '../../assets/LogoWithoutText.png'
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler';
import { setFont, setColor } from '../../Styles/globalStyle';

// import Signup from './Signup';
//import Account from './Main'







class LoginFormBase extends React.Component {

  constructor(props){
    super(props);
    // We have the same props as in our signup.js file and they serve the same purposes.
    this.emailVerified = this.props.navigation.getParam('emailVerified', false);
    this.state = {
      loading: false,
      email: '',
      password: '',
      loggedIn: false,
      isOnFocus : false
    }

    this.inputs = {};
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
            //if (!userData.validated) {
            //  this.props.navigation.navigate('WaitingRoom'); 
            //} else {
              userData.admin ? this.props.navigation.navigate('AppAdmin') : this.props.navigation.navigate('App');
            //}
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

    if (this.state.loading) {
      return (
        <View style={styles.style_activityIndicator}>
        <ActivityIndicator size="large"/>
        </View>
        );
    }

  
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{width: getConstant('width')*0.9, marginLeft:0.05*getConstant('width'), height: getConstant('height'), flexDirection: 'column', justifyContent:'center',alignItems: 'center', borderWidth: 0}}>
          <View style={{flex :0.35, marginTop : sizeByDevice(45, 10, 0), zIndex: 99, borderWidth :0}}>
            <Image
              source={logoImg}
              style={{  opacity: this.state.isOnFocus ? 0.1 : 0.3,
                        //position: "absolute",
                        width: getConstant('width'),
                        height: getConstant('height')*0.35,
                        resizeMode: 'contain'
                }}
              resizeMode="contain"
            />
          </View>
          <KeyboardAvoidingView behavior={'padding'} style={{ flex: 0.65 , width: 0.9*getConstant('width')}} enabled={true}>  
            <ScrollView keyboardShouldPersistTaps={"always"}>
                <View style={{flexDirection: 'row', marginTop: 25, borderBottomWidth: 1, borderBottomColor : setColor('gray')}} >
                  <View style={{padding : 5, width : 35}}>
                        <Ionicons name="ios-mail"  style={{color : setColor('lightBlue')}} size={25}/>
                  </View>
                  <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'space-evenly', paddingLeft : 5}}>
                        <TextInput
                          //onChangeText={(text) => this.setState({email: text})}
                          onChangeText={e => {
                            //let email = String(e).toLocaleLowerCase();
                            this.setState({ email : e});
                          }}
                          value={this.state.email}
                          keyboardType='email-address'
                          clearButtonMode="always"
                          placeholder={"Adresse mail"} 
                          
                          blurOnSubmit={ false }
                          onBlur={() => {
                            //console.log(this.state.email);
                            this.setState({ email: this.state.email.toLowerCase(), isOnFocus: false });
                          }}
                          onFocus={() => {
                            this.setState({ isOnFocus : true });
                            //console.log("focus");
                          }}
                          autoCapitalize={'none'}
                          autoCompleteType={'email'}
                          onSubmitEditing={() => {
                            this.inputs['password'].focus();
                          }}
                          returnKeyType={ "next" }
                          ref={ input => {
                            this.inputs['email'] = input;
                          }}
                          //style={setFont('400', 14, 'black', 'Regular')}
                        />
                        
                  </View>
                </View>
                <View style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor : setColor('gray')}}>
                  <View style={{padding : 5, width : 35}}>
                        <FontAwesome5 name="unlock-alt" style={{color : setColor('lightBlue')}} size={25}/>
                  </View>
                  <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'space-evenly', paddingLeft: 5}}>
                    <TextInput
                        onChangeText={e => {this.setState({ password: e })}}
                        //value={this.state.password}
                        onBlur={() => {
                          this.setState({ isOnFocus: false });
                        }}
                        onFocus={() => {
                          this.setState({ isOnFocus : true });
                        }}
                        secureTextEntry={true}
                        clearButtonMode={"always"}
                        placeholder={"Mot de passe"} 
                        autoCapitalize={'none'}
                        autoCompleteType={'password'}
                        //onSubmitEditing={() => this.login()}
                        blurOnSubmit={ true }
                        returnKeyType={ "done" }
                        ref={ input => {
                          this.inputs['password'] = input;
                        }}
                        />
                  </View>
                </View>
            
                <TouchableOpacity  
                  style={{backgroundColor : setColor(), justifyContent:'center', alignItems: 'center', marginTop: 30, borderRadius: 10}}
                  onPress={this.login}
                  >
                      <Text style={[setFont('600', 18, 'white', 'Regular'), {padding: 5}]}>Connexion</Text>
                </TouchableOpacity>
                <TouchableOpacity  
                  style={{borderColor : setColor(''), justifyContent:'center', alignItems: 'center', marginTop: 15, borderRadius: 10, borderWidth : 1}}
                  onPress={this.goToRegister}
                  >
                      <Text style={[setFont('600', 18, setColor(''), 'Regular'), {padding: 5}]}>Créer un compte</Text>
                </TouchableOpacity>
                <TouchableOpacity  
                  style={{borderColor : setColor(''), justifyContent:'center', alignItems: 'center', marginTop: 15, borderRadius: 10, borderWidth : 1}}
                  onPress={this.goToPasswordRecovery}
                  >
                      <Text style={[setFont('600', 18, setColor(''), 'Regular'), {padding: 5}]}>Mot de passe oublié</Text>
                </TouchableOpacity>
          

            </ScrollView>
            </KeyboardAvoidingView>
        </View>
        </TouchableWithoutFeedback>
    );

  }


}


const styles = StyleSheet.create({

    style_activityIndicator: {
      flex: 9,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: '#F5FCFF',
    },

  });

  const condition = authUser => !!authUser;

  const composedPricerScreen = compose(
   withAuthorization(condition),
    withUser,
    withNavigation,
  );
  
  //export default HomeScreen;
  export default hoistStatics(composedPricerScreen)(LoginFormBase);

