import React from 'react'
import Navigation from '../../Navigation/Navigation'
import { withAuthentication , withAuthorization} from '../../Session';
//import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';




//import globalStyle from '../../Styles/globalStyle'

class Application extends React.Component {
    constructor(props) {
      super(props);

    }


  
    // Render any loading content that you like here
    render() {
      //console.log("APPLEHJGHSGHGAHA : "+this.props.firstName);
      return (

          <Navigation />
  
      );
    }
  }

  const condition = authUser => !!authUser;


  const composedBothAuth = compose(
     //withAuthorization(condition),
     withAuthentication,
  );

  export default hoistStatics(composedBothAuth)(Application);