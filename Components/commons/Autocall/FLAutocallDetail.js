import React from 'react';
import { View, SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, Platform, extInput, Modal, KeyboardAvoidingView, Keyboard, ActivityIndicator} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

import Moment from 'moment';
import localization from 'moment/locale/fr'


import { FontAwesome } from '@expo/vector-icons';

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
                     <FLTemplateAutocall object={this.autocall.getObject()} templateType={TEMPLATE_TYPE.AUTOCALL_MEDIUM_TEMPLATE} isEditable={true} source={'Home'}/>
              </View>
              <View style={[globalStyle.bgColor, {marginTop : -100 , flex:1}]}>
                  <View style={{backgroundColor: 'pink', marginTop : 100}}>
                    <Text>{this.autocall.getProductName()}</Text>
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


