import React from "react";
import { View, Text } from 'react-native'; 
import AuthUserContext from "./context";
import { withFirebase } from "../Database";
import * as Network from 'expo-network';
import  Constants  from "expo-constants";
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { getAPIIP } from '../API/APINetwork';
import { getUserAllInfoAPI, setFavoriteAPI, getUserFavorites, getTicket, getAllUsers } from "../API/APIAWS";


import { isAndroid , getConstant } from '../Utils'; 

import { CObject } from "../Classes/CObject";
import { CBroadcastTicket } from "../Classes/Tickets/CBroadcastTicket";
import { CTicket } from '../Classes/Tickets/CTicket';
import { CWorkflowTicket } from  "../Classes/Tickets/CWorkflowTicket";
import { CUser } from '../Classes/CUser';
import { CUsers } from '../Classes/CUsers';

import * as TEMPLATE_TYPE from '../constants/template';

import { withNotification } from './NotificationProvider'; 
import { CAutocall } from "../Classes/Products/CAutocall";

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        //utilisateur
        authUser: null,
        //device
        device : '',

        //notifications recues et acces au HOC withNotification (passe plats)
        notification: {},
        //chech if it is read
        isNotified : (type, id) => this.props.isNotified(type, id),
        _showToast: (notification, obj) => this.props._showToast(notification, obj),
        removeNotification: (type, id) => this.props.removeNotification(type, id),
        _removeToast : () => this.props._removeToast(),
        addNotification : (notifications) => this.props.addNotification(notifications),
        allNotificationsCount : props.hasOwnProperty('notificationList') ? props.notificationList.length : 0,
        setCurrentFocusedObject : (type , id) => this.props.setCurrentFocusedObject(type, id),
        getNotifications : (type , id) => this.props.getNotifications(type, id),
        idFocused : this.props.idFocused,


        //tickets
        tickets: [],
        apeTickets : [],
        addTicket: ticket => this.addTicket(ticket),

        //users
        users : [],


        //ape publique issu de srp
        apeSRP : [],

        //chargé au départ
        getUserAllInfo: () => this.getUserAllInfo(),

        //la homepage
        featured: [],
        userOrg: [],

        //gestion des categories
        categories: [],
        getAllUndelyings: filter => this.getAllUndelyings(filter),

        //tickets
        broadcasts: [],
        worklow : [],


        //toFavorites
        favorites: [],
        setFavorite: obj => this.setFavorite(obj),

        //les filtres a appliquer sur la home page
        filtersHomePage: [],
        setFiltersHomePage: filters => this.setFiltersHomePage(filters)
      };
    }

   async componentDidMount() {
      console.log("didMount Authentication lancement");

      try {
          this.listener =  await this.props.firebase.onAuthUserListener(
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


              
              
              // Handle notifications that are received or selected while the app
              // is open. If the app was closed and then opened by tapping the
              // notification (rather than just tapping the app icon to open it),
              // this function will fire on the next tick after the app starts
              // with the notification data.
              //this._notificationSubscription = Notifications.addListener(this._handleNotification);
              
            },
            () => {
              console.log("didMount Authentication KO");
              this.setState({ authUser: "" });
              //this.listener();
            }
          );
      } 
      catch(error) {
        console.log("ERREUR RECUP DATABASE INFO USER : ");
        console.log(error);
      }

    }


    UNSAFE_componentWillReceiveProps(props) {
      console.log("RECEIVE PROPS HOME : " + props.notificationList.length );
      this.setState({ allNotificationsCount : props.hasOwnProperty('notificationList')  ? props.notificationList.length : 0, idFocused : props.idFocused });

    }






    //enregistrement du device pour notifications
    async  _recordDeviceForNoticiation() {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      // only asks if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      // On Android, permissions are granted on app installation, so
      // `askAsync` will never prompt the user
    
      // Stop here if the user did not grant permissions
      if (status !== 'granted') {
        //alert('No notification permissions!');
        return;
      }
    
      // Get the token that identifies this device
      let token = await Notifications.getExpoPushTokenAsync();

      return token;
      //console.log("TOKEN : "+ token);
      //let device = this.state.device;
      //device['TOKEN'] = token;
      //this.setState( { device });
      // POST the token to your backend server from where you can retrieve it to send push notifications.
      /*return fetch(PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: {
            value: token,
          },
          user: {
            username: 'Brent',
          },
        }),
      });*/
    }

    //enregistre les filtres
    setFiltersHomePage(filters) {
      //console.log(filters);
      this.setState({ filtersHomePage: filters });
    }

    //chargement des donnees de départ deopuis le serveur
    async getUserAllInfo() {
      let ip = ''; //await Network.getIpAddressAsync();
      try {
         ip = await getAPIIP();
      } catch(error) {
        console.log("ERROR GET IP ADDRESS : " + error);
      };
      
      //console.log("DEVICE ID : " + Constants.deviceId);
      //console.log("INSTALLATION ID : " + Constants.installationId);
      //console.log(Constants);
      //let mac = await Network.getMacAddressAsync();
      let mac='';
      let token =  Constants.isDevice ? await this._recordDeviceForNoticiation() : '';
      let type = await Device.getDeviceTypeAsync();
      //on recupere toutes les donnes sur le device
      let d = {};
      d['deviceId'] = isAndroid() ? Application.androidId : await Application.getIosIdForVendorAsync();
      d['expoVersion'] = Constants.expoVersion;
      d['installationId'] =Constants.installationId;
      d['deviceName'] =Constants.deviceName;
      d['isDevice'] =Constants.isDevice;
      //d['deviceId'] =Constants.deviceId;
      d['nativeAppVersion'] =Constants.nativeAppVersion;
      d['nativeBuildVersion'] =Constants.nativeBuildVersion;
      d['platform'] =Constants.platform;
      d['brand'] =Device.brand;
      d['manufacturer'] =Device.manufacturer
      d['modelName'] =Device.modelName
      d['modelId'] =Device.modelId
      d['designName'] =Device.designName
      d['productName'] =Device.productName
      d['totalMemory'] =Device.totalMemory
      d['supportedCpuArchitectures'] =Device.supportedCpuArchitectures
      d['osName'] =Device.osName
      d['osVersion'] =Device.osVersion
      d['osBuildId'] =Device.osBuildId
      d['osInternalBuildId'] =Device.osInternalBuildId
      d['osBuildFingerprint'] =Device.osBuildFingerprint
      d['platformApiLevel'] =Device.platformApiLevel
      d['IP'] = ip;
      d['MAC'] = mac;
      d['TYPE'] = Device.DeviceType[type];
      if (Constants.isDevice) {
        d['TOKEN'] = token;
      }
      console.log("DEVICE ID : "+ d['deviceId']);
     
      //this.setState({ device : d}, () => console.log(this.state.device));
      this.setState({ device : d });

      //chargement de tous les users
      this.setState({ users : new CUsers( await getAllUsers(this.props.firebase), this.state.authUser.uid) });

      //load all infos at ignition
      return new Promise((resolve, reject) => {
        this.props.firebase
          .doGetIdToken()
          .then(token => {
            //console.log("TOKEn : "+ token);
            getUserAllInfoAPI(token, d)
              .then(userDatas => {
                //console.log(userDatas.userTickets.slice(0,1));
                //console.log(userDatas.userTickets.slice(0,1));
                //console.log("Passage de withAuth");


                //passage du workflow au ticket
                CWorkflowTicket.WORKFLOW = userDatas.workflow;

                //on va crer les objets tickets 
                let tickets = [];
                userDatas.userTickets.forEach((t) => {
                  //let tempTicket = new CTicket(t);
                  //console.log(tempTicket.getType()+ "  :  "+tempTicket.getId());
                  
                  //switch (tempTicket.getType()) {
                  switch(t.type) {
                    case "Broadcasting" :
                      console.log("Broadcast : "+t.id);
                      //console.log(t);
                      //let ticketB = new CBroadcastTicket(t);
                      //this.tickets.push(ticketB);
                      break;
                    case "Produit structuré" :
                      console.log("Workflow : "+t.id);
                      //console.log(t);
                      let ticketC = new CWorkflowTicket(t);
                      tickets.push(ticketC);
                      break;
                    default : 
                      //this.tickets.push(t);
                      break;
                  }
                });
                tickets.sort(CTicket.compareLastUpdateDown);


                //on cree les objets autocalls
                let featuredAutocalls = [];
                userDatas.startPage.bestCoupon.forEach((t) => {            
                  switch (t.template) {
                    case TEMPLATE_TYPE.PSLIST :
                      let featuredAutocall = new CAutocall(t);
                      //console.log(t)
                      featuredAutocalls.push(featuredAutocall);
                      break;
                    default : 
                      break;
                  }
                });
        

                this.setState({
                  //featured : userDatas.startPage.bestCoupon,
                  featured : featuredAutocalls,
                  categories: userDatas.categories,
                  userOrg: userDatas.userOrg,
                  user : new CUser(userDatas.userInfo),
                  favorites: userDatas.favorites,
                  //tickets: userDatas.userTickets,
                  tickets,
                  //tickets: userDatas.userTickets.slice(0,1),

                  apeTickets: userDatas.startPage.ape,
                  apeSRP : userDatas.startPage.srp,
                  //apeSRP : [],
                  broadcasts : userDatas.startPage.campaign,
                  //broadcasts : [],

                  issuers : userDatas.issuers,
                });


                //console.log("Enregistrement user id : ");
                CObject.UID = this.state.authUser.uid;

                let toto = [
                  ...new Set(userDatas.userTickets.map(x => x.id))
                ];

             
                
                //console.log(userDatas.startPage);
                console.log(Object.keys(userDatas.startPage));
                console.log(Object.keys(userDatas));
                if (this.props.addNotification != null) {
                  this.props.addNotification(userDatas.notifications);
                }
                //console.log(userDatas.categories);
                //console.log(userDatas.workflow);
                //console.log(userDatas.startPage.bestCoupon);
                //userDatas.userTickets.forEach((t) => console.log(t.currentStep));
                //console.log(userDatas.workflow.slice(0,1));
                //console.log(this.state.authUser);
                //console.log(userDatas.startPage.campaign);
                //console.log(userDatas.userTickets.slice(0,1))
                //console.log(this.getAllUndelyings());
                //console.log("Nbre APE : " + userDatas.startPage.srp.length);
         
                
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

      //this.ticketListener();
      this.listener();
      //this._notificationSubscription();
    }

    ////////////////////////////////////////
    //           TICKETS
    //  ajoute un ticket des qu'il est crée 
    ////////////////////////////////////////
    addTicket(ticket) {
      let t = this.state.tickets;
      t.unshift(ticket);
      this.setState({ tickets: t });
    }

    updateTicket(ticket) {
      let tickets = this.state.tickets;
      tickets.forEach((t) => {
        if (t.getId() === ticket.getId()){
          t.setOject(ticket.getObject);
        }
      })
      //const newItems = items.map(item => item === 3452 ? 1010 : item);
      
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withNotification(withFirebase(WithAuthentication));
};

export const withUser = Component => props => (
  <AuthUserContext.Consumer>
    {(authUser) => {
          return (
    
                   <Component {...props} {...authUser} />
      
          );
      }
    }
  </AuthUserContext.Consumer>
);

export default withAuthentication;
