import React from 'react';
import { View, SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, Platform, Image, Modal, KeyboardAvoidingView, Keyboard, TextInput, TouchableWithoutFeedback} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Moment from 'moment';
import localization from 'moment/locale/fr'


import { ssCreateStructuredProduct, ssModifyTicket, getConversation  } from '../../../API/APIAWS';

import { setFont, setColor , globalStyle } from '../../../Styles/globalStyle';

import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import FLTemplatePP from "../Ticket/FLTemplatePP";

import logo_white from '../../../assets/LogoWithoutTex_white.png';
import logo from '../../../assets/LogoWithoutText.png';

import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual} from '../../../Utils';
import Dimensions from 'Dimensions';

import * as TEMPLATE_TYPE from '../../../constants/template';
import * as TICKET_TYPE from '../../../constants/ticket'


import { CAutocall } from '../../../Classes/Products/CAutocall';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';
import { ScrollView } from 'react-native-gesture-handler';



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT =  isAndroid() ? StatusBar.currentHeight : isIphoneX() ? 44 : 20;



class FLTicketDetail extends React.Component {
    
  constructor(props) {
    super(props);


    this.ticket= this.props.ticket;
    this.autocall = this.ticket.getProduct();
  

    this.state = {

      nominal :  this.autocall.getNominal(),
      finalNominal :  this.autocall.getNominal(),

      //affchage du modal description avant traiter
      showModalDescription : false,

      //gestion du clavier
      keyboardHeight: 0,
      isKeyboardVisible: false,

      //modal
      showModalDescription : false,
      description : '',

      isLoading : false,
      toto : true,
    }
    


    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
  }

  componentDidMount() {
    if (!isAndroid()) {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle('light-content');
      });
    }
    Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

    //chargement de la conversation
    this.setState({ isLoading : true });

    getConversation(this.props.firebase, this.ticket.getId())
    .then((data) => {

      console.log(data.data);

      this.setState({ isLoading : false});
    })
    .catch(error => {
      console.log("ERREUR recupération conversations : " + error);
      alert('Erreur : ' + error);
      this.setState({ isLoading : false });
      
    }) 
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

  
  _renderHistory() {
    return (
        <View><Text> kfjhfjze</Text></View>
    )
  }
  _renderScene = ({ route }) => {
     
    switch (route.key) {
      case 'tabHistory':
        return this._renderHistory();
      case 'tabProduct':
         return  <View><Text>Produit</Text></View>;
      default:
        return <View><Text>Pas fait</Text></View>;
    }
  };




  render() { 

      return(
            <View style={{flex:1, flexDirection : 'column', height: DEVICE_HEIGHT, opacity: this.state.showModalDescription ? 0.3 : 1}}> 
              <View style={{flexDirection : 'row', height: (isAndroid() ? 110 : 140) + STATUSBAR_HEIGHT , paddingLeft : 10, backgroundColor: setColor(''), paddingTop: isAndroid() ?  0 : STATUSBAR_HEIGHT, padding : 5, alignItems: 'flex-start',justifyContent: 'space-between'}}>
                      <TouchableOpacity style={{flex: 0.2, justifyContent: 'center', alignItems: 'flex-start', padding : 5}}
                                        onPress={() => this.props.navigation.goBack()}
                      >
                           <Ionicons name={'ios-arrow-back'}  size={25} style={{color: 'white'}}/>
                      </TouchableOpacity>
                      <View style={{flex: 0.6, justifyContent: 'center', alignItems: 'center'}}>
                           <Text style={setFont('300', 16, 'white', 'Regular')}>{this.ticket.getWorkflowName()}</Text>
                           <Text style={setFont('300', 12, 'white', )}>{this.ticket.getType()}</Text>
                      </View>
                      <View style={{flex: 0.2, flexDirection : 'row', justifyContent: 'flex-end', alignItems: 'center', borderWidth: 0, marginRight: 0.025*DEVICE_WIDTH}}>
                              <TouchableOpacity style={{width : 40, borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}
                                                onPress={() => {
       
                                                }}
                              >
                                  <EvilIcons name={'share-apple'} size={35} style={{color: 'white'}}/>
                              </TouchableOpacity>
                              <TouchableOpacity style={{width : 40, borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                                  <MaterialCommunityIcons name={'dots-vertical'} size={30} style={{color: 'white'}}/>
                              </TouchableOpacity>
                      </View>
              </View>
              <View style={{flex : 1,
                            marginTop : isAndroid() ?  -80 : -80 ,
                            justifyContent : 'flex-start',
                            alignItems : 'center',
                            zIndex : 2,
                            //backgroundColor: 'pink'
                          }}
              >
                     <FLTemplatePP ticket={this.ticket} templateType={TEMPLATE_TYPE.TICKET_FULL_TEMPLATE} source={'Home'} />
                     <View style={{flex : 1, flexDirection : 'column', marginTop : 10, backgroundColor: 'pink',borderWidth : 1, width: 0.975*DEVICE_WIDTH}}>
                          <View style={{flexDirection : 'row'}}>
                              <TouchableOpacity style={{flex: 0.7, borderWidth:1}}>
                                  <Text>CONVERSATIONS</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={{flex: 0.15, borderWidth: 1}}>
                                  <Text>PRODUIT</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={{flex: 0.15, borderWidth : 1}}>
                                   <FontAwesome name={"file-text-o"}  size={20} style={{color: setColor('light')}}/> 
                              </TouchableOpacity>
                          </View>
                          <View>

                          </View>
                    </View>
                  
              </View>

            </View>


      );
    }
}



const condition = authUser => !!authUser;
const composedStructuredProductDetail = compose(
 withAuthorization(condition),
  withNavigation,
  withUser
);

//export default HomeScreen;
export default hoistStatics(composedStructuredProductDetail)(FLTicketDetail);