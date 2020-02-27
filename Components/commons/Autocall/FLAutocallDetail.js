import React from 'react';
import { View, SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, Platform, Image, Modal, KeyboardAvoidingView, Keyboard, TextInput} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import Accordion from 'react-native-collapsible/Accordion';

import { ssCreateStructuredProduct } from '../../../API/APIAWS';

import { setFont, setColor , globalStyle , backgdColor} from '../../../Styles/globalStyle';



import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import FLTemplateAutocall from "../Autocall/FLTemplateAutocall";

import logo_white from '../../../assets/LogoWithoutTex_white.png';
import logo from '../../../assets/LogoWithoutText.png';

import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual} from '../../../Utils';
import Dimensions from 'Dimensions';

import * as TEMPLATE_TYPE from '../../../constants/template';
import * as TICKET_TYPE from '../../../constants/ticket'


import { CAutocall } from '../../../Classes/Products/CAutocall';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';
import { ScrollView } from 'react-native-gesture-handler';



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT =  isAndroid() ? StatusBar.currentHeight : isIphoneX() ? 44 : 20;


const SECTIONS = [            
  {
    title: 'dates importantes',
    code: 'DATE',
    height : 100,
  }, 
  {
    title: 'protection du capital',
    code: 'CAPITAL',
    height : 100,
  }, 
  {
    title: 'coupons',
    code: 'PHOENIX',
    height : 200,
  }, 
  {
    title: 'niveaux de rappel',
    code: 'AUTOCALL',
    height : 250,
  }, 
]




class FLAutocallDetail extends React.Component {
    
  constructor(props) {
    super(props);


    this.autocall= this.props.autocall;
    //console.log(this.autocall.getObject());
    
  console.log("NOMINAL : "+ this.autocall.getNominal());
    this.state = {

      nominal :  this.autocall.getNominal(),
      finalNominal :  this.autocall.getNominal(),

      //affchage du modal description avant traiter
      showModalDescription : false,

      //gestion des sections
      activeSections: [],
      scrollViewHeight : 50,

      //gestion du clavier
      keyboardHeight: 0,
      isKeyboardVisible: false,

      //modal
      showModalDescription : false,
      description : '',

      toto : true,
    }
    


    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
  }

  componentDidMount() {
    if (!isAndroid()) {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle('light-content');
      });
    }
    Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
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
    }, ()=> console.log("HAUTEUR CLAVIER : " + this.state.keyboardHeight));
  }

  _updateAutocall=(autocall) => {
      this.autocall = autocall;
      this.setState({ toto : !this.state.toto }, () => console.log(this.autocall.getObject()));
  }

  //compense un bug de <Accordeon>
  //calcule le nombre d'élément ouvert et refait la hauteur du scroll
  _redefineHeight() {
    let h = 50;
    this.state.activeSections.forEach((elementPosition) => {
        h = h + SECTIONS[elementPosition].height;
    });
    //console.log("NOUVELLE HAUTEUR : "+ h);
    this.setState({ scrollViewHeight : h });
  }


  _renderHeaderUnderlying = (content, index, isActive, sections) => {
    //console.log(content);
    if (content.code === 'PHOENIX' && !this.autocall.isPhoenix()) {
      return <View></View>;
    }
    return (
      <View style={{backgroundColor: 'white', marginTop: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10, borderWidth :0, backgroundColor : setColor(''),                                          shadowColor: 'rgb(75, 89, 101)',
                    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.9, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={setFont('400', 18, 'white', 'Regular')}>
           {String(content.title).toUpperCase()}
        </Text>
      </View>
    );
  };

  _renderDates() {
    return (
      <View style={{backgroundColor: 'white', borderBottomColor: 'black', justifyContent: 'center', alignItems: 'center', padding: 5, marginTop: 5}}>
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
                    {Moment(this.autocall.getStartDate()).locale('fr',localization).format('ll')}
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
      <View style={{backgroundColor: 'white', borderBottomColor: 'black', justifyContent: 'center', alignItems: 'center', padding: 0, marginTop: 5, marginBottom :5}}>
        <View style={{flex: 1, justifyContent: 'flex-start', borderWidth: 0, marginTop : 5, marginBottom: 5}}>
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
      <View style={{backgroundColor: 'white', borderBottomColor: 'black', justifyContent: 'center', alignItems: 'center', padding: 0, marginTop: 5, marginBottom :5}}>
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
      <View style={{backgroundColor: 'white', borderBottomColor: 'black', justifyContent: 'center', alignItems: 'center', padding: 0, marginTop: 5, marginBottom :5}}>
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
              <View style={{flex: 0.333}}>
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
    
    switch(content.code) {
      case 'DATE' : return this._renderDates();
      case 'CAPITAL' : return this._renderCapital();
      case 'PHOENIX' : return this.autocall.isPhoenix() ? this._renderPhoenix() : <View></View>;
      case 'AUTOCALL' : return this.autocall.isReverse() ? <View></View> : this._renderAutocall();
      default : <View><Text>...</Text></View>;
    }
  };
  
  _renderFooterUnderlying = (content, index, isActive, sections) => {
    if (content.code === 'PHOENIX' && !this.autocall.isPhoenix()) {
      return <View></View>;
    }
    return (
      <View style={{height: 10, border: 1, borderTopWidth : 0, borderColor: setColor(''),shadowColor: 'rgb(75, 89, 101)', shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.9, backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
      </View>
    );
  };

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
                  let verifX = x < DEVICE_WIDTH*0.1  || x > DEVICE_WIDTH*0.9 ? true : false;
                  let verifY = y < DEVICE_HEIGHT*0.15  || y > DEVICE_HEIGHT*0.55 ?true : false;
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
                      borderColor : setColor(''),
                      borderRadius: 4,
                      width: DEVICE_WIDTH*0.8,
                      height: DEVICE_HEIGHT*0.4,
                      top:  DEVICE_HEIGHT*0.15,
                      left : DEVICE_WIDTH*0.1,
                      borderRadius: 4

                  }}
                >


                  <View style={{flex:0.2, backgroundColor: setColor(''), alignItems:'center', justifyContent: 'center'}}>
                      <Text style={setFont('500',14,'white', 'Regular')}>INSTRUCTIONS DE COTATION</Text>
                  </View>
                  <View style={{flex:0.6, backgroundColor: globalStyle.bgColor, alignItems:'flex-start', justifyContent: 'flex-start'}}>
                      <Text style={[setFont('300', 12), {padding: 10}]}>Ajoutez vos instructions pour les émetteurs :</Text>
                      <View style={{backgroundColor: globalStyle.bgColor, borderWidth :0}}>
                        <TextInput  style={{color: 'black', textAlignVertical:'top', backgroundColor: 'white' , margin : 10, padding: 5, borderWidth :1, borderRadius: 2,width: DEVICE_WIDTH*0.8-20, height: DEVICE_HEIGHT*0.15}}
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
                  <View style={{flex:0.2, alignItems:'center', justifyContent: 'center'}}>
                    <TouchableOpacity style={{backgroundColor: setColor('turquoise')}}
                                      onPress={() => {
                                        //on envoie le ticket 
                                        this.setState({ isLoading : true });
                                 
                                        
                                        let productToSend = this.autocall.getProduct();;
                                        productToSend['subject'] = this.autocall.getProductName()  + " " + this.autocall.getMaturityName() + " sur " + this.autocall.getFullUnderlyingName() + " / "  + this.autocall.getFrequencyAutocallTitle().toLowerCase();
                                        productToSend['description'] = this.state.description;
                                        productToSend['type'] = 'Produit structuré';
                                        productToSend['department'] = 'FIN';
                                        productToSend['nominal'] = Number(this.state.nominal);
                                        if (productToSend['cf_cpg_choice'] === "Placement Privé") {
                                          productToSend['cf_step_pp'] = "PPDVB";
                                        } else {
                                          productToSend['cf_step_ape'] = "APEDVB";
                                        }
                                    
                                        //productToSend['UF'] = 0.03;
                                        //productToSend['UFAsso'] =0.001;
                                        //console.log(productToSend);
                                        ssCreateStructuredProduct(this.props.firebase, productToSend)
                                        .then((data) => {
                                          //console.log("USER CREE AVEC SUCCES DANS ZOHO");
                                          
                                          console.log("SUCCES CREATION TICKET");
                                          //console.log(data.data);
                                          this.props.addTicket(data.data);
                                          console.log("TICKET AJOUTE");
                                          this.setState({ isLoading : false , showModalDescription : false}, () => this.props.navigation.navigate('Tickets'));
                                        })
                                        .catch(error => {
                                          console.log("ERREUR CREATION TICKET: " + error);
                                          this.setState({ isLoading : false , showModalDescription : false}, () => alert('ERREUR CREATION DE TICKET', '' + error));
                                          
                                        }) 
                                
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
  render() { 

      return(
            <View style={{flex:1, height: DEVICE_HEIGHT, opacity: this.state.showModalDescription ? 0.1 : 1}}> 
              {this._renderModal()}
              {this.autocall.getFinalNominal() === -1 ?
                  <KeyboardAvoidingView behavior={'padding'} style={{flexDirection : 'row', position : 'absolute',top: DEVICE_HEIGHT-100-this.state.keyboardHeight - (isAndroid() ? 30 : 0), left : (0.4*DEVICE_WIDTH -80)/2 -20,  marginLeft : 10, zIndex: 10, backgroundColor:'white'}}>
                      <View style={{width : 0.6*DEVICE_WIDTH,  justifyContent: 'center'}}>
                        <TextInput 
                                style={{    
                                          display: 'flex',
                                          backgroundColor: 'white',
                                          height : 40,
                                          fontSize: 28,
                                          color: setColor('light'),
                                          borderColor : setColor(''),
                                          borderWidth: 1,
                                          borderRadius: 4,
                                          padding: 5,
                                          //textAlign: this.state.nominal === 0 ? 'left' : 'right',
                                          textAlign: 'right',
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
                      <TouchableOpacity style ={{  flexDirection: 'column',  borderWidth : 1, height: 80, width: 80, borderColor: setColor('turquoise'), borderRadius: 40, marginLeft : 10, padding : 10, backgroundColor: setColor('turquoise')}}
                                      onPress={() => {
                                        if(this.state.nominal === 0) {
                                          alert("Renseigner un nominal avant de demander une cotation");
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

                  </KeyboardAvoidingView>
                : <View style={{position : 'absolute',top: DEVICE_HEIGHT-100-this.state.keyboardHeight - (isAndroid() ? 30 : 0), left : DEVICE_WIDTH*0.025, zIndex: 10, backgroundColor: setColor('turquoise'), width : DEVICE_WIDTH*0.95, borderRadius: 5}}>
                      <Text style={[setFont('400', 24, 'white', 'Regular'), {textAlign: 'center'}]}>{currencyFormatDE(this.autocall.getFinalNominal())} {this.autocall.getCurrency()}</Text>
                  </View>
              }                        
              <View style={{height: 140 + STATUSBAR_HEIGHT, paddingLeft : 10, backgroundColor: setColor(''), paddingTop: isAndroid() ?  0 : STATUSBAR_HEIGHT}}>
                  <TouchableOpacity style={{flexDirection : 'row', borderWidth: 0, padding : 5}}
                                    onPress={() => this.props.navigation.goBack()}
                  >
                      <View style={{justifyContent: 'center', alignItems: 'center'}}>
                           <Ionicons name={'ios-arrow-back'}  size={25} style={{color: 'white'}}/>
                      </View>
                      <View style={{justifyContent: 'center', alignItems: 'flex-start', paddingLeft : 5}}>
                           <Text style={setFont('300', 16, 'white', 'Regular')}>Retour</Text>
                      </View>
                      <View style={{flex: 1, flexDirection : 'row', justifyContent: 'flex-end', alignItems: 'center', borderWidth: 0, marginRight: 0.05*DEVICE_WIDTH}}>
                          <View style={{flexDirection : 'row'}}>
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
                              <TouchableOpacity style={{width : 40, borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                                  <EvilIcons name={'share-apple'} size={35} style={{color: 'white'}}/>
                              </TouchableOpacity>
                          </View>
                      </View>
                  </TouchableOpacity>
              </View>
              <View style={{

                            marginTop : -100 ,
                            justifyContent : 'center',
                            alignItems : 'center',
                            zIndex : 2,
                            //backgroundColor: 'pink'
                          }}
              >
                     <FLTemplateAutocall object={this.autocall.getObject()} templateType={TEMPLATE_TYPE.AUTOCALL_MEDIUM_TEMPLATE} isEditable={this.autocall.isEditableProduct()} source={'Home'} callbackUpdate={this._updateAutocall} nominal={this.state.finalNominal} />
                     <ScrollView style={{marginTop: 5, width: 0.9*DEVICE_WIDTH}}>
                        <Accordion
                            sections={SECTIONS}
                            underlayColor={'transparent'}
                            activeSections={this.state.activeSections}
                            renderHeader={this._renderHeaderUnderlying}
                            renderFooter={this._renderFooterUnderlying}
                            renderContent={this._renderContentUnderlying}
                            expandMultiple={true}
                            onChange={(activeSections) => {
                              this.setState( { activeSections : activeSections }, () => this._redefineHeight())  
                            }}
                          />
                          <View style={{height : this.state.scrollViewHeight}}>
                          </View>
                    </ScrollView>
                  
              </View>

            </View>


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


