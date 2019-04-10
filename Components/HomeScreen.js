import React from 'react'
import { View, TouchableOpacity, ActivityIndicator, FlatList,Text,SafeAreaView,Platform, StatusBar} from 'react-native'
import { Thumbnail, ListItem, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";
import { globalStyle } from '../Styles/globalStyle'
import { getNews } from '../API/APINews'
import { FLBadge } from './commons/FLBadge'
 
import { withAuthorization } from '../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';
import Dimensions from 'Dimensions';
import Moment from 'moment';
import localization from 'moment/locale/fr'

import FLInput from '../Components/commons/FLInput'




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
      });
      //this.props.navigation.navigate('NewsDetail');
    };

   
    _getNewsList = () => {
       getNews().then(data => {
         //console.log("data news " + data);
         this.setState( {news: data, isLoading: false});
       })
       .catch(error => {
         console.log("ERREUR RECUPERATION NEWS : " + error);
       }) 
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
        <View style={{
              flex: 1,
              width: DEVICE_WIDTH*0.65,
              height: 120,
              marginRight: DEVICE_WIDTH*0.01,
              marginLeft:DEVICE_WIDTH*0.05,
              marginVertical: 5,
              marginHorizontal: 2,
              borderWidth: 1,
              borderRadius: 2,
              borderColor: '#ccc',
              flexWrap: "wrap",
              backgroundColor: 'white',
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 1.5,
              elevation: 3,
              flexDirection: 'row',
              justifyContent: 'space-evenly'
              }}
              >
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
                   <Text style={{fontSize: 10}}>{item.author} - {Moment(item.publishedAt).locale('fr',localization).format('LL')}</Text>
                </View>
            </View>
        </View>
        </TouchableOpacity>
        
        )
    }

    render() {
      //console.log(this.props.firebase);
      //const user = this.props.firebase.auth.currentUser.email!=null ? this.props.firebase.auth.currentUser.email : "User inconnu"
      return(
        <Container>
        
          <Content>
            <Text style={{
              marginLeft: DEVICE_WIDTH*0.05,
              marginTop: 20,
              marginBottom: 5,
              fontSize:26,
              color: '#707070'

            }}>Actualités</Text>
            <FlatList
              data={this.state.news}
              renderItem={this._displayNews}
              //keyExtractor={(item, index) => item.key}
              keyExtractor={item => item.title}
              horizontal={true}
              //stickyHeaderIndices={this.state.stickyHeaderIndices}
           />

   


          </Content>
       
          {this._displayLoading()}
         
        </Container>
      );
    }
}

const condition = authUser => !!authUser;


const composedWithNavAndAuthorization = compose(
  withNavigation,
  withAuthorization(condition)
);

//export default HomeScreen;
export default hoistStatics(composedWithNavAndAuthorization)(HomeScreen);
