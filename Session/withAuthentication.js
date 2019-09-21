import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Database';

import { getUserAllInfoAPI, setFavoriteAPI, getUserFavorites } from '../API/APIAWS';


const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,

        //donnees statiques
        tickets : [],
        getAllTickets : () => this.getAllTickets(),

        //chargé au départ
        allInfo : [],
        getUserAllInfo : () => this.getUserAllInfo(),

        //la homepage
        homePage : [],
        userOrg : [],
        favorites : [],
        //toFavorites
        setFavorite : (obj) => this.setFavorite(obj),

        //les filtres a appliquer sur la home page
        filtersHomePage : [],
        setFiltersHomePage : (filters) => this.setFiltersHomePage(filters),

        toto: true,
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


    //enregistre les filtres 
    setFiltersHomePage (filters) {
      
      this.setState({ filtersHomePage : filters});
    }

    //chargement des donnees de départ deopuis le serveur
    async getUserAllInfo() {

      return new Promise((resolve, reject) => {
        this.props.firebase.doGetIdToken()
        .then(token => {
              getUserAllInfoAPI(token)
              .then((userDatas) => {
                //console.log("reception : " + JSON.stringify(userDatas.categories));
                //console.log("Passage de withAuth");
                this.setState({ allInfo: userDatas, 
                                homePage : JSON.parse(JSON.stringify(userDatas.homePage)),
                                userOrg : userDatas.userOrg,
                                favorites : userDatas.favorites});
                console.log(this.state.favorites);
                resolve("ok");
    
              })
              .catch(error => {
                //console.log("ERREUR RECUPERATION DES INFOS USER " + error);
                alert('ERREUR CONNEXION AU SERVEUR : ', '' + error);
                reject(error);
              }) 
            }
        )
        .catch(error => {
          //console.log("ERREUR RECUPERATION DES INFOS USER " + error);
          alert('ERREUR RECUPERATION DES INFOS USER : ', '' + error);
          reject(error);
        }) 
      });
    }


    //add it to HomePage
    manageFavoriteList(obj) {
      console.log("On recherche dans les liste des favoris si existe");
      console.log(obj);
     

      

    }

    //chargement des favoris depuis le serveur
    async getUserFavorites() {
      return new Promise((resolve, reject) => {
        this.props.firebase.doGetIdToken()
        .then(token => {
              getUserFavorites(token)
              .then((data) => {
                //console.log("reception : " + JSON.stringify(userDatas.categories));
                //console.log("Passage de withAuth");
                this.setState({ favorites : data});
                
                resolve("ok");
    
              })
              .catch(error => {
                //console.log("ERREUR RECUPERATION DES INFOS USER " + error);
                alert('ERREUR CONNEXION AU SERVEUR : ', '' + error);
                reject(error);
              }) 
            }
        )
        .catch(error => {
          //console.log("ERREUR RECUPERATION DES INFOS USER " + error);
          alert('ERREUR RECUPERATION DES FAVORITES USER : ', '' + error);
          reject(error);
        }) 
      });
    }

    //on met en favori un objet passé 
    async setFavorite(obj) {
      return new Promise((resolve, reject) => {
        console.log("Doit etre mis en favori : " + !obj.isFavorite);
        
        //check if it's in favorites object 
        console.log(obj);
        let alreadyInFavorites = this.state.favorites.includes(obj);

        console.log("Déja dans les favoris : " + alreadyInFavorites);
        //console.log(this.item.data);
        let favoriteToSend = JSON.parse(JSON.stringify(obj));
        favoriteToSend.toFavorites.active = !favoriteToSend.toFavorites.active;
        favoriteToSend.isFavorite = !favoriteToSend.isFavorite ;

        this.props.firebase.doGetIdToken()
        .then(token => {
              setFavoriteAPI(token, favoriteToSend)
              .then((data) => {
                console.log( " mis en favori ok : " + data.isFavorite);

                if (alreadyInFavorites && !data.isFavorite) {
                  //il faut le retirer de la liste
                }
                if (alreadyInFavorites && !data.isFavorite) {
                  //il faut l'ajouter a la liste
                  this.setState({ favorites : this.state.favorites.push(data)});
                }

                //this.manageFavoriteList(data);
                //on va l'ajoueter ou l'enlever de laliste des favoris
                //this.getUserFavorites()
                //.then(() => resolve(data))
                //.catch((error) => reject(error));
                //this.setState({ toto : !this.state.toto });
                resolve(data);

              })
              .catch(error => {
                console.log("Echec mis en favori : " + JSON.stringify(obj));
                reject(error);
              }) 
            }
        )
        .catch(error => {
          //console.log("ERREUR RECUPERATION DES INFOS USER " + error);
          alert('ERREUR RECUPERATION DES INFOS USER DE LA BASE: ', '' + error);
          reject(error);
        }) 
      });

    }


    //chargement des donnees statiques
    async loadFLDatas() {
      //chargement des categories
     /* let underlyings = [];
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
        console.log(categories);

      })
      .catch((error) => console.log(error));
      */

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