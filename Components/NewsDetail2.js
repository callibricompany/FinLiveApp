import React from 'react'
import { View, Button, Text, AsyncStorage, Alert} from 'react-native'
  
import { globalStyle } from '../Styles/globalStyle'



class NewsDetail2 extends React.Component {



    constructor(props) {
      super(props)

      //this._signOutAsync = this._signOutAsync.bind(this)
    }





  
    render() {
 //     const id = this.props.navigation.getParam('id', 'NO-ID');
      const text = this.props.text;

      return(

    
        <View style={globalStyle.container}>
          <Text>{text}</Text>
        </View>
      );
      }
}

export default NewsDetail2