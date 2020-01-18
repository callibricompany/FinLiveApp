import React from 'react';
import { View, SafeAreaView, StatusBar, Text, TouchableOpacity, StyleSheet, Platform, Image, Modal, KeyboardAvoidingView, Keyboard, TextInput, Linking} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import Accordion from 'react-native-collapsible/Accordion';

import { ssCreateStructuredProduct } from '../../API/APIAWS';

import { setFont, setColor , globalStyle } from '../../Styles/globalStyle';



import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import Numeral from 'numeral'
import 'numeral/locales/fr'


import FLTemplatePSPublicAPE from "../commons/Autocall/FLTemplatePSPublicAPE";

import logo_white from '../../assets/LogoWithoutTex_white.png';
import logo from '../../assets/LogoWithoutText.png';

import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual} from '../../Utils';
import Dimensions from 'Dimensions';

import * as TEMPLATE_TYPE from '../../constants/template';
import * as TICKET_TYPE from '../../constants/ticket'


import { CAutocall } from '../../Classes/Products/CAutocall';
import { CPSRequest } from '../../Classes/Products/CPSRequest';
import { ScrollView } from 'react-native-gesture-handler';



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT =  isAndroid() ? StatusBar.currentHeight : isIphoneX() ? 44 : 20;


const SECTIONS = [    
  {
    title: 'descriptif',
    code: 'DESCRIPTION',
    height : 400,
  },   
  {
    title: 'émission',
    code: 'ISSUER',
    height : 200,
  },          
  {
    title: 'dates importantes',
    code: 'DATE',
    height : 150,
  }, 
  {
    title: 'protection du capital',
    code: 'CAPITAL',
    height : 100,
  }, 

]




class FLSRPDetail extends React.Component {
    
  constructor(props) {
    super(props);


    this.autocall = this.props.navigation.getParam('autocall', '...');
    //console.log(this.autocall.getObject());

    this.state = {

      nominal : 0,


      //affchage du modal description avant traiter
      showModalDescription : false,

      //gestion des sections
      activeSections: [0],
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

    this.props.navigation.setParams({ hideBottomTabBar : true });
  }
  static navigationOptions = ({ navigation }) => {

      return ({
        header : null,
      }
      );
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

  _renderIssuer() {
    return (
      <View style={{backgroundColor: 'white', borderBottomColor: 'black', justifyContent: 'center', alignItems: 'center', padding: 5, marginTop: 5}}>
        <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
                  <Text style={setFont('400', 12, 'black','Regular')}>Code ISIN :</Text>
              </View>
              <View style={{flex: 0.5}}>
                <Text style={setFont('400', 12)}>
                    {this.autocall.getISIN()}
                </Text>
              </View>
        </View>
        <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
                  <Text style={setFont('400', 12, 'black','Regular')}>Fin de la souscription :</Text>
              </View>
              <View style={{flex: 0.5}}>
                <Text style={setFont('400', 12)}>
                    {Moment(this.autocall.getStartDate()).locale('fr',localization).format('ll')}
                </Text>
              </View>
        </View>
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
                 <Text style={setFont('400', 12, 'black','Regular')}>Emetteur :</Text>
              </View>
              <View style={{flex: 0.5}}>
                <Text style={setFont('400', 12)}>
                    {this.autocall.getIssuer()}
                </Text>
              </View>
        </View>

        <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
                  <Text style={setFont('400', 12, 'black','Regular')}>Distributeur :</Text>
              </View>
              <View style={{flex: 0.5}}>
                <Text style={setFont('400', 12)}>
                    {this.autocall.getDistributor()}
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



  _renderDescription() {

    return (
      <View style={{backgroundColor: 'white', borderBottomColor: 'black', justifyContent: 'center', alignItems: 'flex-start', padding: 0, marginTop: 5, marginBottom :5}}>

        <View style={{flex: 1, justifyContent: 'flex-start', borderWidth: 0, marginTop : 5, marginBottom: 5}}>
                  <Text style={setFont('600', 12, 'black','Regular')}>
                    {this.autocall.getDescription(2)}
                  </Text>
        </View>



     </View>
    );
  }
  
  _renderContentUnderlying = (content, index, isActive, sections) => {
    //console.log("EST ACTIF : " + isActive);
    
    switch(content.code) {
      case 'DATE' : return this._renderDates();
      case 'CAPITAL' : return this._renderCapital();
      case 'DESCRIPTION' : return this._renderDescription();
      case 'ISSUER' : return this._renderIssuer();
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

 
  render() { 

      return(
            <View style={{flex:1, height: DEVICE_HEIGHT, opacity: this.state.showModalDescription ? 0.3 : 1}}> 
         
              <KeyboardAvoidingView behavior={'padding'} style={{flexDirection : 'row', position : 'absolute',top: DEVICE_HEIGHT-100-this.state.keyboardHeight - (isAndroid() ? 30 : 0), left : (0.4*DEVICE_WIDTH -80)/2 -20,  marginLeft : 10, zIndex: 10, backgroundColor:'transparent'}}>
                <View style={{width : 0.6*DEVICE_WIDTH,  justifyContent: 'center'}}>
                    <TextInput 
                            style={{    
                                      display: 'flex',
                                      backgroundColor: 'white',
                                      height : 40,
                                      fontSize: 28,
                                      color: 'black',
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
                               
                                      alert("Fonctionalité prochainement disponible");
                                      return;
                               
                                    this.setState({ showModalDescription: true });
                                  }}  
                  >
                      <View style={{marginTop: -5, alignItems: 'center', justifyContent: 'center'}}>
                          <Image style={{width: 50, height: 50}} source={logo_white} />
                      </View>
                      <View style={{marginTop: -2, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={setFont('400', 12, 'white', 'Regular')}>{String('souscrire').toUpperCase()}</Text>
                      </View>
                  </TouchableOpacity>

              </KeyboardAvoidingView>

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
                                                  Linking.openURL(this.autocall.getURIDescription()).catch((err) => console.error('An error occurred', err));
                                                }}
                              >
                                  <FontAwesome name={'file-text-o'} size={20} style={{color: 'white'}}/>
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
                     <FLTemplatePSPublicAPE object={this.autocall.getObject()} templateType={TEMPLATE_TYPE.AUTOCALL_MEDIUM_TEMPLATE} isEditable={false} source={'Home'} nominal={this.state.nominal}/>
                     {Moment(this.autocall.getStartDate()).diff(Moment(Date.now()), 'days') === 0 ?
                                    <View style={{padding : 5, marginTop : 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', borderRadius: 3}}>
                                        <Text style={setFont('500', 12, 'white', 'Bold')}>
                                          Dernier jour
                                        </Text>
                                    </View>
                                  :
                                  <View style={{paddingTop : 10, justifyContent: 'center', alignItems: 'center'}}>
                                      <Text style={setFont('500', 12, 'black', 'Bold')}>
                                        Plus que {Moment(this.autocall.getStartDate()).diff(Moment(Date.now()), 'days')} jours
                                      </Text>
                                  </View>   
                      } 
                     <ScrollView style={{ width: 0.9*DEVICE_WIDTH}}>
                        <Accordion
                            sections={SECTIONS}
                            underlayColor={'transparent'}
                            activeSections={this.state.activeSections}
                            renderHeader={this._renderHeaderUnderlying}
                            renderFooter={this._renderFooterUnderlying}
                            renderContent={this._renderContentUnderlying}
                            expandMultiple={true}
                            onChange={(activeSections) => {
                              //console.log(this.state.activeSections);
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
export default hoistStatics(composedStructuredProductDetail)(FLSRPDetail);


