
import {
  ImageBackground,
  KeyboardAvoidingView,
  AsyncStorage,
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { Header, Item, CheckBox, Body, Content, List, ListItem, InputGroup, Input, Icon, Text, Picker, Button } from 'native-base';
import React, {Component} from 'react';
import ButtonSubmit from './ButtonSubmit'
import Dimensions from 'Dimensions';
import firebase from 'firebase'
import bgSrc from '../../assets/icon_1024.png';
import LogoComponent  from '../LogoComponent'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AntDesign from 'react-native-vector-icons/AntDesign';


// import Signup from './Signup';
//import Account from './Main'

const DEVICE_WIDTH = Dimensions.get('window').width;

class Register extends Component {

  constructor(props){
    super(props);
    // We have the same props as in our signup.js file and they serve the same purposes.
   
    this.state = {
      loading: true,
      name:'',
      firstname:'',
      phone:'',
      email: '',
      passwordVerif:'',
      password: '',
      organisme: '',
      loggedIn: false,
      isIndependant: true

    }
  }
  
  //connection a firebase
  componentWillMount () {
   /* this.setState({loading: true});
      firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            this.setState({ loggedIn: true });
            console.log("USER FIREBASE : " + JSON.stringify(user.email)) 
          } else {
            this.setState({ loggedIn: false });
          }
         
          console.log("LoggedIn : " + this.state.loggedIn) 
        });
        */
  }

  componentDidMount () {
    this.attends();
  }
  
  resolveAfter2Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 500);
    });
  }
  
  async attends() {
    var x = await this.resolveAfter2Seconds(10);
    console.log(x); // 10
    this.setState({loading: false});
  }

  //verif si email correct
  checkEmailValidity = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    if (reg.test(this.state.email) === true){
        return true;
    }
    return false;
  }

  //creation nouvel utilisateur
  register = () => {
    console.log("REGISTER : " + this.state.loading) 
    this.props.navigation.navigate('App');
    return false;
    this.setState({
      loading: true
    });

        this.setState({
                loading: false
              });
              this.props.navigation.navigate('App');
  }

    //coche s'il est independant
    checkIfIsIndependant = () => {
      this.setState({
        isIndependant: !this.state.isIndependant
      });
    }

    //selon independance, ou pas renseigner organisme de rattachement
    renderIsIndepenadant() {
      if (this.state.isIndependant) {
          return <Text />;
      }
      return (
        <InputGroup>
        <Item style={{width: 0.9*DEVICE_WIDTH}} >
        <Icon name="ios-people"  style={{color : '#9A9A9A'}}/>
        <Input
        onChangeText={e => {this.typingInputText('organisme',e)}}
        clearButtonMode="always"
        placeholder={"Organisme de rattachement"} />
       </Item>
       </InputGroup>
      );
  }

  //login a l ecran de login
  backToLogin = () => {
    this.props.navigation.navigate('Login');
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
            case 'passwordVerif':
                this.setState({passwordVerif: text});
                break;              
            case 'name':
                this.setState({name: text});
                break;
            case 'firstname':
                this.setState({firstname: text});
                break;
            case 'phone':
                this.setState({phone: text});
                break;
            case 'organisme':
                this.setState({organisme: text});
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
                source={bgSrc}
                resizeMode="center"
            />
            
   
         
           <Header style={{backgroundColor: 'transparent', borderBottomWidth: 0, height:200}}>
              <View style={[styles.container, {paddingTop:10} ]}>
                 
               <LogoComponent />
                  
              </View>
              </Header>
             
            <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>  
            <ScrollView keyboardShouldPersistTaps="always">
                <View style={[styles.container, {paddingTop:5}]}>
                <Text style={styles.text2}>Créer votre compte</Text>
                  <InputGroup>
                    <Item style={{width: 0.9*DEVICE_WIDTH}}>
                        <Icon name="ios-person" style={{color : '#9A9A9A'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('name',e)}}
                       // value={this.state.name}
                        clearButtonMode="always"
                        placeholder={"Prénom / Nom"} />
                       
                    </Item>
                  </InputGroup>  
                  
                  <InputGroup>
                    <Item style={{width: 0.9*DEVICE_WIDTH}}>
                    <Icon name="ios-phone-portrait" style={{color : '#9A9A9A'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('phone',e)}}
                        value={this.state.phone}
                        keyboardType='phone-pad'
                        clearButtonMode="always"
                        placeholder={"Téléphone"} />
                      
                    </Item>
                  </InputGroup>  
                  <InputGroup>
                    <Item>
                      <Button></Button>
                    </Item>
                  </InputGroup>              
                  <InputGroup>
                    <Item style={{width: 0.9*DEVICE_WIDTH}} >
                        <Icon name="ios-mail" style={{color : '#9A9A9A'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('email',e)}}
                        value={this.state.email.toLowerCase()}
                        keyboardType='email-address'
                        clearButtonMode="always"
                        placeholder={"Adresse mail"} />
                    </Item>
                  </InputGroup>
                
                  <InputGroup>
                  <Item style={{width: 0.9*DEVICE_WIDTH}} >
                        <Icon name="ios-unlock"  style={{color : '#9A9A9A'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('password',e)}}
                       // value={this.state.password}
                        secureTextEntry={true}
                        clearButtonMode="always"
                        placeholder={"Mot de passe"} />
                    </Item>
                  </InputGroup>
                  <InputGroup>
                  <Item style={{width: 0.9*DEVICE_WIDTH}} >
                        <Icon name="ios-unlock"  style={{color : '#9A9A9A'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('passwordVerif',e)}}
                        value={this.state.passwordVerif}
                        secureTextEntry={true}
                        clearButtonMode="always"
                        placeholder={"Confirmez votre mot de passe"} />
                  </Item>
                  </InputGroup>
                  <InputGroup>
                    <Item>
                      <Button></Button>
                    </Item>
                  </InputGroup> 
                     <InputGroup>
                     <ListItem style={{width: 0.9*DEVICE_WIDTH}} >
                        <Text style={{ color: 'black',}}>CGPI Indépendant  </Text>
                        <CheckBox 
                            checked={this.state.isIndependant} 
                            color="#9A9A9A"
                           onPress={this.checkIfIsIndependant.bind(this)}
                            />
                        </ListItem>
                      
              
                    </InputGroup>
                    {this.renderIsIndepenadant()}
                    <View style={styles.container_buttons}>
                      <ButtonSubmit 
                          onPress={this.register.bind(this)} 
                          onCheckEmail={this.checkEmailValidity.bind(this)}
                          text={'CREER SON COMPTE'}
                        />
                    </View>
               
                <View style={styles.container_buttons}>
                    
                    <Button light rounded 
                        style={{ justifyContent:'center'}}
                        onPress={this.backToLogin.bind(this)}
                        >
                        <Icon name="md-arrow-dropleft" style={{color : "#9A9A9A"}}/>                      
                            <Text style={styles.text_button}>Retour Connexion</Text>
                    </Button>
                    
                  </View>
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
  keyboardAvoidingView: {
    flex: 1,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
},
  container: {
        flex: 1,
        alignItems: 'center',
    //   justifyContent: 'center',
    },
    style_activityIndicator: {
      flex: 9,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: '#F5FCFF',
    },
    text2: {
        color: '#9A9A9A',
        backgroundColor: 'transparent',
        marginTop: 30,
        marginBottom: 30,
        fontSize: 25,
      },
    picture: {
          flex: 1,
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.05,
          position: "absolute",
          width: null,
          height: null,
          resizeMode: 'cover',
        },

    text_button: {
            color: '#9A9A9A',
            backgroundColor: 'transparent',
         //   alignItems:'center',
          //  justifyContent:'center',
            fontSize: 14,
          },
    container_buttons: {
           //flex: 1,
           paddingTop:30,
           // top: -95,
             width: 0.9*DEVICE_WIDTH,
            flexDirection: 'column',
           
           // justifyContent: 'center',
           // alignItems: 'flex-start', 
          },

  });


export default Register;

