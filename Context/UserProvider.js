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
export const UserContext = createContext({
  name: "",
  searchInputText: "",
  setName: () => {}
});

/**
 * la classe UserProvider fera office de... Provider (!)
 * en wrappant son enfant direct
 * dans le composant éponyme. De cette façon, ses values
 * seront accessible de manière globale via le `Consumer`
 */
class UserProvider extends Component {
  state = {
    name: "Bonjour FinLive", // une valeur de départ
    searchInputText: "",
    setName: name => this.setState({ name: name }),
    setSearchInputText: inputedText => this.setState({ searchInputText: inputedText })
  };

  render() {
    return (
      /**
       * la propriété value est très importante ici, elle rend ici
       * le contenu du state disponible aux `Consumers` de l'application
       */
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

/**
 * La fonction `withUser` sera notre HOC
 * qui se chargera d'injecter les propriétés de notre contexte
 * à n'importe quel composant qui l'appellera
 */
export const withUser = Component => props => (
  <UserContext.Consumer>
    {store => <Component {...props} {...store} />}
  </UserContext.Consumer>
);

export default UserProvider;
