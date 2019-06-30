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
          { key: 'tabNews', title: 'Actualités' }
        ],

        filterText : '',
        searchTextForNews : ''
      }

       // console.log("PLATE-FORME : " + Platform.OS)
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
          indicatorStyle={styles.indicator}
          style={styles.tabbar}
          labelStyle={styles.label}
          {...props}
        />
      )}
      /*renderTabBar={() => (
        <View><Text>djfhdjfh</Text></View>
      )

      }*/
    />
  );

    _handleIndexChange = index => {
      this.setState({
        currentTab: this.state.routes[index].key,
        index
      });
    }
    _getLabelText = ({ route }) => route.title;

    /*async componentWillMount() {
      try {
        await Expo.Font.loadAsync({
    //      Roboto: require("native-base/Fonts/Roboto.ttf"),
    //      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
        })
        } catch (error) {
          console.log('Erreur chargement icon fonts', error);
        }
  
        this.setState({ isLoading : false });  
    }*/
 

     _displayLoading() {
      if (this.state.isLoading) {
        return (
          <View style={globalStyle.loading_container}>
              <ActivityIndicator size='large' />
            </View>
        )
      }
    }

   /* _renderScene = SceneMap({
      tabHome: TabHome,
      tabNews: TabNews
    });*/

    _renderScene = ({ route, jumpTo }) => {
     
      switch (route.key) {
        case 'tabHome':
          return <TabHome  route={route} jumpTo={jumpTo} />;
        case 'tabNews':
          return  <TabNews  route={route} jumpTo={jumpTo} filterNews={this.state.searchTextForNews} />;
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
          <Animated.View style={[initialLayout, styles.suggestionWrap, styleAnimation]}>
            <TabNews filterNews={this.searchText} />
          </Animated.View>
        );
      }
    }
    


    render() {
      return(

        <SafeAreaView style={{backgroundColor: tabBackgroundColor}}>
              <SearchBarProvider currentTab={this.state.currentTab}>
                {(animation, { canJumpToTab }) => 
                  <View style={initialLayout}>
                    {Platform.OS === 'android' && 
                      <StatusBar
                        translucent={true}
                        backgroundColor={tabBackgroundColor}
                      />
                    }
                    <TabView
                      style={styles.container}
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
            <View>
          {this._displayLoading()}
          </View>
       
          </SafeAreaView>
      );
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edeef0'
  },
  tabbar: {
    backgroundColor: '#fff',
    elevation: 0,
    height : 35
  },
  indicator: {
    backgroundColor: '#45688e'
  },
  label: {
    color: '#45688e',
    margin: 0,
    marginTop: 0,
    marginBottom: 10,
    fontWeight: '200'
  },
  suggestionWrap: {
    position: 'absolute',
    backgroundColor: '#fff',  
    zIndex: 3
  }
});

const condition = authUser => !!authUser;


const composedWithNavAndAuthorization = compose(
 withAuthorization(condition),
  withNavigation,
);

//export default HomeScreen;
export default hoistStatics(composedWithNavAndAuthorization)(HomeScreen);
