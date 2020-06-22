import React from "react";
import { Image, ScrollView, Text, View, Animated, StyleSheet, KeyboardAvoidingView, Dimensions, TouchableOpacity, TextInput, StatusBar, Modal, Keyboard, PanResponder } from "react-native";
import {  } from 'react-native-gesture-handler';
import { NavigationActions } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import FLTemplateAutocall from "./FLTemplateAutocall";
import { setFont, setColor , globalStyle  } from '../../../Styles/globalStyle';

import { ssCreateStructuredProduct } from '../../../API/APIAWS';
import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual, getConstant } from '../../../Utils';
import FLAnimatedSVG from '../FLAnimatedSVG';

import Accordion from 'react-native-collapsible/Accordion';

import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import { CAutocall } from '../../../Classes/Products/CAutocall';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';

import Numeral from 'numeral'
import 'numeral/locales/fr'
import Moment from 'moment';
import localization from 'moment/locale/fr'

import logo_white from '../../../assets/LogoWithoutTex_white.png';
import logo from '../../../assets/LogoWithoutText.png';

import * as TEMPLATE_TYPE from '../../../constants/template';
import { CWorkflowTicket } from "../../../Classes/Tickets/CWorkflowTicket";








class FLAutocallDetail extends React.Component {
   
  constructor(props) {
    super(props);   

    //recuperation de l'autocall
   // this.autocall =  this.props.navigation.getParam('autocall', '...');
   this.autocall = this.props.autocall;
   this.isEditable = typeof this.props.isEditable !== 'undefined' ? this.props.isEditable : true,
   // this.isEditable = this.props.navigation.getParam('isEditable', true);
   console.log("CONSTRUCTEUR AUTOCALL : " +props.isEditable + "  :  " + this.props.isEditable);
    
    this.state = { 

        //gestio, du menu dynamique
        text: "",
        

        //gestion du nominal (deja traité ou pas)
        nominal :  this.autocall.getNominal(),
        finalNominal :  this.autocall.getNominal(),
  
        //gestion des sections
        activeSections: [0],

        //gestion du fondu de l'en tete
        scrollOffset: new Animated.Value(0),
        isScrollAtTop : true,
  
        //gestion du clavier
        keyboardHeight: 0,
        isKeyboardVisible: false,
  
        //affchage du modal description avant traiter
        showModalDescription : false,
        description : '',
        isAutomatique : true,
  
        isLoading : false,
        toto : true,

    };

    this.props.navigation.setParams({ hideBottomTabBar : true });


    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);

    this._loadSections();
  }


  //chargement dynamique des sections
  _loadSections() {
    this.SECTIONS = [            
            {
              title: 'dates importantes',
              code: 'DATE',
            }, 
            {
              title: 'protection du capital',
              code: 'CAPITAL',
            }, 
            {
              title: 'niveaux de rappel',
              code: 'AUTOCALL',
            }, 
            {
              title: 'coupons',
              code: 'PHOENIX',
            }
    ]
  }

  async componentDidMount() {
    if (!isAndroid()) {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle(Platform.OS === 'Android' ? 'light-content' : 'dark-content');
      });
    }
    Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

    const res = await fetch("https://loripsum.net/api/plaintext");
    this.setState({ text: await res.text() });

  }
  componentWillUnmount() {
    if (!isAndroid()) {
      this._navListener.remove();
    }
    Keyboard.removeListener('keyboardDidShow');
    Keyboard.removeListener('keyboardDidHide');
  }
  
  keyboardDidHide() {
    this.setState({
      keyboardHeight: 0,
      isKeyboardVisible: false
    });
  }

  keyboardDidShow(e) {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
      isKeyboardVisible: true
    });
  }

  _updateAutocall=(autocall) => {
      this.autocall = autocall;
      this.setState({ toto : !this.state.toto }, () => console.log(this.autocall.getObject()));
  }

  static navigationOptions = ({ navigation }) => {
    return ({
      header : null,
    }
    );
 }

 //confirmation pour traiter
 _renderModal() {
    return (
      <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.showModalDescription}
              onRequestClose={() => {
                console.log('Modal has been closed');
              }
              }>
              <View 
                style={{flex:1, backgroundColor:'transparent'}} 
                onStartShouldSetResponder={() => true}
                //onStartShouldSetResponderCapture={() => true}
                //onMoveShouldSetResponderCapture={() => true}
                //onMoveShouldSetResponder={() => true}
                onResponderRelease={(evt) =>{
                  let x = evt.nativeEvent.pageX;
                  let y = evt.nativeEvent.pageY;
                  //si on a clické en dehors du module view cidessous on ferme le modal
                  let verifX = x < getConstant('width')*0.1  || x > getConstant('width')*0.9 ? true : false;
                  let verifY = y < Math.min(getConstant('height')*0.35, getConstant('height')-300-getConstant('statusBar')-this.state.keyboardHeight)  || y > getConstant('height')*0.75 ?true : false;
                  if (verifX || verifY) {
                    this.setState({showModalDescription : false})
                  }
                }}

              >
                <View 
                  //directionalLockEnabled={true} 
                  //contentContainerStyle={{
                    style={{
                      flexDirection: 'column',
                      backgroundColor: 'white',
                      borderWidth :1,
                      //borderColor : setColor(''),
                      borderRadius: 4,
                      width: getConstant('width')*0.8,
                      //height: getConstant('height')*0.4,
                      top:  Math.min(getConstant('height')*0.35, getConstant('height')-300-getConstant('statusBar')-this.state.keyboardHeight),
                      left : getConstant('width')*0.1,
                      borderRadius: 4,
       

                  }}
                >


                  <View style={{backgroundColor: setColor(''), alignItems:'center', justifyContent: 'center', padding: 10}}>
                      <Text style={setFont('500',14,'white', 'Regular')}>INSTRUCTIONS DE COTATION</Text>
                  </View>
                  <View style={{ backgroundColor: setColor('background'), alignItems:'flex-start', justifyContent: 'flex-start'}}>
                      <Text style={[setFont('300', 14), {padding: 10}]}>Ajoutez vos instructions pour les émetteurs :</Text>
                      <View style={{}}>
                        <TextInput  style={{color: 'black', textAlignVertical:'top', backgroundColor: 'white' , margin : 10, padding: 5, borderWidth :1, borderRadius: 2,width: getConstant('width')*0.8-20, height: getConstant('height')*0.15}}
                                  multiline={true}
                                  numberOfLines={5}
                                  placeholder={'Vos instructions...'}
                                  onChangeText={(e) => this.setState({ description : e})}
                                  value={this.state.description}
                                  returnKeyType={'done'}
                                  onSubmitEditing={() => Keyboard.dismiss()}
                        />
                      </View>
                  </View>
                  <View style={{flexDirection: 'row', backgroundColor: setColor('background'), borderWidth : 0, paddingLeft : 10, paddingRight : 10, paddingTop : 10}}>
                      <View style={{flex: 0.8, borderWidth : 0}}>
                          <Text style={setFont('300', 14, 'black')}>
                              Avez-vous décrit une spécifité au produit non standard ?
                          </Text>
                      </View>
                      <TouchableOpacity style={{flex: 0.2, alignItems:'center', justifyContent: 'center', borderWidth : 0}}
                                        onPress={() => {
                                          this.setState({ isAutomatique : !this.state.isAutomatique })
                                        }}
                      >
                          <MaterialCommunityIcons name={this.state.isAutomatique ? "checkbox-blank-outline" : "check-box-outline"} size={25} />
                      </TouchableOpacity>
                  </View>
                  <View style={{alignItems:'center', backgroundColor : setColor('background'), justifyContent: 'center', padding : 15}}>
                    <TouchableOpacity style={{backgroundColor: setColor('subscribeBlue')}}
                                      onPress={() => {
                                        //on envoie le ticket 
                                        this.setState({ isLoading : true , showModalDescription : false });
                                 
                                        
                                        let productToSend = this.autocall.getProduct();;
                                        productToSend['subject'] = this.autocall.getProductName()  + " " + this.autocall.getMaturityName() + " sur " + this.autocall.getFullUnderlyingName() + " / "  + this.autocall.getFrequencyAutocallTitle().toLowerCase();
                                        productToSend['description'] = this.state.description ==='' ? "Aucune instruction particulière" : this.state.description;
                                        productToSend['type'] = 'Produit structuré';
                                        productToSend['department'] = 'FIN';
                                        productToSend['nominal'] = Number(this.state.nominal);
                                        if (productToSend['cf_cpg_choice'] === "Placement Privé") {
                                          productToSend['cf_step_pp'] = "PPDVB";
                                        } else {
                                          productToSend['cf_step_ape'] = "APEDVB";
                                        }
                                        
                                        //date de fin de resolution du ticket 
                                        //si PP dans 3 jours fin de journée
                                        let due_byDate = Moment(Date.now()).add(3, 'days').set({"hour": 17, "minute": 30, "second" : 0}).toDate();
                                        productToSend['due_by'] = Moment.utc(due_byDate).format();
                                        let fr_due_byDate = Moment(Date.now()).add(1, 'days').set({"hour": 17, "minute": 15, "second" : 0}).toDate();
                                        productToSend['fr_due_by'] = Moment.utc(fr_due_byDate).format();


                                        //quel mode va rentrer le ticket
                                        productToSend['cf_ps_mode'] = this.state.isAutomatique ? "Automatique" : "Specifique";
                                        
                                        productToSend['UF'] = this.autocall.getUF();
                                        productToSend['UFAsso'] = this.autocall.getUFAssoc();
                                        //console.log(productToSend);

                                       //"due_by": 2020-05-03T15:30:00.912Z,

                                        ssCreateStructuredProduct(this.props.firebase, productToSend)
                                       .then((data) => {
                                          //console.log("USER CREE AVEC SUCCES DANS ZOHO");
                                          
                                          console.log("SUCCES CREATION TICKET");
                                          let t = new CWorkflowTicket(data.data);
                                          this.props.addTicket(t);
                                          console.log("TICKET AJOUTE");
                                          this.setState({ isLoading : false }, () => {
                                            this.props.navigation.navigate('FLTicketDetailTicket', {ticket : t});
                                          })
                                        })
                                        .catch(error => {
                                           console.log("ERREUR CREATION TICKET: " + error);
                                           this.setState({ isLoading : false }, () => alert('ERREUR CREATION DE TICKET', '' + error));
                                          
                                        });
                                        
                                      }}
                    >
                      <Text style={[setFont('400',14,'white', 'Bold'), {margin : 5}]}>ENVOYER LA DEMANDE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
          </Modal>


    );
  }


  _renderHeaderUnderlying = (content, index, isActive, sections) => {
    //console.log(content);
    if (content.code === 'PHOENIX' && !this.autocall.isPhoenix()) {
      return <View style={{height : 0}}></View>;
    }
    return (
      <View style={{width : 0.9*getConstant('width'), borderWidth : 1, borderColor : setColor(''), backgroundColor : setColor(''),  justifyContent: 'center', alignItems: 'center', borderTopRightRadius : 10, borderTopLeftRadius : 10}}>
        <Text style={setFont('400', 18, 'white', 'Regular')}>
           {String(content.title).toUpperCase()}
        </Text>
      </View>
    );
  };

  _renderDates() {
    return (
      <View style={{}}>
      {
        this.autocall.isStruck() ?
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <View style={{flex: 0.5}}>
                      <Text style={setFont('400', 12, 'black','Bold')}>Prochaine date : </Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text style={setFont('400', 12)}>
                          {Moment(this.autocall.getStrikingDate()).locale('fr',localization).format('ll')}
                      </Text>
                      <Text style={setFont('400', 12)}>
                          Justification date
                      </Text>
                    </View>
              </View>
              : null
      }
        <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
                  <Text style={setFont('400', 12, 'black','Regular')}>Date de strike :</Text>
              </View>
              <View style={{flex: 0.5}}>
                <Text style={setFont('400', 12)}>
                   {Moment(this.autocall.getStrikingDate()).locale('fr',localization).format('ll')}
                </Text>
              </View>
        </View>

        <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
                 <Text style={setFont('400', 12, 'black','Regular')}>Date d'émission :</Text>
              </View>
              <View style={{flex: 0.5}}>
                <Text style={setFont('400', 12)}>
                    {Moment(this.autocall.getIssueDate()).locale('fr',localization).format('ll')}
                </Text>
              </View>
        </View>

        <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
                  <Text style={setFont('400', 12, 'black','Regular')}>Date finale de constatation :</Text>
              </View>
              <View style={{flex: 0.5}}>
                <Text style={setFont('400', 12)}>
                    {Moment(this.autocall.getLastConstatDate()).locale('fr',localization).format('ll')}
                </Text>
              </View>
        </View>
        <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
                  <Text style={setFont('400', 12, 'black','Regular')}>Date de remboursement :</Text>
              </View>
              <View style={{flex: 0.5}}>
                <Text style={setFont('400', 12)}>
                    {Moment(this.autocall.getEndDate()).locale('fr',localization).format('ll')}
                </Text>
              </View>
        </View>

      </View>
    );
  }

  
  _renderCapital() {
    return (
      <View style={{}}
                
      >
        <View style={{justifyContent: 'flex-start',  margin: 5}}>
                  <Text style={setFont('400', 12, 'black','Regular')}>
                    100% de votre capital est protégé jusqu'à ce que le sous-jacent atteigne le niveau de protection. En-dessous, votre capital remboursé sera amputé de l'éventuelle baisse du sous-jacent à l'échéance.
                  </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
                 <Text style={setFont('400', 12, 'black','Bold')}>Niveau de protection :</Text>
              </View>
              <View style={{flex: 0.5}}>
                <Text style={setFont('400', 12)}>
                   {Numeral(this.autocall.getBarrierPDI()).format('0.00%')}
                </Text>
              </View>
        </View>

        <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
                  <Text style={setFont('400', 12, 'black','Bold')}>Désactivation de la protection :</Text>
              </View>
              <View style={{flex: 0.5}}>
                <Text style={setFont('400', 12)}>
                  {this.autocall.isPDIUS() ? 'A tout moment' : 'Déterminé par le cours de clotûre du dernier jour'}
                </Text>
              </View>
        </View>
     </View>
    );
  }

  _renderPhoenix() {
    let alreadyBreaked = false;
    let phoenixDatas = this.autocall.getPhoenixDatas();
    return (
      <View style={{}}>
        <View style={{flex: 1, justifyContent: 'flex-start', borderWidth: 0, marginTop : 5, marginBottom: 5}}>
                  <Text style={setFont('400', 12, 'black','Regular')}>
                  Si à une date ci-dessous, le niveau du sous-jacent est supérieur ou égal à la barrière de coupon alors le coupon est payé.
  
                  </Text>
                  { this.autocall.isMemory() ?
                          <Text style={setFont('400', 12, 'black','Regular')}>
                              {'\n'}Les coupons bénéficient de l'effet mémoire; à la date validant le paiement d'un coupon, les coupons précédents non payés seront quand même payés.
          
                          </Text>
                          : null
                  }

        </View>

        <View style={{flexDirection: 'row', marginTop : 5}}>
              <View style={{flex: 0.333}}>
                 <Text style={[setFont('400', 12, 'black','Bold'), {alignSelf: 'center'}]}>Date de constatation</Text>
              </View>
              <View style={{flex: 0.334}}>
                <Text style={[setFont('400', 12, 'black','Bold'), {alignSelf: 'center'}]}>
                  Barrière de coupon
                </Text>
              </View>
              <View style={{flex: 0.333}}>
                <Text style={[setFont('400', 12, 'black','Bold'), {alignSelf: 'center'}]}>
                   Niveau de coupon
                </Text>
              </View>
        </View>


        {
            
            phoenixDatas.map((obj, i) => {
                if (phoenixDatas.length > 10 && i > 5 && i < (phoenixDatas.length - 3)) {
                  if (alreadyBreaked) { 
                    return null;
                  }
                  alreadyBreaked = true;
                  return (
                    <View style={{flexDirection: 'row'}} key={i}>
                        <View style={{flex: 0.333}}>
                          <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                              ...
                          </Text>
                        </View>
                        <View style={{flex: 0.334}}>
                          <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                              ...
                          </Text>
                        </View>
                        <View style={{flex: 0.333}}>
                          <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                              ...
                          </Text>
                        </View>
                      </View>
                  )
                }
                return (
                  <View style={{flexDirection: 'row'}} key={i}>
                      <View style={{flex: 0.333}}>
                        <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                             {obj["date"].locale('fr',localization).format('ll')}
                        </Text>
                      </View>
                      <View style={{flex: 0.334}}>
                        <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                            {Numeral(obj['level']).format('0%')}
                        </Text>
                      </View>
                      <View style={{flex: 0.333}}>
                        <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                            {Numeral(obj['coupon']).format('0.00%')}
                        </Text>
                      </View>
                  </View>
                )
            })
        }
     </View>
    );
  }

  _renderAutocall() {
    let alreadyBreaked = false;
    let phoenixDatas = this.autocall.getPhoenixDatas();
    let autocalldatas = this.autocall.getAutocallDatas();
    return (
      <View style={{}}>
        <View style={{flex: 1, justifyContent: 'flex-start', borderWidth: 0, marginTop : 5, marginBottom: 5}}>
                  <Text style={setFont('400', 12, 'black','Regular')}>
                  Si à une date ci-dessous, le niveau du sous-jacent est supérieur ou égal au niveau de rappel alors le produit s'arrête et est remboursé à son niveau de remboursement.
                  </Text>
        </View>

        <View style={{flexDirection: 'row', marginTop : 5}}>
              <View style={{flex: 0.333}}>
                 <Text style={[setFont('400', 12, 'black','Bold'), {alignSelf: 'center'}]}>Date de constatation</Text>
              </View>
              <View style={{flex: 0.334}}>
                <Text style={[setFont('400', 12, 'black','Bold'), {alignSelf: 'center'}]}>
                  Niveau de rappel
                </Text>
              </View>
              <View style={{flex: 0.333}}
                    ref={(ref) => { this.lastView = ref }}
              >
                <Text style={[setFont('400', 12, 'black','Bold'), {alignSelf: 'center'}]}>
                   Remboursement
                </Text>
              </View>
        </View>


        {
            
            autocalldatas.map((obj, i) => {
                if (autocalldatas.length > 10 && i > 5 && i < (autocalldatas.length - 3)) {
                  if (alreadyBreaked) { 
                    return null;
                  }
                  alreadyBreaked = true;
                  return (
                    <View style={{flexDirection: 'row'}} key={i}>
                        <View style={{flex: 0.333}}>
                          <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                              ...
                          </Text>
                        </View>
                        <View style={{flex: 0.334}}>
                          <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                              ...
                          </Text>
                        </View>
                        <View style={{flex: 0.333}}>
                          <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                              ...
                          </Text>
                        </View>
                      </View>
                  )
                }
                return (
                  <View style={{flexDirection: 'row'}} key={i}>
                      <View style={{flex: 0.333}}>
                        <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                             {obj["date"].locale('fr',localization).format('ll')}
                        </Text>
                      </View>
                      <View style={{flex: 0.334}}>
                        <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                            {Numeral(obj['level']).format('0%')}
                        </Text>
                      </View>
                      <View style={{flex: 0.333}}>
                        <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                            {Numeral(obj['coupon']).format('0.00%')}
                        </Text>
                      </View>
                  </View>
                )
            })
        }
     </View>
    );
  }
  
  _renderContentUnderlying = (content, index, isActive, sections) => {
    //console.log("EST ACTIF : " + isActive);
    let renderSections = null;
    switch(content.code) {
      case 'DATE' : renderSections = this._renderDates(); break;
      case 'CAPITAL' : renderSections =  this._renderCapital(); break;
      case 'PHOENIX' : renderSections = (this.autocall.isPhoenix() ? this._renderPhoenix() : null); break;
      case 'AUTOCALL' : renderSections = this.autocall.isReverse() ? null : this._renderAutocall(); break;
      default : break;
    }
    
    if (content.code === 'PHOENIX' && !this.autocall.isPhoenix()) {
      return null;
    }

    return (
      <View style={{width : 0.9*getConstant('width'), padding : 10}}>
          {renderSections}
      </View>
    )

  };
  
  _renderFooterUnderlying = (content, index, isActive, sections) => {
   
    if (content.code === 'PHOENIX' && !this.autocall.isPhoenix()) {
      return null;
    }
    return (
      <View style={{height: 10, backgroundColor: setColor(''),opacity : 0.3,  width : getConstant('width')*0.9,borderColor: setColor(''), borderBottomWidth : 1, borderBottomLeftRadius : 10, borderBottomRightRadius : 10, paddingBottom : 1}}>
      </View>
    );
  };

 

  renderHeader() {
    //const headerHeight = 240;
    const expandedHeaderHeight = isIphoneX() ? 330 : 300;
    const collapsedHeaderHeight = 64 + (isIphoneX() ? 30 : 0);
    const titleHeight = 44;
    const { scrollOffset } = this.state;
    const scrollSpan = expandedHeaderHeight - collapsedHeaderHeight;

    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

    return (
        <Animated.View  style={{
                                height: expandedHeaderHeight,
                                overflow: "hidden",
                                // Déplacement de l'entête dans la direction opposée au défilement
                                // Déplacement du header vers le haut afin de réduire sa hauteur
                                transform: [
                                    {
                                    translateY: Animated.subtract(
                                        scrollOffset,
                                        scrollOffset.interpolate({
                                        inputRange: [0, scrollSpan],
                                        outputRange: [0, scrollSpan],
                                        extrapolate: "clamp",
                                        })
                                    ),
                                    },
                                ],
                                // zIndex est utilisé pour que l'entête soit toujours au dessus du contenu
                                zIndex: this.state.isScrollAtTop ? 0 : 15,
                                
                                justifyContent : 'center',
                                alignItems : 'center',
                                borderWidth : 0
                        }}
                        pointerEvents={"auto"}
        >
                {/*<Animated.Image
                    // style={{
                    //     width: "100%",
                    //     height: "100%",
                    //     // Déplacement de l'image de fond vers le bas à une vitesse 2 fois plus faible
                    //     transform: [
                    //         {
                    //         translateY: scrollOffset.interpolate({
                    //             inputRange: [0, scrollSpan],
                    //             outputRange: [0, scrollSpan / 2],
                    //             extrapolate: "clamp",
                    //         }),
                    //         },
                    //     ],
                    //     }}
                    // source={require("../../../assets/bot.png")}
                />
                                <AnimatedTouchable style={{height : 200, width : 200, backgroundColor: 'pink'}}
                                    onPress={() => console.log("jsqhgdsqgf")}>

                </AnimatedTouchable>
                
                */}


                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                        backgroundColor: setColor(''),
                        // Apparition d'un overlay noir semi-transparent
                        opacity: scrollOffset.interpolate({
                            //inputRange: [scrollSpan / 2, scrollSpan],
                            inputRange: [0, scrollSpan/2],
                            outputRange: [0, 0.85],
                            extrapolate: "clamp",
                        }),
                        },
                        {
                        //zIndex : 20
                        }
                    ]}
                />
                <Animated.Text
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 16,
                        fontSize: 20,
                        //fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                        // Déplacement du titre vers le haut afin de le faire apparaitre progressivement
                        transform: [
                        {
                            translateY: scrollOffset.interpolate({
                            inputRange: [0, scrollSpan + titleHeight],
                            //outputRange: [titleHeight, 0],
                            outputRange: [titleHeight , 0],
                            extrapolate: "clamp",
                            }),
                        },
                        ],
                        //zIndex : 25
                    }}
                >
                {this.autocall.getProductName()} {this.autocall.getMaturityName()} {this.autocall.getFullUnderlyingName()} : {Numeral(this.autocall.getCoupon()).format('0.00%')}
                </Animated.Text>
      </Animated.View>
 
    );
  }



  renderContent() {
      
    return (
      <View style={{ padding: 20 }}>
        <Text style={setFont('500', 26, 'black', 'Bold')}>
          NOMINAL
        </Text>
        { this.autocall.getFinalNominal() === -1    
             ?     <KeyboardAvoidingView behavior={'padding'} style={{flexDirection : 'row', marginTop : 12}}>
                                <View style={{width : 0.7*getConstant('width'),  justifyContent: 'center'}}
                                          ref={(ref) => { this.marker = ref }}
                                          onLayout={({nativeEvent}) => {
                                            if (this.marker) {
                                              this.marker.measure((x, y, width, height, pageX, pageY) => {
                                                        console.log(x, y, width, height, pageX, pageY);
                                              })
                                            }
                                          }}
                                >
                                    <TextInput 
                                            style={{    
                                                    display: 'flex',
                                                    backgroundColor: 'white',
                                                    height : 40,
                                                    fontSize: 28,
                                                    color: setColor('lightBlue'),
                                                    borderColor : setColor(''),
                                                    borderWidth: 1,
                                                    borderRadius: 4,
                                                    paddingRight: 5,
                                                    //textAlign: this.state.nominal === 0 ? 'left' : 'right',
                                                    textAlign: 'right',
                                                    textAlignVertical: 'center',
                                                    }}
                                            placeholder={this.autocall.getCurrency()}
                                            placeholderTextColor={'lightgray'}
                                            underlineColorAndroid={'#fff'}
                                            autoCorrect={false}
                                            keyboardType={'numeric'}
                                            returnKeyType={'done'}
                                            onBlur={() => {
                                            console.log("STATE NOMINAL : " + this.state.nominal +  "-  AUTOCALL NOMINAL : " + this.autocall.getNominal());
                                            
                                            this.setState( { finalNominal : this.state.nominal});
                                            }}
                                            onFocus={() => {
                                                this.setState({ nominal : ''});
                                                
                                            }}
                                            //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                            value={this.state.nominal === 0 ? '' : currencyFormatDE(Number(this.state.nominal),0)}
                                            ref={(inputNominal) => {
                                            this.inputNominal = inputNominal;
                                            }}
                                            onChangeText={e => {
                                            //console.log(Number(e));
                                            this.setState({ nominal : e === '' ? 0 : Numeral(e).value()  });
                                            ;
                                            }}
                                    />
                                </View>
                                <View style={{width : 0.2*getConstant('width'), borderWidth : 0, justifyContent : 'center', paddingLeft : 5}}>
                                    <Text style={setFont('400', 28, 'gray', 'Regular')}>
                                        {this.autocall.getCurrency()}
                                    </Text>
                                </View>
 
                  </KeyboardAvoidingView>
              :   <View style={{  width : getConstant('width')*0.95 - 20,  alignItems: 'flex-start'}}>
                      <Text style={[setFont('400', 24, 'black', 'Regular'), {textAlign: 'center'}]}>{currencyFormatDE(this.autocall.getFinalNominal())} {this.autocall.getCurrency()}</Text>
                  </View>
        }
        <View style={{height : 20}} />
        <Accordion
            sections={this.SECTIONS}
            underlayColor={'transparent'}
            activeSections={this.state.activeSections}
            renderHeader={this._renderHeaderUnderlying}
            renderFooter={this._renderFooterUnderlying}
            renderContent={this._renderContentUnderlying}
            expandMultiple={true}
            onChange={(activeSections) => {
                this.setState( { activeSections : activeSections })  
            }}
            sectionContainerStyle={{
                                    width : 0.9*getConstant('width'),
                                    backgroundColor: 'white', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                             
                                    marginTop : 20,
                                    borderLeftWidth: isAndroid() ? 1 : 0, 
                                    borderRightWidth: isAndroid() ? 1 : 0,  
                                    borderColor : setColor(''), 
                                    borderRadius : 10, 
                                    shadowColor: 'rgb(75, 89, 101)', 
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.9
                                  }}
        />
     
        <View style={{height : 150}} />
      </View>
    );
  }


  render() {

    const scrollEvent = Animated.event(
        [{ nativeEvent: { contentOffset: { y: this.state.scrollOffset } } }],
        { useNativeDriver: true },
    );

    

    return (
      <Animated.ScrollView  style={{ flex: 1, backgroundColor: "white" , opacity: this.state.showModalDescription ? 0.3 : this.state.isLoading ? 0.2 : 1}}
                            pointerEvents={"auto"}
                            // Mis à jour de scrollOffset sur l'évènement onScroll
                            onScroll={scrollEvent}
                            scrollEventThrottle={1} //est nécessaire afin d'être notifié
                            // de tous les évènements de défilement
                            scrollEventThrottle={1}
                    
                            onScrollBeginDrag={(event) => { 
                              // scroll animation began
                             // gestion des zIndex et de la possiblité de faire passer le statusbar (bouton retour et autres) au dessus pour etre clickable
                             this.setState({ isScrollAtTop : event.nativeEvent.contentOffset.y === 0 ? false : null})
                           
                           }}
                           onScrollEndDrag={(event) => { 
                            // scroll animation ended
                            // gestion des zIndex et de la possiblité de faire passer le statusbar (bouton retour et autres) au dessus pour etre clickable
                            this.setState({ isScrollAtTop : event.nativeEvent.contentOffset.y <= 0 ? true : false})
                    
                                if (this.marker) {
                                  this.marker.measure((x, y, width, height, pageX, pageY) => {
                                            console.log(x, y, width, height, pageX, pageY);
                                  })
                                }
                               
                                if (this.lastView) {
                                  this.lastView.measure((x, y, width, height, pageX, pageY) => {
                                            console.log(x, y, width, height, pageX, pageY);
                                  })
                                }
                          
                         }}
                            
      >
         
            <FLAnimatedSVG name={'robotBlink'} visible={this.state.isLoading} text={String("création d'une demande de cotation").toUpperCase()}/>
            {this._renderModal()}
            {this.renderHeader()}
            {this.renderContent()}
        
            <View style={{position : 'absolute', top : 0, left : 0, flexDirection : 'row', marginTop : getConstant('statusBar')-(isIphoneX() ? 45 : isAndroid() ? 30 : 20) ,height: 140 + getConstant('statusBar'), width : getConstant('width'), paddingLeft : 10, backgroundColor: setColor(''), opacity : 0.9, paddingTop : isAndroid() ? 10 : isIphoneX() ? 40 : 20, alignItems : 'flex-start', zIndex: 5}}  >
                            <TouchableOpacity style={{ flex: 0.5, flexDirection : 'row', borderWidth: 0, padding : 5}}
                                                onPress={() => this.props.navigation.goBack()}
                            >
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Ionicons name={'ios-arrow-back'}  size={25} style={{color: 'white'}}/>
                                    </View>
                                    <View style={{justifyContent: 'center', alignItems: 'flex-start', paddingLeft : 5}}>
                                        <Text style={setFont('300', 16, 'white', 'Regular')}>Retour</Text>
                                    </View>
                            </TouchableOpacity>
                            <View style={{flex: 0.5, flexDirection : 'row', justifyContent: 'flex-end', alignItems: 'center', borderWidth: 0, marginRight: 0.05*getConstant('width')}}>
    
                                    <TouchableOpacity style={{width : 40, borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}
                                                        onPress={() => {
                                                        let r = new CPSRequest();
                                                        r.setRequestFromCAutocall(this.autocall);
                                                        this.props.navigation.dispatch(NavigationActions.navigate({
                                                            routeName: 'Pricer',
                                                            action: NavigationActions.navigate({ routeName: 'PricerEvaluate' , params : {request : r}} ),
                                                        }));
                                                        }}
                                    >
                                        <FontAwesome name={'gears'} size={25} style={{color: 'white'}}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{width : 40, borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}
                                                                        onPress={() => {
                                                            
                                                                        this.props.navigation.navigate('FLAutocallDetail2' , {autocall : this.autocall});
                                                                
                                                                        }}
                                    >
                                        <EvilIcons name={'share-apple'} size={35} style={{color: 'white'}}/>
                                    </TouchableOpacity>
                   
                            </View>
            </View>
            <View style={{position : 'absolute', top : isAndroid() ? 40 : 40 + getConstant('statusBar'), left : 0, width : getConstant('width'), justifyContent : 'center', alignItems : 'center', zIndex: 6}}>
                <FLTemplateAutocall object={this.autocall.getObject()} templateType={TEMPLATE_TYPE.AUTOCALL_MEDIUM_TEMPLATE} isEditable={this.isEditable} source={'Home'} callbackUpdate={this._updateAutocall} nominal={this.state.finalNominal} />
            </View>
            
            {this.autocall.getFinalNominal() === -1 ?
                 
                      <Animated.View style={{position : 'absolute',top: getConstant('height')-110-this.state.keyboardHeight - (isAndroid() ? 30 : 0), left : getConstant('width') -120,  marginLeft : 10, zIndex: 10, backgroundColor:'transparent', transform: [{ translateY: this.state.scrollOffset }]}}>
                  

                                <TouchableOpacity style ={{  flexDirection: 'column',  borderWidth : 1, height: 80, width: 80, borderColor: setColor('subscribeBlue'), borderRadius: 40, marginLeft : 10, padding : 10, backgroundColor: setColor('subscribeBlue')}}
                                                onPress={() => {
                                                    if(this.state.nominal === 0) {
                                                    alert("Renseigner un nominal avant de demander une cotation");
                                                    return;
                                                    } else if(this.state.nominal < 50000) {
                                                        alert("Renseigner un nominal supérieur à 50 000 EUR pour demander une cotation");
                                                        return;
                                                    }
                                                    this.setState({ showModalDescription: true });
                                                }}  
                                >
                                    <View style={{marginTop: -5, alignItems: 'center', justifyContent: 'center'}}>
                                        <Image style={{width: 50, height: 50}} source={logo_white} />
                                    </View>
                                    <View style={{marginTop: -2, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={setFont('400', 12, 'white', 'Regular')}>{String('traiter').toUpperCase()}</Text>
                                    </View>
                                </TouchableOpacity>
      
                    </Animated.View>
                    : null
              }    
      </Animated.ScrollView>
    );
  }

}

const condition = authUser => !!authUser;
const composedStructuredProductDetail = compose(
 withAuthorization(condition),
  withNavigation,
  withUser
);

//export default HomeScreen;
export default hoistStatics(composedStructuredProductDetail)(FLAutocallDetail);