import React from 'react'
import Navigation from '../../Navigation/Navigation'
import { withAuthentication } from '../../Session';
//import { withUser } from '../../Session/withAuthentication';





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



  export default withAuthentication(Application);