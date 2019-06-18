import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Database';


const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
        tickets : [],
        getAllTickets : () => this.getAllTickets(),
      };
    }

   

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          console.log("didMount Authentication ok");
          this.setState({ authUser });
        },
        () => {
          console.log("didMount Authentication KO");
          this.setState({ authUser: '' });
          //this.listener();
        },
      );
    }
    /*componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          authUser
            ? this.setState({ authUser })
            : this.setState({ authUser: null });
        },
      );
    }*/

    componentWillUnmount() {
      console.log("withAUTHENTICATION : Appel this.listener() ");
      this.ticketListener();
      this.listener();
    }



    getAllTickets() {
      this.ticketListener = this.props.firebase.onTicketListenner(
        tickets => {
          console.log("Chargement tickets ok");
          this.setState({ tickets });
        },
        () => {
          console.log("Chargement tickets KO");
          this.setState({ tickets: null });
        }, this.state.authUser.codeTS
      );
    }


    render() {
      return (
        <AuthUserContext.Provider value={this.state}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export const withUser = Component => props => (
  <AuthUserContext.Consumer>
    {authUser => <Component {...props} {...authUser} />}
  </AuthUserContext.Consumer>
);

export default withAuthentication;