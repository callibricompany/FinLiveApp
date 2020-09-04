// store/UserProvider.js
import React, { createContext, Component } from "react";  // on importe createContext qui servira à la création d'un ou plusieurs contextes
import { View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { CWorkflowTicket } from "../Classes/Tickets/CWorkflowTicket";
import NavigationService from '../Navigation/NavigationService';
import { setColor, setFont } from '../Styles/globalStyle';
import { Notifications } from 'expo';
import { getTicket , deleteNotification } from "../API/APIAWS";
import { withFirebase } from '../Database/';
import { isAndroid, getConstant } from "../Utils";
import { CSouscriptionTicket } from "../Classes/Tickets/CSouscriptionTicket";




/**
 * `createContext` contient 2 propriétés :
 * `Provider` et `Consumer`. Nous les rendons accessibles
 * via la constante `UserContext`, et on initialise une
 * propriété par défaut : "name" qui sera une chaine vide.
 * On exporte ce contexte afin qu'il soit exploitable par
 * d'autres composants par la suite via le `Consumer`
 */
export const NotificationContext = createContext({
  /*notification: '',
  object: '',
  setNotification: () => {}*/
});

/**
 * la classe UserProvider fera office de... Provider (!)
 * en wrappant son enfant direct
 * dans le composant éponyme. De cette façon, ses values
 * seront accessible de manière globale via le `Consumer`
 */
class NotificationProvider extends Component {


    constructor(props) {
      super(props);
      
      this.state = {
        //current notification
        notification: '', // une valeur de départ
        typeNotification : '',
        titleNotification : '',
        messageNotification : '',
        object : '',
    
        //page visité en cours
        setCurrentFocusedObject : (type , id) => this.setCurrentFocusedObject(type, id),
        typeFocused : '',
        idFocused : '',
        
        handleNotificationReception: (notification, obj) => this.handleNotificationReception(notification, obj),
        _removeToast : () => this._removeToast(),
        _showToast: (notification, obj) => this._showToast(notification, obj),

        //handle all notification list
        notificationList : [],
        addNotification : (notifications) => this.addNotification(notifications),
        removeNotification: (type, id) => this.removeNotification(type, id),
        getNotifications :  (type, id) => this.getNotifications(type, id),

        //nouveaux broadcasts donc ticket souscription
        newSouscription : 0,

        //nouveaux tickets annulés
        newCancelledTickets : 0,

        //chech if it is read
        isNotified : (type, id) => this.isNotified(type, id),

        //gere l'apparition de l'alerte
        positionTop : new Animated.Value(getConstant('height')),
      };

      this.ticketBadgesCount = 0;

    }

    registerForPushNotificationsAsync = async () => {
      
      if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = await Notifications.getExpoPushTokenAsync();
        console.log("Token : ");
        console.log(token);
        this.setState({ expoPushToken: token });
      } else {
        alert('Must use physical device for Push Notifications');
      }
  
      if (Platform.OS === 'android') {
        Notifications.createChannelAndroidAsync('default', {
          name: 'default',
          sound: true,
          priority: 'max',
          vibrate: [0, 250, 250, 250],
        });
      }
    };
  

    async componentDidMount() {
      // Handle notifications that are received or selected while the app
      // is open. If the app was closed and then opened by tapping the
      // notification (rather than just tapping the app icon to open it),
      // this function will fire on the next tick after the app starts
      // with the notification data.

      //this.registerForPushNotificationsAsync();

      this._notificationSubscription = Notifications.addListener(this._handleNotification);
              
    }

    //determine la page focusé en ce moment
    setCurrentFocusedObject (type, id) {
      this.setState({ typeFocused : type, idFocused : id }, () => console.log("FOCUS SUR : " + this.state.typeFocused + "  #"+this.state.idFocused));
    }


    //une notification a été recue : on montre un bandeau à l'ecran
    _showToast(notification, obj) { 
      if (notification !== '') {
        console.log("showToast : " + notification.subTitle);
        this.setState({ typeNotification : notification.type, titleNotification : notification.title , messageNotification : notification.eventText, object : obj}, () => {
          
          Animated.spring(
            this.state.positionTop,
              {
                toValue: getConstant('height') - 200,
                duration : 1500,
                //easing: Easing.elastic(),
                speed : 1
              }
          ).start();
          setTimeout(() => {
            this.setState({ typeNotification : '', titleNotification : '', messageNotification : '', positionTop : new Animated.Value(getConstant('height')) });
          }, 20000);

        });
      }
    }
    
    //efface la notfication
    _removeToast() {  
      this.setState({ typeNotification : '', titleNotification : '', messageNotification : '', positionTop : new Animated.Value(getConstant('height')) });
    }

    //met à jour le compteur de notifications
    _handleCounter(type, newNumber) {
      if (type === 'TICKET') {
        this.ticketBadgesCount = newNumber;
        console.log("Nouveau comptage de badge : "+ this.ticketBadgesCount);
        NavigationService.handleBadges('Tickets', this.ticketBadgesCount);
      } 
    }

    //ajoute des notifications 
    addNotification (notifications, typeNotif = 'TICKET') {
      //console.log(notifications);

      //ancienne notifications 
      let oldNotifs = this.state.notificationList;
      notifications.forEach((notif) => {
        //est rajouté si on n'est pas en train de le regardeer
        //if (this.state.typeFocused !== notif.type || this.state.idFocused !== notif.id) {
          //if(notif.type === typeNotif) {
            oldNotifs.push(notif)
          //}
        //}

      });

      //console.log(notifications);
      let ticketNotifs = notifications.filter(({ type }) => type === typeNotif);
      if (typeNotif === 'TICKET') {
        this._handleCounter(typeNotif, ticketNotifs.length + this.ticketBadgesCount);
      }

      this.setState( { notificationList : oldNotifs });
      
    }

    //removeNotification
    removeNotification(typeObject, idObject) {
        
          console.log("ON DEMANDE LA SUPPRESSION DES NOTIGFS POUR : " + idObject + "    : " +typeObject);
      
          //verifie si il est dans la liste
          let arrayTemp = [];
          this.state.notificationList.map((n, i) => {
            //console.log(n.id + "   "+ n.type);
            if (n.type !== typeObject || n.id !== idObject) {
              arrayTemp.push(n);
            } 
          })

          deleteNotification(this.props.firebase, typeObject, idObject);
          
          this._handleCounter(typeObject, arrayTemp.filter(({ type }) => type === typeObject).length);
          
          //this.setState({ notificationList : arrayTemp }, () => console.log(this.state.notificationList));
          this.setState({ notificationList : arrayTemp });
    
    }

    //removeNotification
    getNotifications(typeObject, idObject) {
    
      //console.log("GET NOTIFICATION : " + idObject + "    : " +typeObject);
  
      //verifie si il est dans la liste
      let arrayTemp = [];
      this.state.notificationList.map((n, i) => {
        //console.log(n.id + "   "+ n.type);
        if (n.type === typeObject && n.id === idObject) {
          arrayTemp.push(n);
        } 
      })

      return arrayTemp;

    
    }



    //verifie si cela a été lu ou pas 
    isNotified(typeObject, idObject) {
      let notifArray = this.state.notificationList.filter(({ type, id }) => (type === typeObject && id === idObject));
      let notified = true;
      if (notifArray == null) {
        notified = false;
      } else if (notifArray.length < 1) {
        notified = false;
      }
      return notified;
    }


  //gestion de la reception des notifications
  _handleNotification = notification => {
    console.log(notification);
    //console.log("FOCUSED : " + this.state.typeFocused + "   : " + this.state.idFocused);
    //console.log("Notification recu : "+notification.origin);
    //console.log(notification.data.event);
    switch(notification.data.type) {
        case 'TICKET' : 
                      //console.log(notification.data);
                      this.addNotification([].concat(notification.data));
                      if (this.state.typeFocused !== 'TICKET' || this.state.idFocused !== notification.data.id) {                     
                          NavigationService.handleBadges(this.ticketBadgesCount);
                      
                          //origin === received  -> l'appli est deja ouverte : on met une notification discrete et on incremente le badge
                          if (notification.origin == 'received') {
                              
                              //retourne un ticket donné
                              getTicket(this.props.firebase, notification.data.id)
                              .then((ticket) => {
                                  console.log("ticket retrouvé : " + notification.data.id);
                                  //console.log(Object.keys(ticket));
                                  //updateTicket
                                  this._showToast(notification.data, ticket);
                                  let localnotificationId = notification.notificationId;
                                  setTimeout(function () {
                                    console.log("desactivation de la notification : "+ localnotificationId);
                                    isAndroid() ? Notifications.dismissNotificationAsync(localnotificationId) : null;
                                  }, 10000);
                                  
                              })
                              .catch((error) => {
                                console.log(error);
                                alert("Impossible de récupérer les changements du ticket " + notification.data.idTicket);
                              });
                          } else if (notification.origin == 'selected') { //origin === selected  -> l'appli est en background il y a donc eu click sur la notification native du telephone / on va directement sur le ticket

                              getTicket(this.props.firebase, notification.data.id)
                              .then((ticket) => {
                                  let localnotificationId = notification.notificationId;
                                  console.log("ticket retrouvé en mode selected : " + notification.data.id);
                                  console.log("desactivation de la notification : "+ localnotificationId);
                                  isAndroid() ? Notifications.dismissNotificationAsync(localnotificationId) : null;
                                  NavigationService.navigate('FLTicketDetailTicket', { ticket: ticket.type === "Souscription" ? new CSouscriptionTicket(ticket) :  new CWorkflowTicket(ticket) });
                                  //this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLTicketDetailHome' : 'FLTicketDetailTicket', {
                                  // ticket: new CWorkflowTicket(ticket),
                                  //})
                                })
                                .catch((error) => {
                                  console.log(error);
                                  alert("Impossible de récupérer les changements du ticket " + notification.data.id);
                                });
                          }
                        } else { //on est déja au bon endroit il faut juste consumer la notification
                          let localnotificationId = notification.notificationId;
                          console.log("desactivation de la notification : "+ localnotificationId);
                          isAndroid() ? Notifications.dismissNotificationAsync(localnotificationId) : null;

                          //on l'efface aussi de la base
                          deleteNotification(this.props.firebase, 'TICKET', notification.data.id);
                        }
              break;
        case 'NEW_SOUSCRIPTION' : 
                    //console.log(notification.data);
                    this.addNotification([].concat(notification.data));                   
                    //NavigationService.handleBadges(this.ticketBadgesCount);
                
                    //origin === received  -> l'appli est deja ouverte : on met une notification discrete et on incremente le badge
                    if (notification.origin == 'received') {
                        
                        //retourne un ticket donné
                        this.setState({newSouscription : notification.data.id}, () => {
                            this._showToast(notification.data, null);
                            let localnotificationId = notification.notificationId;
                            setTimeout(function () {
                              console.log("desactivation de la notification : "+ localnotificationId);
                              isAndroid() ? Notifications.dismissNotificationAsync(localnotificationId) : null;
                            }, 10000);
                        });
                    } else if (notification.origin == 'selected') { //origin === selected  -> l'appli est en background il y a donc eu click sur la notification native du telephone / on va directement sur le ticket
                        let localnotificationId = notification.notificationId;
                        isAndroid() ? Notifications.dismissNotificationAsync(localnotificationId) : null;
                        NavigationService.navigate('Accueil');
                  }                      
            break;
        case 'CANCEL' : 
            //console.log(notification.data);
            this.addNotification([].concat(notification.data));                   
            //NavigationService.handleBadges(this.ticketBadgesCount);
        
            //origin === received  -> l'appli est deja ouverte : on met une notification discrete et on incremente le badge
            if (notification.origin == 'received') {
                
                //retourne un ticket donné
                this.setState({newCancelledTickets : notification.data.id}, () => {
                    this._showToast(notification.data, null);
                    let localnotificationId = notification.notificationId;
                    setTimeout(function () {
                      console.log("desactivation de la notification : "+ localnotificationId);
                      isAndroid() ? Notifications.dismissNotificationAsync(localnotificationId) : null;
                    }, 10000);
                });
            } else if (notification.origin == 'selected') { //origin === selected  -> l'appli est en background il y a donc eu click sur la notification native du telephone / on va directement sur le ticket
                let localnotificationId = notification.notificationId;
                isAndroid() ? Notifications.dismissNotificationAsync(localnotificationId) : null;
                //NavigationService.navigate('Accueil');
          }                      
    break;
        default :
              // this._showToast(notification.data, ticket);
              // let localnotificationId = notification.notificationId;
              
              // setTimeout(function () {
              //   () => this.setState({newBroadcast : 0});
              // }, 10000);
              
              break;
    }
  };




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
    
    {store => {
        //console.log(store);
        return (
        <View style={{flex: 1}}>
              <View style={{flex: 1}}>
                    <Component {...props} {...store} />
              </View>
              { (store.titleNotification != null && store.titleNotification !== '')
                ?
                  <Animated.View style={{position: 'absolute', top: store.positionTop, left : getConstant('width')/10, width :4*getConstant('width')/5, borderWidth : 0, borderColor: 'red', borderRadius : 20}}>
                      <TouchableOpacity style={{ flexDirection : 'row'}}
                                          onPress={() => {
                                              if (store.typeNotification === 'TICKET') {
     
                                                  let t = store.object.type === "Souscription" ? new CSouscriptionTicket(store.object) :  new CWorkflowTicket(store.object);
                                                  //let t = store.object;
                                                  console.log("NAVIGATION VERS LE TICKET");
                                                  //store._removeToast();
                                                  NavigationService.navigate('FLTicketDetailTicket' , {
                                                    ticket: t,
                                                  });
                                                  //console.log(t.getDescription());
                                              } else if (store.typeNotification === 'NEW_SOUSCRIPTION') {
                                                console.log("NAVIGATION VERS ACCUEIL");
                                                NavigationService.navigate('Accueil');
                                              } else if (store.typeNotification === 'CANCEL') {
                                                console.log("NAVIGATION VERS Tickets");
                                                NavigationService.navigate('Tickets');
                                              }  
                                      }}          
                            >
                            <View style={{flex: 0.9, flexDirection : 'column',justifyContent: 'center', backgroundColor: setColor('darkBlue'), borderWidth : 1, borderColor : setColor('darkBlue'), borderBottomLeftRadius : 15, borderTopLeftRadius : 15}}>
                                <View style={{flex: 0.4, padding : 5, paddingTop : 10}}>
                                  <Text style={setFont('400', 12, 'white', 'Regular')}> {store.titleNotification}</Text>
                                </View>
                                <View style={{ paddingLeft : 20, paddingBottom : 10}}>
                                  <Text style={setFont('400', 14, 'white')}>{store.messageNotification}</Text>
                               </View>              
                            </View>
                            <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center', backgroundColor: setColor(''), borderWidth : 1, borderColor : setColor(''), borderBottomRightRadius : 15, borderTopRightRadius : 15}}>
                                <Text style={setFont('400', 18, 'white', 'Regular')}>></Text>
                            </View>
                      </TouchableOpacity>
                  </Animated.View>
                : null
              }
        </View>
        );
      }
  }
  </NotificationContext.Consumer>
);


export default withFirebase(NotificationProvider);

