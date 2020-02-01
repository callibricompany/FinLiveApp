import React from 'react';
import { View, SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, Platform, Image, Modal, KeyboardAvoidingView, Keyboard, TextInput} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import Accordion from 'react-native-collapsible/Accordion';

import { ssCreateStructuredProduct } from '../../../API/APIAWS';

import { setFont, setColor , globalStyle } from '../../../Styles/globalStyle';



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


const SECTIONS = [            
  {
    title: 'dates importantes',
    code: 'DATE',
    height : 100,
  }, 
  {
    title: 'protection du capital',
    code: 'CAPITAL',
    height : 100,
  }, 
  {
    title: 'coupons',
    code: 'PHOENIX',
    height : 200,
  }, 
  {
    title: 'niveaux de rappel',
    code: 'AUTOCALL',
    height : 250,
  }, 
]




class FLTicketDetail extends React.Component {
    
  constructor(props) {
    super(props);


    this.ticket= this.props.ticket;
    //console.log(this.autocall.getObject());
  

    this.state = {

      nominal :  this.autocall.getNominal(),
      finalNominal :  this.autocall.getNominal(),

      //affchage du modal description avant traiter
      showModalDescription : false,

      //gestion des sections
      activeSections: [],
      scrollViewHeight : 50,

      //gestion du clavier
      keyboardHeight: 0,
      isKeyboardVisible: false,

      //modal
      showModalDescription : false,
      description : '',

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

  _updateAutocall=(autocall) => {
      this.autocall = autocall;
      this.setState({ toto : !this.state.toto }, () => console.log(this.autocall.getObject()));
  }

  //compense un bug de <Accordeon>
  //calcule le nombre d'élément ouvert et refait la hauteur du scroll
  _redefineHeight() {
    let h = 50;
    this.state.activeSections.forEach((elementPosition) => {
        h = h + SECTIONS[elementPosition].height;
    });
    //console.log("NOUVELLE HAUTEUR : "+ h);
    this.setState({ scrollViewHeight : h });
  }


  _renderHeaderUnderlying = (content, index, isActive, sections) => {

    return (
      <View style={{backgroundColor: 'white', marginTop: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderWidth :0, backgroundColor : setColor(''),                                          shadowColor: 'rgb(75, 89, 101)',
                    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.9, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={setFont('400', 18, 'white', 'Regular')}>
           {String(content.title).toUpperCase()}
        </Text>
      </View>
    );
  };



  
  _renderContentUnderlying = (content, index, isActive, sections) => {
    //console.log("EST ACTIF : " + isActive);
    
    switch(content.code) {
     // case 'DATE' : return this._renderDates();

      default : <View><Text>...</Text></View>;
    }
  };
  
  _renderFooterUnderlying = (content, index, isActive, sections) => {

    return (
      <View style={{height: 10, border: 1, borderTopWidth : 0, borderColor: setColor(''),shadowColor: 'rgb(75, 89, 101)', shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.9, backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
      </View>
    );
  };


  render() { 

      return(
            <View style={{flex:1, height: DEVICE_HEIGHT, opacity: this.state.showModalDescription ? 0.3 : 1}}> 
              <View style={{height: 140 + STATUSBAR_HEIGHT, paddingLeft : 10, backgroundColor: setColor(''), paddingTop: isAndroid() ?  0 : STATUSBAR_HEIGHT}}>
                  <TouchableOpacity style={{flexDirection : 'row', borderWidth: 0, padding : 5}}
                                    onPress={() => this.props.navigation.goBack()}
                  >
                      <View style={{justifyContent: 'center', alignItems: 'center'}}>
                           <Ionicons name={'ios-arrow-back'}  size={25} style={{color: 'white'}}/>
                      </View>
                      <View style={{justifyContent: 'center', alignItems: 'flex-start', paddingLeft : 5}}>
                           <Text style={setFont('300', 16, 'white', 'Regular')}>Retour</Text>
                      </View>
                      <View style={{flex: 1, flexDirection : 'row', justifyContent: 'flex-end', alignItems: 'center', borderWidth: 0, marginRight: 0.05*DEVICE_WIDTH}}>
                          <View style={{flexDirection : 'row'}}>
                              <TouchableOpacity style={{width : 40, borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}
                                                onPress={() => {
                                                  let r = new CPSRequest();
                                                  r.setRequestFromCAutocall(this.autocall);
                                                  this.props.navigation.dispatch(NavigationActions.navigate({
                                                    routeName: 'Pricer',
                                                    action: NavigationActions.navigate({ routeName: 'PricerEvaluate' , params : {request : r}} ),
                                                  }));
                                                }}
                              >
                                  <FontAwesome name={'gears'} size={25} style={{color: 'white'}}/>
                              </TouchableOpacity>
                              <TouchableOpacity style={{width : 40, borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                                  <EvilIcons name={'share-apple'} size={35} style={{color: 'white'}}/>
                              </TouchableOpacity>
                          </View>
                      </View>
                  </TouchableOpacity>
              </View>
              <View style={{

                            marginTop : -100 ,
                            justifyContent : 'center',
                            alignItems : 'center',
                            zIndex : 2,
                            //backgroundColor: 'pink'
                          }}
              >
                     <FLTemplatePP ticket={this.ticket} templateType={TEMPLATE_TYPE.TICKET_MEDIUM_TEMPLATE} source={'Home'} />
                     <ScrollView style={{marginTop: 5, width: 0.9*DEVICE_WIDTH}}>
                        <Accordion
                            sections={SECTIONS}
                            underlayColor={'transparent'}
                            activeSections={this.state.activeSections}
                            renderHeader={this._renderHeaderUnderlying}
                            renderFooter={this._renderFooterUnderlying}
                            renderContent={this._renderContentUnderlying}
                            expandMultiple={true}
                            onChange={(activeSections) => {
                              this.setState( { activeSections : activeSections }, () => this._redefineHeight())  
                            }}
                          />
                          <View style={{height : this.state.scrollViewHeight}}>
                          </View>
                    </ScrollView>
                  
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


