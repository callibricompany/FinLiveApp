import React from 'react';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import FLAutocallDetail  from '../commons/Autocall/FLAutocallDetail';

class FLAutocallDetailTicket extends React.Component {
    

    constructor(props) {
      super(props);


      this.autocall =  this.props.navigation.getParam('autocall', '...');

      

      this.props.navigation.setParams({ hideBottomTabBar : true });
    }

    static navigationOptions = ({ navigation }) => {

      return ({
			headerShown : false
      }
      );
  }

    render() {
      return (
        <FLAutocallDetail autocall={this.autocall} isEditable={false}/>
      );
    }
  };
  
  const condition = authUser => !!authUser;
  const composedFLAutocallDetailPricer = compose(
   withAuthorization(condition),
    withNavigation,
    withUser
  );
  
  //export default HomeScreen;
  export default hoistStatics(composedFLAutocallDetailPricer)(FLAutocallDetailTicket);

