import React from 'react'
import { View } from 'react-native'
import { FLButton } from './commons';
import { Badge, Item, Label, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content,Text, Card, CardItem }  from "native-base";
  
import { globalStyle } from '../Styles/globalStyle'
import { UserContext } from '../Context/UserProvider';
import FLInput from '../Components/commons/FLInput'


class TicketsList extends React.Component {
    static navigationOptions = {
      title: 'Liste des tickets'
    }

    constructor(props) {
      super(props)
      this.textePourPierre =''
      this.state = { 

        reponseDePierre :'La réponse ici',

      }
    }

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
 
                <Container>
                <Content padder>
                <View style={globalStyle.container}>
          <Text style={globalStyle.defaultText}>Liste de mes tickets</Text>
          <FLButton onPress={this.onButtonPress.bind(this, 1, news1)}>{news1}</FLButton>
          <FLButton onPress={this.onButtonPress.bind(this, 2, news2)}>{news2}</FLButton>
        </View>
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
      );
      }
}

export default TicketsList