import React from 'react'
import { View, Text, StatusBar, AsyncStorage} from 'react-native'

import { globalStyle } from '../Styles/globalStyle'


class PricerScreen extends React.Component {
  static navigationOptions = {
    title: 'Pricer'
  }

  constructor(props) {
    super(props)

  }


  render() {
    return (
      <View style={globalStyle.container}> 
        <Text>Dans peu de temps un pricer remplacera ce texte</Text>
      </View>
    );
  }
}

export default PricerScreen