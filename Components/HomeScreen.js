import React from 'react'
import { View, Button, Text, AsyncStorage, Alert} from 'react-native'
  
import { globalStyle } from '../Styles/globalStyle'

import Icon from 'react-native-vector-icons/FontAwesome'

class HomeScreen extends React.Component {
    static navigationOptions = {
      title: 'FinLive'
    }

    constructor(props) {
      super(props)

      //this._signOutAsync = this._signOutAsync.bind(this)
    }

    _NavToNewsList = () => {
      this.props.navigation.navigate('NewsList');
    };



  
    render() {
      return(
        <View style={globalStyle.container}>
          <Text style={globalStyle.defaultText}>Bienvenue dans l'application</Text>
          <Button title="Les denières actualités" onPress={this._NavToNewsList} />
        </View>
      );
      }
}

export default HomeScreen