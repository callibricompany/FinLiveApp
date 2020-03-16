// store/UserProvider.js
import React, { createContext, Component } from "react"; // on importe createContext qui servira à la création d'un ou plusieurs contextes
import { View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { CWorkflowTicket } from "../Classes/Tickets/CWorkflowTicket";
import NavigationService from '../Navigation/NavigationService';
import { setColor, setFont } from '../Styles/globalStyle';




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
      notification: '', // une valeur de départ
      titleNotification : '',
      messageNotification : '',
      object : '',
  
      setNotification: (notification, obj) => this.setNotification(notification, obj),


      positionTop : new Animated.Value(DEVICE_HEIGHT),
    };

    this.ticketBadgesCount = 0;
  }


  setNotification(notification, obj) {
    
    console.log(notification);
      
    if (notification !== '') {
      
      //console.log(props.notification.subject);
      this.setState({ titleNotification : notification.type , messageNotification : notification.subject, object : obj}, () => {
        NavigationService.handleBadges(this.ticketBadgesCount);
        Animated.spring(
          this.state.positionTop,
            {
              toValue: DEVICE_HEIGHT - 180,
              duration : 1500,
              //easing: Easing.elastic(),
              speed : 1
            }
        ).start();
        setTimeout(() => {
          this.setState({ titleNotification : '', messageNotification : '', positionTop : new Animated.Value(DEVICE_HEIGHT) });
        }, 10000);

      });
    }
    
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
    
    {store => {
        //console.log(store);
        return (
        <View style={{flex: 1}}>
              <View style={{flex: 1}}>
                    <Component {...props} {...store} />
              </View>
              { store.titleNotification !== ''
                ?
                  <Animated.View style={{ flexDirection : 'row', position: 'absolute', top: store.positionTop, left : DEVICE_WIDTH/10, width :4*DEVICE_WIDTH/5, borderWidth : 1, borderColor: 'transparent', borderRadius : 4}}>
                            <View style={{flex: 0.9, flexDirection : 'column',justifyContent: 'center', backgroundColor: setColor('vertpomme')}}>
                                <View style={{flex: 0.4, padding : 5}}>
                                  <Text style={setFont('400', 12, 'white')}> {store.titleNotification} {String("mis à jour").toUpperCase()}</Text>
                                </View>
                                <View style={{ padding : 5}}>
                                  <Text style={setFont('400', 14, 'white')}>{store.messageNotification}</Text>
                                </View>               
                            </View>
                            <TouchableOpacity style={{flex: 0.1, justifyContent: 'center', alignItems: 'center', backgroundColor: setColor('subscribeticket')}}
                                              onPress={() => {
                                                      let ticket = new CWorkflowTicket(store.object);
                                                      this.setState({ titleNotification : '', messageNotification : '', positionTop : new Animated.Value(DEVICE_HEIGHT) });
                                                      NavigationService.navigate('FLTicketDetailHome' , {
                                                      ticket: ticket,
                                                      });
                                                    // NavigationService.navigate('NewsList');
                                                      //this.props.navigation.navigate('NewsList'); 
                                              }}          
                            >
                                <Text style={setFont('400', 18, 'white', 'Regular')}>></Text>
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


export default NotificationProvider;

