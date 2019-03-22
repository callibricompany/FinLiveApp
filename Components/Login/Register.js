
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
      loading: false,
      name:'',
      firstname:'',
      phone:'',
      email: '',
      passwordVerif:'',
      password: '',
      loggedIn: false
    }
  }
  
  //connection a firebase
  componentWillMount () {
    this.setState({loading: true});
      firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            this.setState({ loggedIn: true });
            console.log("USER FIREBASE : " + JSON.stringify(user.email)) 
          } else {
            this.setState({ loggedIn: false });
          }
         
          console.log("LoggedIn : " + this.state.loggedIn) 
        });
        
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
    
    //if (reg.test(this.state.email) === true){
        return true;
    //}
    return false;
  }

  //login a la base firebase
  login = () => {
    console.log("LOGIN : " + this.state.loading) 
    this.setState({
      loading: true
    });

        this.setState({
                loading: false
              });
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
    
    // A simple UI with a toolbar, and content below it.
    let eraseInputEmail = (this.state.email === '') ?  <Text /> : this.renderEraseOnButton('email') ;
    let eraseInputPassword = (this.state.password === '') ?  <Text /> : this.renderEraseOnButton('password') ;
    let eraseInputName = (this.state.name === '') ?  <Text /> : this.renderEraseOnButton('name') ;
    let eraseInputFirstName = (this.state.firstname === '') ?  <Text /> : this.renderEraseOnButton('firstname') ;
    let eraseInputPhone = (this.state.phone === '') ?  <Text /> : this.renderEraseOnButton('phone') ;
    let eraseInputPasswordVerif = (this.state.passwordVerif === '') ?  <Text /> : this.renderEraseOnButton('passwordVerif') ;


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
         
           <Header style={{backgroundColor: 'transparent', borderBottomWidth: 0, height:170}}>
              <View style={[styles.container, {paddingTop:10} ]}>
                 
                  <Button  style={{height:100, width:DEVICE_WIDTH-50, alignItems:'center',justifyContent:'center'}} dark>
                    <Text style={{color: 'aquamarine',fontWeight: 'bold',fontSize: 50,}}>FinLive</Text>
                  </Button>
                  
              </View>
              </Header>
             
            <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>  
            <ScrollView keyboardShouldPersistTaps="always">
                <View style={[styles.container, {paddingTop:5}]}>
                <Text style={styles.text2}>Créer votre compte</Text>
                  <InputGroup>
                    <Item >
                        <Icon name="ios-person" style={{color : 'black'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('name',e)}}
                        value={this.state.name}
                        placeholder={"Nom"} />
                        {eraseInputName}
                    </Item>
                  </InputGroup>  
                  <InputGroup>
                    <Item >
                    <Icon name="ios-arrow-forward" style={{color : 'black'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('firstname',e)}}
                        value={this.state.firstname}
                        placeholder={"Prénom"} />
                        {eraseInputFirstName}
                    </Item>
                  </InputGroup>  
                  <InputGroup>
                    <Item >
                    <Icon name="ios-phone-portrait" style={{color : 'black'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('phone',e)}}
                        value={this.state.phone}
                        keyboardType='phone-pad'
                        placeholder={"Téléphone"} />
                        {eraseInputPhone}
                    </Item>
                  </InputGroup>  
                  <InputGroup>
                    <Item>
                      <Button></Button>
                    </Item>
                  </InputGroup>              
                  <InputGroup>
                    <Item >
                        <Icon name="ios-mail" style={{color : 'black'}}/>
                        <Input
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
                  <InputGroup>
                        <Icon name="ios-unlock"  style={{color : 'black'}}/>
                        <Input
                        onChangeText={e => {this.typingInputText('passwordVerif',e)}}
                        value={this.state.passwordVerif}
                        secureTextEntry={true}
                        placeholder={"Confirmez votre mot de passe"} />
                        {eraseInputPasswordVerif}
                  </InputGroup>
                  <InputGroup>
                    <Item>
                      <Button></Button>
                    </Item>
                  </InputGroup> 
                     <InputGroup>
                     
                        <Text>CGPI Indépendant</Text>
                      
                      <CheckBox checked={false} />
              
                    </InputGroup>
                    <InputGroup style={{paddingTop: 35}}>
                    <ButtonSubmit onPress={this.login.bind(this)} onCheckEmail={this.checkEmailValidity.bind(this)}/>
                    </InputGroup>
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
        justifyContent: 'center',
    },
    style_activityIndicator: {
      flex: 9,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: '#F5FCFF',
    },
    text2: {
        color: 'black',
        backgroundColor: 'transparent',
        marginTop: 10,
        fontSize: 25,
      },
    picture: {
          flex: 1,
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.15,
          position: "absolute",
          width: null,
          height: null,
          resizeMode: 'cover',
        },
    container_buttons: {
            flex: 1,
            top: 0,
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


export default Register;

