import React from 'react'
import { View, Button, Text } from 'react-native'
import { FLButton } from './commons';
  
import { globalStyle } from '../Styles/globalStyle'



class TicketsList extends React.Component {
    static navigationOptions = {
      title: 'Liste des tickets'
    }

    constructor(props) {
      super(props)

    }



    onButtonPress(idNew, textNew) {
          this.props.navigation.navigate('TicketDetail', {
            id: idNew,
            text: textNew,
          });
 //         this.props.navigation.navigate('NewDetail');
  }

  
    render() {
      news1 = 'Ticket 1'
      news2 = 'Ticket 2'

      return(
        <View style={globalStyle.container}>
          <Text style={globalStyle.defaultText}>Liste de mes tickets</Text>
          <FLButton onPress={this.onButtonPress.bind(this, 1, news1)}>{news1}</FLButton>
          <FLButton onPress={this.onButtonPress.bind(this, 2, news2)}>{news2}</FLButton>
        </View>
      );
      }
}

export default TicketsList