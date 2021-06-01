import React from 'react'
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, Image, Share, WebView} from 'react-native'

import Ionicons from "react-native-vector-icons/Ionicons";

import Moment from 'moment';
import localization from 'moment/locale/fr'

import { globalStyle } from '../../Styles/globalStyle'
import SwipeGesture from '../../Gesture/SwipeGesture'
import FadeInLeft from '../../Animated/FadeInLeft'

import { FLBadge } from '../commons/FLBadge'
import bgSrc from '../../assets/icon_196.png'
import FontAwesomeI from 'react-native-vector-icons/FontAwesome'


class NewsDetailWeb extends React.Component {
    
    constructor(props) {
      super(props);
      this.item = this.props.navigation.getParam('item', '...');
   
     
      this.state = {
      
      }
      
    }




    static navigationOptions = ({ navigation }) => {
    //static navigationOptions = {
      item = navigation.getParam('item', '...');
      const { params } = navigation.state;
      return {
      header: (
        <SafeAreaView style={globalStyle.header_safeviewarea}>
          <TouchableOpacity style={globalStyle.header_left_view} onPress={() => navigation.goBack()}>
            <Ionicons name='md-arrow-back' style={globalStyle.header_icon} />
          </TouchableOpacity>
          <View style={globalStyle.header_center_view} >
            <Text style={globalStyle.header_center_text_medium}>{item.source.name}</Text>
          </View>
          <View style={globalStyle.header_right_view} >
          <TouchableOpacity onPress={() => params.shareNews()}>
            <Ionicons name='ios-share' style={globalStyle.header_icon} />
           </TouchableOpacity>
          </View>
        </SafeAreaView>
      )
      }
    }


    componentDidMount () {
      this.props.navigation.setParams({
        shareNews: this._onShareNews,
      })
  }
    _onShareNews = async () => {
      try {
        const result = await Share.share({
          title : 'FinLive Actus : ' + this.item.title,
          subject : 'FinLive Actus : ' + this.item.title,
          dialogTitle: 'FinLive Actus : ' + this.item.title,
          url : this.item.url,
          message: "FinLive Actus :\n\n" + this.item.content,
        });
  
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    };

    render() {
      
      return(
        <WebView
          source={{ uri: item.url }}
          style={{ marginTop: 20 }}
        />      
      );
      }
}

export default NewsDetailWeb