import React from 'react';
import { View, SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, Platform, Image, Modal, KeyboardAvoidingView, Keyboard, TextInput, WebView} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import Accordion from 'react-native-collapsible/Accordion';

import { ssCreateStructuredProduct } from '../../API/APIAWS';

import { setFont, setColor , globalStyle } from '../../Styles/globalStyle';



import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import FLTemplateAutocall from "../commons/Autocall/FLTemplateAutocall";


import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual} from '../../Utils';
import Dimensions from 'Dimensions';

import * as TEMPLATE_TYPE from '../../constants/template';
import * as TICKET_TYPE from '../../constants/ticket'


import { CAutocall } from '../../Classes/Products/CAutocall';
import { CPSRequest } from '../../Classes/Products/CPSRequest';
import { ScrollView } from 'react-native-gesture-handler';

import PDFReader from 'rn-pdf-reader-js'
import { Constants } from 'expo'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT =  isAndroid() ? StatusBar.currentHeight : isIphoneX() ? 44 : 20;






class FLSRPPdfReader extends React.Component {
    
  constructor(props) {
    super(props);


    
    this.url =  this.props.navigation.getParam('urLPDF', '');
    console.log(this.url);
    this.state = {

    }
    


    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    //static navigationOptions = {
      //item = navigation.getParam('item', '...');
     
      //console.log("HOME SCREEN : "+JSON.stringify(navigation));
      return ({
        header : null,
      }
      );
  }

  componentDidMount() {
    if (!isAndroid()) {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle('dark-content');
      });
    }
    Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }
  componentWillUnmount() {
    if (!isAndroid()) {
      this._navListener.remove();
    }
    Keyboard.removeListener('keyboardDidShow');
    Keyboard.removeListener('keyboardDidHide');
  }
  
  keyboardDidHide() {
    this.setState({
      keyboardHeight: 0,
      isKeyboardVisible: false
    });
  }

  keyboardDidShow(e) {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
      isKeyboardVisible: true
    }, ()=> console.log("HAUTEUR CLAVIER : " + this.state.keyboardHeight));
  }






  render() { 

      return(

              <View style={{
                            flex: 1,
                            //width : DEVICE_WIDTH,
                            //height : DEVICE_HEIGHT - 50 - STATUSBAR_HEIGHT,
                            justifyContent : 'center',
                            alignItems : 'center',
                            
                            //backgroundColor: 'pink'
                          }}
              >
                    
                    <PDFReader
                      source={{
                        uri: this.url,
                      }}
                    />
              </View>



      );
    }
}



const condition = authUser => !!authUser;
const composedFLSRPPdfReader = compose(
 withAuthorization(condition),
  withNavigation,
  withUser
);

//export default HomeScreen;
export default hoistStatics(composedFLSRPPdfReader)(FLSRPPdfReader);


/*
            <View style={{flex:1, height: DEVICE_HEIGHT}}> 


              <View style={{height: 50+STATUSBAR_HEIGHT, paddingLeft : 10, backgroundColor: 'white', paddingTop: isAndroid() ?  0 : STATUSBAR_HEIGHT}}>
                  <TouchableOpacity style={{flexDirection : 'row', borderWidth: 0, padding : 5}}
                                    onPress={() => this.props.navigation.goBack()}
                  >
                      <View style={{justifyContent: 'center', alignItems: 'center'}}>
                           <Ionicons name={'ios-arrow-back'}  size={25} style={{color: setColor('')}}/>
                      </View>
                      <View style={{justifyContent: 'center', alignItems: 'flex-start', paddingLeft : 5}}>
                           <Text style={setFont('300', 16, setColor(''), 'Regular')}>Retour</Text>
                      </View>
                      <View style={{flex: 1, flexDirection : 'row', justifyContent: 'flex-end', alignItems: 'center', borderWidth: 0, marginRight: 0.05*DEVICE_WIDTH}}>
                          <View style={{flexDirection : 'row'}}>
   
                              <TouchableOpacity style={{width : 40, borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                                  <EvilIcons name={'share-apple'} size={35} style={{color: setColor('')}}/>
                              </TouchableOpacity>
                          </View>
                      </View>
                  </TouchableOpacity>
              </View>

              */