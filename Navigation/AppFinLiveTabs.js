import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';

import HomeScreen from '../Components/Home/HomeScreen';
import NewsList from '../Components/Home/NewsList';
import NewsDetail from '../Components/Home/NewsDetail';
import NewsDetailWeb from '../Components/Home/NewsDetailWeb';
import FLTicketDetailHome from '../Components/Home/FLTicketDetailHome';
import FLAutocallDetailHome from '../Components/Home/FLAutocallDetailHome';
import FLSRPDetail from '../Components/Home/FLSRPDetail';

import PricerScreen from '../Components/Pricer/PricerScreen'
import FLResultPricer from '../Components/Pricer/FLResultPricer'
import FLAutocallDetailPricer from '../Components/Pricer/FLAutocallDetailPricer';
import FLTicketDetailTicket from '../Components/Ticket/FLTicketDetailTicket';

import FLCouponMinDetailAndroid from '../Components/Pricer/description/FLCouponMinDetailAndroid';

import ProfileScreen from '../Components/ProfileScreen';

import TicketScreen from '../Components/Ticket/TicketScreen';
import FLTicketDetail from '../Components/commons/Ticket/FLTicketDetail';

import BroadcastingScreen from '../Components/Broadcast/BroadcastingScreen';

import AdminScreen from '../Components/Admin/AdminScreen';
import AdminUser from '../Components/Admin/AdminUser';

import FontAwesomeI from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon } from 'native-base';

import { blueFLColor, FLFontFamily, setFont, setColor} from '../Styles/globalStyle';



import Numeral from 'numeral';

import * as ROLES from '../constants/roles';


const tabIconFocused = 'white';
//const tabIconNonFocused = '#C8D1DB';
const tabIconNonFocused = blueFLColor;



function labelStyle (focused, tintColor) {
    if (focused) {
      couleur = tintColor }
    else {
       //couleur = '#707070' }
       couleur = blueFLColor }
  
    
    return {
      marginTop:0,  
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
      //screen: NewsList,
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
    FLAutocallDetailHome : {
      screen : FLAutocallDetailHome
    },
    FLSRPDetail: {
      screen : FLSRPDetail
    },
    FLTicketDetailHome: {
      screen : FLTicketDetailHome
    },

  }, 
  {
    initialRouteName: 'Home'
  });



  
  //Ecran pricer
  const PricerScreenStack = createStackNavigator({
    PricerEvaluate: {
      screen: PricerScreen,
      navigationOptions: {
        title: 'Evaluer'
      },
    },
    FLAutocallDetailPricer : {
      screen : FLAutocallDetailPricer
    },
    FLResultPricer : {
      screen : FLResultPricer
    },
    FLCouponMinDetailAndroid: {
      screen : FLCouponMinDetailAndroid
    },

  })
  
  //Ecran ticket
  const TicketScreenStack = createStackNavigator({
      Tickets: {
        screen: TicketScreen,
      },
      FLTicketDetailTicket : {
        screen : FLTicketDetailTicket
      },
      FLTicketDetail : {
        screen : FLTicketDetail
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
    },
    AdminUser : {
      screen : AdminUser
    }
    })
  
  
  
  const TABS = {
      Accueil: {
        screen: HomeScreenStack,

      },
      Pricer: {
        screen: PricerScreenStack,
      },
      Tickets: {
        screen: TicketScreenStack,
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
                      name='ios-podium' 
                      style={focused ? { color: tabIconFocused } : { color: tabIconNonFocused }}
                    />
              </View>
            );
          },
          tabBarLabel: ({ focused, tintColor }) => {
            return (
              <View style={{alignItems:'center', justifyContent:'center'}}>
              <Text style={labelStyle(focused,tintColor)}>Stats</Text>
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
    //console.log("HOMEEEEEBAR : " + routes[index].routeName);
    //console.log(routes[index].params);
    //console.log("PASSE PAR ROUTE HOME");
    //console.log(navigation);
    //console.log(routes[index].routeName);
    if(routes[index].routeName === 'Home' || routes[index].routeName === 'FLAutocallDetailHome'  || routes[index].routeName === 'FLSRPDetail' || routes[index].routeName === 'FLTicketDetailHome'
    || routes[index].routeName === 'FLAutocallDetail'){
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
  TABS['Tickets'].navigationOptions = ({ navigation }) => {
    const { state: { routes, index, params} } = navigation;
    let tabBarVisible = true;
    let badgeCount = 0
    
    
    if(routes[index].routeName === 'Tickets' || routes[index].routeName === 'FLTicketDetailTicket'){
      
      if (typeof routes[index].params !== 'undefined') {
        if (routes[index].params.hasOwnProperty('hideBottomTabBar')) {
            tabBarVisible = !routes[index].params['hideBottomTabBar'];
        }
      }

      if (params) {
        
        if (params.hasOwnProperty('badge')){
            badgeCount = params['badge'];
            //console.log("HANDLE BADGES : " + badgeCount);
            if (Numeral(badgeCount).value() > 99) {
              badgeCount = '+99';
            }
        }
  
        
      }
      
    }
    //console.log("PASSE PAR ROUTE TICKEY : nbr badges : " +badgeCount);
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
             <MaterialCommunityIconsI
                  //name='radio-tower'
                  name='ticket-outline'
                  size={30}
                  style={focused ? { color: tabIconFocused } : { color: tabIconNonFocused }}
              />   
              {badgeCount > 0 && (
                  <View
                    style={{
                      // If you're using react-native < 0.57 overflow outside of parent
                      // will not work on Android, see https://git.io/fhLJ8
                      position: 'absolute',
                      right: -6,
                      top: -3,
                      backgroundColor: 'red',
                      borderRadius: 9,
                      width: 18,
                      height: 18,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth : 0
                    }}
                  >
                    <Text style={setFont('300',12,'white','Regular')}>
                      {badgeCount}
                    </Text>
                  </View>
                )}
            </View>
          );
        },
        tabBarLabel: ({ focused, tintColor }) => {
          return (
            <View style={{alignItems:'center', justifyContent:'center'}}>
            <Text style={labelStyle(focused,tintColor)}>Tickets</Text>
            </View>
          );
          },
        //tabBarVisible: false,
   
      tabBarVisible
    }
  }


  TABS['Pricer'].navigationOptions = ({ navigation }) => {
    const { state: { routes, index } } = navigation;
    let tabBarVisible = true;
    //console.log("TOOOLLLLBAR : " + routes[index].routeName);
    //console.log(routes[index].params);
    if(routes[index].routeName === 'FLAutocallDetailPricer'){
      if (typeof routes[index].params !== 'undefined') {
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
                  //name='radio-tower'
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