import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Icon } from 'native-base';
import {  
    generalFontColor, 
    tabBackgroundColor,
    headerTabColor,
    selectElementTab,
    progressBarColor,
    subscribeColor,
    FLFontFamily,
    FLFontFamilyBold,
    apeColor,
    globalStyle
 } from '../../Styles/globalStyle'

import Dimensions from 'Dimensions';
import Numeral from 'numeral'
import 'numeral/locales/fr'

import { withUser } from '../../Session/withAuthentication';
import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import * as Progress from 'react-native-progress';

import Moment from 'moment';
import localization from 'moment/locale/fr'



import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;




class FLTicketTemplateAPE extends React.Component {


  constructor(props) {
    super(props);

    this.ticket = this.props.ticket;

    this.state = {

    }

    //le produit-ticket est filtre ou pas
    this.isFiltered = false;

  }

  componentWillReceiveProps (props) {

  }

 




  render () {
    //si c'est filtré on ne l'affiche pas
    if (this.isFiltered) {
      return null;
    }

    return (
      <View style={[globalStyle.itemTicket, {flexDirection : 'column', width: DEVICE_WIDTH*0.925, borderBottomWidth : 1, height : 50}]}>
          <View style={{backgroundColor:  apeColor  }}>
            <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 16, color: 'white', paddingTop: 5, paddingLeft :5}}>
                {this.ticket['subject']}
            </Text>
            <Text style={{fontFamily:  FLFontFamily, fontWeight: '200', fontSize: 13, color: 'white', paddingBottom: 2, paddingLeft :5}}>
                Appel Public à l'épargne
            </Text>
          </View>
          <View style={{backgroundColor:  'white'  }}>
            <Text style={{fontFamily:  FLFontFamily, textDecorationLine : 'underline', fontWeight: '300', fontSize: 12, paddingTop: 5, paddingLeft :5}}>
                Etape
            </Text>
            <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 14, paddingTop: 5, paddingLeft :15}}>
                {this.ticket['subject']}
            </Text>
          </View>
      </View>
    );
  }
}



  const condition = authUser => !!authUser;

  const composedWithNav = compose(
    withAuthorization(condition),
     withNavigation,
     withUser
   );

export default hoistStatics(composedWithNav)(FLTicketTemplateAPE);

