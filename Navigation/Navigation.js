//carte de l'application
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation'

import AuthLoadingScreen from '../Components/Login/AuthLoadingScreen'
import LoginScreen from '../Components/Login/LoginScreen'

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
        tabBarIcon: () => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
          return <FontAwesomeI name='home' size={30} style={styles.icon}/> // On applique un style pour les redimensionner comme il faut
        }
      }
    },
    Evaluer: {
      screen: PricerScreenStack,
      navigationOptions: {
        tabBarIcon: () => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
          return (
            <FontAwesomeI name='euro' size={30} style={styles.icon}/>
          );
        }
      }
    },
    Tickets: {
      screen: TicketScreenStack,
      navigationOptions: {
        tabBarIcon: () => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
          return <FontAwesomeI name='ticket' size={30} style={styles.icon}/> // On applique un style pour les redimensionner comme il faut
        }
      }
    },
    Broadcasting: {
      screen: BroadcastingScreen,
      navigationOptions: {
        tabBarIcon: () => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
          return <MaterialCommunityIconsI name='radio-tower' size={30} style={styles.icon}/> // On applique un style pour les redimensionner comme il faut
        }
      }
    },
    Profil: {
      screen: ProfilScreenStack,
      navigationOptions: {
        tabBarIcon: () => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
          return <FontAwesomeI name='user-o' size={30} style={styles.icon}/> // On applique un style pour les redimensionner comme il faut
        }
      }

    }

  },


  {
    tabBarOptions: {
      activeBackgroundColor: '#DDDDDD', // Couleur d'arrière-plan de l'onglet sélectionné
      inactiveBackgroundColor: '#FFFFFF', // Couleur d'arrière-plan des onglets non sélectionnés
      showLabel: true, // On masque les titres
      showIcon: true // On informe le TabNavigator qu'on souhaite afficher les icônes définis
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


const AuthStack = createStackNavigator(
  { 
    SignIn: LoginScreen 
  }
  );


const styles = StyleSheet.create({
  icon: {
     color: '#229298',
  }
})  

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppFinLive,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));


