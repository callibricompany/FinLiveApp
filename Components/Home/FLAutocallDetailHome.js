import React from 'react';


import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import FLAutocallDetail  from '../../Components/commons/Autocall/FLAutocallDetail';

class FLAutocallDetailHome extends React.Component {
    
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
const composedFLAutocallDetailHome = compose(
 withAuthorization(condition),
  withNavigation,
  withUser
);

//export default HomeScreen;
export default hoistStatics(composedFLAutocallDetailHome)(FLAutocallDetailHome);

