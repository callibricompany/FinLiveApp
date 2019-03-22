
import {
  ImageBackground,
  KeyboardAvoidingView,
  AsyncStorage,
  View,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { Thumbnail, Item,Container,Title, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button } from 'native-base';
import React, {Component} from 'react';
import ButtonSubmit from './ButtonSubmit'
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

      firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            this.setState({ loggedIn: true });
            console.log("USER FIREBASE : " + JSON.stringify(user.uid)) 
          } else {
            this.setState({ loggedIn: false });
          }
          
          console.log("LoggedIn : " + this.state.loggedIn) 
        });
        
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
        AsyncStorage.setItem('userToken', JSON.stringify(userData));
        //this.props.navigator.push({ component: Account });
        this.props.navigation.navigate('App');
      }
    ).catch((error) =>
        {
              this.setState({
                loading: false
              });
        alert('Erreur de connexion : '+error);
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


  //rajoute un bouton pour effacer l'input
    eraseInputText = (whichInput) => {
        this.typingInputText(whichInput, "");
    }


    typingInputText = (whichInput, text) =>{
        switch (whichInput) {
            case 'email':
                this.setState({email: text});
                break;
            case 'password':
                this.setState({password: text});
                break;            
            default:
              console.log('Ne trouve pas le bon input');
          }
    }

  //button premettant d'eefacer l'input
  renderEraseOnButton = (whichInput) => {
    return(
            <Icon name="close-circle" style={{color : 'black'}} onPress={() =>this.eraseInputText(whichInput)} />
         );
    }
  render() {
    console.log("RENDER" + this.state.loading)
    // A simple UI with a toolbar, and content below it.
    let eraseInputEmail = (this.state.email === '') ?  <Text /> : this.renderEraseOnButton('email') ;
    let eraseInputPassword = (this.state.password === '') ?  <Text /> : this.renderEraseOnButton('password') ;


    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    const content = this.state.loading ?
    <View style={styles.style_activityIndicator}>
    <ActivityIndicator size="large"/>
    </View> :
        <View style={{flex: 1}}>
            <ImageBackground
                style={styles.picture} 
                source={{uri: 'https://picsum.photos/g/400/600?random'}}
            >
            
            </ImageBackground>
            <View style={styles.container}>
                <Thumbnail large source={{uri: 'https://picsum.photos/80/120?random'}} />
                <View style={styles.container}>
                    <Button  style={{height:100, width:DEVICE_WIDTH-50, alignItems:'center',justifyContent:'center'}} dark>
                    <Text style={{color: 'aquamarine',fontWeight: 'bold',fontSize: 50,}}>FinLive</Text>
                    </Button>
                </View>
                <KeyboardAvoidingView behavior="padding" style={styles.container}>
                    <InputGroup>
                    <Item >
                        <Icon name="ios-mail" style={{color : 'black'}}/>
                        <Input
                        //onChangeText={(text) => this.setState({email: text})}
                        onChangeText={e => {this.typingInputText('email',e)}}
                        value={this.state.email.toLowerCase()}
                        keyboardType='email-address'
                        placeholder={"Adresse mail"} />
                        {eraseInputEmail}
                    </Item>
                    </InputGroup>
                
                    <InputGroup>
                        <Icon name="ios-unlock"  style={{color : 'black'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('password',e)}}
                        value={this.state.password}
                        secureTextEntry={true}
                        placeholder={"Mot de passe"} />
                        {eraseInputPassword}
                    </InputGroup>
                </KeyboardAvoidingView>
            {/*content*/}
            <ButtonSubmit onPress={this.login.bind(this)} onCheckEmail={this.checkEmailValidity.bind(this)}/>
            <View style={styles.container_buttons}>
                <Button light rounded 
                    style={{width: DEVICE_WIDTH/2 - 8, justifyContent:'center'}}
                    onPress={this.goToRegister}
                    >
                        <Text style={styles.text_button}>Créer un compte</Text>
                </Button>
                <Button light rounded
                    style={{width: DEVICE_WIDTH/2 -8,  justifyContent:'center'}}
                    onPress={this.goToPasswordRecovery}
                >
                        <Text style={styles.text_button}>Retrouver ses identifiants</Text>
                </Button>
            </View>
            </View>
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
        flex: 3,
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
            flex: 2,
           // top: -95,
             width: DEVICE_WIDTH,
            flexDirection: 'row',
            justifyContent: 'space-around',
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

