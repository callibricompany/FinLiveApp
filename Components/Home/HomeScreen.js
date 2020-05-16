import React from 'react'

import { View, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions,Text,SafeAreaView,Platform, StatusBar, Animated, KeyboardAvoidingView} from 'react-native'
import { Thumbnail, Toast, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';

import { globalStyle , setColor, setFont} from '../../Styles/globalStyle'
import { getConstant, isAndroid } from '../../Utils';

import NavigationService from '../../Navigation/NavigationService';

import { FLBadge } from '../commons/FLBadge'
 

import RobotBlink from "../../assets/svg/robotBlink.svg";

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';



import { SearchBarProvider } from '../SearchBar/searchBarAnimation';
import SearchBarHome from './SearchBarHome';

import TabNews from './TabNews';
import TabHome from './TabHome';



//import Icon from 'react-native-vector-icons/FontAwesome'






const initialLayout = {
  width: getConstant('width'),
  height: getConstant('height')
};

//class HomeScreenFormBase extends React.Component {
  class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
        this.countTicket=0;
        this.state = {
          isLoading : true,
          isServerOk : true,
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
        //this.props.navigation.setParams({ hideBottomTabBar : true });
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
    componentDidMount() {
      if (!isAndroid()) {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
          StatusBar.setBarStyle('light-content');
        });
      }

      this._loadAllUserInfos();
      
    }
    componentWillUnmount() {
      if (!isAndroid()) {
        this._navListener.remove();
      }
    }

    UNSAFE_componentWillMount () {
      //this._loadAllUserIndos();
    }

    async _loadAllUserInfos() {
      //console.log(CATEGORIES);
      try {
        await this.props.getUserAllInfo();
        //this.props.resetCurrentNotification();
        this.setState({ isServerOk : true, isLoading: false});
      } catch(error) {
        console.log("ERREUR RESEAU : "+error);
        this.setState({ isServerOk : false, isLoading: false});
      }
 
    }
 

    //le user veut filtrer --> on va renvoyer à HOC un objet filtre
    _filterUpdated(category, subCategory, filterText='') {
      
      let filters = {};
      filters["category"] = category.codeCategory;
      filters["subcategory"] = subCategory;
      filters["filterText"] = filterText;


      //this.setState({searchTextForNews : filterText === '' ? subCatName : filterText});
      console.log (filters);
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
                indicatorStyle={{    backgroundColor: setColor(''), height : 0 }}
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
          return <TabHome   route={route} 
                            jumpTo={jumpTo} 
                            marginSearch={this.state.marginSearch} 
                            filters={this.props.filtersHomePage}
                  />;
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
      return null;
      return (
           <TouchableOpacity style={{height : 200, width: 200}}
                             onPress={() => {
                               this.countTicket = this.countTicket +1;
                              NavigationService.handleBadges('Tickets', this.countTicket);
                             }}
           >
               <Text>Test badge</Text>
          </TouchableOpacity>
      )
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
                              style={{flex: 1, backgroundColor : setColor('background')}}
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
        return (
              <View style={{flex : 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size='large' />
              </View>
        );
      }
      if (!this.state.isServerOk) {
            //this.props.navigation.setParams({ hideBottomTabBar : false });
            return (
              <View style={{flex : 1, alignItems: 'center'}}>
                  <View style={{flex : 0.7, justifyContent: 'center', alignItems: 'center', padding : 10, backgroundColor:'white'}}>
                    <RobotBlink width={120} height={120} />
                    <Text style={setFont('400', 18)}>Problème de connexion</Text>

                  </View>
                  <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', padding : 10, borderRadius : 3, backgroundColor: setColor('')}}
                                    onPress={() => {
                                          //this.props.navigation.setParams({ hideBottomTabBar : true });
                                          this.setState({ isLoading : true}, 
                                          //   async() => {      try {
                                          //   await this.props.getUserAllInfo();
                                          //   //this.props.resetCurrentNotification();
                                          //   this.setState({ isServerOk : true, isLoading: false});
                                          // } catch(error) {
                                          //   console.log("ERREUR RESEAU : "+error);
                                          //   this.setState({ isServerOk : false, isLoading: false});
                                          // }}
                                          );
                                    }}
                  >
                        <Text style={setFont('400', 13, 'white', 'Regular')}>Essayer à nouveau</Text>
                  </TouchableOpacity>
              </View>
            );
      }
      //this.props.navigation.setParams({ hideBottomTabBar : true });
      return(
            <SafeAreaView style={{backgroundColor: setColor('')}}>
                   { Platform.OS === 'android' && 
                    <StatusBar
                    barStyle= "light-content"
                    // dark-content, light-content and default
                    hidden={false}
                    //To hide statusBar
                    backgroundColor='black'
                    //Background color of statusBar
                    translucent={false}
                    //allowing light, but not detailed shapes
                    networkActivityIndicatorVisible={true}
                  />
                  
                  
                  }

  
            {render}

            </SafeAreaView>
      );
    }
}




const condition = authUser => !!authUser;


const composedWithNavAndAuthorization = compose(
 withAuthorization(condition),
  withNavigation,
  withUser,

);

//export default HomeScreen;
export default hoistStatics(composedWithNavAndAuthorization)(HomeScreen);
