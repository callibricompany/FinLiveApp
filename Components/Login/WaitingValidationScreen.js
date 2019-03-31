
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
import { H1, Item,Body,Title, Content, List, ListItem, InputGroup, Input, Icon, Picker, Button } from 'native-base';
import React, {Component} from 'react';
import ButtonSubmit from './ButtonSubmit'
import LogoComponent  from '../LogoComponent'
import Dimensions from 'Dimensions';
import firebase from 'firebase'


// import Signup from './Signup';
//import Account from './Main'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

class WaitingValidationScreen extends Component {

  constructor(props){
    super(props);

  }
  



  // Go to the signup page
  goToLogin = () => {
    //this.props.navigator.push({component: Signup});
    this.props.navigation.navigate('Login');
  }





  render() {

    const content =    <View style={{flex: 1,justifyContent:'center',alignItems:'center'}}>
            <ImageBackground
                style={styles.picture} 
                //source={{uri: 'https://picsum.photos/g/400/600?random'}}
                backgroundColor="#F9FAFC"
            />
            
     
            <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>  
            <ScrollView keyboardShouldPersistTaps="always" >
             <View style={styles.container}>
                <LogoComponent />
                </View>

            <View style={styles.container}>
            <Button bordered warning  style={{flew:1, width: 0.9*DEVICE_WIDTH,  marginBottom: 50,  flexWrap: "nowrap", justifyContent:'center', alignItems:'center'}}>
            <Text numberOfLines={3} >Votre compte est en cours de validation</Text>
          </Button>
            
                <ButtonSubmit 
                    //onPress={this.login.bind(this)} 
                    //onCheckEmail={this.checkEmailValidity.bind(this)}
                    text={'RENVOYER LA DEMANDE'}
                    style={{flex:1}}
                />
            </View>
            <View style={styles.container_buttons}>
            
                <Button light rounded 
                    style={{flex:1, justifyContent:'center',alignItems:'center',  marginRight: 5}}
                    onPress={this.goToLogin}
                    >
                    <Icon name="md-arrow-dropleft" style={{color : "#9A9A9A"}}/>   
                        <Text style={styles.text_button}>Retour Connexion</Text>
                </Button>
                <Button light rounded
                    style={{flex:1, width: 0.45*DEVICE_WIDTH,  justifyContent:'center', alignItems:'center', marginLeft: 5}}
                    //disabled={true}
                    onPress={() => this.props.navigation.navigate('App')}
                >
                        <Text style={styles.text_button}>Contacter organisme</Text>
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
        width: 0.9*DEVICE_WIDTH, 
        //marginTop: STATUSBAR_HEIGHT,
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

