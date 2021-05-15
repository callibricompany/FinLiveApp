import React from 'react'
import { InteractionManager, YellowBox, ImageBackground, StyleSheet, Platform, Dimensions} from 'react-native'
import * as Font from 'expo-font';

import getTheme from './native-base-theme/components'
import material from './native-base-theme/variables/commonColor'

import NotificationProvider from './Session/NotificationProvider'
import Firebase, { FirebaseContext } from './Database';

import { getConstant } from './Utils';

import Application from './Components/Login/Application'
import Navigation from './Navigation/Navigation'
import bgSrc from './assets/LogoWithText.png';






const _setTimeout = global.setTimeout;
const _clearTimeout = global.clearTimeout;
const MAX_TIMER_DURATION_MS = 60 * 1000;
if (Platform.OS === 'android') {
// Work around issue `Setting a timer for long time`
// see: https://github.com/firebase/firebase-js-sdk/issues/97
    const timerFix = {};
    const runTask = (id, fn, ttl, args) => {
        const waitingTime = ttl - Date.now();
        if (waitingTime <= 1) {
            InteractionManager.runAfterInteractions(() => {
                if (!timerFix[id]) {
                    return;
                }
                delete timerFix[id];
                fn(...args);
            });
            return;
        }

        const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS);
        timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime);
    };

    global.setTimeout = (fn, time, ...args) => {
        if (MAX_TIMER_DURATION_MS < time) {
            const ttl = Date.now() + time;
            const id = '_lt_' + Object.keys(timerFix).length;
            runTask(id, fn, ttl, args);
            return id;
        }
        return _setTimeout(fn, time, ...args);
    };

    global.clearTimeout = id => {
        if (typeof id === 'string' && id.startWith('_lt_')) {
            _clearTimeout(timerFix[id]);
            delete timerFix[id];
            return;
        }
        _clearTimeout(id);
    };
}



class App extends React.Component {
  constructor(props) {
    super(props);

    YellowBox.ignoreWarnings(['Setting a timer', 'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`']);
    console.ignoredYellowBox = [
      'Setting a timer'
    ];


    this.state = {
      loading : true,
    };
    console.log(Platform.OS + "  -> WIDTH : "+ getConstant('width')+ "   HEIGHT : "+getConstant('height'));
  }
 
  async componentDidMount() {
    await Font.loadAsync({
      //'FLFontFamily': require('./assets/fonts/Arial.ttf'),
      'FLFont': require('./assets/fonts/Typo_Round_Regular_Demo.otf'),
      'FLFontBold': require('./assets/fonts/Typo_Round_Bold_Demo.otf'),
      'Light' : require('./assets/fonts/roboto/Roboto-Light.ttf'),
      'Italic' : require('./assets/fonts/roboto/Roboto-Italic.ttf'),
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
          <NotificationProvider>
      
       
            <Application/>

          </NotificationProvider>
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




