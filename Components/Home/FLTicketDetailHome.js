import React from 'react';
import { View, Text } from 'react-native';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import FLAutocallDetail  from '../commons/Autocall/FLAutocallDetail';

class FLTicketDetailHome extends React.Component {
    
    constructor(props) {
      super(props);


      this.autocall =  this.props.navigation.getParam('autocall', '...');

      

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
        <FLAutocallDetail autocall={this.autocall} />
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

