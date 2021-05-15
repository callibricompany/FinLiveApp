
import {
  ImageBackground,
  KeyboardAvoidingView,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { sendEmail } from '../../Utils/sendEmail';
import { getConstant, sizeByDevice } from '../../Utils';
import splashImage from '../../assets/LogoWithoutText.png';
import logoImg from '../../assets/LogoWithoutText.png'
import { setFont, setColor } from '../../Styles/globalStyle';
import { compose, hoistStatics } from 'recompose';
import { withNavigation } from 'react-navigation';
import { withFirebase } from '../../Database';

class WaitingValidationScreen extends React.Component {

  constructor(props){
    super(props);
    
    this.state = {
      loading: false,
      email: '',
      isOnFocus : false
    }

    this.inputs = {};
    this.name = this.props.navigation.getParam('name', '');
    this.firstName = this.props.navigation.getParam('firstName', '');
  }
  








  render() {

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
                            //this.inputs['password'].focus();
                          }}
                          returnKeyType={ "next" }
                          ref={ input => {
                            this.inputs['email'] = input;
                          }}
                          style={setFont('400', 14, 'black', 'Regular')}
                        />
                        
                  </View>
                </View>
                
            
                <TouchableOpacity  
                  style={{backgroundColor : setColor(), justifyContent:'center', alignItems: 'center', marginTop: 30, borderRadius: 10}}
				  onPress={() => {
					const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
					if (reg.test(this.state.email) === false){
						Alert.alert('VERIFIER VOTRE EMAIL', 'Adresse mail non valide');
						return false;
					}
					this.props.firebase.doPasswordReset(this.state.email)
					.then((authUser) => {
						Alert.alert('Email de réinitialisation de mot  de passe envoyé');
						
						this.props.navigation.navigate('Login');
					

					})
					.catch((error) => {
							//console.log("erreur connexio n signIn : " + error);

							Alert.alert('ERREUR DE DEMANDE DE REINITIALISATION',  ''+ error);
	
					});
			  }}
                  >
                      <Text style={[setFont('600', 18, 'white', 'Regular'), {padding: 5}]}>Réinitialiser le mot de passe</Text>
                </TouchableOpacity>
                <TouchableOpacity  
                      style={{borderColor : setColor(''), justifyContent:'center', alignItems: 'center', marginTop: 15, borderRadius: 10, borderWidth : 1}}
					  onPress={() => {
						this.props.navigation.navigate('Login');
					  }}
                  >
                      <Text style={[setFont('600', 18, setColor(''), 'Regular'), {padding: 5}]}>Retour</Text>
                </TouchableOpacity>

          

            </ScrollView>
            </KeyboardAvoidingView>
        </View>
        </TouchableWithoutFeedback>
    );
  }


}


const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        width: 0.9*getConstant('width'), 

        flex: 1,
        flexDirection : 'column',
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
          top: getConstant('height')/5, left: 0, right: 0, bottom: 0,
          opacity: 0.05,
          position: "absolute",
          width: getConstant('width'),
          height: 4*getConstant('height')/5,
          resizeMode: 'cover',
        },
    container_buttons: {
            flex: 1,
            paddingTop:30,
            paddingBottom: 60,
           // top: -95,
            // width: 0.2*getConstant('width'),
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems : 'center',
          },
    text_button: {
            color: 'black',
            backgroundColor: 'transparent',
            alignItems:'center',
            justifyContent:'center',
            fontSize: 14,
          },
  });

//const condition = authUser => !!authUser;

const composedPricerScreen = compose(
 //withAuthorization(condition),
  //withUser,
  withFirebase,
  withNavigation,
);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(WaitingValidationScreen);


