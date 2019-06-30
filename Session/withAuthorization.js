import React from 'react';
import Expo from 'expo';

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

    
      async componentWillMount() {
        try {
          await Expo.Font.loadAsync({
      //      Roboto: require("native-base/Fonts/Roboto.ttf"),
      //      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
              Roboto: require("native-base/Fonts/Roboto.ttf"),
              Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
              //Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
          })
          } catch (error) {
            console.log('Erreur chargement icon fonts', error);
          }
    
        //this.setState({ isLoading: false });    
      }
    

    componentDidMount() {
        this.listener = this.props.firebase.onAuthUserListener(
          authUser => {
            if (!condition(authUser)) {
                console.log("with AUTHORIZATION  : Attention user sans droit");
                //this.props.navigation.push('Login');
                this.props.navigation.navigate('Login');
            } else {
                console.log("with AUTHORIZATION  : " + authUser.name);
                if (!authUser.roles.includes(ROLES.VALIDATED)) {
                  //this.props.navigation.navigate('WaitingRoom');
                  this.props.navigation.navigate('WaitingRoom', {
                    name: authUser.name,
                    firstName : authUser.firstName
                  });

                } else if (authUser.roles.includes(ROLES.ADMIN)) {
                  this.props.navigation.navigate('AppAdmin');
                } else {
                  //on va charger les infos du users
                  console.log("ON CAHRGER LES INFOS DU USER");

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