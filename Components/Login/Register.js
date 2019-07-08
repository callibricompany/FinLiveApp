
import {
  ImageBackground,
  KeyboardAvoidingView,
  AsyncStorage,
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  Text
} from 'react-native';
import { Header, Item, CheckBox, Body, Content, List, ListItem, InputGroup, Input, Icon, Picker, Button } from 'native-base';
import React, {Component} from 'react';
import ButtonSubmit from './ButtonSubmit'
import Dimensions from 'Dimensions';
import firebase, { auth } from 'firebase'
import bgSrc from '../../assets/icon_1024.png';
import LogoComponent  from '../LogoComponent'

import { withFirebase } from '../../Database';
import { withNavigation } from 'react-navigation';

import { ssCreateUser } from '../../API/APIAWS';

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'



// import Signup from './Signup';
//import Account from './Main'

const DEVICE_WIDTH = Dimensions.get('window').width;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const Register = () => (
    
  <RegisterForm />

);

class RegisterFormBase extends Component {

  constructor(props){
    super(props);
    // We have the same props as in our signup.js file and they serve the same purposes.
   
    this.state = {
      loading: true,
      name:'',
      firstName:'',
      phone:'',
      email: '',
      passwordVerif:'',
      password: '',
      organization: '',
      company: '',
      loggedIn: false,
      isIndependant: true,
      idToken : ''

    }

    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};

    this.creationUserOk = false;
  }

  //focus next text input : putain de galere
  focusNextField = (id) => {
    //this.inputs[id].focus();
    this.inputs[id]._root.focus();
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
    //console.log(x); // 10
    this.setState({loading: false});
  }

  //verif si email correct
  checkEmailValidity = () => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    const phoneRegEx =  /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
 

    if (this.state.name.length < 2){
      Alert.alert('VERIFIER VOTRE NOM', 'Vérifiez votre nom');
      return false;
    }

    if (this.state.firstName.length < 2){
      Alert.alert('VERIFIER VOTRE PRENOM', 'Vérifiez votre prénom');
      return false;
    }
    if (this.state.organization.length < 2 && !this.state.isIndependant){
      Alert.alert('VERIFIER VOTRE ORGANISME', 'Vérifiez votre organisme de rattachement');
      return false;
    }

    if (phoneRegEx.test(this.state.phone) === false){
      Alert.alert('VERIFIER VOTRE NUMERO DE TELEPHONE', 'Le format de votre numéro de téléphone est invalide');
      return false;
    }
    if (reg.test(this.state.email) === false){
      Alert.alert('VERIFIER VOTRE EMAIL', 'Adresse mail non valide');
      return false;
    }

    if (this.state.company.length < 1 ){
      Alert.alert('VERIFIER LE NOM DE VOTRE SOCIETE', 'Le nom de votre société est invalide');
      return false;
    }

    if (this.state.password !== this.state.passwordVerif){
      Alert.alert('VERIFIER VOTRE MOT DE PASSE', 'Vous avez tapé 2 mots de passe différents');
      return false;
    }

    if (this.state.password.length < 6){
      Alert.alert('RESSAISISSEZ UN MOT DE PASSE', 'Il doit contenir au moins 6 caractères');
      return false;
    }

    return true;
  }


  onRegisterFail =  () => {

    Alert.alert('ERREUR CREATION DE COMPTE', 'error');
    console.log("erreur creation compte : " + error)
    this.setState({loggedIn : false, loading: false});
    this.creationUserOk = false;
    return false;
  }

  onRegisterSuccess() {
    this.setState({loggedIn : true, loading: false});
    this.creationUserOk = true;
    this.props.navigation.navigate('WaitingRoom');
    return true;
  }


  //creation nouvel utilisateur
   register =  () => {
    
    this.setState({loading: true});
    //this.checkEmailValidity();
    //firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    this.props.firebase
    .doCreateUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(authUser => {
      // Create a user in your Firebase realtime database
      //console.log(this.props.firebase.user(authUser.user.uid));
      /*return this.props.firebase
        .user(authUser.user.uid)
        .set({
          zohocode : '',
          email : this.state.email,
          name : this.state.name,
          firstName : this.state.firstName,
          validated : false,
          independant : this.state.isIndependant,
          organization : this.state.isIndependant ? '' : this.state.organisme,
          supervisor : false,
          expert : false,
          phone : this.state.phone
        });*/
    })
    .then(() => {
      console.log("DEMANDE ID TOKEN");
      this.props.firebase.doGetIdToken()
      .then(token => {
        console.log("REPONSE ID TOKEN"+token);
        //this.setState({ idToken : token});


        ssCreateUser(token, 
                        this.state.email, 
                        this.state.name, 
                        this.state.firstName, 
                        this.state.phone, 
                        this.state.isIndependant, 
                        this.state.company, 
                        this.state.organization).then((data) => {
          //console.log("USER CREE AVEC SUCCES DANS ZOHO");
          
          console.log("SUCCES CREATION USER");
          this.onRegisterSuccess();
        })
        .catch(error => {
          console.log("ERREUR CREATION USER: " + error);
          Alert.alert('ERREUR CREATION DE COMPTE', '' + error);
          this.props.navigation.navigate('WaitingRoom');
        }) 



      }).catch(function (error) {
        console.log(error);
        Alert.alert('ERREUR CREATION DE COMPTE', '' + error);
        this.props.navigation.navigate('WaitingRoom');
        });
    })
    .catch((error) =>{
      
      console.log("erreur creation compte : " + error);
      Alert.alert('ERREUR CREATION DE COMPTE', '' + error);
      this.props.navigation.navigate('WaitingRoom');
    })
    
    return this.creationUserOk;
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
        onChangeText={e => {this.typingInputText('organization',e)}}
        clearButtonMode="always"
        placeholder={"Organisme de rattachement"} 
        blurOnSubmit={ true }
        returnKeyType={ "done" }
        />
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
            case 'firstName':
                this.setState({firstName: text});
                break;
            case 'company':
                this.setState({company: text});
                break;
            case 'phone':
                this.setState({phone: text});
                break;
            case 'organization':
                this.setState({organization: text});
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
                  <InputGroup >
                    <Item style={{width: 0.9*DEVICE_WIDTH}}>
                        <Icon name="ios-person" style={{color : '#9A9A9A'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('name',e)}}
                       // value={this.state.name}
                        clearButtonMode="always"
                        placeholder={"Nom"}
                        blurOnSubmit={ false }
                        onSubmitEditing={() => {
                          this.focusNextField('firstName');
                        }}
                        returnKeyType={ "next" }
                        style={styles.textInput}
                        ref={ input => {
                          this.inputs['name'] = input;
                        }}
                         />
                    </Item>
                    </InputGroup>
                    <InputGroup>
                    <Item style={{width: 0.9*DEVICE_WIDTH}}>
                       <Icon name="ios-person" style={{color : '#9A9A9A'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('firstName',e)}}
                       // value={this.state.name}
                        clearButtonMode="always"
                        placeholder={"Prénom"} 
                        style={styles.textInput}
                        dataDetectorTypes={'phoneNumber'}
                        blurOnSubmit={ false }
                        onSubmitEditing={() => {
                          this.focusNextField('phone');
                        }}
                        returnKeyType={ "next" }
                        ref={ input => {
                          this.inputs['firstName'] = input;
                        }}
                        />
                     </Item>
            
                  </InputGroup>  
                  
                  <InputGroup>
                    <Item style={{width: 0.9*DEVICE_WIDTH}}>
                    <Icon name="ios-phone-portrait" style={{color : '#9A9A9A'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('phone',e)}}
                        value={this.state.phone}
                        mask={"+1 ([000]) [000] [00] [00]"}
                        keyboardType='phone-pad'
                        textContentType='telephoneNumber'
                        clearButtonMode="always"
                        placeholder={"Téléphone"} 
                        blurOnSubmit={ false }
                        onSubmitEditing={() => {
                          this.focusNextField('company');
                        }}
                        returnKeyType={ "next" }
                        ref={ input => {
                          this.inputs['phone'] = input;
                        }}
                        />
                      
                    </Item>
                  </InputGroup>  
                  <InputGroup>
                    <Item style={{width: 0.9*DEVICE_WIDTH}}>
                    <Icon name="md-star-outline" style={{color : '#9A9A9A'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('company',e)}}
                        value={this.state.company}
                        //keyboardType='phone-pad'
                        clearButtonMode="always"
                        placeholder={"Votre société"} 
                        blurOnSubmit={ false }
                        onSubmitEditing={() => {
                          this.focusNextField('email');
                        }}
                        returnKeyType={ "next" }
                        ref={ input => {
                          this.inputs['company'] = input;
                        }}
                        />
                      
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
                  <Item style={{width: 0.9*DEVICE_WIDTH}} >
                        <Icon name="ios-unlock"  style={{color : '#9A9A9A'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('password',e)}}
                       // value={this.state.password}
                        secureTextEntry={true}
                        clearButtonMode="always"
                        placeholder={"Mot de passe"} 
                        blurOnSubmit={ false }
                        onSubmitEditing={() => {
                          this.focusNextField('passwordVerif');
                        }}
                        returnKeyType={ "next" }
                        ref={ input => {
                          this.inputs['password'] = input;
                        }}
                        />
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
                        placeholder={"Confirmez votre mot de passe"}
                        blurOnSubmit={ true }
                        returnKeyType={ "done" }
                        ref={ input => {
                          this.inputs['passwordVerif'] = input;
                        }}
                        />
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
                        style={{ justifyContent:'center', marginBottom:50}}
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

        //console.log('statusBarHeight: ', StatusBar.currentHeight);
        return (
            <SafeAreaView style={{flex: 1,paddingTop : STATUSBAR_HEIGHT}}>
                   <StatusBar
                        barStyle="dark-content"
                        // dark-content, light-content and default
                        hidden={false}
                        //To hide statusBar
                        backgroundColor="#00BCD4"
                        //Background color of statusBar
                        translucent={false}
                        //allowing light, but not detailed shapes
                        networkActivityIndicatorVisible={true}
                      />
            <View style={{flex: 1}}>
                {content}
                </View>
            </SafeAreaView>
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
           paddingTop: 30,
           paddingBottom: 10,
           // top: -95,
             width: 0.9*DEVICE_WIDTH,
            flexDirection: 'column',
           
           // justifyContent: 'center',
           // alignItems: 'flex-start', 
          },

  });


  const RegisterForm = withNavigation(withFirebase(RegisterFormBase));

  export default Register;
  export { RegisterForm };

