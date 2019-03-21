import React from 'react'
import { Thumbnail, ListItem, Icon, Root, Content, Button, Text, ActionSheet, Header, Left, Body, Title, Right, Container} from 'native-base'
import { FlatList } from "react-native";
import { getOpenTickets } from '../API/APIAWS'


  



var BUTTONS = ["Option 0", "Option 1", "Option 2", "Delete", "Cancel"];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

class BroadcastingScreen extends React.Component {
 
    constructor(props) {
      super(props)
      this.state = {
        result: []
      };
    }

    _getTicketList = () => {
     /* getOpenTickets().then(data => {
        console.log(data);
      }
      )*/
      getOpenTickets().then(data => {
        //response.json({ message: 'Request received!', data })
        //console.log(data);
        this.setState( { result: data});
      })
     
    };

    renderItem = ({ item }) => {
      console.log(item)
        return (
          
          <ListItem avatar>
            <Left>
              <Thumbnail source={{ uri: item.avatar }} />
            </Left>
            <Body>
              <Text>{item.name}</Text>
              <Text note>{item.resume}</Text>
              <Text note>{item.email}</Text>
            </Body>
            <Right>
              <Text note>{item.date}</Text>
            </Right>
          </ListItem>
        
        );
    }

    render() {
      return(
        <Root>
       <Container>
       <Header>
        <Left>
        </Left>
        <Body center>
          <Title>Diffusion</Title>
        </Body>
        <Right >
        </Right>
      </Header>
        <Content padder>
        <Button
          onPress={() =>
          ActionSheet.show(
            {
              options: BUTTONS,
              cancelButtonIndex: CANCEL_INDEX,
              destructiveButtonIndex: DESTRUCTIVE_INDEX,
              title: "Que voulez-vous faire ?"
            },
            buttonIndex => {
              this.setState({ clicked: BUTTONS[buttonIndex] });
            }
          )}
        >
          <Text>Actions</Text>
        </Button>
 
          <Button iconLeft transparent primary onPress={this._getTicketList}>
            <Icon name='beer' />
            <Text>Les tickets</Text>
          </Button>

       
          <FlatList
              data={this.state.result}
              renderItem={this.renderItem}
              keyExtractor={item => item.name}
              //stickyHeaderIndices={this.state.stickyHeaderIndices}
           />
      </Content>
      </Container>
      </Root>
      );
      }
}

export default BroadcastingScreen