import React from 'react';
import * as Font from 'expo-font';

import { withFirebase } from '../Database';
import { withNavigation } from 'react-navigation';
import AuthUserContext from './context';
import { compose } from 'recompose';

import * as ROLES from '../constants/roles';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    constructor(props) {
        super(props);
        //this.isAlreadyConnected = false;

      }

  
    

    componentDidMount() {
        this.listener = this.props.firebase.onAuthUserListener(
          authUser => {
            //console.log("AUTHUSER EMAIL VERIF : " + authUser.emailVerified);
            if (!condition(authUser) || !authUser.emailVerified) {
                console.log("with AUTHORIZATION  : Attention user sans droit");
                //this.props.navigation.push('Login');
                this.props.navigation.navigate('Login', {emailVerified : authUser.emailVerified});
            } else {
                //console.log("with AUTHORIZATION  : " + authUser.name);
                if (!authUser.roles.includes(ROLES.VALIDATED)) {
                  //this.props.navigation.navigate('WaitingRoom');
                  this.props.navigation.navigate('WaitingRoom', {
                    name: authUser.name,
                    firstName : authUser.firstName
                  });

                } else if (authUser.roles.includes(ROLES.ADMIN)) {
                  this.props.navigation.navigate('AppAdmin');
                } else {
                  this.props.navigation.navigate('App');
                }
            }
          },
          () => {
              console.log("with AUTHORIZATION  : Attention user inconnu");
              this.props.navigation.navigate('Login');
              //this.props.navigation.navigate('App');
          },
        );
      }


    componentWillUnmount() {
        //console.log("withAUTHORIZATION : Appel this.listener() ");
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
        {authUser => {
          //console.log("RENDER withAUTHORIZATION : " + authUser);
          return (
          //condition(authUser) ? <Component {...this.props} /> : null
          //<Component {...this.props} isLoggedIn={this.isAlreadyConnected} /> 
          <Component {...this.props} /> 
          );
        }
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