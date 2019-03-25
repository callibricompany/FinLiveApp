
import {
  ImageBackground,
  KeyboardAvoidingView,
  AsyncStorage,
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { Thumbnail, Item,Body,Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button } from 'native-base';
import React, {Component} from 'react';
import ButtonSubmit from './ButtonSubmit'
import LogoComponent  from '../LogoComponent'
import Dimensions from 'Dimensions';
import firebase from 'firebase'


// import Signup from './Signup';
//import Account from './Main'

const DEVICE_WIDTH = Dimensions.get('window').width;

class Login extends Component {

  constructor(props){
    super(props);
    // We have the same props as in our signup.js file and they serve the same purposes.
   
    this.state = {
      loading: false,
      email: '',
      password: '',
      loggedIn: false
    }
  }
  
  //connection a firebase
  componentWillMount () {

    /*  firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            this.setState({ loggedIn: true });
            console.log("USER FIREBASE : " + JSON.stringify(user.uid)) 
          } else {
            this.setState({ loggedIn: false });
          }
          
          console.log("LoggedIn : " + this.state.loggedIn) 
        });
      */  
  }

  //verif si email correct
  checkEmailValidity = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    if (reg.test(this.state.email) === true){
        return true;
    }
    return false;
  }

  //login a la base firebase
  login = () => {
    console.log("LOGIN : " + this.state.loading) 
    this.setState({
      loading: true
    });
    //this.props.navigation.navigate('App');
    // Log in and display an alert to tell the user what happened.
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password
    ).then((userData) =>
      {
        this.setState({
                loading: false
              });
        console.log(userData.user.uid);
        console.log(userData.user.email);

        AsyncStorage.setItem('userToken', userData.user.uid);
        AsyncStorage.setItem('userEmail', userData.user.email);
        //this.props.navigator.push({ component: Account });
        
        this.props.navigation.navigate('App');
        return true;
      }
    ).catch((error) =>
        {
              this.setState({
                loading: false
              });
        alert(error);
        return false;
    });
  }

  // Go to the signup page
  goToRegister = () => {
    //this.props.navigator.push({component: Signup});
    this.props.navigation.navigate('Register');
  }

  // Go to the signup page
  goToPasswordRecovery = () => {
    //this.props.navigator.push({component: Signup});
    this.props.navigation.navigate('App');
  }



  render() {
    console.log("RENDER LOGIN : " + this.state.loading)
 

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
                        onChangeText={e => {this.setState({ email: e.toLowerCase() })}}
                        value={this.state.email}
                        keyboardType='email-address'
                        clearButtonMode="always"
                        placeholder={"Adresse mail"} />
                        
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
                        onSubmitEditing={() => this.login()}
                        />
                    </Item>
                    </InputGroup>
                    
             
            </View>
            <View style={styles.container}>
                <ButtonSubmit 
                    onPress={this.login.bind(this)} 
                    onCheckEmail={this.checkEmailValidity.bind(this)}
                    text={'SE CONNECTER'}
                />
            </View>
            <View style={styles.container_buttons}>
                <Button light rounded 
                    style={{width: 0.45*DEVICE_WIDTH, justifyContent:'center'}}
                    onPress={this.goToRegister}
                    >
                        <Text style={styles.text_button}>Créer un compte</Text>
                </Button>
                <Button light rounded
                    style={{width: 0.45*DEVICE_WIDTH,  justifyContent:'center'}}
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

//AppRegistry.registerComponent('Login', () => Login);
export default Login;

