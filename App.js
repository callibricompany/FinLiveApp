import React from 'react'
import { StyleProvider, Container } from 'native-base'
import { Text } from 'react-native'
import Expo from "expo";

import getTheme from './native-base-theme/components'
import material from './native-base-theme/variables/commonColor'

import UserProvider from './Session/UserProvider'
import Firebase, { FirebaseContext } from './Database';



import Application from './Components/Login/Application'
import Navigation from './Navigation/Navigation'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : true,
    };
    
  }
 

  async componentWillMount() {
    try {
      await Expo.Font.loadAsync({
  //      Roboto: require("native-base/Fonts/Roboto.ttf"),
  //      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
          //Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
      })
      } catch (error) {
        console.log('Erreur chargement icon fonts', error);
      }

    this.setState({ loading: false });    
  }



  render() {
    if (this.state.loading) {
      return (
          <Text>Ca charge ...</Text>
      );
    }
    //console.log("RENDER APP");
    return (
     
      <FirebaseContext.Provider value={new Firebase()}>
      <UserProvider>
        <StyleProvider  style={getTheme(material)}>  
        <Container>
           <Application/>
        </Container>
        </StyleProvider>
      </UserProvider>
      </FirebaseContext.Provider>

    );
  }
}


export default App;
/*
      <FirebaseContext.Provider value={new Firebase()}>
      <UserProvider>
        <StyleProvider  style={getTheme(material)}>  
        <Container>
           <Navigation/>
        </Container>
        </StyleProvider>
      </UserProvider>
      </FirebaseContext.Provider>
*/


