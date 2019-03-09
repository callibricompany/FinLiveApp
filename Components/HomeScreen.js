import React from 'react'
import { View, Button, Text, AsyncStorage} from 'react-native'
  
//import { globalStyle } from '../Styles/globalStyle'


class HomeScreen extends React.Component {
    static navigationOptions = {
      title: 'Welcome to the app!'
    }

    constructor(props) {
      super(props)

      this._signOutAsync = this._signOutAsync.bind(this)
    }

    _showMoreApp = () => {
      this.props.navigation.navigate('Other');
    };

    _signOutAsync = async () => {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
    };
  
    render() {
      return(
        <View>
          <Text>Alouette</Text>
          <Button title="Show me more of the app" logout={this._signOutAsync} onPress={this._showMoreApp} />
          <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
        </View>
      );
      }
}

export default HomeScreen