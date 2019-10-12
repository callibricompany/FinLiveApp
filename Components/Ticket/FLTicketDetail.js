import React from 'react'
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, StyleSheet, Platform, TextInput, Alert, KeyboardAvoidingView} from 'react-native'
import { Icon, Button, Input} from 'native-base'
import Moment from 'moment';
import localization from 'moment/locale/fr'

import { globalStyle } from '../../Styles/globalStyle'
import { FontAwesome } from '@expo/vector-icons';

import { ssCreateStructuredProduct } from '../../API/APIAWS';

import { tabBackgroundColor, FLFontFamily, generalFontColor, subscribeColor, backgdColor } from '../../Styles/globalStyle';

import FLTemplateAutocall  from '../Pricer/FLTemplateAutocall';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import Numeral from 'numeral'
import 'numeral/locales/fr'


import { ifIphoneX, ifAndroid, sizeByDevice, currencyFormatDE} from '../../Utils';
import Dimensions from 'Dimensions';


import * as TEMPLATE_TYPE from '../../constants/template';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;



class FLTicketDetail extends React.Component {
    
    constructor(props) {
      super(props);
  
      this.ticket = this.props.navigation.getParam('ticket', '...');
      this.product = this.props.navigation.getParam('product', '...');
      console.log(this.product);

      //this.currentStep = this.ticket.
      this.state = {

      }

    }

    componentDidMount () {

    }

    static navigationOptions = ({ navigation }) => {
    //static navigationOptions = {
      let ticket = navigation.getParam('ticket', '...');

 
      const { params } = navigation.state;
      return {
      header: (
        <SafeAreaView style={globalStyle.header_safeviewarea}>
          {/*<View style={[globalStyle.header_left_view, {flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}]} >*/}
          <View style={globalStyle.header_left_view} >
              <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => navigation.goBack()}>
                <Icon name='ios-arrow-round-back' size={40} style={[globalStyle.header_icon, {paddingLeft : 10}]} />
              </TouchableOpacity>
          </View>
          <View style={globalStyle.header_center_view} >
            <Text style={globalStyle.header_center_text_medium}>{ticket.currentStep[0].operation}{'\n'}<Text style={{fontSize:12}}>{ticket.subject}</Text></Text>
          </View>
          <View style={globalStyle.header_right_view} >
            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => navigation.goBack()}>
             <Icon name='ios-notifications-outline' size={40} style={[globalStyle.header_icon, {paddingRight : 10}]}/>
             </TouchableOpacity>

          </View>
        </SafeAreaView>
      )
      }
    }

   

    render() {


      return(
        <View  style={{flex:1 , flexDirection: 'column', marginTop : 20, backgroundColor: globalStyle.bgColor, width: DEVICE_WIDTH, justifyContent: 'center', alignItems: 'center'}}>
                    
                  <ScrollView>
                    <Text>{JSON.stringify(this.ticket)}</Text>
                    </ScrollView>      
      
      
      
      
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
