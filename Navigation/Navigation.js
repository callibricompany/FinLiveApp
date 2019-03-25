//carte de l'application
import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation'

import AuthLoadingScreen from '../Components/Login/AuthLoadingScreen'
import SplashScreen from '../Components/Login/SplashScreen'
import Login from '../Components/Login/Login'
import Register from '../Components/Login/Register'

import HomeScreen from '../Components/HomeScreen'
import NewsList from '../Components/NewsList'
import NewsDetail from '../Components/NewsDetail'
import PricerScreen from '../Components/PricerScreen'
import ProfileScreen from '../Components/ProfileScreen'
import TicketsList from '../Components/TicketsList'
import TicketDetail from '../Components/TicketDetail'
import BroadcastingScreen from '../Components/BroadcastinScreen'

import FontAwesomeI from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons'
import { TabBarItem } from 'react-native-vector-icons/AntDesign';

//import { Ionicons } from 'react-native-vector-icons';




/*class IconWithBadge extends React.Component {
  render() {
    const { name, badgeCount, color, size } = this.props;
    return (
      <View style={{ width: 24, height: 24, margin: 5 }}>
        <Ionicons name={name} size={size} color={color} />
        {badgeCount > 0 && (
          <View
            style={{
              // /If you're using react-native < 0.57 overflow outside of the parent
              // will not work on Android, see https://git.io/fhLJ8
              position: 'absolute',
              right: -6,
              top: -3,
              backgroundColor: 'red',
              borderRadius: 6,
              width: 12,
              height: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const HomeIconWithBadge = props => {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  return <IconWithBadge {...props} badgeCount={3} />;
};

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;
  let iconName;
  if (routeName === 'Home') {
    iconName = `ios-information-circle${focused ? '' : '-outline'}`;
    // We want to add badges to home tab icon
    IconComponent = HomeIconWithBadge;
  } else if (routeName === 'Settings') {
    iconName = `ios-options${focused ? '' : '-outline'}`;
  }

  // You can return any component that you like here!
  return <IconComponent name={iconName} size={25} color={tintColor} />;
};

*/



//Ecran accueil
const HomeScreenStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
 //   navigationOptions: {
 //     title: 'FinLive'
 //   }
  },
  NewsList: {
    screen: NewsList
  },
  NewsDetail : {
    screen: NewsDetail
  }
})

//Ecran pricer
const PricerScreenStack = createStackNavigator({
Pricer: {
  screen: PricerScreen,
  navigationOptions: {
    title: 'Evaluer'
  }
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



const AppFinLive = createBottomTabNavigator(
  {
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
            <Text style={labelStyle(focused,tintColor)}>Accueil</Text>
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
            <Text style={labelStyle(focused,tintColor)}>Evaluer</Text>
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
          <Text style={labelStyle(focused,tintColor)}>Tickets</Text>
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
            <Text style={labelStyle(focused,tintColor)}>Diffusion</Text>
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
            <Text style={labelStyle(focused,tintColor)}>Profil</Text>
          );
          }
      }

    }

  },


  {
    tabBarOptions: {
      activeBackgroundColor: '#C8D1DB', // Couleur d'arrière-plan de l'onglet sélectionné
      inactiveBackgroundColor: '#C8D1DB', // Couleur d'arrière-plan des onglets non sélectionnés
      showLabel: true, // On masque les titres
      showIcon: true, // On informe le TabNavigator qu'on souhaite afficher les icônes définis
      activeTintColor: '#85B3D3',
      inactiveTintColor: '#9A9A9A',
      style: {
        backgroundColor: '#C8D1DB',
        borderTopColor: '#C8D1DB',
        borderTopWidth: 15,
        height: 65
        },
 
      labelStyle:{
   //       labelSize: 30,
          marginTop: 10
        },
      iconStyle: {
          flexGrow: 1,
          marginTop: 0,
          marginBottom: 10
        },
    },
    /*defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
        getTabBarIcon(navigation, focused, tintColor),
      }),
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      },*/

    }
)


function labelStyle (focused, tintColor) {
  if (focused) {
    couleur = tintColor }
  else {
     couleur = '#9A9A9A' }
  return {
    marginTop:10,  
    fontSize: 14 ,
    fontWeight: 'bold',
    color: couleur
  }
}


const styles = StyleSheet.create({
  icon: {
     color: '#9A9A9A',
  }
})  

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppFinLive,
    Login: Login,
    Register: Register,
    Splash: SplashScreen
  },
  {
    initialRouteName: 'Splash',
  }
));


