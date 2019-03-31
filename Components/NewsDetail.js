import React from 'react'
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, Image} from 'react-native'
import { Title, Icon, Container, Card, Content, CardItem, Left, Body, Thumbnail, Button} from 'native-base'
import Moment from 'moment';
import localization from 'moment/locale/fr'

import { globalStyle } from '../Styles/globalStyle'
import { FLBadge } from './commons/FLBadge'
import bgSrc from '../assets/icon_196.png'
import FontAwesomeI from 'react-native-vector-icons/FontAwesome'


class NewsDetail extends React.Component {
    
    constructor(props) {
      super(props);
      this.item = this.props.navigation.getParam('item', '...');
    }

    componentWillMount () {
    }


    static navigationOptions = ({ navigation }) => {
    //static navigationOptions = {
      item = navigation.getParam('item', '...');
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
            <Icon name='ios-share' style={globalStyle.header_icon} />
           
          </View>
        </SafeAreaView>
      )
      }
    }



    render() {
      return(
        <ScrollView >
          <Image style={globalStyle.news_detail_image} source={{uri: this.item.urlToImage}} />
          <Card style={{flex: 0}}>
          <CardItem style={{alignItems:'center'}}>
          <Text style={{fontSize:20, fontWeight:'bold'}}>
                  {this.item.title}
                </Text>
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
        </ScrollView>             
      );
      }
}

export default NewsDetail