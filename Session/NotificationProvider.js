// store/UserProvider.js
import React, { createContext, Component } from "react";  // on importe createContext qui servira à la création d'un ou plusieurs contextes
import { View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { CWorkflowTicket } from "../Classes/Tickets/CWorkflowTicket";
import NavigationService from '../Navigation/NavigationService';
import { setColor, setFont } from '../Styles/globalStyle';
import { Notifications } from 'expo';
import { getTicket , deleteNotification } from "../API/APIAWS";
import { withFirebase } from '../Database/';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

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

        //chech if it is read
        isNotified : (type, id) => this.isNotified(type, id),

        //gere l'apparition de l'alerte
        positionTop : new Animated.Value(DEVICE_HEIGHT),
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
        this.setState({ typeNotification : notification.type, titleNotification : notification.type , messageNotification : notification.subTitle, object : obj}, () => {
          
          Animated.spring(
            this.state.positionTop,
              {
                toValue: DEVICE_HEIGHT - 200,
                duration : 1500,
                //easing: Easing.elastic(),
                speed : 1
              }
          ).start();
          setTimeout(() => {
            this.setState({ typeNotification : '', titleNotification : '', messageNotification : '', positionTop : new Animated.Value(DEVICE_HEIGHT) });
          }, 10000);

        });
      }
    }
    
    //efface la notfication
    _removeToast() {  
      this.setState({ typeNotification : '', titleNotification : '', messageNotification : '', positionTop : new Animated.Value(DEVICE_HEIGHT) });
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
    addNotification (notifications) {
      //Object {
      //  "event": "{ffs_07:{from:10Y,to:7Y}}",
      //  "id": 118,
      //  "read": false,
      //  "subTitle": "Athéna 9 ans sur Cac 40 / annuel",
      //  "subType": "Produit structuré",
      //  "timestamp": 1584204236700,
      //  "title": "TICKET MIS A JOUR",
      //  "type": "TICKET",
      //  "uid": "xjoRccvRXBVo5Tqe3iaWuGBe0aX2",
      //},
      //console.log(notifications);
      //nouvelles notifications TICKETs
      let ticketNotifs = notifications.filter(({ type }) => type === 'TICKET');
      this._handleCounter('TICKET', ticketNotifs.length + this.ticketBadgesCount);
      
      //ancienne notifications 
      let oldNotifs = this.state.notificationList;
      notifications.forEach((t) => oldNotifs.push(t));
      this.setState( { notificationList : oldNotifs });
    }

    //removeNotification
    removeNotification(typeObject, idObject) {
      
      if (this.state.typeFocused !== 'TICKET' || this.state.idFocused !== notification.data.id) {
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
    }



    //verifie si cela a été lu ou pas 
    isNotified(typeObject, idObject) {
      return (this.state.notificationList.filter(({ type, id }) => (type === typeObject && id === idObject)).length >= 1);
    }

  //gestion de la reception des notifications
  _handleNotification = notification => {
    console.log(notification);
    //console.log("Notification recu : "+notification.origin);
    //console.log(notification.data.event);
    switch(notification.data.type) {
        case 'TICKET' : 
                      //console.log(notification.data);
                      if (this.state.typeFocused !== 'TICKET' || this.state.idFocused !== notification.data.id) {
                          this.addNotification([].concat(notification.data));
                          NavigationService.handleBadges(this.ticketBadgesCount);
                      
                          //origin === received  -> l'appli est deja ouverte : on met une notification discrete et on incremente le badge
                          if (notification.origin == 'received') {
                              
                              //retourne un ticket donné
                              getTicket(this.props.firebase, notification.data.id)
                              .then((ticket) => {
                                  console.log("ticket retrouvé : " + notification.data.id);
                                  this._showToast(notification.data, ticket);
                                  let localnotificationId = notification.notificationId;
                                  setTimeout(function () {
                                    console.log("desactivation de la notification : "+ localnotificationId);
                                    Notifications.dismissNotificationAsync(localnotificationId);
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
                                  Notifications.dismissNotificationAsync(localnotificationId);
                                  NavigationService.navigate('FLTicketDetailTicket', { ticket: new CWorkflowTicket(ticket) });
                                  //this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLTicketDetailHome' : 'FLTicketDetailTicket', {
                                  // ticket: new CWorkflowTicket(ticket),
                                  //})
                                })
                                .catch((error) => {
                                  console.log(error);
                                  alert("Impossible de récupérer les changements du ticket " + notification.data.idTicket);
                                });
                          }
                        } else { //on est déja au bon endroit il faut juste consumer la notification
                          let localnotificationId = notification.notificationId;
                          console.log("desactivation de la notification : "+ localnotificationId);
                          Notifications.dismissNotificationAsync(localnotificationId);

                          //on l'efface aussi de la base
                          deleteNotification(this.props.firebase, 'TICKET', notification.data.id);
                        }
              break;

        default :
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
              { store.titleNotification !== ''
              //1 === 1
                ?
                  <Animated.View style={{position: 'absolute', top: store.positionTop, left : DEVICE_WIDTH/10, width :4*DEVICE_WIDTH/5, borderWidth : 1, borderColor: 'transparent', borderRadius : 4}}>
                      <TouchableOpacity style={{ flexDirection : 'row'}}
                                          onPress={() => {
                                              if (store.typeNotification === 'TICKET') {
                                                  let t = new CWorkflowTicket(store.object);
                                                  //let t = store.object;
                                                  //console.log("TICKET creeeeeee ");
                                                  //store._removeToast();
                                                  NavigationService.navigate('FLTicketDetailTicket' , {
                                                    ticket: t,
                                                  });
                                                  //console.log(t.getDescription());
                                              }
                                          
                                      }}          
                            >
                            <View style={{flex: 0.9, flexDirection : 'column',justifyContent: 'center', backgroundColor: setColor('vertpomme')}}>
                                <View style={{flex: 0.4, padding : 5}}>
                                  <Text style={setFont('400', 12, 'white')}> {store.titleNotification} {String("mis à jour").toUpperCase()}</Text>
                                </View>
                                <View style={{ padding : 5}}>
                                  <Text style={setFont('400', 14, 'white')}>{store.messageNotification}</Text>
                               </View>              
                            </View>
                            <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center', backgroundColor: setColor('subscribeticket')}}>
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

