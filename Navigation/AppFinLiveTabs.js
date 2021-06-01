import React from 'react';
import { View, Text } from 'react-native';
//import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from '../Components/Home/HomeScreen';
import NewsList from '../Components/Home/NewsList';
import NewsDetail from '../Components/Home/NewsDetail';
import NewsDetailWeb from '../Components/Home/NewsDetailWeb';
import FLAutocallDetail from '../Components/commons/Autocall/FLAutocallDetail';
import FLAutocallDetailTrade from '../Components/commons/Autocall/FLAutocallDetailTrade';
import FLAutocallDetailBroadcastPP from '../Components/commons/Autocall/FLAutocallDetailBroadcastPP';
import FLAutocallDetailBroadcastFriends from '../Components/commons/Autocall/FLAutocallDetailBroadcastFriends';
import FLSRPDetail from '../Components/Home/FLSRPDetail';
import FLNotifications from '../Components/commons/FLNotifications';

import PricerScreen from '../Components/Pricer/PricerScreen'
import FLResultPricer from '../Components/Pricer/FLResultPricer'
import FLAutocallDetailPricer from '../Components/Pricer/FLAutocallDetailPricer';
import FLAutocallDetailTicket from '../Components/Ticket/FLAutocallDetailTicket';

import FLCouponMinDetailAndroid from '../Components/Pricer/description/FLCouponMinDetailAndroid';

import ProfileScreen from '../Components/Profile/ProfileScreen';
import ProfileScreenDetail from '../Components/Profile/ProfileScreenDetail';
import ProfileScreenIssuer from '../Components/Profile/ProfileScreenIssuer';
import ProfileScreenFriends from '../Components/Profile/ProfileScreenFriends';
import ProfileScreenDashboard from '../Components/Profile/ProfileScreenDashboard';
import ProfileScreenClientsList from '../Components/Profile/ProfileScreenClientsList';
import ProfileClientDetail from '../Components/Profile/ProfileClientDetail';

import TicketScreen from '../Components/Ticket/TicketScreen';
import FLTicketDetail from '../Components/commons/Ticket/FLTicketDetail';
import {FLAddFriendOnBroadcast} from '../Components/commons/Ticket/FLAddFriendOnBroadcast';

import FollowingScreen from '../Components/Following/FollowingScreen';
import FLTermSheetDescription from '../Components/commons/FLTermSheetDescription';

import AdminScreen from '../Components/Admin/AdminScreen';
import AdminUser from '../Components/Admin/AdminUser';

import FontAwesomeI from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


import { setFont, setColor} from '../Styles/globalStyle';



import Numeral from 'numeral';

import * as ROLES from '../constants/roles';


const tabIconFocused = 'white';
//const tabIconNonFocused = '#C8D1DB';
const tabIconNonFocused = setColor('');



function labelStyle (focused, tintColor) {
    if (focused) {
      couleur = tintColor }
    else {
       //couleur = '#707070' }
       couleur = setColor('') }
  
    
    return {
      marginTop:0,  
      //paddingTop: -20,
      fontSize: 14 ,
      //fontWeight: 'bold',
      justifyContent: 'center',
      alignItems: 'center',
      color: couleur,
      //fontFamily : 'Regular'
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
    FLAutocallDetail : {
      screen : FLAutocallDetail
    },
    FLSRPDetail: {
      screen : FLSRPDetail
    },
    FLTicketDetail: {
      screen : FLTicketDetail
    },
    FLAutocallDetailTrade: {
      screen : FLAutocallDetailTrade
    },
    FLAutocallDetailBroadcastPP: {
      screen : FLAutocallDetailBroadcastPP
    },
    FLAutocallDetailBroadcastFriends: {
      screen : FLAutocallDetailBroadcastFriends
    },
    FLAddFriendOnBroadcast: {
      screen : FLAddFriendOnBroadcast
    },
    FLNotifications: {
      screen : FLNotifications
    },
    FLTermSheetDescription:{
      screen: FLTermSheetDescription,
      navigationOptions: {
			headerShown : false
    }
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
    FLAutocallDetail : {
      screen : FLAutocallDetail
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
    FLAutocallDetailTrade: {
      screen : FLAutocallDetailTrade
    },
    FLAutocallDetailBroadcastFriends: {
      screen : FLAutocallDetailBroadcastFriends
    },
    FLAddFriendOnBroadcast: {
      screen : FLAddFriendOnBroadcast
    },
    FLAutocallDetailBroadcastPP: {
      screen : FLAutocallDetailBroadcastPP
    },
    FLTermSheetDescription:{
      screen: FLTermSheetDescription,
      navigationOptions: {
        headerShown : false
    }
    },
  })
  
  //Ecran ticket
  const TicketScreenStack = createStackNavigator({
      Tickets: {
        screen: TicketScreen,
      },
      FLTicketDetail : {
        screen : FLTicketDetail
      },
      FLAutocallDetail : {
        screen : FLAutocallDetail
      },
      FLAutocallDetailTicket: {
        screen : FLAutocallDetailTicket
      },
      FLAddFriendOnBroadcast: {
        screen : FLAddFriendOnBroadcast
      },


    })

  //Ecran suivi de produits
  const FollowingScreenStack = createStackNavigator({
    Following: {
      screen: FollowingScreen,
    },
    FLTermSheetDescription:{
      screen: FLTermSheetDescription,
      navigationOptions: {
        headerShown : false
    }
    },
    FLAutocallDetail : {
      screen : FLAutocallDetail
    },
    FLTicketDetail : {
      screen : FLTicketDetail
    },

    })

  //Ecran profil
  const ProfilScreenStack = createStackNavigator({
      Profil: {
        screen: ProfileScreen,
        navigationOptions: {
          title: 'Profil',
        },
      },
      ProfileScreenDetail: {
        screen: ProfileScreenDetail,
      },
      ProfileScreenIssuer : {
        screen: ProfileScreenIssuer,
        navigationOptions: {
          headerShown : false
        }
      },
      ProfileScreenFriends : {
        screen: ProfileScreenFriends,
        navigationOptions: {
          headerShown : false
        }
      },
      ProfileScreenDashboard : {
        screen: ProfileScreenDashboard,
        navigationOptions: {
          headerShown : false
        }
      },
      ProfileScreenClientsList: {
        screen : ProfileScreenClientsList,
        navigationOptions: {
          headerShown : false
       },
      },
      ProfileClientDetail: {
        screen : ProfileClientDetail,
        navigationOptions: {
          headerShown : false
       },
      },

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
      Following: {
        screen: FollowingScreenStack,
      },
      Profil: {
        screen: ProfilScreenStack,

  
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
    if(routes[index].routeName === 'Home' || routes[index].routeName === 'FLSRPDetail' || routes[index].routeName === 'FLTicketDetail'
    || routes[index].routeName === 'FLAutocallDetail'  || routes[index].routeName === 'FLAutocallDetailTrade'   || routes[index].routeName === 'FLAutocallDetailBroadcastPP'
    || routes[index].routeName === 'FLAutocallDetailBroadcastFriends') {
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
        keyboardHidesTabBar: true,
        tabBarVisible
    }
  }
  TABS['Tickets'].navigationOptions = ({ navigation }) => {
    const { state: { routes, index, params} } = navigation;
    let tabBarVisible = true;
    let badgeCount = 0
    
    
    if(routes[index].routeName === 'Tickets' || routes[index].routeName === 'FLTicketDetail' ){
      
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
            <Text style={labelStyle(focused,tintColor)}>Trades</Text>
            </View>
          );
          },
        //tabBarVisible: false,
        keyboardHidesTabBar: true,
        tabBarVisible
    }
  }


  TABS['Pricer'].navigationOptions = ({ navigation }) => {
    const { state: { routes, index } } = navigation;
    let tabBarVisible = true;
    //console.log("TOOOLLLLBAR : " + routes[index].routeName);
    //console.log(routes[index].params);
    if(routes[index].routeName === 'FLAutocallDetailPricer'  || routes[index].routeName === 'FLAutocallDetailTrade'   || routes[index].routeName === 'FLAutocallDetailBroadcastPP'
    || routes[index].routeName === 'FLAutocallDetailBroadcastFriends' || routes[index].routeName === 'FLAutocallDetail'){
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
          
        keyboardHidesTabBar: true,
        tabBarVisible
    }
  }

  TABS['Following'].navigationOptions = ({ navigation }) => {
    const { state: { routes, index } } = navigation;
	let tabBarVisible = true;
	
    if(routes[index].routeName === 'FLTicketDetail'  || routes[index].routeName === 'FLAutocallDetail'){
      if (typeof routes[index].params !== 'undefined') {
          tabBarVisible = !routes[index].params['hideBottomTabBar'];
      }
    }
    return {

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
             <Ionicons 
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
			<Text style={labelStyle(focused,tintColor)}>Suivi</Text>
			</View>
			);
        },
        //tabBarVisible: false,
          
        keyboardHidesTabBar: true,
        tabBarVisible
      
    }
  }


  TABS['Profil'].navigationOptions = ({ navigation }) => {
    const { state: { routes, index } } = navigation;
    let tabBarVisible = true;
    //console.log("TOOOLLLLBAR : " + routes[index].routeName);
    //console.log(routes[index].params);
    
    if(routes[index].routeName === 'ProfileScreenCamera' || routes[index].routeName === 'ProfileClientDetail' || routes[index].routeName === 'ProfileScreenFriends'){
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
          },
        //tabBarVisible: false,
        keyboardHidesTabBar: true,
        tabBarVisible
    }
  }


  export function  AppFinLiveTabs (role) {
        let tabs = {};
        if (role === ROLES.ADMIN) {
          const {Accueil, Tickets, Pricer, Following, Profil, Admin} = TABS;
          tabs = {Accueil, Tickets, Pricer, Following, Profil, Admin};
        }
        else {
          const {Accueil, Tickets, Pricer, Following, Profil} = TABS;
          tabs = {Accueil, Tickets, Pricer,  Following, Profil};
        }
        
        return tabs;

  }