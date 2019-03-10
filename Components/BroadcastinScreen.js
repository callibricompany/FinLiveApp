import React from 'react'
import { View, Button, Text } from 'react-native'
import { FLButton } from './commons';
  
import { globalStyle } from '../Styles/globalStyle'



class BroadcastingScreen extends React.Component {
    static navigationOptions = {
      title: 'Diffusion'
    }

    constructor(props) {
      super(props)

    }



  
    render() {


      return(
        <View style={globalStyle.container}>
          <Text style={globalStyle.defaultText}>Suivi</Text>
        </View>
      );
      }
}

export default BroadcastingScreen