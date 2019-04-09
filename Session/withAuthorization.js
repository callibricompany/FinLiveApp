import React from 'react';

import { withFirebase } from '../Database';
import { withNavigation } from 'react-navigation';
import AuthUserContext from './context';
import { compose } from 'recompose';



const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    constructor(props) {
        super(props);
        this.isAlreadyConnected = false;
      }


    

    componentDidMount() {
        this.listener = this.props.firebase.onAuthUserListener(
          authUser => {
            if (!condition(authUser)) {
                console.log("with AUTHORIZATION  : Attention user sans droit");
                //this.props.navigation.push('Login');
                this.props.navigation.navigate('Login');
            } else {
                console.log("with AUTHORIZATION  : " + authUser.email);
                this.isAlreadyConnected = true;
                //this.props.history.push('App');
                //console.log(this.props);
                this.props.navigation.navigate('App');
            }
          },
          () => {
              console.log("with AUTHORIZATION  : Attention user inconnu");
              //this.listener();
              this.props.navigation.navigate('Login');
          },
        );
      }


    componentWillUnmount() {
        console.log("withAUTHORIZATION : Appel this.listener() ");
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
        {authUser =>
          condition(authUser) ? <Component {...this.props} isLoggedIn={this.isAlreadyConnected} /> : null
          //<Component {...this.props} isLoggedIn={this.isAlreadyConnected} /> 
        }
      </AuthUserContext.Consumer>
      );
    }
  }

  return compose(
        withNavigation,
        withFirebase,
    )(WithAuthorization);

};


export default withAuthorization;