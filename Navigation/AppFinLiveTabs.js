import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation'

import HomeScreen from '../Components/Home/HomeScreen'
import NewsList from '../Components/Home/NewsList'
import NewsDetail from '../Components/Home/NewsDetail'
import PricerScreen from '../Components/Pricer/PricerScreen'
import StructuredProductDetail from '../Components/Pricer/StructuredProductDetail'
import ProfileScreen from '../Components/ProfileScreen'
import TicketsList from '../Components/TicketsList'
import TicketDetail from '../Components/TicketDetail'
import BroadcastingScreen from '../Components/BroadcastinScreen'
import AdminScreen from '../Components/AdminScreen'

import FontAwesomeI from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons'

import * as ROLES from '../constants/roles';

function labelStyle (focused, tintColor) {
    if (focused) {
      couleur = tintColor }
    else {
       couleur = '#707070' }
  
    
    return {
      marginTop:10,  
      fontSize: 14 ,
      fontWeight: 'bold',
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
      screen: TicketDetail
    }
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
                  style={focused ? { color: 'white' } : { color: '#C8D1DB' }}
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
                        borderRadius:50,
                      }}
                  >
                  <FontAwesomeI
                  name='euro'
                  size={30}
                  style={focused ? { color: 'white' } : { color: '#C8D1DB' }}
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
                <FontAwesomeI
                name='ticket'
                size={30}
                style={focused ? { color: 'white' } : { color: '#C8D1DB' }}
            />
            </View>
          );
        },
        tabBarLabel: ({ focused, tintColor }) => {
          return (
            <View style={{alignItems:'center', justifyContent:'center'}}>
            <Text style={labelStyle(focused,tintColor)}>Tickets</Text>
            </View>
          );
          }
        }
      },
      Broadcasting: {
        screen: BroadcastingScreen,
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
                  <MaterialCommunityIconsI
                  name='radio-tower'
                  size={30}
                  style={focused ? { color: 'white' } : { color: '#C8D1DB' }}
              />
              </View>
            );
          },
          tabBarLabel: ({ focused, tintColor }) => {
            return (
              <View style={{alignItems:'center', justifyContent:'center'}}>
              <Text style={labelStyle(focused,tintColor)}>Diffusion</Text>
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
                  style={focused ? { color: 'white' } : { color: '#C8D1DB' }}
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
                  style={focused ? { color: 'white' } : { color: '#C8D1DB' }}
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
  
  const TABS_BAR_OPTIONS = {
      tabBarOptions: {
        activeBackgroundColor: '#C8D1DB', // Couleur d'arrière-plan de l'onglet sélectionné
        inactiveBackgroundColor: '#C8D1DB', // Couleur d'arrière-plan des onglets non sélectionnés
        showLabel: true, // On masque les titres
        showIcon: true, // On informe le TabNavigator qu'on souhaite afficher les icônes définis
        activeTintColor: '#85B3D3',
        inactiveTintColor: '#707070',
        justifyContent: 'center',
        alignItems: 'center',
        style: {
          backgroundColor: '#C8D1DB',
          borderTopColor: '#C8D1DB',
          borderTopWidth: 15,
          height: 65,
          justifyContent: 'center',
          alignItems: 'center',
          },
   
        labelStyle:{
     //       labelSize: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10
          },
        iconStyle: {
            flexGrow: 1,
            marginTop: 0,
            marginBottom: 10
          },
      },
  }
    
 /* export default class AppFinLiveTabs extends React.Component {
    constructor(props) {
        super(props);
    }
  
    _tabNavigator() {
        let tabs = {};
        const {Accueil, Pricer} = TABS;
        tabs = {Accueil, Pricer};
  
        return createBottomTabNavigator(TABS, TABS_BAR_OPTIONS);
    }
  
    render() {
        const Tabs = this._tabNavigator.bind(this);
        //const Tabs = createBottomTabNavigator(TABS, TABS_BAR_OPTIONS);
        return (
            <Tabs/>
        );
    }
  }*/

  export function  AppFinLiveTabs (role) {
        let tabs = {};
        if (role === ROLES.ADMIN) {
          const {Accueil, Pricer, Tickets, Broadcasting, Profil, Admin} = TABS;
          tabs = {Accueil, Pricer, Tickets, Broadcasting, Profil, Admin};
        }
        else {
          const {Accueil, Pricer, Tickets, Broadcasting, Profil} = TABS;
          tabs = {Accueil, Pricer, Tickets, Broadcasting, Profil};
        }
        
        return createBottomTabNavigator(tabs, TABS_BAR_OPTIONS);

  }