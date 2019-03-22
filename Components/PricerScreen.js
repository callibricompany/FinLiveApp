import React from 'react'
import { AsyncStorage, TouchableOpacity} from 'react-native'
import { Label, Right, Left, Body, Content, Text, Header, Item, InputGroup, Icon, Input, Button, Container } from 'native-base'
import { globalStyle } from '../Styles/globalStyle'
import getTheme from '../native-base-theme/components'
import material from '../native-base-theme/variables/material'
import { Font, AppLoading } from "expo";
import { UserContext } from '../Context/UserProvider';
import FLSearchInput from './commons/FLSearchInput';




class PricerScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = { 
      filterText: ''
    };
  }

  static navigationOptions = {
    header: () => {
     // this.filterText = ''
   
      

      /*if (this.state.filterText === '') {
        myFLFilterInput = <Icon name="people" /> ;
        console.log('NULLLLLLLL')
      } else {
        myFLFilterInput = <Icon name="close" /> ;
        console.log('YA UN TRUC')
      }*/
      return (
        <Header>      
            <Left style={{ flex: 2 }}><Button transparent>
              <Icon name='menu' />
            </Button>   
            </Left>    
            <Body searchBar style={{ flex: 8 }}>
              <FLSearchInput />                  
            </Body>
            <Right style={{ flex: 1 }}/>
        </Header>
        );
      }
  }
  /*static navigationOptions = ({ navigation }) => {
    const setState = navigation.getParam('setState', () => { })
    //const myCustomFunction = navigation.getParam('myCustomFunction', () => { })
    return (
      <Header>      
      <Left style={{ flex: 2 }}>
      <Button transparent onPress={() => setState({ buttonPressed: true })}>
        <Icon name='menu' />
      </Button>   
      </Left>  
      </Header>
        //headerRight: <TouchableOpacity onPress={() => setState({ buttonPressed: true })} />,
        //headerLeft: <TouchableOpacity onPress={() => myCustomFunction()} />

    );
}

  componentWillMount() {
        this.props.navigation.setParams({
            setState: this.setState.bind(this),
            //myCustomFunction: myCustomFunction.bind(this),
        })
  }*/


  render() {
    return (
        <Container>
          <Content style={{flex:1}}>
            <Text>
             Dans peu de temps, un pricer remplacera ce texte !!!
            </Text>
            <UserContext.Consumer>
              {value => <Label>{value.searchInputText}</Label>}
            </UserContext.Consumer> 
          </Content>
        </Container>

    );
  }
}

export default PricerScreen

//<InputGroup  rounded style={{flex:1, backgroundColor:'#fff',height:30}}>