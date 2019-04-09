import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
      {firebase => <Component {...props} firebase={firebase} />}     
    </FirebaseContext.Consumer>

);

  /*export const withFirebase = Component =>  props => {
     class WithFirebase extends React.Component {
      constructor(props) {
          super(props);
        }
  
      render() {
        return (
          <FirebaseContext.Consumer>
          {firebase => <Component {...props} firebase={firebase} />}     
        </FirebaseContext.Consumer>
        );
      }
    }
    hoistNonReactStatics(WithFirebase, Component);
    return WithFirebase;
  };*/
  
//export default withFirebase;

export default FirebaseContext;