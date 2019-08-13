import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Database';


const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,

        //donnees statiques
        categories : [],
        categoriesState : '',
        underlyings : [],
        loadFLDatas : () => this.loadFLDatas(),

        tickets : [],
        getAllTickets : () => this.getAllTickets(),
      };

      
    }

   

    componentDidMount() {
      console.log("didMount Authentication lancement");
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

    //chargement des donnees statiques
    async loadFLDatas() {
      //chargement des categories
      let underlyings = [];
      await this.props.firebase.getCategoriesState()
      .then((data) => {
        this.setState({ categoriesState: data });
        //console.log(data);
      })
      .catch((error) => console.log(error));

      //chargement des sous-categories dont les sous-jacents
      await this.props.firebase.getUnderlyingList()
      .then((data) => {
        data.forEach(doc => {
          //console.log(descriptifProduit["Price"]);
          underlyings.push(doc.data());
        });

        let categories  = [...new Set(underlyings.map(x => x.underlyingGroup))];
        this.setState({ categories, underlyings });

      })
      .catch((error) => console.log(error));
    }


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