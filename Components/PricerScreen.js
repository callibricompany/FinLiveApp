import React from 'react'
import { AsyncStorage} from 'react-native'
import { Right, Left, Body, Content, Text, Header, InputGroup, Icon, Input, Button } from 'native-base'
import { globalStyle } from '../Styles/globalStyle'


class PricerScreen extends React.Component {
  static navigationOptions = {
    header: (
      
      <Header searchBar rounded>
        <Left>
        <Button transparent onPress={() => null}>
          <Icon name="calendar"/>
        </Button>
        </Left>
        <Body>
        <InputGroup  rounded style={{flex:1, backgroundColor:'#fff',height:30, width:300}}>
         
          <Input rounded style={{height:20, width:100}} placeholder="Rechercher tickets" />
          <Icon name="ios-search" />
        </InputGroup>
        </Body>
        <Right>
          <Button transparent>
              <Icon name='more' />
            </Button>
      </Right>
    
     </Header>
    )
  }

  constructor(props) {
    super(props)

  }


  render() {
    return (
             <Content>
             <Text>
             Dans peu de temps, un pricer remplacera ce texte !!!
             </Text>
           </Content>
    );
  }
}

export default PricerScreen