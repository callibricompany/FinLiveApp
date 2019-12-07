import React from 'react'
import { StyleProvider, Container } from 'native-base'
import { Text, YellowBox, ImageBackground, StyleSheet, Platform } from 'react-native'
import * as Font from 'expo-font';

import getTheme from './native-base-theme/components'
import material from './native-base-theme/variables/commonColor'

import UserProvider from './Session/UserProvider'
import Firebase, { FirebaseContext } from './Database';

import Dimensions from 'Dimensions';

import Application from './Components/Login/Application'
import Navigation from './Navigation/Navigation'
import bgSrc from './assets/LogoWithText.png';


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class App extends React.Component {
  constructor(props) {
    super(props);

    YellowBox.ignoreWarnings(['Setting a timer']);



    this.state = {
      loading : true,
    };
    console.log(Platform.OS + "  -> WIDTH : "+ DEVICE_WIDTH+ "   HEIGHT : "+DEVICE_HEIGHT);
  }
 
  async componentDidMount() {
    await Font.loadAsync({
      'FLFontFamily': require('./assets/fonts/Arial.ttf'),
      'FLFontTitle': require('./assets/fonts/Typo_Round_Regular_Demo.otf'),

      'Light' : require('./assets/fonts/roboto/Roboto-Light.ttf'),
      'Regular' : require('./assets/fonts/roboto/Roboto-Regular.ttf'),
      'Thin' : require('./assets/fonts/roboto/Roboto-Thin.ttf'),
      'Bold' : require('./assets/fonts/roboto/Roboto-Bold.ttf'),
      
      //'Light-i' : require('./assets/fonts/roboto/Roboto-LightItalic.ttf'),
      //'Regular-i' : require('./assets/fonts/roboto/Roboto-MediumItalic.ttf'),
      //'Thin-i' : require('./assets/fonts/roboto/Roboto-ThinItalic.ttf'),
      //'Bold-i' : require('./assets/fonts/roboto/Roboto-BoldItalic.ttf'),

    });

    this.setState({ loading: false });  
  }




  render() {
    if (this.state.loading) {
      return (
        <ImageBackground
          source={bgSrc}
          style={styles.picture}
          resizeMode="contain"
        />
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

const styles = StyleSheet.create({

  picture: {
    flex: 1,
    top: 0, left: 0, right: 0, bottom: 0,
    //opacity: 0.15,
    position: "absolute",
    backgroundColor : 'white',
    width: null,
    height: null,
    //resizeMode: 'cover',
  },
});

export default App;



