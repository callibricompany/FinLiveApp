//carte de l'application
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation'

import AuthLoadingScreen from '../Components/Login/AuthLoadingScreen'
import LoginScreen from '../Components/Login/LoginScreen'

import HomeScreen from '../Components/HomeScreen'
import OtherScreen from '../Components/OtherScreen'



const AppStack = createStackNavigator(
  { 
    Home: HomeScreen, 
    Other: OtherScreen 
  }
  );


const AuthStack = createStackNavigator(
  { 
    SignIn: LoginScreen 
  }
  );

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));