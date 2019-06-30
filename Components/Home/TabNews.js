import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text, Platform} from 'react-native'; 
import { Thumbnail, Toast, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";

import { FlatList } from '../SearchBar/searchBarAnimation';
import { getNews } from '../../API/APINews';

import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import { globalStyle , tabBackgroundColor, FLFontFamily} from '../../Styles/globalStyle'
import Dimensions from 'Dimensions';


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class TabNews extends React.PureComponent {
   constructor(props) {
    super(props);

    this.state = {
        isLoading: true,
        isRefreshing : false,
        pageNews: 1,
        news: [],
    };


    this.filterNews = '';
    if (typeof this.props.filterNews != 'undefined'){
        this.filterNews = this.props.filterNews;
    }
  }


  componentDidMount(){

    //console.log("VA CHERCHE LES NEWS");
    this._getNewsList();

  }

  componentWillReceiveProps(props) {

    if (typeof props.filterNews != 'undefined' && this.filterNews != props.filterNews){
      this.filterNews = props.filterNews;
      this._onRefreshNews();
    }

   

  }

  _getNewsList = () => {
    this.setState({ isLoading : true });
     getNews(this.state.pageNews, this.filterNews).then(data => {
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

  _displayNews = ({ item, index }) => {
        Moment.locale('fr');
    
        const imageUri = item.urlToImage!=null ? item.urlToImage : ""
    //console.log(item);
        return (
        <TouchableOpacity onPress={this._NavToNewsList.bind(this,item)}>
            <View style={{ backgroundColor:'white',flexDirection: 'row', justifyContent: 'space-evenly', width: DEVICE_WIDTH*0.475, height: 130, borderWidth: 1, borderColor:'lightgray'}}>
                <View style={{flex:1, flexWrap: "wrap",justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flex:5, justifyContent: 'center', flexWrap: 'wrap'}}>
                        <Thumbnail source={imageUri.length!=0?{uri: imageUri}: null} />
                    </View>
                    <View style={{flex:1, flexWrap: 'wrap', justifyContent: 'flex-end', paddingLeft: 5, paddingRight: 5}}>
                    <Text >{item.source.name}</Text>
                    </View>
                </View>
                <View style={{flex:2, flexDirection:'column', flexWrap: 'wrap'}}>
                <View style={{flex:5, flexDirection:'row',justifyContent: 'center', flexWrap: 'wrap', paddingRight:5, height : 0}}>
                  <View style={{flex: 1, flexWrap: 'wrap'}}>
                    <Text style={{fontFamily: FLFontFamily, fontSize: 14,flexWrap: 'wrap', alignSelf:'stretch', paddingTop : 2, paddingLeft: 2}}>{item.title}</Text>
                    </View>
                    </View>
                    <View style={{flex:1, flexWrap: 'wrap', justifyContent: 'flex-end', paddingRight:10, paddingBottom: 2}}>
                    <Text style={{fontSize: 10}}>{Moment(item.publishedAt).locale('fr',localization).calendar()}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
        
        )
    }

    _NavToNewsList = (item) => {
        this.props.navigation.navigate('NewsDetail', {
          item: item,
          news : this.state.news
        });
        //this.props.navigation.navigate('NewsDetail');
    };

    _displayLoading() {
        if (this.state.isLoading) {
        return (
            <View style={globalStyle.loading_container}>
                <ActivityIndicator size='large' />
            </View>
        )
        }
        return (
          <View style={globalStyle.loading_container}>
              
          </View>
        );
    }

  render() {
    return (
        <View style={{justifyContent:'flex-start', alignItems: 'center'}}>
        
        <FlatList
            data={this.state.news}
            renderItem={this._displayNews}
            style={{width : DEVICE_WIDTH*0.95}}
            //keyExtractor={(item, index) => item.key}
            keyExtractor={(item, index) => String(index)}
            numColumns={2}
            tabRoute={this.props.route.key}
            //horizontal={true}
            /*refreshControl={
            <RefreshControl
            refreshing={true}
            //onRefresh={this._onRefreshNews.bind(this)}
            onRefresh={console.log("rafrafarafrafarfarafar")}
            />
            }*/
            onEndReachedThreshold={0.5}
            onEndReached={() => {
            //console.log("onEndReached");
            this._getNewsList();

            }}
            //stickyHeaderIndices={this.state.stickyHeaderIndices}
        />
        </View>
    );
  }
}

const composedWithNav = compose(
    //withAuthorization(condition),
     withNavigation,
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(TabNews);
