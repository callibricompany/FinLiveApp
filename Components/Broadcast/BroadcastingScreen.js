import React from 'react'
import { Thumbnail, ListItem, Icon, Root, Content, Button, ActionSheet, Header, Left, Body, Title, Right, Container} from 'native-base'
import { FlatList, Text, View, SafeAreaView, TouchableOpacity, ActionSheetIOS } from "react-native";


import { globalStyle } from '../../Styles/globalStyle'
  
import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withFirebase } from '../../Database';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';


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

    static navigationOptions = ({ navigation }) => {
      return {
      header: (
        <SafeAreaView style={globalStyle.header_safeviewarea}>
          <View style={globalStyle.header_left_view} />
          <View style={globalStyle.header_center_view} >
            <Title style={globalStyle.header_center_text_medium}>Tickets</Title>
          </View>
          <View style={globalStyle.header_right_view} >
            <Icon name='ios-help' style={globalStyle.header_icon} />
          </View>
        </SafeAreaView>
      ),
      tabBarVisible: false,
      }
    }   



    render() {
      return(
        <View>
      
          <Button
            onPress={() =>
 
              ActionSheetIOS.showActionSheetWithOptions(
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
    
        </View>
      );
      }
}

const condition = authUser => !!authUser;
const composedPricerScreen = compose(
 withAuthorization(condition),
  withFirebase,
  withUser,
  withNavigation,
);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(BroadcastingScreen);
