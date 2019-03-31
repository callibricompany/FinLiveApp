import React from 'react'
import Navigation from './Navigation/Navigation'
import UserProvider from './Context/UserProvider'
import Firebase, { FirebaseContext } from './Database';


import { StyleProvider, Container, Text } from 'native-base'

import getTheme from './native-base-theme/components'
import material from './native-base-theme/variables/commonColor'

import { Font } from "expo";

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { loading: true };
    
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
          <Text>Ca charge ...</Text>
      );
    }
    return (
     
      <FirebaseContext.Provider value={new Firebase()}>
      <UserProvider>
        <StyleProvider  style={getTheme(material)}>  
        <Container>
           <Navigation/>
        </Container>
        </StyleProvider>
      </UserProvider>
      </FirebaseContext.Provider>

    );
  }
}

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


