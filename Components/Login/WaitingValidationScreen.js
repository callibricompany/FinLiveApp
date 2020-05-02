
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
  Image,
  Text,
  Dimensions
} from 'react-native';
import { H1, Item,Body,Title, Content, List, ListItem, InputGroup, Input, Icon, Picker, Button } from 'native-base';
import React, {Component} from 'react';
import { sendEmail } from '../../Utils/sendEmail';
import { getConstant } from '../../Utils';
import splashImage from '../../assets/LogoWithoutText.png';





// import Signup from './Signup';
//import Account from './Main'





class WaitingValidationScreen extends Component {

  constructor(props){
    super(props);

    this.name = this.props.navigation.getParam('name', '');
    this.firstName = this.props.navigation.getParam('firstName', '');
  }
  



  // Go to the signup page
  goToLogin = () => {
    //this.props.navigator.push({component: Signup});
    this.props.navigation.navigate('Login');
  }





  render() {

    const content =    <View style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
            <Image style={styles.picture} source={splashImage} />
            
     
            <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>  
            <ScrollView keyboardShouldPersistTaps="always" >
 

            <View style={styles.container}>
            <Button bordered warning  style={{flew:1, height: 60, width: 0.9*getConstant('width'),  marginBottom: 50, justifyContent:'center', alignItems:'center'}}>
            <Text numberOfLines={3} >Bonjour {this.firstName} {this.name}{"\n\n\n"}Votre compte est en cours de validation</Text>
          </Button>
            
                <Button 
                    style={{backgroundColor : '#85B3D3', width: 0.9*getConstant('width'), justifyContent:'center', alignItems: 'center'}}
                    onPress={() => {
                        sendEmail(
                          'pierre@finlive.eu;vincent@finlive.eu',
                          'Activation de compte',
                          'Bonjour,\nSuite à mon incription, je souhaite activer mon compte le plus rapidement possible.\nMerci de faire le nécessaire.\n\nCordialement,\n'
                        ).then(() => {
                            console.log('Email envoyé par appli par defaut');
                        });
                    }} 
                >
                  <Text style={{
                                color: 'black',
                                backgroundColor: 'transparent',
                                alignItems:'center',
                                justifyContent:'center',
                                fontSize: 14,
                              }}>
                      RENVOYER LA DEMANDE
                  </Text>
                </Button>
            </View>
            <View style={styles.container_buttons}>
            
                <Button light  
                    style={{flex:1, justifyContent:'center',alignItems:'center',  marginRight: 5}}
                    onPress={this.goToLogin}
                    >
                    <Icon name="md-arrow-dropleft" style={{color : "#9A9A9A"}}/>   
                        <Text style={styles.text_button}>Retour Connexion</Text>
                </Button>
                {/*<Button light rounded
                    style={{flex:1, width: 0.45*getConstant('width'),  justifyContent:'center', alignItems:'center', marginLeft: 5}}
                    //disabled={true}
                    onPress={() => this.props.navigation.navigate('App')}
                >
                        <Text style={styles.text_button}>Contacter organisme</Text>
                </Button>*/}
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

//AppRegistry.registerComponent('Login', () => Login);
export default WaitingValidationScreen;

