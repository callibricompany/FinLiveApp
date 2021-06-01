
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
  Text,
  Image,
  Keyboard,
  Dimensions
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import FontAwesome5  from 'react-native-vector-icons/FontAwesome5';

import logoImg from '../../assets/LogoWithoutText.png'
import React from 'react';
import ButtonSubmit from './ButtonSubmit'

import { setColor, setFont } from '../../Styles/globalStyle';
import { isAndroid, sizeByDevice , getConstant } from '../../Utils';

import splashImage from '../../assets/LogoWithoutText.png';

import { withFirebase } from '../../Database';
import { withNavigation } from 'react-navigation';

import { ssCreateUser } from '../../API/APIAWS';





// import Signup from './Signup';
//import Account from './Main'





const Register = () => (
    
  <RegisterForm />

);

class RegisterFormBase extends React.Component {

  constructor(props){
    super(props);
    // We have the same props as in our signup.js file and they serve the same purposes.
   
    this.state = {
      loading: false,
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
    this.inputs[id].focus();
    //this.inputs[id]._root.focus();
  }


  componentDidMount () {

    //this.attends();
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
    // if (this.state.organization.length < 2 && !this.state.isIndependant){
    //   Alert.alert('VERIFIER VOTRE ORGANISME', 'Vérifiez votre organisme de rattachement');
    //   return false;
    // }

    // if (phoneRegEx.test(this.state.phone) === false){
    //   Alert.alert('VERIFIER VOTRE NUMERO DE TELEPHONE', 'Le format de votre numéro de téléphone est invalide');
    //   return false;
    // }
    if (reg.test(this.state.email) === false){
      Alert.alert('VERIFIER VOTRE EMAIL', 'Adresse mail non valide');
      return false;
    }

    // if (this.state.company.length < 1 ){
    //   Alert.alert('VERIFIER LE NOM DE VOTRE SOCIETE', 'Le nom de votre société est invalide');
    //   return false;
    // }

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


  onRegisterFail(error) {

    
    console.log("erreur creation compte : " + error)
    this.setState({loggedIn : false, loading: false});

    setTimeout(() => {
      Alert.alert('Erreur','ERREUR CREATION DE COMPTE');
      }, 1000);
    this.creationUserOk = false;
    return false;
  }

  onRegisterSuccess() {
    this.setState({loggedIn : true, loading: false});
    this.creationUserOk = true;
    this.props.navigation.navigate('Login');
    return true;
  }


  //creation nouvel utilisateur
   register () {
    
    this.setState({loading: true});
    //this.checkEmailValidity();
    //firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)

    this.props.firebase.doCreateUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(authUser => {

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
          this.onRegisterFail(error);
        }) 



      }).catch(function (error) {
        this.onRegisterFail(error);
        });
    })
    .catch((error) =>{
      this.onRegisterFail(error);
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
      //   <InputGroup>
      //   <Item style={{width: 0.9*getConstant('width')}} >
      //   <Icon name="ios-people"  style={{color : setColor('')}}/>
      //   <Input
      //   onChangeText={e => {this.typingInputText('organization',e)}}
      //   clearButtonMode="always"
      //   placeholder={"Organisme de rattachement"} 
      //   blurOnSubmit={ true }
      //   returnKeyType={ "done" }
      //   />
      //  </Item>
      //  </InputGroup>
      <View />
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
            // <Icon name="close-circle" style={{color : setColor('')}} onPress={() =>this.eraseInputText(whichInput)} />
            <View />
         );
    }
  render() {
    


    // The content of the screen should be inputs for a username, password and submit button.
    // If we are loading then we display an ActivityIndicator.
    if (this.state.loading) {
      return (
        <View style={styles.style_activityIndicator}>
          <ActivityIndicator size="large"/>
        </View>
      );
    }
    return (
      <SafeAreaView style={{flex: 1,paddingTop : getConstant('statusBar')}}>
        {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flexDirection :'column', flex: 1}}>
                 
            <Image style={styles.picture}  source={splashImage} />
                  
          
             
            <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>  
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
               <Text style={styles.text2}>Créer votre compte</Text>
            </View>
            <ScrollView keyboardShouldPersistTaps="always">
                <View style={[styles.container, {paddingTop:5}]}>
                
                  <InputGroup >
                    <Item style={{width: 0.9*getConstant('width')}}>
                        <Icon name="ios-person" style={{color : setColor('')}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('name',e)}}
                       // value={this.state.name}
                        clearButtonMode="always"
                        placeholder={"Nom"}
                        blurOnSubmit={ false }
                        onSubmitEditing={() => {
                          this.focusNextField('firstName');
                        }}
                        autoCompleteType={'name'}
                        returnKeyType={ "next" }
                        style={styles.textInput}
                        ref={ input => {
                          this.inputs['name'] = input;
                        }}
                         />
                    </Item>
                    </InputGroup>
                    <InputGroup>
                    <Item style={{width: 0.9*getConstant('width')}}>
                       <Icon name="ios-person" style={{color : setColor('')}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('firstName',e)}}
                       // value={this.state.name}
                        clearButtonMode="always"
                        placeholder={"Prénom"} 
                        style={styles.textInput}
                        //dataDetectorTypes={'all'}
                        blurOnSubmit={ false }
                        autoCompleteType={'name'}
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
                    <Item style={{width: 0.9*getConstant('width')}}>
                    <Icon name="ios-phone-portrait" style={{color : setColor('')}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('phone',e)}}
                        value={this.state.phone}
                        mask={"+1 ([000]) [000] [00] [00]"}
                        keyboardType='phone-pad'
                        textContentType='telephoneNumber'
                        clearButtonMode="always"
                        placeholder={"Téléphone"} 
                        blurOnSubmit={ false }
                        autoCompleteType={'tel'}
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
                    <Item style={{width: 0.9*getConstant('width')}}>
                    <Icon name="md-star-outline" style={{color : setColor('')}}/>
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
                    <Item style={{width: 0.9*getConstant('width')}} >
                        <Icon name="ios-mail" style={{color : setColor('')}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('email',e)}}
                        value={this.state.email.toLowerCase()}
                        keyboardType='email-address'
                        clearButtonMode="always"
                        placeholder={"Adresse mail"} 
                        blurOnSubmit={ false }
                        autoCapitalize={'none'}
                        autoCompleteType={'email'}
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
                  <Item style={{width: 0.9*getConstant('width')}} >
                        <Icon name="ios-unlock"  style={{color : setColor('')}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('password',e)}}
                       // value={this.state.password}
                        secureTextEntry={true}
                        clearButtonMode="always"
                        placeholder={"Mot de passe"} 
                        blurOnSubmit={ false }
                        autoCapitalize={'none'}
                        autoCompleteType={'password'}
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
                  <Item style={{width: 0.9*getConstant('width')}} >
                        <Icon name="ios-unlock"  style={{color : setColor('')}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('passwordVerif',e)}}
                        value={this.state.passwordVerif}
                        secureTextEntry={true}
                        clearButtonMode="always"
                        placeholder={"Confirmez votre mot de passe"}
                        blurOnSubmit={ true }
                        autoCapitalize={'none'}
                        autoCompleteType={'password'}
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
                     <ListItem style={{width: 0.9*getConstant('width')}} >
                        <Text style={{ color: setColor(''),}}>CGPI Indépendant  </Text>
                        <CheckBox 
                            checked={this.state.isIndependant} 
                            color={setColor('')}
                            onPress={this.checkIfIsIndependant.bind(this)}
                            />
                        </ListItem>
                      
              
                    </InputGroup>
                    {this.renderIsIndepenadant()}

                      <TouchableOpacity  
                            style={{backgroundColor : setColor(), justifyContent:'center', alignItems: 'center', marginTop: 30, borderRadius: 10}}
                            onPress={this.register.bind(this)}
                      >
                              <Text style={[setFont('600', 18, 'white', 'Regular'), {padding: 5, paddingHorizontal : 20}]}>CREER SON COMPTE</Text>
                      </TouchableOpacity>


               
                <View style={styles.container_buttons}>
                    
                    <Button light  
                        style={{ justifyContent:'center', marginBottom:50, width : getConstant('width')/2}}
                        onPress={this.backToLogin.bind(this)}
                        >
                        <Icon name="md-arrow-dropleft" style={{color : setColor('')}}/>                      
                            <Text style={styles.text_button}>Retour Connexion</Text>
                    </Button>
                    
                  </View>
            </View>               

            
                </ScrollView>
            </KeyboardAvoidingView>
           
        </View>
        </TouchableWithoutFeedback>
        */}
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{width: getConstant('width')*0.9, marginLeft:0.05*getConstant('width'), height: getConstant('height'), flexDirection: 'column', justifyContent:'flex-start',alignItems: 'center', borderWidth: 0}}>
          <View style={{ marginTop : sizeByDevice(25, 10, 0), zIndex: 99, borderWidth :0}}>
            <Image
              source={logoImg}
              style={{  opacity: this.state.isOnFocus ? 0.1 : 0.3,
                        //position: "absolute",
                        width: getConstant('width'),
                        height: getConstant('height')*0.25,
                        resizeMode: 'contain'
                }}
              resizeMode="contain"
            />
          </View>
          <KeyboardAvoidingView behavior={'padding'} style={{  width: 0.9*getConstant('width')}} enabled={true}>  
            <ScrollView keyboardShouldPersistTaps={"always"}>
            <View style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor : setColor('gray')}}>
                  <View style={{padding : 5, width : 35}}>
                        <Ionicons name="md-person" style={{color : setColor('lightBlue')}} size={25}/>
                  </View>
                  <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'space-evenly', paddingLeft: 5}}>
                    <TextInput
                        onChangeText={e => {this.setState({ firstName: e })}}
                        //value={this.state.password}
                        onBlur={() => {
                          this.setState({ isOnFocus: false });
                        }}
                        onFocus={() => {
                          this.setState({ isOnFocus : true });
                        }}
                        clearButtonMode={'while-editing'}
                        //secureTextEntry={true}
                        clearButtonMode={"always"}
                        placeholder={"Prénom"} 
                        autoCapitalize={'none'}
                        autoCompleteType={'name'}
                        onSubmitEditing={() => this.focusNextField('name')}
                        blurOnSubmit={ true }
                        returnKeyType={ "next" }
                        ref={ input => {
                          this.inputs['firsname'] = input;
                        }}
                        />
                  </View>
                </View>

                <View style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor : setColor('gray')}}>
                  <View style={{padding : 5, width : 35}}>
                        <Ionicons name="md-person" style={{color : setColor('lightBlue')}} size={25}/>
                  </View>
                  <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'space-evenly', paddingLeft: 5}}>
                    <TextInput
                        onChangeText={e => {this.setState({ name: e })}}
                        //value={this.state.password}
                        onBlur={() => {
                          this.setState({ isOnFocus: false });
                        }}
                        onFocus={() => {
                          this.setState({ isOnFocus : true });
                        }}
                        clearButtonMode={'while-editing'}
                        //secureTextEntry={true}
                        clearButtonMode={"always"}
                        placeholder={"Nom"} 
                        autoCapitalize={'none'}
                        autoCompleteType={'name'}
                        onSubmitEditing={() => this.focusNextField('email')}
                        blurOnSubmit={ true }
                        returnKeyType={ "next" }
                        ref={ input => {
                          this.inputs['name'] = input;
                        }}
                        />
                  </View>
                </View>


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
                          placeholder={"Adresse mail"} 
                          clearButtonMode={'while-editing'}
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
                        clearButtonMode={'while-editing'}
                        secureTextEntry={true}
                        clearButtonMode={"always"}
                        placeholder={"Mot de passe"} 
                        autoCapitalize={'none'}
                        autoCompleteType={'password'}
                        onSubmitEditing={() => this.focusNextField('passwordVerif')}
                        blurOnSubmit={ true }
                        returnKeyType={ "done" }
                        ref={ input => {
                          this.inputs['password'] = input;
                        }}
                        />
                  </View>
                </View>

                <View style={{flexDirection: 'row', borderBottomWidth: 1, borderBottomColor : setColor('gray')}}>
                  <View style={{padding : 5, width : 35,height : 35}}>
                  {/* <FontAwesome5 name="unlock-alt" style={{color : setColor('lightBlue')}} size={25}/> */}
                  </View>
                  <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'space-evenly', paddingLeft: 5}}>
                    <TextInput
                        onChangeText={e => {this.setState({ passwordVerif: e })}}
                        //value={this.state.password}
                        onBlur={() => {
                          this.setState({ isOnFocus: false });
                        }}
                        onFocus={() => {
                          this.setState({ isOnFocus : true });
                        }}
                        clearButtonMode={'while-editing'}
                        secureTextEntry={true}
                        clearButtonMode={"always"}
                        placeholder={"Confirmez votre mot de passe"} 
                        autoCapitalize={'none'}
                        autoCompleteType={'password'}
                        //onSubmitEditing={() => this.login()}
                        blurOnSubmit={ true }
                        returnKeyType={ "done" }
                        ref={ input => {
                          this.inputs['passwordVerif'] = input;
                        }}
                        />
                  </View>
                </View>
            
                <TouchableOpacity  
                  style={{backgroundColor : setColor(), justifyContent:'center', alignItems: 'center', marginTop: 30, borderRadius: 10}}
                  onPress={() => {
                    if (!this.checkEmailValidity()) {
                      return;
                    }
                    this.register();
                  }}
                  >
                      <Text style={[setFont('600', 18, 'white', 'Regular'), {padding: 5}]}>Créer son compte</Text>
                </TouchableOpacity>
                <TouchableOpacity  
                  style={{borderColor : setColor(''), justifyContent:'center', alignItems: 'center', marginTop: 15, borderRadius: 10, borderWidth : 1}}
                  onPress={()  => this.props.navigation.navigate('Login')}
                  >
                      <Text style={[setFont('600', 18, setColor(''), 'Regular'), {padding: 5}]}>Retour</Text>
                </TouchableOpacity>

          

            </ScrollView>
            </KeyboardAvoidingView>
        </View>
        </TouchableWithoutFeedback>
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
        color: setColor(''),
        backgroundColor: 'transparent',
        marginTop: 30,
        marginBottom: 30,
        fontSize: 25,
      },
    picture: {
          //lex: 1,
          top: getConstant('height')/5, left: 0, right: 0, bottom: 0,
          opacity: 0.05,
          position: "absolute",
          width: getConstant('width'),
          height: 4*getConstant('height')/5,
          resizeMode: 'cover',
        },

    text_button: {
            color: setColor(''),
            backgroundColor: 'transparent',
         //   alignItems:'center',
          //  justifyContent:'center',
            fontSize: 14,
          },
    container_buttons: {
           //flex: 1,
           paddingTop: 30,
           paddingBottom: 10,
           marginBottom: 40,
           // top: -95,
             width: 0.9*getConstant('width'),
            flexDirection: 'column',
            
           
           // justifyContent: 'center',
           // alignItems: 'flex-start', 
          },

  });


  const RegisterForm = withNavigation(withFirebase(RegisterFormBase));

  export default Register;
  export { RegisterForm };

