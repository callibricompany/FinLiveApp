import React from 'react'
import { StyleProvider, Container } from 'native-base'
import { Text, YellowBox } from 'react-native'
import * as Font from 'expo-font';

import getTheme from './native-base-theme/components'
import material from './native-base-theme/variables/commonColor'

import UserProvider from './Session/UserProvider'
import Firebase, { FirebaseContext } from './Database';

import Dimensions from 'Dimensions';

import Application from './Components/Login/Application'
import Navigation from './Navigation/Navigation'


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class App extends React.Component {
  constructor(props) {
    super(props);

    YellowBox.ignoreWarnings(['Setting a timer']);



    this.state = {
      loading : true,
    };
    console.log("WIDTH : "+ DEVICE_WIDTH+ "   HEIGHT : "+DEVICE_HEIGHT);
  }
 
  async componentDidMount() {
    await Font.loadAsync({
      'FLFontFamily': require('./assets/fonts/Arial.ttf'),
      'FLFontTitle': require('./assets/fonts/Typo_Round_Regular_Demo.otf'),
    });

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


