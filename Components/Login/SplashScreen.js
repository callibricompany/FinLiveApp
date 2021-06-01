import React from 'react';
import { StyleSheet, View, Text, Dimensions, ImageBackground, Image, StatusBar} from 'react-native';


import bgSrc from '../../assets/LogoWithText.png';
import { getConstant } from '../../Utils';




class SplashScreen extends React.Component {
  performTimeConsumingTask = async() => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        500
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
    //console.log ("HAUTEUR" + height);
    //console.log ("LARGEUR" + width);
    return (
 
          <View style={styles.container}>
          <StatusBar hidden />
          
          {/*<Svg width={getConstant('width')} height={getConstant('height')} viewBox="0 0 100 100">
             <Svg.Circle cx="100" cy="0" r="50" fill="#479ac8" opacity="0.2"/>
             <Svg.Circle cx="0" cy="100" r="50" fill="#479ac8" opacity="0.2"/>
    </Svg>*/}
            <ImageBackground
            //source={{uri: 'https://picsum.photos/200/300?image=1062'}}
              //source={{uri: 'https://picsum.photos/400/600?random'}}
              //source={{uri: 'https://picsum.photos/' + width + '/' + '/' + height + '?random'}}
              //</View>source={{uri: 'https://images.unsplash.com/photo-1424819827928-55f0c8497861?fit=crop&w=600&h=600'}}
              source={bgSrc}
              style={styles.picture}
              resizeMode="contain"
            />

          </View >
    );
  }
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
   // alignItems: 'stretch',
   // justifyContent: 'center',
  },
  image: {
    //flexGrow:1,
    flex:1,
    width:null,
    height:null,
    alignItems: 'center',
    justifyContent:'center',
  },
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


export default SplashScreen;