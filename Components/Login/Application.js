import React from 'react'
import { View, ActivityIndicator, StatusBar, AsyncStorage} from 'react-native'
import Navigation from '../../Navigation/Navigation'
import { withAuthentication } from '../../Session';



//import globalStyle from '../../Styles/globalStyle'

class Application extends React.Component {
    constructor(props) {
      super(props);

    }


  
    // Render any loading content that you like here
    render() {
      return (

          <Navigation />
  
      );
    }
  }



  export default withAuthentication(Application);