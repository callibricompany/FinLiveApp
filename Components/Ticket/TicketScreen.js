import React, { Component } from 'react';
import { Animated, Image, TextInput, TouchableOpacity,ImageBackground, StatusBar, Dimensions, 
        StyleSheet, Easing, View, Text, FlatList, SafeAreaView, Modal, Alert} from 'react-native';
import { Icon } from 'native-base';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import { globalStyle, setFont, setColor } from '../../Styles/globalStyle'
  
import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';

import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import { ifIphoneX, ifAndroid, isEqual , getConstant, isAndroid } from '../../Utils';

import { getAllTicketClosed } from '../../API/APIAWS';

import { CBroadcastTicket } from "../../Classes/Tickets/CBroadcastTicket";
import { CTicket } from '../../Classes/Tickets/CTicket';
import { CWorkflowTicket } from  "../../Classes/Tickets/CWorkflowTicket";

import FLTemplatePP  from '../commons/Ticket/FLTemplatePP';
import FLTemplatePSBroadcast from '../commons/Ticket/FLTemplatePSBroadcast';

import * as TEMPLATE_TYPE from '../../constants/template';


import Moment from 'moment';






const NAVBAR_HEIGHT = 45;
//determination de la hauteur des status bar
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);


const sortDatas = [
  {'LASTUPDATE' : "Date de modification"},
  {'DUEDATE' : "Date de réponse attendue"},
  {'CREATIONDATE' : "Date de création"}
];

const filterDatas = [
  {'LIVETICKETS' : "Mes trades en cours"},
  {'UNREADTICKETS' : "Mes trades non lus"},
  {'CLOSEDTICKETS' : "Mes trades clotûrés"},
  {'ALLTICKETS' : "Tous mes trades"}
];

class TicketScreen extends React.Component {
 
  constructor(props) {
    super(props);

    //recuperation de type de templtate a affichier
    this.templateType = this.props.navigation.getParam('templateType', TEMPLATE_TYPE.TICKET_FULL_TEMPLATE);


    //utiliser pour dispzarition en-tete
    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);

    //liste de tous les tickets à afficher classé
    //console.log(this.props.tickets.slice(1,2));
    this.allTickets = [];
    
    //this.props.tickets.forEach((t) =>  t.type === "Produit structuré" ? this.allTickets.push(new CWorkflowTicket(t)) : null);
    //this.props.broadcasts.forEach((t) => this.allTickets.push(new CBroadcastTicket(t)));
    this.allTickets = this.props.tickets;
    this.allTickets.sort(CTicket.compareLastUpdateDown);

    
    //this.allTickets.forEach((t) => console.log(t.getId() +" : " +Moment(t.getLastUpdateDate()).format('lll')));
    //console.log(this.props.tickets[0]);

    this.state = {

      //animation barre de recherche
      positionLeft: new Animated.Value(getConstant('width')), //indicateur si recherche ou pas
      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnim,
        ),
        0,
        NAVBAR_HEIGHT ,
      ),
      //gestion de la fenetre modale
      showModalDrawner : false,

      //classement
      sortDataDown : true,
      sortSelected : 'LASTUPDATE',

      //notifications
      allNotificationsCount : this.props.allNotificationsCount,
      idFocused : this.props.idFocused,

      //filttre
      filterSelected : this.props.navigation.getParam('filterTypeTicket', 'LIVETICKETS'),

      toto : true,
    };
    //this.dataSource = Array(19).fill().map((_, index) => ({id: index}));

    //si le filtre par defaut n'est pas chargé au depart : on charge le filtre addequat
    //console.log("ALOUETTTTTTTTTTTTTTTTTTTTTE : "+ this.state.filterSelected);
    this.state.filterSelected !== 'LIVETICKETS' ? this._loadAppropriateTickets(this.state.filterSelected) : null; 
    this.filterOnAir = false;
  }

  
  _clampedScrollValue = 0;
  _offsetValue = 0;
  _scrollValue = 0;

  static navigationOptions = ({ navigation }) => {
      return ({
        header : null,
      }
      );
  }



  componentDidMount() {

    //StatusBarManager.getHeight(({height}) => console.log("HAUTEUR STATUS BAR : " + height));
    this.state.scrollAnim.addListener(({ value }) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, 0),
        NAVBAR_HEIGHT ,
      );
    });
    this.state.offsetAnim.addListener(({ value }) => {
      this._offsetValue = value;
    });

    if (!isAndroid()) {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle('light-content');
      });
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    // if (!isEqual(props.tickets, this.props.tickets)) {
    //   console.log("CHANGEMENT DANS LES TICKETS PABLITOTOTOTOTOTOTOTOTOTOTOT");
    //   //this.setState({ toto : !this.state.toto });
    // }
    this._loadAppropriateTickets(this.state.filterSelected);
    this.setState({ allNotificationsCount :props.allNotificationsCount , idFocused : props.idFocuse});
  }

  componentWillUnmount() {
    if (!isAndroid()) {
      this._navListener.remove();
    }
    this.state.scrollAnim.removeAllListeners();
    this.state.offsetAnim.removeAllListeners();
  }

  _onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };

  _onMomentumScrollEnd = () => {
    const toValue = this._scrollValue > NAVBAR_HEIGHT &&
      this._clampedScrollValue > (NAVBAR_HEIGHT - getConstant('statusBar')) / 2
      ? this._offsetValue + NAVBAR_HEIGHT
      : this._offsetValue - NAVBAR_HEIGHT;

   /* Animated.timing(this.state.offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();*/
  };


  //classement des tickets
  _sortTicket(field, down) {
    if (field === 'LASTUPDATE') {
      down ? this.allTickets.sort(CTicket.compareLastUpdateDown) : this.allTickets.sort(CTicket.compareLastUpdateUp);
    } else if (field === 'CREATIONDATE') {
      down ? this.allTickets.sort(CTicket.compareCeationDateDown) : this.allTickets.sort(CTicket.compareCeationDateUp);
    } else if (field === 'DUEDATE') {
      down ? this.allTickets.sort(CTicket.compareDueDateDown) : this.allTickets.sort(CTicket.compareDueDateUp);
    }
  }

/**
 * charge les tickets adequats selon le filtre voulu en params
 * @param {*} filterCode 
 */
  _loadAppropriateTickets(filterCode) {
    switch(filterCode) {
      case 'LIVETICKETS' : 
        this.allTickets = this.props.tickets;
        break;
      case 'UNREADTICKETS' :
        this.allTickets = [];
        break;
      case 'CLOSEDTICKETS' : 
        //on rappatrie les tickets 
        this.allTickets = [];
        getAllTicketClosed(this.props.firebase)
        .then((tickets) => {
          //console.log(tickets.userTickets);
          this.allTickets = this.props.classifyTickets(tickets.userTickets, 'PRODUCT');
          this.setState({ toto : !this.state.toto });
        })
        .catch((err) => alert(err));
        console.log("fin chargement tickets archivés :  "+this.allTickets.length);
        break;
      case 'ALLTICKETS' :
        break;
      default : 
        this.allTickets = [];
        break;
    }
  }

  _renderModalDrawner () {
    return (
      <Modal  animationType="slide" transparent={true} visible={this.state.showModalDrawner}
              onRequestClose={() => {
              console.log('Modal has been closed');
            }}
      >
          <View 
              style={{flex:1, backgroundColor:'transparent'}} 
              onStartShouldSetResponder={() => true}
              onResponderRelease={(evt) =>{
                let x = evt.nativeEvent.pageX;
                let y = evt.nativeEvent.pageY;
                //si on a clické en dehors du module view cidessous on ferme le modal
                let verifX = x < getConstant('width')*0  || x > getConstant('width') ? true : false;
                let verifY = y < getConstant('height')*0.4  || y > getConstant('height') ? true : false;
                if (verifX || verifY) {
                  //console.log("passe la ");
                  this.setState({showModalDrawner : false})
                }
              }}
          >
            <View style={{ flexDirection: 'column',backgroundColor: 'white', borderWidth :0, borderColor : 'black', borderRadius:5,width: getConstant('width'), height: getConstant('height')*0.6, top:  getConstant('height')*0.4, left : getConstant('width')*0}}>
                <View style={{ marginTop : 15, justifyContent : 'center', alignItems: 'flex-start', paddingLeft : 15}}>
                        <Text style={setFont('200', 14, 'gray')}>
                            Trier par : 
                        </Text>
                </View>
                {sortDatas.map((s,i) => {
                      let sortName = Object.values(s)[0]
                      let sortCode = Object.keys(s)[0]
                      return (
                        <TouchableOpacity style={{flexDirection : 'row', marginTop : 15}} key={i}
                                          onPress={() => {
                                              //si le type de classement est le meme que precedemment selectionné : on change juste le sens
                                              if (sortCode === this.state.sortSelected) {
                                                this._sortTicket(sortCode, !this.state.sortDataDown);
                                                this.setState({ sortDataDown : !this.state.sortDataDown , showModalDrawner : false });
                                              } else {
                                                this._sortTicket(sortCode, this.state.sortDataDown);
                                                this.setState({ sortSelected : sortCode , showModalDrawner : false});
                                              }
                                          }}
                        >
                              <View style={{flex : sortCode === this.state.sortSelected ? 0.8 : 1, justifyContent : 'center', alignItems: 'flex-start', paddingLeft : 15}}>
                                  <View style={{flexDirection: 'row'}}>
                                      <View>
                                          <Text style={setFont('200', 16, sortCode === this.state.sortSelected ? setColor('granny') : 'black', 'Regular')}>
                                              {sortName}
                                          </Text>
                                      </View>
                                      {sortCode === this.state.sortSelected  
                                        ?
                                          <View style={{paddingLeft : 5, justifyContent :'center'}}>
                                              <MaterialCommunityIcons name={this.state.sortDataDown ? 'arrow-down' : 'arrow-up'} size={22} color={setColor('granny')}/>
                                          </View>
                                        : null
                                      }
                                  </View>
                              </View>
                              {sortCode === this.state.sortSelected  
                                ?
                                    <View style={{flex: 0.2, justifyContent : 'center', alignItems: 'flex-start'}}>
                                      <MaterialCommunityIcons name='check' size={22} color={setColor('granny')}/>
                                    </View>
                                : null
                              }
                        </TouchableOpacity>
                      );
                    })
                }
 
                <View style={{marginTop : 25, justifyContent : 'center', alignItems: 'flex-start', paddingLeft : 15}}>
                    <Text style={setFont('200', 14, 'gray')}>
                        Voir : 
                    </Text>
                </View>
                {filterDatas.map((f,i) => {
                      let filterName = Object.values(f)[0]
                      let filterCode = Object.keys(f)[0]
                      return (
                        <TouchableOpacity style={{flexDirection : 'row', marginTop : 15}} key={i}
                                          onPress={() => {
                                                //selection des tickets a afficher
                                                //load appropaite tickets 
                                                this._loadAppropriateTickets(filterCode);
    
                                                //apppel au rechargement des tickets
                                                this.setState({ filterSelected : filterCode , showModalDrawner : false});

                                          }}
                        >
                              <View style={{flex : filterCode === this.state.filterSelected ? 0.8 : 1, justifyContent : 'center', alignItems: 'flex-start', paddingLeft : 15}}>
                                  <Text style={setFont('200', 16, filterCode === this.state.filterSelected ? setColor('granny') : 'black', 'Regular')}>
                                      {filterName}
                                  </Text>
                              </View>
                              {filterCode === this.state.filterSelected  
                                ?
                                    <View style={{flex: 0.2, justifyContent : 'center', alignItems: 'flex-start'}}>
                                      <MaterialCommunityIcons name='check' size={22} color={setColor('granny')}/>
                                    </View>
                                : null
                              }
                        </TouchableOpacity>
                      );
                    })
                }

            </View>
          </View>
      </Modal>
    );
  }

  render() {
    const { clampedScroll } = this.state;

    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT ],
      outputRange: [0, -(NAVBAR_HEIGHT )],
      extrapolate: 'clamp',
    });
    const navbarOpacity = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT ],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const navbarTop = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT ],
      outputRange: [0, -getConstant('statusBar')],
      extrapolate: 'clamp',
    });


  
// <Animated.View style={[styles.navbar, { transform: [{ translateY: navbarTranslate }] }]}>
    return (
      <SafeAreaView style={{flex : 1, backgroundColor : setColor('')}}>
        {this._renderModalDrawner()}
 
        <View style={{height: getConstant('height'), WIDTH: getConstant('width'), backgroundColor: setColor('background'), opacity : this.state.showModalDrawner ? 0.3 : 1}}>
          <AnimatedFlatList
            contentContainerStyle={{alignItems : 'center', marginTop :  20 + NAVBAR_HEIGHT}}
            data={this.allTickets}
            //data={this.props.broadcasts}
            keyExtractor={(item)  => {
              return item.getId().toString();
            }}
            renderItem={({item, index}) => {
              //let ticket = new CTicket(item);
              //console.log("TICKET TYPE : " + item.getId() + "   :  " + item.getType() +  "   :  " + item.getTemplate());

              //on verifie si la selection est les tickets non lus et on ne montre pas les lus
              if (this.state.filterSelected === 'UNREADTICKETS') {
                let isNotified = this.props.isNotified('TICKET', item.getId());
                if (!isNotified) {
                  return null;
                }
              }

              switch(item.getType()) {
                  case "Broadcasting" :
                      //let ticketB = new CBroadcastTicket(item);
                      //console.log("TICKET BROADCAST : " + ticketB.getId() + "   :  " + ticketB.getType() +  "   :  " + ticketB.getTemplate()+":templ : ");
                      //console.log(item);
                      switch (item.getTemplate()) {
                        case TEMPLATE_TYPE.PSBROADCAST :
                          return (
                            <View style={{marginBottom : 15}} >
                              <FLTemplatePSBroadcast ticket={item} templateType={TEMPLATE_TYPE.BROADCAST_PS_FULL_TEMPLATE} source={'Home'} screenWidth={0.95} />
                            </View>
                          );
                        default:
                          return null;
                      };
                      break;
                  case "Produit structuré" :
                      //let ticketC = new CWorkflowTicket(item);
                      //console.log("TICKET WORKFLOW : " + ticketC.getId() + "   :  " + ticketC.getType() +  "   :  " + ticketC.getTemplate());
      
                      switch (item.getTemplate()) {
                        case TEMPLATE_TYPE.PSAPE : 
                          return null;
                        case TEMPLATE_TYPE.PSPP :         
                          return (
                            <View style={{ marginBottom : 15 }} >
                                <FLTemplatePP ticket={item} templateType={this.templateType} source={'Ticket'} screenWidth={0.95} />
                            </View>
                          );
                        default : return null;
                      };
                      break;
                  default : return null;  
                }
            }}
            scrollEventThrottle={1}
            extraData={this.state.allNotificationsCount}
            onMomentumScrollBegin={this._onMomentumScrollBegin}
            onMomentumScrollEnd={this._onMomentumScrollEnd}
            onScrollEndDrag={this._onScrollEndDrag}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
              { useNativeDriver: true },
            )}
            ListFooterComponent={() => {
              return (
                <TouchableOpacity onPress={() => {
                        Alert.alert("FinLive SAS","Copyright ©")
                    }}
                    style={{height : 250, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={setFont('600', 12)}>F i n L i v e</Text>
                </TouchableOpacity>
              );
            }}
          />
          
          <Animated.View style={[styles.navbar, { transform: [{ translateY: this.filterOnAir ? 0 : navbarTranslate }] }]}>
          
          <Animated.View style={{
                    display: 'flex',
                    backgroundColor: setColor(''),
                    //borderRadius: 3,
                    borderWidth:0,
                    opacity: this.filterOnAir ? 1 : navbarOpacity,
                    height: 45,
                    marginTop: 0,
                    width: getConstant('width')*1,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}> 
                    <View style={{flex: 1, height: 45, borderWidth: 0, width: getConstant('width')*0.925,flexDirection: 'row'}}>   
                      <TouchableOpacity style={{flex: 0.1, height : 45, justifyContent: 'center', alignItems: 'flex-start'}}
                                              onPress={() => {
                                                this.setState ({ showModalDrawner : true });
                                              }}
                            >
                                      <MaterialIcons name='filter-list' size={22} color={'white'}/>
                      </TouchableOpacity>
                      <View style={{flex:0.8, borderWidth: 0, height: 45,justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => {
                                    console.log("qsjhfjhdfjd");
                        }}>
                          <Text style={[setFont('200', 18, 'white', 'Regular'), {paddingLeft : 5}]}>
                          {filterDatas.map((f,i) => Object.keys(f)[0] === this.state.filterSelected ? Object.values(f)[0] : null)}  
                          </Text>    
                        </TouchableOpacity>
                      </View>   

                      <TouchableOpacity style={{ flex:0.1, height: 45, borderWidth: 0,justifyContent: 'center', alignItems: 'center'}}
                          onPress={() => {
                            this.props.navigation.setParams({ hideBottomTabBar : true});
                            
                            this.filterOnAir = true;
                              Animated.parallel([
                                Animated.timing(
                                    this.state.positionLeft,
                                      {
                                        toValue: 0,
                                        duration : 1000,
                                        easing: Easing.elastic(),
                                        speed : 1
                                      }
                                ),
                                  /*Animated.timing(
                                    this.state.categoryHeight,
                                    {
                                      toValue: 0,
                                      duration : 1000,
                                      easing: Easing.elastic(),
                                      speed : 1
                                    }
                                  )  */
                              ]).start(() => {
  
                            });
                              
                              if (this.inputSearch !== null && this.inputSearch !== undefined) {
                                this.inputSearch.focus();
                              }
                            

                          }}>  
                            <MaterialIcons name='search' size={25} color={'white'} />
                        </TouchableOpacity>
          
                      
                    </View>
                    <Animated.View style={{flexDirection:'row', top: 0, width: getConstant('width'), backgroundColor: 'white',left: this.state.positionLeft, height: 45}}>
                        <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => {
                                        this.filterOnAir = false;
                                        
                                          Animated.parallel([
                                            Animated.timing(
                                                this.state.positionLeft,
                                                  {
                                                    toValue: getConstant('width'),
                                                    duration : 1000,
                                                    easing: Easing.elastic(),
                                                    speed : 1
                                                  }
                                            ),
                                              /*Animated.timing(
                                                this.state.categoryHeight,
                                                {
                                                  toValue: 45,
                                                  duration : 1000,
                                                  easing: Easing.elastic(),
                                                  speed : 1
                                                }
                                              )  */
                                          ]).start(() => {
                                                //force le render avec un changement de state dont on se fiche 
                                                
                                                this.props.navigation.setParams({ hideBottomTabBar : false});
                                          });

                                          if (this.inputSearch !== null && this.inputSearch !== undefined) {
                                            this.inputSearch.blur();
                                          }
                                          this.searchText = '';
                                          //this.props.filterUpdated(this.state.selectedCategory, this.state.selectedSubCategory, '');
                                }}>  
                                  <MaterialIcons
                                        name='arrow-back' 
                                        size={22} 
                                        color='lightgray'
                                        style={{paddingLeft: 20}}
                                      />
                              </TouchableOpacity>
                        </View>
                        <View style={{flex: 0.9}}>
                            <TextInput 
                                style={styles.inputText}
                                placeholder={'Filtre ...'}
                                placeholderTextColor={'#999'}        
                                underlineColorAndroid={'#fff'}
                                autoCorrect={false}
                                //editable={false}
                                onSubmitEditing={() => {
                                  this.props.navigation.setParams({ hideBottomTabBar : false});
                                  //this.props.filterUpdated(this.state.selectedCategory, this.state.selectedSubCategory, this.searchText);
                                }}
                                ref={(inputSearch) => {
                                  //if (this.inputSearch !== null && this.inputSearch !== undefined) {
                                    this.inputSearch = inputSearch;
                                    //inputSearch.focus();
                                //  }
                                }}
                                onChangeText={(text) => this.searchText = text}
                              />
                            </View>

                    </Animated.View>                    
              </Animated.View>
            </Animated.View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    height: NAVBAR_HEIGHT,
    justifyContent: 'center',
    //paddingTop: getConstant('statusBar),
  },
 

  inputText: {
    display: 'flex',
    ...ifAndroid({
      marginTop: 9
    }, {
      marginTop: 13
    }),
    marginLeft: 20,
    fontSize: 18,
    color: '#999',
  },
});


const condition = authUser => !!authUser;
const composedPricerScreen = compose(
 withAuthorization(condition),
  withUser,
  withNavigation,
);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(TicketScreen);

/*

 <Animated.Text style={[styles.title, { opacity: navbarOpacity }]}>

 */
