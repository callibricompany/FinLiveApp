import React from 'react'
import { View, Button, StatusBar} from 'react-native'

//import globalStyle from '../../Styles/globalStyle'


class OtherScreen extends React.Component {
  static navigationOptions = {
    title: 'Lots of features here'
  }

  constructor(props) {
    super(props)

  }
  

  render() {
    console.log(this.props);
    return (
      <View>
        <Button title="I'm done, sign me out" onPress={this.props.logout()} />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default OtherScreen
//<View style={styles.container}>