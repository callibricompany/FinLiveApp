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

import * as ROLES from '../constants/roles';



const Navigation =  createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppFinLiveTabs(''),
    AppAdmin : AppFinLiveTabs(ROLES.ADMIN),
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


