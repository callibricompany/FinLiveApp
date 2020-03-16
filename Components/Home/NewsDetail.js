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


class NewsDetail extends React.Component {
    
    constructor(props) {
      super(props);
      this.item = this.props.navigation.getParam('item', '...');
      this.news = this.props.navigation.getParam('news', '...');
     
      this.state = {
        page: this.news.findIndex(item => item === this.item),
        totalPage : this.news.length
      }
      console.log("PAGE : " + this.state.page);
    }

  


    static navigationOptions = ({ navigation }) => {
    //static navigationOptions = {
      item = navigation.getParam('item', '...');
      const { params } = navigation.state;
      return {
      header: (
        <SafeAreaView style={globalStyle.header_safeviewarea}>
          <TouchableOpacity style={globalStyle.header_left_view} onPress={() => navigation.goBack()}>
            <Icon name='md-arrow-back' style={globalStyle.header_icon} />
          </TouchableOpacity>
          <View style={globalStyle.header_center_view} >
            <Title style={globalStyle.header_center_text_medium}>FinLive Actus</Title>
          </View>
          <View style={globalStyle.header_right_view} >
          <TouchableOpacity onPress={() => params.shareNews()}>
            <Icon name='ios-share' style={globalStyle.header_icon} />
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

    //on charge le suivant
    onSwipePerformed = (action) => {

      /// action : 'left' for left swipe
      /// action : 'right' for right swipe
      /// action : 'up' for up swipe
      /// action : 'down' for down swipe
      console.log("ACTION : " + action);
      if (action === 'left') {
        if (this.state.page +1 < this.news.length) {
          this.item = this.news[this.state.page +1 ];
          this.setState({page : this.state.page +1})
          
        }
      }
      else if (action === 'right') {
          if (this.state.page === 0){
            this.props.navigation.goBack();
          }
          if (this.state.page  > 0) {
            this.item = this.news[this.state.page - 1 ];
            this.setState({page : this.state.page - 1})
          }  
      }
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
      const imageUri = this.item.urlToImage!=null ? this.item.urlToImage : ""
      return(
        <FadeInLeft>
        <ScrollView >
           <SwipeGesture gestureStyle={globalStyle.swipesGestureContainer} 
            onSwipePerformed={this.onSwipePerformed.bind(this)}>
          <Image style={globalStyle.news_detail_image} source={imageUri.length!=0?{uri: imageUri}: null}/>
          <Card style={{flex: 0}}>
          <CardItem style={{alignItems:'center'}}>
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('NewsDetailWeb', {
                  item: this.item,
                });
            }}>
                <Text style={{fontSize:20, fontWeight:'bold'}}>
                  {this.item.title}
                </Text>
            </TouchableOpacity>
          </CardItem>
            <CardItem>
              <Left>
               <Thumbnail source={bgSrc} />
            <Body>
                  <Text>{this.item.source.name}</Text>
                  <Text style={{fontSize:14}}>{Moment(this.item.publishedAt).locale('fr',localization).format('LLLL')}</Text>
                </Body>
                </Left>
              </CardItem>
              <CardItem>
              <Body>
                
                <Text style={{fontSize:20}}>
                  {this.item.content}
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Left>
                <Button transparent textStyle={{color: 'black'}}>
                  <FontAwesomeI style={{marginRight : 5}} name="newspaper-o" />
                  <Text>{this.item.author}</Text>
                </Button>
              </Left>
            </CardItem>
            </Card>
            </SwipeGesture>
        </ScrollView>     
        </FadeInLeft>        
      );
      }
}

export default NewsDetail