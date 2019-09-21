import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'

import HomeScreen from '../Components/Home/HomeScreen'
import NewsList from '../Components/Home/NewsList'
import NewsDetail from '../Components/Home/NewsDetail'
import NewsDetailWeb from '../Components/Home/NewsDetailWeb'
import PricerScreen from '../Components/Pricer/PricerScreen'
import FLTicketPS from '../Components/Pricer/FLTicketPS'
import ProfileScreen from '../Components/ProfileScreen'
import TicketsList from '../Components/Ticket/TicketsList'
//import TicketDetail from '../Components/Ticket/TicketDetail'
import TicketDetail from '../Components/Ticket/SearchScreen'
import BroadcastingScreen from '../Components/Broadcast/BroadcastingScreen'
import AdminScreen from '../Components/AdminScreen'

import FontAwesomeI from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons'
import { Icon } from 'native-base'

import { tabBackgroundColor, FLFontFamily } from '../Styles/globalStyle';

import { withUser } from '../Session/withAuthentication';

import * as ROLES from '../constants/roles';


const tabIconFocused = 'white';
//const tabIconNonFocused = '#C8D1DB';
const tabIconNonFocused = tabBackgroundColor;



function labelStyle (focused, tintColor) {
    if (focused) {
      couleur = tintColor }
    else {
       //couleur = '#707070' }
       couleur = tabBackgroundColor }
  
    
    return {
      marginTop:10,  
      //paddingTop: -20,
      fontSize: 14 ,
      //fontWeight: 'bold',
      justifyContent: 'center',
      alignItems: 'center',
      color: couleur,
      fontFamily : FLFontFamily
    }
  }


//Ecran accueil
  const HomeScreenStack = createStackNavigator({

    Home: {
      screen: HomeScreen,
    },
    NewsList: {
      screen: NewsList
    },
    NewsDetail : {
      screen: NewsDetail
    },
    NewsDetailWeb : {
      screen: NewsDetailWeb
    },
    FLTicketPS : {
      screen : FLTicketPS
    }
  }, 
  {
    initialRouteName: 'Home'
  });



  
  //Ecran pricer
  const PricerScreenStack = createStackNavigator({
    Pricer: {
      screen: PricerScreen,
      navigationOptions: {
        title: 'Evaluer'
      },
    },
    FLTicketPS : {
      screen : FLTicketPS
    }
  })
  
  //Ecran ticket
  const TicketScreenStack = createStackNavigator({
    Tickets: {
      screen: TicketsList,
      navigationOptions: {
        title: 'Tickets'
      }
    },
    TicketDetail: {
      screen: TicketDetail,
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      }
    }
    })
    //Ecran broadcast
    const BroadcastingScreenStack = createStackNavigator({
      Broadcasting: {
        screen: BroadcastingScreen,
        navigationOptions: {
          title: 'Broadcast',

        }
      },

      })
  //Ecran profil
  const ProfilScreenStack = createStackNavigator({
  Profil: {
    screen: ProfileScreen,
    navigationOptions: {
      title: 'Profil',
    }
  }
  })
  //Ecran admin
  const AdminScreenStack = createStackNavigator({
    Admin: {
      screen: AdminScreen,
      navigationOptions: {
        title: 'Admin',
    //    headerVisible: false
      }
    }
    })
  
  
  
  const TABS = {
      Accueil: {
        screen: HomeScreenStack,
        navigationOptions: {
          tabBarIcon:  ({ focused, tintColor }) => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
            return (
            //<FontAwesomeI name='user-o' size={30} style={styles.icon}/> 
            <View  style={{
                        borderWidth:0,
                        //borderColor:'rgba(0,0,0,0.2)',
                        alignItems:'center',
                        justifyContent:'center',
                        width:40,
                        height:40,
                        backgroundColor:tintColor,
                        borderRadius:50,
                      }}
                  >
                  <FontAwesomeI
                  name='home'
                  size={30}
                  style={focused ? { color: tabIconFocused } : { color: tabIconNonFocused }}
              />
              </View>
            );
          },
          tabBarLabel: ({ focused, tintColor }) => {
            return (
              <View style={{alignItems:'center', justifyContent:'center'}}>
              <Text style={labelStyle(focused,tintColor)}>Accueil</Text>
              </View>
            );
            },
          //tabBarVisible: false,
        }
      },
      Pricer: {
        screen: PricerScreenStack,
        navigationOptions: {
          tabBarIcon:  ({ focused, tintColor }) => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
            return (
            //<FontAwesomeI name='user-o' size={30} style={styles.icon}/> 
            <View  style={{
                        borderWidth:0,
                        //borderColor:'rgba(0,0,0,0.2)',
                        alignItems:'center',
                        justifyContent:'center',
                        width:40,
                        height:40,
                        backgroundColor:tintColor,
                        borderRadius:40,
                      }}
                  >
                  <FontAwesomeI
                  name='euro'
                  size={30}
                  style={focused ? { color: tabIconFocused } : { color: tabIconNonFocused }}
              />
              </View>
            );
          },
          tabBarLabel: ({ focused, tintColor }) => {
            return (
              <View style={{alignItems:'center', justifyContent:'center'}}>
              <Text style={labelStyle(focused,tintColor)}>Evaluer</Text>
              </View>
            );
            },
            //tabBarVisible : false
        }
      },
      Tickets: {
        screen: TicketScreenStack,
        navigationOptions: {
        
        tabBarIcon:  ({ focused, tintColor }) => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
          return (
          //<FontAwesomeI name='user-o' size={30} style={styles.icon}/> 
          <View  style={{
                      borderWidth:0,
                      //borderColor:'rgba(0,0,0,0.2)',
                      alignItems:'center',
                      justifyContent:'center',
                      width:40,
                      height:40,
                      backgroundColor:tintColor,
                      borderRadius:50,
                    }}
                >
                {/*<FontAwesomeI
                name='ticket'
                size={30}
                style={focused ? { color: tabIconFocused } : { color: tabIconNonFocused }}
                />*/}
             <MaterialCommunityIconsI
                  name='radio-tower'
                  size={30}
                  style={focused ? { color: tabIconFocused } : { color: tabIconNonFocused }}
              />    
            </View>
          );
        },
        tabBarLabel: ({ focused, tintColor }) => {
          return (
            <View style={{alignItems:'center', justifyContent:'center'}}>
            <Text style={labelStyle(focused,tintColor)}>Live</Text>
            </View>
          );
          }
        }
      },
      Broadcasting: {
        screen: BroadcastingScreenStack,
        navigationOptions: {
    
          tabBarIcon:  ({ focused, tintColor }) => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
            return (
            //<FontAwesomeI name='user-o' size={30} style={styles.icon}/> 
            <View
            style={{
                borderWidth:0,
                //borderColor:'rgba(0,0,0,0.2)',
                alignItems:'center',
                justifyContent:'center',
                width:40,
                height:40,
                backgroundColor:tintColor,
                borderRadius:50,
              }}
          >
              {/* <MaterialCommunityIconsI
                  name='radio-tower'
                  size={30}
                  style={focused ? { color: tabIconFocused } : { color: tabIconNonFocused }}
              />*/}
                 <Icon 
                      size={30}
                      name='ios-notifications' 
                      style={focused ? { color: tabIconFocused } : { color: tabIconNonFocused }}
                    />
              </View>
            );
          },
          tabBarLabel: ({ focused, tintColor }) => {
            return (
              <View style={{alignItems:'center', justifyContent:'center'}}>
              <Text style={labelStyle(focused,tintColor)}>Alertes</Text>
              </View>
            );
            }
        }
      },
      Profil: {
        screen: ProfilScreenStack,
        navigationOptions: {
          tabBarIcon:  ({ focused, tintColor }) => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
            return (
            //<FontAwesomeI name='user-o' size={30} style={styles.icon}/> 
            <View
            style={{
                borderWidth:0,
                //borderColor:'rgba(0,0,0,0.2)',
                alignItems:'center',
                justifyContent:'center',
                width:40,
                height:40,
                backgroundColor:tintColor,
                borderRadius:50,
              }}
          >
                  <FontAwesomeI
                  name='user'
                  size={30}
                  style={focused ? { color: tabIconFocused } : { color: tabIconNonFocused }}
              />
              </View>
            );
          },
          tabBarLabel: ({ focused, tintColor }) => {
            return (
              <View style={{alignItems:'center', justifyContent:'center'}}>
                 <Text style={labelStyle(focused,tintColor)}>Profil</Text>
              </View>
            );
            }
        }
  
      },
     Admin: { 
        screen: AdminScreenStack,
        visible : false,
        navigationOptions: {
          tabBarIcon:  ({ focused, tintColor }) => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
            return (
            //<FontAwesomeI name='user-o' size={30} style={styles.icon}/> 
            <View
            style={{
                borderWidth:0,
                //borderColor:'rgba(0,0,0,0.2)',
                alignItems:'center',
                justifyContent:'center',
                width:40,
                height:40,
                backgroundColor:tintColor,
                borderRadius:50,
              }}
            >
                  <FontAwesomeI
                  name='user-plus'
                  size={30}
                  style={focused ? { color: tabIconFocused } : { color: tabIconNonFocused }}
              />
              </View>
            );
          },
          tabBarLabel: ({ focused, tintColor }) => {
            return (
              <View style={{alignItems:'center', justifyContent:'center'}}>
                 <Text style={labelStyle(focused,tintColor)}>Admin</Text>
              </View>
            );
            }
        }
      }
    }
  
  TABS['Accueil'].navigationOptions = ({ navigation }) => {
    const { state: { routes, index } } = navigation;
    let tabBarVisible = true;
    //console.log("NAVIGATION.js :"+JSON.stringify(navigation));
    //console.log("NAVIGATION.js: "+routes[index].routeName);
    //console.log("NAVIGATION.js : "+ navigation.getParam('hideBottomTabBar'));
    //console.log(JSON.stringify(navigation));
    if(routes[index].routeName === 'Home'){
      if (typeof routes[index].params !== 'undefined') {
        //console.log("TATATATATATAATTATATATATATATATATATTATAATTATA : " +routes[index].params);
        //console.log("TATATATATATAATTATATATATATATATATATTATAATTATA : " +routes[index].params['hideBottomTabBar']);
        tabBarVisible = !routes[index].params['hideBottomTabBar'];
      }
      
    }
    return {
 
        tabBarIcon:  ({ focused, tintColor }) => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
          return (
          //<FontAwesomeI name='user-o' size={30} style={styles.icon}/> 
          <View  style={{
                      borderWidth:0,
                      //borderColor:'rgba(0,0,0,0.2)',
                      alignItems:'center',
                      justifyContent:'center',
                      width:40,
                      height:40,
                      backgroundColor:tintColor,
                      borderRadius:50,
                    }}
                >
                <FontAwesomeI
                name='home'
                size={30}
                style={focused ? { color: tabIconFocused } : { color: tabIconNonFocused }}
            />
            </View>
          );
        },
        tabBarLabel: ({ focused, tintColor }) => {
          return (
            <View style={{alignItems:'center', justifyContent:'center'}}>
            <Text style={labelStyle(focused,tintColor)}>Accueil</Text>
            </View>
          );
          },
        //tabBarVisible: false,
   
      tabBarVisible
    }
  }

  export function  AppFinLiveTabs (role) {
        let tabs = {};
        if (role === ROLES.ADMIN) {
          const {Accueil, Tickets, Pricer, Broadcasting, Profil, Admin} = TABS;
          tabs = {Accueil, Tickets, Pricer, Broadcasting, Profil, Admin};
        }
        else {
          const {Accueil, Tickets, Pricer, Broadcasting, Profil} = TABS;
          tabs = {Accueil, Tickets, Pricer,  Broadcasting, Profil};
        }
        
        return tabs;

  }