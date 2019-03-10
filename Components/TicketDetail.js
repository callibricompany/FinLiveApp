import React from 'react'
import { View, Button, Text, AsyncStorage, Alert} from 'react-native'
  
import { globalStyle } from '../Styles/globalStyle'



class TicketDetail extends React.Component {


    static navigationOptions = ({ navigation }) => {
      return {
        title: navigation.getParam('text', '...'),
        //headerLeft: (<Text>Toto</Text>)
      };
    };

    constructor(props) {
      super(props)

      //this._signOutAsync = this._signOutAsync.bind(this)
    }





  
    render() {
      const id = this.props.navigation.getParam('id', 'NO-ID');
      const text = this.props.navigation.getParam('text', 'some default value');

      return(

    
        <View style={globalStyle.container}>
          <Text>Détail du ticket</Text>
        </View>
      );
      }
}

export default TicketDetail