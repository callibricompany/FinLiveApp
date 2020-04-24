import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Navigation from '../../Navigation/Navigation';
import NavigationService from '../../Navigation/NavigationService';

import { withAuthentication , withAuthorization} from '../../Session';
import { withUser } from '../../Session/withAuthentication';

import { setColor, setFont } from '../../Styles/globalStyle';
import { compose, hoistStatics } from 'recompose';

import { CWorkflowTicket } from '../../Classes/Tickets/CWorkflowTicket';
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;





//import globalStyle from '../../Styles/globalStyle'

class Application extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        title : '',
        message : '',
      };
      this.ticket = '';
    }



    // Render any loading content that you like here
    render() {
     
      return (
          <View style={{flex: 1}}>
              <Navigation ref={navigatorRef => {
                                 NavigationService.setTopLevelNavigator(navigatorRef);
                              }}
              />

            
          </View>
  
      );
    }
  }

  const condition = authUser => !!authUser;


  const composedBothAuth = compose(
     //withAuthorization(condition),
     //withUser,
     withAuthentication,
     //withNavigation

  );

  export default hoistStatics(composedBothAuth)(Application);