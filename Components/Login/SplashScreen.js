import React from 'react';
import { StyleSheet, View, Text, Dimensions, ImageBackground, StatusBar} from 'react-native';
import { Button } from 'native-base';

import bgSrc from '../../assets/splash.jpg';
const DEVICE_WIDTH = Dimensions.get('window').width;

class SplashScreen extends React.Component {
  performTimeConsumingTask = async() => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        3000
      )
    )
  }

  async componentDidMount() {
    // Preload data from an external API
    // Preload data using AsyncStorage
    const data = await this.performTimeConsumingTask();

    if (data !== null) {
      this.props.navigation.navigate('AuthLoading');
    }
  }

  render() {
    var {height, width} = Dimensions.get('window');
    console.log ("HAUTEUR" + height);
    console.log ("LARGEUR" + width);
    return (
          <View style={styles.container}>
          <StatusBar hidden />
            <ImageBackground
              source={{uri: 'https://picsum.photos/400/600?random'}}
              //source={{uri: 'https://picsum.photos/' + width + '/' + '/' + height + '?random'}}
              //</View>source={{uri: 'https://images.unsplash.com/photo-1424819827928-55f0c8497861?fit=crop&w=600&h=600'}}
              //source={bgSrc}
              style={styles.image}
            >
   <View style={styles.main_view}>
                  <Button  style={{height:100, width:DEVICE_WIDTH-50, alignItems:'center',justifyContent:'center'}} dark>
                    <Text style={{color: 'aquamarine',fontWeight: 'bold',fontSize: 50,}}>FinLive</Text>
                  </Button>
                  </View>
            </ImageBackground>
          </View >
    );
  }
}
const styles = StyleSheet.create({
main_view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
},
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  image: {
    flexGrow:1,
    height:null,
    width:null,
    alignItems: 'center',
    justifyContent:'center',
  },
  paragraph: {
    textAlign: 'center',
    color: 'aquamarine',
    fontSize: 60,
    fontWeight: 'bold'
  },
});



/*      <View style={styles.main_container}>
        <Image style={styles.imageStyle} source={bgSrc} />
        <Text style={styles.textStyles}>
          FinLive
        </Text>
      </View>
    );
  }
}

const styles = {
  main_container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'aquamarine'
  },
  imageStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyles: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold'
  }
}*/

export default SplashScreen;