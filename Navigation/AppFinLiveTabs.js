import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'

import HomeScreen from '../Components/Home/HomeScreen'
import NewsList from '../Components/Home/NewsList'
import NewsDetail from '../Components/Home/NewsDetail'
import NewsDetailWeb from '../Components/Home/NewsDetailWeb'
import PricerScreen from '../Components/Pricer/PricerScreen'
import StructuredProductDetail from '../Components/Pricer/StructuredProductDetail'
import ProfileScreen from '../Components/ProfileScreen'
import TicketsList from '../Components/Ticket/TicketsList'
//import TicketDetail from '../Components/Ticket/TicketDetail'
import TicketDetail from '../Components/Ticket/SearchScreen'
import BroadcastingScreen from '../Components/Broadcast/BroadcastingScreen'
import AdminScreen from '../Components/AdminScreen'

import FontAwesomeI from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons'
import { Icon } from 'native-base'

import { tabBackgroundColor } from '../Styles/globalStyle';

import * as ROLES from '../constants/roles';

const tabIconFocused = 'white';
//const tabIconNonFocused = '#C8D1DB';
const tabIconNonFocused = 'white';

const TABS_BAR_OPTIONS = {
  tabBarOptions: {
    activeBackgroundColor: tabBackgroundColor, // Couleur d'arrière-plan de l'onglet sélectionné
    inactiveBackgroundColor: tabBackgroundColor, // Couleur d'arrière-plan des onglets non sélectionnés
    showLabel: true, // On masque les titres
    showIcon: true, // On informe le TabNavigator qu'on souhaite afficher les icônes définis
    activeTintColor: '#85B3D3',
    //inactiveTintColor: '#707070',
    inactiveTintColor: tabBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    style: {
      backgroundColor: tabBackgroundColor,
      borderTopColor: 'gray',
      paddingTop: 10,
      borderTopWidth: 1,
      height: 70,
      //ustifyContent: 'center',
      //alignItems: 'center',
      },

    labelStyle:{
 //       labelSize: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0
      },
    iconStyle: {
        flexGrow: 1,
        marginTop: 0,
        marginBottom: 0,
        //alignItems : 'center'
      },
  },
}

function labelStyle (focused, tintColor) {
    if (focused) {
      couleur = tintColor }
    else {
       //couleur = '#707070' }
       couleur = 'silver' }
  
    
    return {
      marginTop:10,  
      fontSize: 14 ,
      //fontWeight: 'bold',
      justifyContent: 'center',
      alignItems: 'center',
      color: couleur
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
    }
  }, 
  {
    initialRouteName: 'Home'
  })
  
  //Ecran pricer
  const PricerScreenStack = createStackNavigator({
    Pricer: {
      screen: PricerScreen,
      navigationOptions: {
        title: 'Evaluer'
      },
    },
    StructuredProductDetail : {
      screen : StructuredProductDetail
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
          title: 'Broadcast'
        }
      },

      })
  //Ecran profil
  const ProfilScreenStack = createStackNavigator({
  Profil: {
    screen: ProfileScreen,
    navigationOptions: {
      title: 'Profil'
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
            }
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
            }
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
        
        return createBottomTabNavigator(tabs, TABS_BAR_OPTIONS);

  }