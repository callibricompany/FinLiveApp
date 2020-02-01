import React from 'react';
import { View, Text } from 'react-native';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import FLTicketDetail  from '../commons/Ticket/FLTicketDetail';

class FLTicketDetailHome extends React.Component {
    
    constructor(props) {
      super(props);


      this.ticket =  this.props.navigation.getParam('ticket', '...');
      this.showModal =  this.props.navigation.getParam('showModal', false);

      

      this.props.navigation.setParams({ hideBottomTabBar : true });
    }

    static navigationOptions = ({ navigation }) => {

        return ({
          header : null,
        }
        );
    }

    render() {
      return (
        <FLTicketDetail ticket={this.ticket} showModal={this.showModal}/>
      );
    }
};

const condition = authUser => !!authUser;
const composedFLTicketDetailHome = compose(
 withAuthorization(condition),
  withNavigation,
  withUser
);

//export default HomeScreen;
export default hoistStatics(composedFLTicketDetailHome)(FLTicketDetailHome);

