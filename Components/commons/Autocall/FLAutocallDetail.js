import React from 'react';
import { View, SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, Platform, extInput, Modal, KeyboardAvoidingView, Keyboard, ActivityIndicator} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

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

import FLTemplateAutocall from "../Autocall/FLTemplateAutocall";



import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual} from '../../../Utils';
import Dimensions from 'Dimensions';

import * as TEMPLATE_TYPE from '../../../constants/template';
import * as TICKET_TYPE from '../../../constants/ticket'


import { CAutocall } from '../../../Classes/Products/CAutocall';



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT =  isAndroid() ? StatusBar.currentHeight : isIphoneX() ? 44 : 20;







class FLAutocallDetail extends React.Component {
    
    constructor(props) {
      super(props);
  

      this.autocall= this.props.autocall;
      //console.log(this.autocall.getObject());

      this.state = {

        nominal : 0,


        //affchage du modal description avant traiter
        showModalDescription : false,

        //gestion des sections
        activeSections: [],


        toto : true,
      }
      
    }
  componentDidMount() {
    if (!isAndroid()) {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle('light-content');
      });
    }
  }
  componentWillUnmount() {
    if (!isAndroid()) {
      this._navListener.remove();
    }
  }
  

  _updateAutocall=(autocall) => {
      this.autocall = autocall;
      this.setState({ toto : !this.state.toto });
  }

  _renderHeaderUnderlying = (content, index, isActive, sections) => {
    //console.log(content);
    return (
      <View style={{backgroundColor: 'white', marginTop: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderWidth :0, backgroundColor : setColor(''),                                          shadowColor: 'rgb(75, 89, 101)',
                    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.9, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={setFont('400', 18, 'white', 'Regular')}>
           {String(content.title).toUpperCase()}
        </Text>
      </View>
    );
  };

  _renderDates() {
    return (
      <View style={{backgroundColor: 'white', borderBottomColor: 'black', justifyContent: 'center', alignItems: 'center', padding: 5}}>
        <Text style={setFont('400', 12)}>alouette</Text>
      </View>
    );
  }

  _renderContentUnderlying = (content, index, isActive, sections) => {
    //console.log("EST ACTIF : " + isActive);
    switch(content.code) {
      case 'DATE' : return this._renderDates();
      default : <View><Text>...</Text></View>;
    }
  };
  
  _renderFooterUnderlying = (content, index, isActive, sections) => {
    console.log("EST ACTIF : " + isActive);
    if (!isActive) {
      //return;
    }
    return (
      <View style={{height: 10, border: 1, borderTopWidth : 0, borderColor: setColor(''),shadowColor: 'rgb(75, 89, 101)', shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.9, backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
      </View>
    );
  };
  render() { 

      return(
            <View style={{flex:1, height: DEVICE_HEIGHT,}}> 
              
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
                  </TouchableOpacity>
              </View>
              <View style={{
                            marginTop : -100 ,
                            justifyContent : 'center',
                            alignItems : 'center',
                            zIndex : 2
                          }}
              >
                     <FLTemplateAutocall object={this.autocall.getObject()} templateType={TEMPLATE_TYPE.AUTOCALL_MEDIUM_TEMPLATE} isEditable={true} source={'Home'} callbackUpdate={this._updateAutocall}/>
                     <View style={{marginTop: 5, width: 0.9*DEVICE_WIDTH}}>
                        <Accordion
                            sections={[            
                              {
                                title: 'dates importantes',
                                code: 'DATE',
                              }, 
                              {
                                title: 'coupons',
                                code: 'COUPON',
                              }, 
                            ]}
                            underlayColor={'transparent'}
                            activeSections={this.state.activeSections}
                            renderHeader={this._renderHeaderUnderlying}
                            renderFooter={this._renderFooterUnderlying}
                            renderContent={this._renderContentUnderlying}
                            expandMultiple={true}
                            onChange={(activeSections) => {
                              this.setState( { activeSections : activeSections })  
                            }}
                          />
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
export default hoistStatics(composedStructuredProductDetail)(FLAutocallDetail);


