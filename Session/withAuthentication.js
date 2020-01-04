import React from "react";

import AuthUserContext from "./context";
import { withFirebase } from "../Database";

import {
  getUserAllInfoAPI,
  setFavoriteAPI,
  getUserFavorites
} from "../API/APIAWS";

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,

        //donnees statiques
        tickets: [],
        addTicket: ticket => this.addTicket(ticket),

        //chargé au départ
        allInfo: [],
        getUserAllInfo: () => this.getUserAllInfo(),

        //la homepage
        homePage: [],
        userOrg: [],

        //gestion des categories
        categories: [],
        getAllUndelyings: filter => this.getAllUndelyings(filter),

        //tickets
        broadcasts: [],

        //toFavorites
        favorites: [],
        setFavorite: obj => this.setFavorite(obj),

        //les filtres a appliquer sur la home page
        filtersHomePage: [],
        setFiltersHomePage: filters => this.setFiltersHomePage(filters)
      };
    }

    componentDidMount() {
      console.log("didMount Authentication lancement");

      this.listener = this.props.firebase.onAuthUserListener(
        authUser => {
          console.log(
            "didMount Authentication : " +
              authUser.firstName +
              " " +
              authUser.name +
              " (" +
              authUser.company +
              " / " +
              authUser.organization +
              ")"
          );
          this.setState({ authUser });
        },
        () => {
          console.log("didMount Authentication KO");
          this.setState({ authUser: "" });
          //this.listener();
        }
      );
    }

    //enregistre les filtres
    setFiltersHomePage(filters) {
      //console.log(filters);
      this.setState({ filtersHomePage: filters });
    }

    //chargement des donnees de départ deopuis le serveur
    async getUserAllInfo() {
      return new Promise((resolve, reject) => {
        this.props.firebase
          .doGetIdToken()
          .then(token => {
            getUserAllInfoAPI(token)
              .then(userDatas => {
                //console.log("reception : " + JSON.stringify(userDatas.categories));
                //console.log("Passage de withAuth");
                this.setState({
                  allInfo: userDatas,
                  homePage: JSON.parse(JSON.stringify(userDatas.homePage)),
                  categories: userDatas.categories,
                  userOrg: userDatas.userOrg,
                  favorites: userDatas.favorites,
                  tickets: userDatas.userTickets,
                  broadcasts : userDatas.homePage.filter(({ template }) => template === "PSBROADCAST"),
                  
                });

                let toto = [
                  ...new Set(userDatas.homePage.map(x => x.template))
                ];
                console.log(toto);
                //console.log(userDatas.userTickets);
                
                resolve("ok");
              })
              .catch(error => {
                //console.log("ERREUR RECUPERATION DES INFOS USER " + error);
                alert("ERREUR CONNEXION AU SERVEUR : ", "" + error);
                reject(error);
              });
          })
          .catch(error => {
            //console.log("ERREUR RECUPERATION DES INFOS USER " + error);
            alert("ERREUR RECUPERATION DES INFOS USER : ", "" + error);
            reject(error);
          });
      });
    }

    //chargement des favoris depuis le serveur
    getUserFavorites = () => {
      return new Promise((resolve, reject) => {
        this.props.firebase
          .doGetIdToken()
          .then(token => {
            getUserFavorites(token)
              .then(data => {
                //console.log("reception : " + JSON.stringify(userDatas.categories));
                console.log("Nombre de favoris : " + data.length);
                this.setState({ favorites: data }, () => resolve("ok"));
              })
              .catch(error => {
                //console.log("ERREUR RECUPERATION DES INFOS USER " + error);
                alert("ERREUR CONNEXION AU SERVEUR : ", "" + error);
                reject(error);
              });
          })
          .catch(error => {
            //console.log("ERREUR RECUPERATION DES INFOS USER " + error);
            alert("ERREUR RECUPERATION DES FAVORITES USER : ", "" + error);
            reject(error);
          });
      });
    };

    //on met en favori un objet passé
    async setFavorite(obj) {
      return new Promise((resolve, reject) => {
        console.log("Doit etre mis en favori : " + !obj.isFavorite);

        //check if it's in favorites object
        //console.log(obj);

        //console.log(this.item.data);
        let favoriteToSend = JSON.parse(JSON.stringify(obj));
        favoriteToSend.toFavorites.active = !favoriteToSend.toFavorites.active;
        favoriteToSend.isFavorite = !favoriteToSend.isFavorite;

        this.props.firebase
          .doGetIdToken()
          .then(token => {
            setFavoriteAPI(token, favoriteToSend)
              .then(data => {
                console.log("Mis en favori ok : " + data.isFavorite);

                this.getUserFavorites()
                  .then(() => resolve(data))
                  .catch(error => reject(error));
                //this.manageFavoriteList(data);
                //on va l'ajoueter ou l'enlever de laliste des favoris
                //this.getUserFavorites()
                //.then(() => resolve(data))
                //.catch((error) => reject(error));
                //this.setState({ toto : !this.state.toto });
                //resolve(data);
              })
              .catch(error => {
                console.log("Echec mis en favori : " + JSON.stringify(obj));
                reject(error);
              });
          })
          .catch(error => {
            //console.log("ERREUR RECUPERATION DES INFOS USER " + error);
            alert(
              "ERREUR RECUPERATION DES INFOS USER DE LA BASE: ",
              "" + error
            );
            reject(error);
          });
      });
    }

    //retourne tous les sous-jacents d'une categories
    getAllUndelyings(type = "PS") {
      let allCat = this.state.categories.filter(({ codeCategory }) => codeCategory === type )[0].subCategory;
      let result = [];
      
      allCat.forEach((u) => {
        if (!u.subCategoryHead) {
          if (!u.hasOwnProperty('groupingHead')) {  //c'est un indice
            result.push(u.underlyingCode);
          } else if (!u.groupingHead) {
            result.push(u.underlyingCode);
          }
        }
      });
      return result;
    }

    componentWillUnmount() {
      console.log("withAUTHENTICATION : Appel this.listener() ");

      this.ticketListener();
      this.listener();
    }

    addTicket(ticket) {
      let t = this.state.tickets;
      t.unshift(ticket);
      this.setState({ tickets: t });
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
