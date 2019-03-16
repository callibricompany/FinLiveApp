import React from 'react'
import { View, AsyncStorage, Alert} from 'react-native'
import { Form, Item, Label, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem }  from "native-base";
import { globalStyle } from '../Styles/globalStyle'
import { UserContext } from '../Context/UserProvider';
import FLInput from '../Components/commons/FLInput'



//import Icon from 'react-native-vector-icons/FontAwesome'

class HomeScreen extends React.Component {

  constructor(props) {
      super(props)
      this.textePourPierre =''
      this.state = { 

        reponseDePierre :'La réponse ici',

      }
      //this._signOutAsync = this._signOutAsync.bind(this)
    }

    static navigationOptions = {
      header: (
        <Header>
        <Left>
        </Left>
        <Body center>
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


    _NavToNewsList = () => {
      this.props.navigation.navigate('NewsList');
    };

    _alert =  () => {
      Alert.alert(
        'Coucou',
        'Test')
    };
    _getInfoFromPierre = () => {
      const url = 'http://34.245.143.173:8080'
      return fetch(url)
         .then((response) => console.log(response))
   //     .then((response) => response.json())
       .catch((error) => console.error(error))
    };

    _postInfoToPierre = () => {
          console.log(this.state)
          const url = 'http://34.245.143.173:8080'
          var details = {
              'idToken': this.textePourPierre,
          };
          
          var formBody = [];
          for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody = formBody.join("&");
          console.log(formBody)
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
          })
          .then((response) => {
            console.log('Reponse POST : ' + JSON.stringify(response));
            //this.setState( { reponseDePierre : response.toString() } )
            this.setState( { reponseDePierre : JSON.stringify(response) } )
            }
            )
          .catch((error) => {
              console.error('Erreur requete POST : ' + error);
              this.setState( { reponseDePierre : 'La requete a foirée' } )
          });
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
                <Button full rounded info
                  style={{ marginTop: 10 }}
                  onPress={this._getInfoFromPierre}>
                  <Text>Get de Pierre</Text>
                </Button>
                <Item regular>
                    <Input placeholder='A envoyer à Pierre' onChangeText={(text) => this.textePourPierre=text }/>
                </Item>
                <Button full rounded danger
                  style={{ marginTop: 10 }}
                  onPress={this._postInfoToPierre}>
                  <Text>Post vers Pierre</Text>
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


                    <Card>
                      <CardItem header>
                        <Text>TESTAGE DE POST</Text>
                      </CardItem>
                      <CardItem>
                        <Body>
                          <Text>
                            {this.state.reponseDePierre._bodyText}
                          </Text>
                        </Body>
                      </CardItem>
                      <CardItem footer>
                        <Text>Vincent</Text>
                      </CardItem>
                    </Card>
                  
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