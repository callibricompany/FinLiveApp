import React from 'react'
import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator, FlatList,Text,SafeAreaView,Platform, StatusBar} from 'react-native'
import { Thumbnail, Toast, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";
import { globalStyle } from '../../Styles/globalStyle'
import { getNews } from '../../API/APINews'
import { FLBadge } from '../commons/FLBadge'
 
import smallIcon from '../../assets/icon_196.png'

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';
import Dimensions from 'Dimensions';
import Moment from 'moment';
import localization from 'moment/locale/fr'

import FLInput from '../commons/FLInput'




//import Icon from 'react-native-vector-icons/FontAwesome'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;




//class HomeScreenFormBase extends React.Component {
  class HomeScreen extends React.Component {

  constructor(props) {
      super(props)
      console.log("CONSTRUCTEUR HOMESCREEN");
      this.state = {
        isLoading: true,
        isRefreshing : false,
        pageNews: 1,
        news: []
      }
       // console.log("PLATE-FORME : " + Platform.OS)
    }



    
    static navigationOptions = ({ navigation }) => {
      return {
      header: (
        <SafeAreaView style={globalStyle.header_safeviewarea}>
          <View style={globalStyle.header_left_view} />
          <View style={globalStyle.header_center_view} >
            <Title style={globalStyle.header_center_text_big}>FinLive</Title>
          </View>
          <View style={globalStyle.header_right_view} >
            <Icon name='ios-notifications' style={globalStyle.header_icon} />
            <FLBadge numero='3'/>
          </View>
        </SafeAreaView>
      ),
      tabBarVisible: false,
      }
    }

    componentDidMount(){

      console.log("VA CHERCHE LES NEWS");
      this._getNewsList();

    }





    _NavToNewsList = (item) => {
      this.props.navigation.navigate('NewsDetail', {
        item: item,
        news : this.state.news
      });
      //this.props.navigation.navigate('NewsDetail');
    };

   
    _getNewsList = () => {
      this.setState({ isLoading : true });
       getNews(this.state.pageNews).then(data => {
         //console.log("data news " + data);      
         this.setState( {
           news: [ ...this.state.news, ...data ],
           isLoading: false,
           pageNews : this.state.pageNews +1,
           isRefreshing : false
          });
       })
       .catch(error => {
         console.log("ERREUR RECUPERATION NEWS : " + error);
       }) 
     };

     _onRefreshNews = () => {
      this.setState( {
        news: [],
        pageNews : 1,
        isRefreshing : true
       });
       console.log("ON RAFRAICHIT LES NEWS");
       this._getNewsList();
     };

     _displayLoading() {
      if (this.state.isLoading) {
        return (
          <View style={globalStyle.loading_container}>
              <ActivityIndicator size='large' />
            </View>
        )
      }
    }

  

    _displayNews = ({ item }) => {
        Moment.locale('fr');
     
        const imageUri = item.urlToImage!=null ? item.urlToImage : ""
      //console.log(item);
        return (
        <TouchableOpacity onPress={this._NavToNewsList.bind(this,item)}>
         <View style={[globalStyle.rectangle, { width: DEVICE_WIDTH*0.65, height: 130}]}>
            <View style={{flex:1, flexWrap: "nowrap",justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flex:5, justifyContent: 'center', flexWrap: 'wrap'}}>
                <Thumbnail source={imageUri.length!=0?{uri: imageUri}: null} />
                </View>
                <View style={{flex:1, flexWrap: 'wrap', justifyContent: 'flex-end', paddingLeft: 5, paddingRight: 5}}>
                <Text >{item.source.name}</Text>
                </View>
            </View>
            <View style={{flex:2, flexDirection:'column', flexWrap: 'wrap'}}>
               <View style={{flex:5, justifyContent: 'center', flexWrap: 'wrap', paddingRight:5}}>
                  <Text style={{fontSize: 18}}>{item.title}</Text>
                </View>
                <View style={{flex:1, flexWrap: 'wrap', justifyContent: 'flex-end', paddingRight:10, paddingBottom: 2}}>
                   <Text style={{fontSize: 10}}>{Moment(item.publishedAt).locale('fr',localization).calendar()}</Text>
                </View>
            </View>
        </View>
        </TouchableOpacity>
        
        )
    }

    render() {
      return(
        <ScrollView style={globalStyle.bgColor}>



            <Text style={globalStyle.heeader_text_home}>Offres du moment</Text>
            <View style={[globalStyle.rectangle, { width: DEVICE_WIDTH*0.75, height: 150}]}>
            </View>

            <Text style={globalStyle.heeader_text_home}>Financier</Text>
            <View style={[globalStyle.rectangle, { flexDirection : 'column',width: DEVICE_WIDTH*0.90, height: 200,}]}> 
              <View style={{flex: 0.7}}><Text></Text></View>

              <View style={{flex: 0.3, alignItems:'center',justifyContent: 'space-around', marginLeft: 10, marginRight: 10, marginBottom: 5}}>
                <View style={{flex: 0.5, flexDirection : 'row',justifyContent: 'center', alignItems: 'center'}}>
                   <View style={{width: 30}}>
                    <Image style={{width: 25, height: 25}} source={smallIcon} />
                    </View>
                    <View style={{flex:1}}>
                      <Text style={{fontSize:20}}>Evaluer</Text>
                    </View>
                    <View style={{width: 30}}>
                    <Image style={{width: 25, height: 25}} source={smallIcon} />
                    </View>
                    <View style={{flex:1}}>
                      <Text style={{fontSize:20}}>Suivre</Text>
                    </View>                    
                </View>
                <View style={{flex: 0.5, flexDirection : 'row', justifyContent: 'center', alignItems: 'center'}}>
                   <View style={{width: 30}}>
                    <Image style={{width: 25, height: 25}} source={smallIcon} />
                    </View>
                    <View style={{flex:1}}>
                      <Text style={{fontSize:20}}>Alertes</Text>
                    </View>
                    <View style={{width: 30}}>
                    <Image style={{width: 25, height: 25}} source={smallIcon} />
                    </View>
                    <View style={{flex:1}}>
                      <Text style={{fontSize:20}}>Chercher</Text>
                    </View>                    
                </View>
              </View>
            </View>
            
            <Text style={globalStyle.heeader_text_home}>Actualités</Text> 
            <FlatList
              data={this.state.news}
              renderItem={this._displayNews}
              //keyExtractor={(item, index) => item.key}
              keyExtractor={item => item.title}
              horizontal={true}
              /*refreshControl={
                <RefreshControl
                 refreshing={true}
                 //onRefresh={this._onRefreshNews.bind(this)}
                 onRefresh={console.log("rafrafarafrafarfarafar")}
                />
              }*/
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                console.log("onEndReached");
                this._getNewsList();

              }}
              //stickyHeaderIndices={this.state.stickyHeaderIndices}
           />

   


       
          {this._displayLoading()}
          </ScrollView>
      );
    }
}

const condition = authUser => !!authUser;


const composedWithNavAndAuthorization = compose(
 withAuthorization(condition),
  withNavigation,
);

//export default HomeScreen;
export default hoistStatics(composedWithNavAndAuthorization)(HomeScreen);
