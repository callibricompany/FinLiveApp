import React from 'react'

import { View, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList,Text,SafeAreaView,Platform, StatusBar, Animated, KeyboardAvoidingView} from 'react-native'
import { Thumbnail, Toast, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { globalStyle , tabBackgroundColor, subscribeColor} from '../../Styles/globalStyle'


import { FLBadge } from '../commons/FLBadge'
 
import smallIcon from '../../assets/icon_196.png'

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import Dimensions from 'Dimensions';

import { SearchBarProvider } from '../SearchBar/searchBarAnimation';
import SearchBarHome from './SearchBarHome';

import TabNews from './TabNews';
import TabHome from './TabHome';



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
          isLoading : true,

          //gestion du scroll avec l'input text recherche
          marginSearch : 0,

          //gestion des tabs
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
    
    static navigationOptions = ({ navigation }) => {
      //static navigationOptions = {
        //item = navigation.getParam('item', '...');
       
        //console.log("HOME SCREEN : "+JSON.stringify(navigation));
        return ({
          header : null,
        }
        );
    }

    /*static navigationOptions = {
      header: null
    }*/

    async componentWillMount () {
      
      //console.log(CATEGORIES);
      await this.props.getUserAllInfo();
     
     
      //creation de l aliste des categories 
      //console.log("Passage homescrrenn");
    
      //console.log("PASSEE E EE E  E E E E E  E E E E E E E E EE E  E E E EE E E E E E  E");
      //toto = {...this.props.categories};
      //console.log(this.props.categories);
      //console.log(this.props.categoriesState);
      /*this.props.categories.forEach((value, cle) => {
            console.log(value + " : "+ cle);
      });
      /*Toast.show({
        text: "Wrong password!",
        buttonText: "Okay",
        duration: 3000
      });*/

      //on va charger toutes les constantes (sous jacents, etc, ....)

      //setTimeout(() => {
        
      //}, 300);
      this.setState({ isLoading: false });
    }

 

    //le user veut filtrer --> on va renvoyer à HOC un objet filtre
    _filterUpdated(category, subCategory, filterText='') {
      
      let filters = {};
      filters["category"] = category.codeCategory;
      filters["subcategory"] = subCategory;
      filters["filterText"] = filterText;


      //this.setState({searchTextForNews : filterText === '' ? subCatName : filterText});
      console.log (JSON.stringify(filters));
      this.props.setFiltersHomePage(filters);

      //test pour supprimer le menu du bas
      if (filterText === 'Test'){
        //console.log("C est bien un test : " + JSON.stringify(this.props.navigation));
        //this.props.navigation.setParams({ hideBottomTabBar : true});
      }
    }

    _renderHeader = (animation, canJumpToTab) => props => (
      <SearchBarHome
        animation={animation}
        categories={this.props.categories}
        userOrg={this.props.userOrg}

        changeMarginSearch={(marginSearch) => {
          //console.log("SCROLL Y HomeScreen : "+marginSearch);
          this.setState({ marginSearch : marginSearch });
        }
        }

        manageVisibilityTabBar={(hideBottomTabBar = false)  => {
          this.props.navigation.setParams({ hideBottomTabBar : hideBottomTabBar});
        }}

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
          return <TabHome  route={route} jumpTo={jumpTo} marginSearch={this.state.marginSearch} />;
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
                            {/*Platform.OS === 'android' && 
                              <StatusBar
                                translucent={false}
                                backgroundColor={'black'}
                                barStyle={'dark-content'}
                                animated={false}
                              />*/
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
            <SafeAreaView style={{backgroundColor: 'white'}}>
                   { Platform.OS === 'android' && 
                     <StatusBar
                      translucent={false}
                      //backgroundColor={'#45688e'}
                      backgroundColor={'white'}
                      barStyle={'light-content'}
                      animated={false}
                      /> }
            {render}

            </SafeAreaView>
      );
    }
}




const condition = authUser => !!authUser;


const composedWithNavAndAuthorization = compose(
 withAuthorization(condition),
  withNavigation,
  withUser
);

//export default HomeScreen;
export default hoistStatics(composedWithNavAndAuthorization)(HomeScreen);
