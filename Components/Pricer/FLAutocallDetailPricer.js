import React from 'react';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import FLAutocallDetail  from '../commons/Autocall/FLAutocallDetail';

class FLAutocallDetailPricer extends React.Component {
    

      constructor(props) {
        super(props);
  
  
        this.item =  this.props.navigation.getParam('item', '...');
  
        
  
        this.props.navigation.setParams({ hideBottomTabBar : true });
      }
  
  
  
      render() {
        return (
            <FLAutocallDetail item={this.item} />
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
  export default hoistStatics(composedFLAutocallDetailPricer)(FLAutocallDetailPricer);

