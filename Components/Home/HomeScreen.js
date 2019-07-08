import React from 'react'
import Expo from "expo";
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList,Text,SafeAreaView,Platform, StatusBar, Animated} from 'react-native'
import { Thumbnail, Toast, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { globalStyle , tabBackgroundColor, subscribeColor} from '../../Styles/globalStyle'


import { FLBadge } from '../commons/FLBadge'
 
import smallIcon from '../../assets/icon_196.png'

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';
import Dimensions from 'Dimensions';


import { SearchBarProvider } from '../SearchBar/searchBarAnimation';
import SearchBarHome from './SearchBarHome';

import TabNews from './TabNews';
import TabHome from './TabHome';

import CATEGORIES from '../../Data/categories.json'
import SUBCATEGORIES from '../../Data/subCategories.json'
//import Icon from 'react-native-vector-icons/FontAwesome'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;


const initialLayout = {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT
};

//class HomeScreenFormBase extends React.Component {
  class HomeScreen extends React.Component {

  constructor(props) {
      super(props)

      this.state = {
        isLoading: true,

        index: 0,
        currentTab: 'tabHome',
        routes: [
          { key: 'tabHome', title: 'FINLIVE' },
          //{ key: 'tabNews', title: 'Actualités' }
        ],

        filterText : '',
        searchTextForNews : ''
      }

       // console.log("PLATE-FORME : " + Platform.OS)
    }


    componentDidMount () {
      this.attends();
    }
    
    resolveAfter2Seconds(x) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(x);
        }, 300);
      });
    }
    
    async attends() {
      var x = await this.resolveAfter2Seconds(10);
      this.setState({ isLoading: false });
    }
    
  static navigationOptions = {
      header: null
  }


  _filterUpdated(category, subCategory, filterText='') {

    let subCatName = SUBCATEGORIES.filter(({ticker}) => ticker === subCategory);

    let whatToFilter = category;
    

    this.setState({searchTextForNews : filterText === '' ? subCatName[0].name : filterText});
  }

  _renderHeader = (animation, canJumpToTab) => props => (
    <SearchBarHome
      animation={animation}
      category={this.props.category}


      filterUpdated={(cat, subCat, filterText) => {
        this._filterUpdated(cat, subCat, filterText);
      }
      }
      renderTabBar={() => (
        <TabBar
              onTabPress={({route}) => {
                if(route.key != this.state.currentTab && canJumpToTab) {
                  animation.onTabPress(route);
                }
              }}
              getLabelText={this._getLabelText}
              indicatorStyle={{    backgroundColor: tabBackgroundColor, height : 0 }}
              style={{ backgroundColor: 'white', elevation: 0, height : 0 }}
              labelStyle={{ color: 'pink', margin: 0, marginTop: 0, marginBottom: 0, fontWeight: '200', height: 0 }}
              {...props}
            />
          )}
        />
  );

    _handleIndexChange = index => {
      this.setState({
        currentTab: this.state.routes[index].key,
        index
      });
    }
    _getLabelText = ({ route }) => route.title;
 



   /* _renderScene = SceneMap({
      tabHome: TabHome,
      tabNews: TabNews
    });*/

    _renderScene = ({ route, jumpTo }) => {
     
      switch (route.key) {
        case 'tabHome':
          return <TabHome  route={route} jumpTo={jumpTo} />;
        //case 'tabNews':
        //  return  <TabNews  route={route} jumpTo={jumpTo} filterNews={this.state.searchTextForNews} />;
        default:
          return null;
      }
    };
  
    
    _renderSuggestion(animation) {
      //console.log("TAB : "+ this.state.currentTab);

      if(this.state.currentTab === 'sssstabNews') {
        let styleAnimation = animation.getStyleSuggestion();
        //let Suggestion = (focus == 'location') ? SearchBarLocationSuggestion : SearchBarSuggestion;
        //let Suggestion = <TabNews filterNews={this.searchText} />
  
        return (
          <Animated.View style={[initialLayout, { position: 'absolute', backgroundColor: '#fff', zIndex: 3 }, styleAnimation]}>
            <TabNews filterNews={this.searchText} />
          </Animated.View>
        );
      }
    }
    


    render() {
      let render =    <SearchBarProvider currentTab={this.state.currentTab}>
                        {(animation, { canJumpToTab }) => 
                          <View style={initialLayout}>
                            {Platform.OS === 'android' && 
                              <StatusBar
                                translucent={false}
                                backgroundColor={'black'}
                                barStyle={'dark-content'}
                                animated={false}
                              />
                            }
                            <TabView
                              style={[globalStyle.bgColor, {flex: 1}]}
                              navigationState={this.state}
                              renderScene={this._renderScene}
                              renderTabBar={this._renderHeader(animation, canJumpToTab)}
                              onIndexChange={this._handleIndexChange}
                              initialLayout={initialLayout}
                              swipeEnabled={true} // TODO ...
                              //canJumpToTab={() => canJumpToTab}
                              useNativeDriver
                            />

                            {this._renderSuggestion(animation)}
                          </View>
                        }
                      </SearchBarProvider>
                

          if (this.state.isLoading) {
            render =  <View style={globalStyle.loading}>
                  <ActivityIndicator size='large' />
                </View>
          }
      return(
            <SafeAreaView style={{backgroundColor: tabBackgroundColor}}>
            {render}
            </SafeAreaView>
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
