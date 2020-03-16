import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Navigation from '../../Navigation/Navigation';
import NavigationService from '../../Navigation/NavigationService';

import { withAuthentication , withAuthorization} from '../../Session';
import { withUser } from '../../Session/withAuthentication';
import { withNotification } from '../../Session/NotificationProvider'; 
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

    UNSAFE_componentWillReceiveProps(props) {
      /*
      if (props.hasOwnProperty('notification') && props.notification !== '') {
        console.log(props.notification);
        console.log(props.notification.subject);
        this.setState({ title : props.notification.type , message : props.notification.subject }, () => {
          this.ticket = new CWorkflowTicket(props.object);
          setTimeout(() => {
            this.setState({ title : '', message : '' });
          }, 10000);

        });
      }*/

    } 

    // Render any loading content that you like here
    render() {
     
      return (
          <View style={{flex: 1}}>
              <Navigation ref={navigatorRef => {
                                 NavigationService.setTopLevelNavigator(navigatorRef);
                              }}
              />
              {this.state.message === 'jhjhjhj' 
              ?
                    <View style={{ flexDirection : 'row', position: 'absolute', top : DEVICE_HEIGHT - 180, left : DEVICE_WIDTH/10, width :4*DEVICE_WIDTH/5, borderWidth : 1, borderColor: 'transparent', borderRadius : 4, height : 50}}>
                        <View style={{flex: 0.9, flexDirection : 'column',justifyContent: 'center', backgroundColor: setColor('vertpomme')}}>
                            <View style={{flex: 0.4, padding : 5}}>
                              <Text style={setFont('400', 12, 'white')}>{this.state.title} {String("mis à jour").toUpperCase()}</Text>
                            </View>
                            <View style={{flex: 0.6, padding : 5}}>
                              <Text style={setFont('400', 14, 'white')}>{this.state.message}</Text>
                            </View>               
                        </View>
                        <TouchableOpacity style={{flex: 0.1, justifyContent: 'center', alignItems: 'center', backgroundColor: setColor('subscribeticket')}}
                                          onPress={() => {
                                                  this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLTicketDetailHome' : 'FLTicketDetailTicket', {
                                                  ticket: this.ticket,
                                                  });
                                          }}          
                        >
                            <Text style={setFont('400', 18, 'white', 'Regular')}>></Text>
                        </TouchableOpacity>
                    </View>
               : null
            }
            
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
     //withNotification
  );

  export default hoistStatics(composedBothAuth)(Application);