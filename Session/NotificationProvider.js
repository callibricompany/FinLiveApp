// store/UserProvider.js
import React, { createContext, Component } from "react"; // on importe createContext qui servira à la création d'un ou plusieurs contextes


/**
 * `createContext` contient 2 propriétés :
 * `Provider` et `Consumer`. Nous les rendons accessibles
 * via la constante `UserContext`, et on initialise une
 * propriété par défaut : "name" qui sera une chaine vide.
 * On exporte ce contexte afin qu'il soit exploitable par
 * d'autres composants par la suite via le `Consumer`
 */
export const NotificationContext = createContext({
  titleNoticfication: "",
  eventNotification: "",
  setName: () => {}
});

/**
 * la classe UserProvider fera office de... Provider (!)
 * en wrappant son enfant direct
 * dans le composant éponyme. De cette façon, ses values
 * seront accessible de manière globale via le `Consumer`
 */
class NotificationProvider extends Component {
  state = {
    notification: '', // une valeur de départ
    object : '',

    setNotification: (notification, obj) => this.setNotification(notification, obj),
  };

  setNotification(notification, obj) {
    //console.log("DEPUIS LE STORE NOTIFICATION : ");
    //console.log(ticket);
    this.setState({ notification , object : obj });
  }

  render() {
    return (
      /**
       * la propriété value est très importante ici, elle rend ici
       * le contenu du state disponible aux `Consumers` de l'application
       */
      <NotificationContext.Provider value={this.state}>
        {this.props.children}
      </NotificationContext.Provider>
    );
  }
}

/**
 * La fonction `withNotification` sera notre HOC
 * qui se chargera d'injecter les propriétés de notre contexte
 * à n'importe quel composant qui l'appellera
 */
export const withNotification = Component => props => (
  <NotificationContext.Consumer>
    {store => <Component {...props} {...store} />}
  </NotificationContext.Consumer>
);

export default NotificationProvider;
