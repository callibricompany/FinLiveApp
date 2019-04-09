import React from 'react'

import UserProvider from './Context/UserProvider'
import Firebase, { FirebaseContext } from './Database';
import Application from './Components/Login/Application'

import { StyleProvider, Container, Text } from 'native-base'

import getTheme from './native-base-theme/components'
import material from './native-base-theme/variables/commonColor'

//import { Font } from "expo";




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
    };
    
  }
 

  /*async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    
  }*/



  render() {
    if (this.state.loading) {
      return (
          <Text>Ca charge ...</Text>
      );
    }
    console.log("RENDER APP");
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


