import React from 'react'
import { View, AsyncStorage, Alert} from 'react-native'
import { Form, Item, Label, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem }  from "native-base";
import { globalStyle } from '../Styles/globalStyle'
import { UserContext } from '../Context/UserProvider';
import FLInput from '../Components/commons/FLInput'

//import Icon from 'react-native-vector-icons/FontAwesome'

class HomeScreen extends React.Component {
  static navigationOptions = {
/*      title: 'FinLive'
    }
*/

//static navigationOptions = ({ navigation }) => ({
  header: (
    <Header>
    <Left>
    </Left>
    <Body>
      <Title>FinLive</Title>
    </Body>
    <Right >
    <Button transparent>
              <Icon name='more' />
            </Button>
      </Right>
  </Header>
  )
}



    constructor(props) {
      super(props)

      //this._signOutAsync = this._signOutAsync.bind(this)
    }

    _NavToNewsList = () => {
      this.props.navigation.navigate('NewsList');
    };

    _alert =  () => {
      Alert.alert(
        'Coucou',
        'Test')
    };
  
    render() {
      //console.log(this.props);
      return(
       
            <Container>
              <Content padder>
                <Card>
                  <CardItem>
                    <Body>
                      <Text>bla bla bla ...</Text>
                    </Body>
                  </CardItem>
                </Card>
                <Button full rounded dark
                  style={{ marginTop: 10 }}
                  onPress={this._alert}>
                  <Text>Alerte test</Text>
                </Button>
                <Button full rounded primary
                  style={{ marginTop: 10 }}
                  //onPress={() => this.props.navigation.navigate("Profile")}
                  onPress={this._NavToNewsList}
                  >
                  <Text>Actualités</Text>
                </Button>
               
                  
                  <UserContext.Consumer>
                  {value => <Text>Hello {value.name}</Text>}
                  </UserContext.Consumer> 
                  <FLInput></FLInput>
                  
                    <Button full rounded primary
                        style={{ marginTop: 10 }}
                        onPress={this._NavToNewsList}
                    >
                       <UserContext.Consumer>
                          {value => <Text>{value.name}</Text>}
                      </UserContext.Consumer> 
                    </Button>
              </Content>
            </Container>
            
        /*<View style={globalStyle.container}>
          <Text style={globalStyle.defaultText}>Bienvenue dans l'application</Text>
          <Button title="Les denières actualités" onPress={this._NavToNewsList} />
        </View>*/
      );
      }
}


export default HomeScreen

//<Input autoCorrect={false} onChange={e => {this.props.setName(e.nativeEvent.text)}}/>