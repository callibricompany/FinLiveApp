//carte de l'application
import React from 'react'
import { StyleSheet, View, Text, Platform } from 'react-native'
import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation'

import AuthLoadingScreen from '../Components/Login/AuthLoadingScreen'
import SplashScreen from '../Components/Login/SplashScreen'
import Login from '../Components/Login/Login2'
import Register from '../Components/Login/Register'
import WaitingRoom from '../Components/Login/WaitingValidationScreen'
import { AppFinLiveTabs } from './AppFinLiveTabs';

import { blueFLColor, FLFontFamily } from '../Styles/globalStyle';

import * as ROLES from '../constants/roles';


const TABS_BAR_OPTIONS = {
  tabBarOptions: {
    activeBackgroundColor: 'white', // Couleur d'arrière-plan de l'onglet sélectionné
    inactiveBackgroundColor: 'white', // Couleur d'arrière-plan des onglets non sélectionnés
    showLabel: true, // On masque les titres
    showIcon: true, // On informe le TabNavigator qu'on souhaite afficher les icônes définis
    activeTintColor: blueFLColor,//'#85B3D3',
    //inactiveTintColor: '#707070',
    inactiveTintColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    style: {
      backgroundColor: 'white',
      borderTopColor: blueFLColor,
      paddingTop: 10,
      borderTopWidth: 0,
      height: Platform.OS === 'ios' ? 60 : 70,
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


const bottomTabs = createBottomTabNavigator(AppFinLiveTabs(''), TABS_BAR_OPTIONS);
const bottomTabsAdmin = createBottomTabNavigator(AppFinLiveTabs(ROLES.ADMIN), TABS_BAR_OPTIONS);



const Navigation =  createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: bottomTabs,
    AppAdmin : bottomTabsAdmin,
    Login: Login,
    Register: Register,
    Splash: SplashScreen,
    WaitingRoom : WaitingRoom
  },
  {
    initialRouteName: 'Splash',
  }
));




export default Navigation;


