import React from 'react'
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, Image, Share} from 'react-native'
import { Title, Icon, Container, Card, Content, CardItem, Left, Body, Thumbnail, Button} from 'native-base'
import Moment from 'moment';
import localization from 'moment/locale/fr'

import { globalStyle } from '../../Styles/globalStyle'
import SwipeGesture from '../../Gesture/SwipeGesture'
import FadeInLeft from '../../Animated/FadeInLeft'

import { FLBadge } from '../../Components/commons/FLBadge'
import bgSrc from '../../assets/icon_196.png'
import FontAwesomeI from 'react-native-vector-icons/FontAwesome'


import UNDERLYINGS from '../../Data/underlyings.json'
import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json'
import FREQUENCYLIST from '../../Data/frequencyList.json'



class StructuredProductDetail extends React.Component {
    
    constructor(props) {
      super(props);
      this.product = this.props.navigation.getParam('product', '...');
      
     
      this.state = {

      }

    }



    static navigationOptions = ({ navigation }) => {
    //static navigationOptions = {
      item = navigation.getParam('product', '...');
      let productName = STRUCTUREDPRODUCTS.filter(({id}) => id === item.product);
      

      const { params } = navigation.state;
      return {
      header: (
        <SafeAreaView style={globalStyle.header_safeviewarea}>
          <TouchableOpacity style={globalStyle.header_left_view} onPress={() => navigation.goBack()}>
            <Icon name='md-arrow-back' style={globalStyle.header_icon} />
          </TouchableOpacity>
          <View style={globalStyle.header_center_view} >
            <Title style={globalStyle.header_center_text_medium}>{productName[0].name}</Title>
          </View>
          <View style={globalStyle.header_right_view} >
     
            <Icon name='md-help-circle-outline' style={globalStyle.header_icon} />

          </View>
        </SafeAreaView>
      )
      }
    }

 





    render() {
  
      return(
    
        <ScrollView >
           <Text>Détail du produit à venir ...</Text>
        </ScrollView>     
     
      );
      }
}

export default StructuredProductDetail