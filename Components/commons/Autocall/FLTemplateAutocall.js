import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Modal, Alert} from 'react-native';
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

import AnimatedProgressWheel from 'react-native-progress-wheel';

import RobotBlink from "../../../assets/svg/robotBlink.svg";

import {  
    generalFontColor, 
    blueFLColor,
    headerTabColor,
    selectElementTab,
    progressBarColor,
    subscribeColor,
    FLFontFamily,
    FLFontFamilyBold,
    apeColor,
    backgdColorPricerParameter,
    globalStyle,
    backgdColor,
    setFont,
    setColor
 } from '../../../Styles/globalStyle'

import Dimensions from 'Dimensions';
import Numeral from 'numeral'
import 'numeral/locales/fr'

import { withUser } from '../../../Session/withAuthentication';
import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import * as Progress from 'react-native-progress';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import * as TEMPLATE_TYPE from '../../../constants/template'

import { searchProducts } from '../../../API/APIAWS';

import { FLPDIDetail } from '../../Pricer/description/FLPDIDetail';
import { FLPhoenixBarrierDetail } from '../../Pricer/description/FLPhoenixBarrierDetail';
import { FLFreqDetail } from '../../Pricer/description/FLFreqDetail';
import { FLUFDetail } from '../../Pricer/description/FLUFDetail';
import { FLAirbagDetail} from '../../Pricer/description/FLAirbagDetail';

import { ifIphoneX, ifAndroid, sizeByDevice, isEqual } from '../../../Utils';
import { interpolateBestProducts } from '../../../Utils/interpolatePrices';

import { CAutocall } from '../../../Classes/Products/CAutocall';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';


import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';

import STRUCTUREDPRODUCTS from '../../../Data/structuredProducts.json';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class FLTemplateAutocall extends React.Component {


  constructor(props) {
    super(props);

    this.state = {

      isGoodToShow : typeof this.props.isGoodToShow !== 'undefined' ? this.props.isGoodToShow : true,
      isEditable : typeof this.props.isEditable !== 'undefined' ? this.props.isEditable : false,
      showModalUpdate : false,
      typeTemplate: this.props.hasOwnProperty('width') ? this.props.width === 0.9 ? 'FULL' : 'SHORT' : 'FULL',
      messageLoading: '',
      toto : true,

    }

    //largeur de la cartouche sur l'ecran
    this.screenWidth = (this.props.hasOwnProperty('width') ? this.props.width : 0.975)*DEVICE_WIDTH;

    //console.log(this.props.object);

    //type de tycket
    this.type = this.props.templateType;

    this.object= {};
    //copie des datas au format correct
    if (!this.props.object.hasOwnProperty('data')) {
      //reconstruction de l'objet style envoie dans homepage
      this.object['category'] = this.props.object.category;
      this.object['code'] = this.props.object.underlying;
      this.object['isOrg'] = false;
      this.object['template'] = TEMPLATE_TYPE.LIST;
      this.object['isFavorite'] = false;
      this.object['data'] = this.props.object;
      this.data = this.props.object;

      let toFavorites = {};
      toFavorites['active'] = false;
      toFavorites['code'] = this.props.object.code;
      toFavorites['label'] = '';
      toFavorites['source'] = 'sp';
      toFavorites['userId'] = this.props.authUser.uid;
      toFavorites['id'] = "";
      this.object['toFavorites'] = toFavorites;
  
    } else {

      this.object = this.props.object;
      //tant que Pierre ne rajoute l'UF dans le calcul sur serveur on le rajoute
      this.data = this.props.object.data;
      if (!this.data.hasOwnProperty('UF')) {
        this.data['UF'] = 0.03;
      }
      if (!this.data.hasOwnProperty('UFAssoc')) {
        this.data['UFAssoc'] = 0.001;
      }
      if (!this.data.hasOwnProperty('cf_cpg_choice')) {
        this.data['cf_cpg_choice'] = "Placement Privé";
      }

    }
          
    //l'objet autocall Classe
    this.autocall = new CAutocall(this.data);
    this.autocallResult = new CAutocall(this.data);

    this.request = new CPSRequest();
    this.request.setRequestFromCAutocall(this.autocall);

    //console.log(this.autocall);
    //console.log(this.data);
    //le produit-ticket est filtre ou pas
    this.isFiltered = false;
  }


  componentWillReceiveProps (props) {
    //console.log("Prop received in FLTemplateAutocall : " + props.data);
    typeof props.isGoodToShow !== 'undefined' ? this.setState({ isGoodToShow : props.isGoodToShow }) : null;
   
  }
 



_renderRecalculateProduct() {
        //on est en train de recalcler le produit
        /*
                          <AnimatedProgressWheel 
                      size={60} 
                      width={4} 
  
                      //progress={45}
                      //backgroundColor={'orange'}
                      progress={100}
                      animateFromValue={0}
                      duration={5000}
                      color={'white'}
                      fullColor={headerTabColor}
                  />
                  <View style={{marginTop: 20}}>
                    <Text style={setFont('300', 14, 'white')}>{this.state.messageLoading}</Text>
                  </View>
                  */
        if (this.state.messageLoading !== '') {
          return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding : 10, backgroundColor:'white'}}>
                  <RobotBlink width={120} height={120} />
                </View>
          );
        } 
}

 _renderModalUpdate ()  {
   let render = null;


   return (
   
    <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.showModalUpdate}
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
          let verifX = x < DEVICE_WIDTH*0  || x > DEVICE_WIDTH ? true : false;
          let verifY = y < DEVICE_HEIGHT*0.5  || y > DEVICE_HEIGHT ? true : false;
          if (verifX || verifY) {
            //console.log("passe la ");
            this.setState({showModalUpdate : false})
          }
        }}

      >
        <View 
          //directionalLockEnabled={true} 
          //contentContainerStyle={{
            style={{
              flexDirection: 'column',
              backgroundColor: 'white',
              borderWidth :0,
              borderColor : headerTabColor,
              borderRadius:5,
              width: DEVICE_WIDTH,
              height: DEVICE_HEIGHT*0.5,
              top:  DEVICE_HEIGHT*0.5,
              left : DEVICE_WIDTH*0,

          }}
        >
                    <View style={{    height: 20,
                                      backgroundColor: backgdColorPricerParameter,
                                      justifyContent : 'center',
                                      alignItems : 'center',
                                      borderTopRightRadius : 10,
                                      borderTopLeftRadius : 10,}} 
                    >
                      <View style={{width: DEVICE_WIDTH/3, height : 4, backgroundColor: blueFLColor}}><Text></Text></View>
                    </View>
                    <View style={{flex:0.1 , flexDirection: 'row',justifyContent: 'center',alignItems: 'flex-start', borderWidth: 0}}>
                          <View  style={{flex : 0.15, justifyContent: 'center',alignItems: 'flex-end', borderWidth: 0}}>
                            
                          </View>
                          <View style={{flex : 0.7, justifyContent: 'center',alignItems: 'center', borderWidth: 0}}>
                                <Text style={[setFont('600', 21), { textAlign: 'center'}]}>
                                  AIDE
                                </Text>
                          </View>
                          <TouchableOpacity  style={{flex : 0.15, justifyContent: 'center',alignItems: 'center', borderWidth: 0}}
                                             onPress={() => {
                                                    this.setState({ showModalUpdate : false });
                                                }}
                          >
                                <Ionicons name="md-close"  size={25} style={{color : "#85B3D3"}}/>
                          </TouchableOpacity>
                      </View>
                      {render}
        </View>
      </View>
    </Modal>
  );
               
           
  //  return <FLPDIDetail updateValue={this._updateValue} initialValue={this.autocall.getBarrierPDI()}/>;
}

_updateValue=(id, value, valueLabel) =>{
  console.log(id + "  :  "+value+"  :  "+valueLabel);
  this.request.setCriteria(id, value, valueLabel);
}

_recalculateProduct(){
  this.setState({ messageLoading : 'Interrogation du marché...', isGoodToShow : true});
  searchProducts(this.props.firebase, this.request.getCriteria())
  .then((data) => {
    this.setState({ messageLoading : 'Réception et analyse des prix' });

    autocall = interpolateBestProducts(data, this.request);

    if (autocall.length === 1){
      //console.log(autocall);
      this.autocallResult.updateProduct(autocall[0]);
      //this.request.setRequestFromCAutocall(this.autocallResult);
    } else if (autocall.length === 0) {
      alert("Pas résultat possible.\nModifiez vos critères.");
    }

    this.setState({ messageLoading : '', isGoodToShow : true});
  
  })
  .catch(error => {
    console.log("ERREUR recup prix: " + error);
    alert('ERREUR calcul des prix', '' + error);
    this.setState({ isLoading : false , messageLoading : ''});
  });
}

_renderHeaderShortTemplate() {

  return (

                <View style={{
                              paddingLeft : 20,  
                              backgroundColor: setColor('blue'), 
                              borderTopLeftRadius: 10, 
                              borderTopRightRadius: 10, 
                              flexDirection: 'row',
                              //paddingTop: 5,
                              //paddingBottom: 5,
                              }}
                >                                                    
                  <View style={{flex : 0.85, flexDirection: 'column', justifyContent: 'center' , paddingTop: 3, paddingBottom: 3}}>
                    <View>
                      <Text style={setFont('400', 18, 'white')}>
                        {this.autocall.getProductName()} 
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>

                        <Text style={setFont('400', 18, 'white')}>   
                           {this.autocall.getFullUnderlyingName(this.props.categories)}
                        </Text>   
                    </View>
                  </View>
                  <TouchableOpacity style={{flex : 0.15,  justifyContent: 'center', alignItems: 'center',backgroundColor: setColor('turquoise'), borderTopRightRadius: 10}}
                                    onPress={() => {
                                      this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLAutocallDetailHome' : 'FLAutocallDetailPricer', {
                                        item: this.object,
                                        //ticketType: TICKET_TYPE.PSCREATION
                                      })
                                    }}
                  >
                      <Text style={setFont('300', 20, 'white', 'Regular')}>></Text>
                  </TouchableOpacity>
                </View>
  
  );
}

_renderHeaderFullTemplate() {
  let dataMaturityAutocall = ['1 an','2 ans','3 ans','4 ans','5 ans','6 ans','7 ans','8 ans','9 ans','10 ans'];
  let dataUnderlyingAutocall = this.props.getAllUndelyings();
  //let dataProductName = STRUCTUREDPRODUCTS.map((p) => p.name);
  let dataProductName = ['Athéna', 'Phoenix', 'Phoenix mémoire'];
  

  return (
          <View style={{flex : 0.35, flexDirection : 'row'}}>
                <View style={{
                              flex : 0.6, 
                              flexDirection : 'column', 
                              paddingLeft : 20,  
                              backgroundColor: blueFLColor, 
                              borderTopLeftRadius: 10, 
                              //borderRadius: 14,
                              borderBottomWidth :  0,
                              borderColor : 'red',

                              }}
                >                                                    
                  <View style={{flex : 0.6, flexDirection: 'column', justifyContent: 'center' }}>
                    <View>
                          <ModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                                    onSelect={(index, value) => {
                                      switch (Number(index))  {
                                         case 0 :   //athena
                                            this._updateValue('type', 'autocall', value);
                                            this._updateValue('barrierPhoenix', 1, "100%");
                                            this._updateValue('isIncremental', true, "incremental");
                                            //this._updateValue('isMemory', true, "Effet mémoire");
                                            break;
                                         case 1 : 
                                            this._updateValue('type', 'phoenix', value);
                                            this._updateValue('isMemory', false, "non mémoire");
                                            this._updateValue('degressiveStep', 0, 'sans stepdown');
                                            this._updateValue('airbagLevel', 'NA', 'Non airbag');
                                            break;
                                         case 2 : 
                                            this._updateValue('type', 'phoenix', value);
                                            this._updateValue('isMemory', true, "Effet mémoire");
                                            this._updateValue('degressiveStep', 0, 'sans stepdown');
                                            this._updateValue('airbagLevel', 'NA', 'Non airbag');
                                            break;
                                      }
                          
               
                                      this._recalculateProduct();
                                    }}
                                    adjustFrame={(f) => {
                                      return {
                                        width: DEVICE_WIDTH/2,
                                        height: Math.min(DEVICE_HEIGHT/3, dataProductName.length * 40),
                                        left : f.left,
                                        right : f.right,
                                        top: f.top,
                                      }
                                    }}
                                    defaultIndex={dataProductName.indexOf(this.autocallResult.getProductName())}
                                    options={dataProductName}
                                    disabled={!this.state.isEditable}
                                >
                                  <Text style={setFont('400', 18, this.request.isUpdated('underlying') ? setColor('turquoise') : 'white','Regular')}>
                                      {this.autocallResult.getProductName()} 
                                  </Text>
                          </ModalDropdown>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <View>
                            <ModalDropdown
                              //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                              //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                              dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                              dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                              onSelect={(index, value) => {
                                  let code = [ value ];
                    
                                  this._updateValue('underlying', code, value);
                                  this._recalculateProduct();
                              }}
                              adjustFrame={(f) => {
                                return {
                                  width: DEVICE_WIDTH/3,
                                  height: Math.min(DEVICE_HEIGHT/3, dataUnderlyingAutocall.length * 40),
                                  left : f.left,
                                  right : f.right,
                                  top: f.top,
                                }
                              }}
                              defaultIndex={dataUnderlyingAutocall.indexOf(this.autocallResult.getUnderlyingTicker())}
                              options={dataUnderlyingAutocall}
                              disabled={!this.state.isEditable}
                          >
                            <Text style={setFont('400', 18, this.request.isUpdated('underlying') ? setColor('turquoise') : 'white','Regular')}>
                                {this.autocallResult.getFullUnderlyingName(this.props.categories)} <Text style={setFont('400', 18, 'white','Regular')}>{' - '}</Text>
                            </Text>
                          </ModalDropdown>
           
                      </View>
                      <View style={{ flexDirection: 'row', borderWidth: 0}}>
                          <View style={{ borderWidth: 0, paddingLeft : 15, alignItems: 'center', justifyContent: 'center',}}>
                            <MaterialCommunityIconsIcon name={"calendar"}  size={18} style={{color: this.request.isUpdated('maturity') ? setColor('turquoise') : 'white'}}/> 
                          </View>
                          <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                                <ModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                                    onSelect={(index, value) => {
                                        let code = [ Number(index)+1, Number(index) +1 ];
                          
                                        this._updateValue('maturity', code, value);
                                        this._recalculateProduct();
                                    }}
                                    adjustFrame={(f) => {
                                      return {
                                        width: DEVICE_WIDTH/3,
                                        height: Math.min(DEVICE_HEIGHT/3, dataMaturityAutocall.length * 40),
                                        left : f.left,
                                        right : f.right,
                                        top: f.top,
                                      }
                                    }}
                                    defaultIndex={this.autocallResult.getMaturityInMonths()/12-1}
                                    options={dataMaturityAutocall}
                                    disabled={!this.state.isEditable}
                                >
                                  <Text style={setFont('400', 18, this.request.isUpdated('maturity') ? setColor('turquoise') : 'white','Regular')}>
                                      {'  ' + this.autocallResult.getMaturityName()}
                                  </Text>
                                </ModalDropdown>
                          </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{flex : 0.4, flexDirection : 'column', borderWidth: 0,  borderTopRightRadius: 10}}>
                  <View style={{flex : 0.5, backgroundColor: 'white',justifyContent: 'center', alignItems: 'center', paddingRigth : 5, borderWidth: 0, marginTop:0, borderWidth: 0, borderColor: 'white', borderTopRightRadius :10}}>
                    <Text style={setFont('400', 24, this.state.messageLoading !== '' ? 'black' : 'green')} numberOfLines={1}>
                        { this.state.messageLoading !== '' ? 'X.XX%' : Numeral(this.autocallResult.getCouponTitle()).format('0.00%')}
                        <Text style={setFont('200', 12)}> { 'p.a.'}</Text>   
                    </Text>  
                  </View> 
                  <TouchableOpacity style={{flex : 0.5, paddingTop: 5, paddingBottom: 5, backgroundColor: this.request.isUpdated() ? 'green' : subscribeColor, justifyContent: 'center', alignItems: 'center',  borderWidth: 0, }}
                                                   onPress={() => {
                                                    //envoi du produit
                                          
                                                      if (this.request.isUpdated()) {
                                                          //on va recalculer le produit
                                                            //console.log("AVANT LACEMENT CALCUL");
                                                            /*this.setState({ messageLoading : 'Interrogation du marché...', isGoodToShow : true});
                                                            searchProducts(this.props.firebase, this.request.getCriteria())
                                                            .then((data) => {
                                                              this.setState({ messageLoading : 'Réception et analyse des prix' });
                                                
                                                              autocall = interpolateBestProducts(data, this.request);

                                                              if (autocall.length === 1){
                                                                console.log(autocall);
                                                                this.autocallResult.updateProduct(autocall[0]);
                                                                //this.request.setRequestFromCAutocall(this.autocallResult);
                                                              }

                                                              this.setState({ messageLoading : '', isGoodToShow : true});
                                                            
                                                            })
                                                            .catch(error => {
                                                              console.log("ERREUR recup prix: " + error);
                                                              alert('ERREUR calcul des prix', '' + error);
                                                              this.setState({ isLoading : false , messageLoading : ''});
                                                            });*/

                                                            Alert.alert(
                                                              'Votre choix :',
                                                              "Concernant l'ancien produit et le nouveau : ",
                                                              [
                                                                {
                                                                  text: 'Garder les deux', 
                                                                  onPress: () => console.log('Ask me later pressed')
                                                                },
                                                                {
                                                                  text: "Revenir au produit initial",
                                                                  onPress: () => {
                                                                    this.autocallResult = new CAutocall(this.data);

                                                                    this.request = new CPSRequest();
                                                                    this.request.setRequestFromCAutocall(this.autocall);
                                                                    //console.log('Cancel Pressed');
                                                                    this.setState({ toto: !this.state.toto });
                                                                  },
                                                                  style: 'cancel',
                                                                },
                                                                {
                                                                  text: 'Ne garder que le nouveau', 
                                                                  onPress: () => {
                                                                    this.request = new CPSRequest();
                                                                    this.request.setRequestFromCAutocall(this.autocallResult);
                                                                    this.autocall = this.autocallResult;
                                                                    this.setState({ toto: !this.state.toto });
                                                                  }, 
                                                                  style: 'cancel',},
                                                              ],
                                                              {cancelable: true},
                                                            );
                                                        
                                                      } else {
                                                        this.props.navigation.navigate((this.props.hasOwnProperty('source') && this.props.source === 'Home') ? 'FLAutocallDetailHome' : 'FLAutocallDetailPricer', {
                                                          item: this.object,
                                                          //ticketType: TICKET_TYPE.PSCREATION
                                                        })
                                                      }
                                                  }}
                  >
                    <Text style={setFont('400', 14, 'white')}>
                    { (this.request.isUpdated() ?  'VALIDER' : 'VOIR >')}
                    </Text>   
                  </TouchableOpacity>
                </View>

              </View>
  
  );
}

_renderAutocallFullTemplate() {

  //remplissage des dropdown
  let dataPhoenixBarrier = ['-60%','-55%','-50%','-45%','-40%','-35%','-20%','-15%','-10%'];
  let dataPDIBarrier = ['-70%','-65%','-60%','-55%','-50%','-45%','-40%','-35%','-20%','-15%','-10%'];
  let dataNNCP = ['1 an','2 ans','3 ans'];
  let dataFreqAutocall = ['Mensuel','Trimestriel','Semestriel','Annuel'];
  let dataMemoryAutocall = ['Effet mémoire','Non mémoire'];
  let dataAirbagAutocall = ['Non Airbag','Semi-Airbag','Airbag'];
  let dataDSAutocall = ['sans stepdown','1% / an','2% / an','3% / an','4% / an','5% / an'];

  return (
   <View style={{flex : 0.55, flexDirection : 'row', backgroundColor: 'white', paddingTop:5 }}>
     <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
       <View style={{justifyContent: 'flex-start', alignItems: 'center', padding: 2}}>
         <Text style={[setFont('300', 10, 'black', 'Light', 'top'), {textAlign: 'center'}]}>
          {String('protection \ncapital').toUpperCase()}
         </Text>         
       </View>
       <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIconsIcon name={"shield"}  size={18} style={{color: setColor(this.request.isUpdated('barrierPDI') ? 'turquoise' : 'light')}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 2}}>
              <ModalDropdown
                //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                textStyle={setFont('500', 16, (this.request.isUpdated('barrierPDI')) ? setColor('turquoise'): setColor('light'), 'Bold')}
                dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                  onSelect={(index, value) => {
                    this._updateValue('barrierPDI', Math.round(100*(Numeral(value).value() +1))/100, value);
                    this._recalculateProduct();

                }}
                adjustFrame={(f) => {
                  return {
                    width: DEVICE_WIDTH/3,
                    height: Math.min(DEVICE_HEIGHT/3, dataPDIBarrier.length * 40),
                    left : f.left,
                    right : f.right,
                    top: f.top,
                  }
                }}
                defaultIndex={dataPDIBarrier.indexOf(Numeral(this.autocallResult.getBarrierPDI() - 1).format('0%'))}
                defaultValue={Numeral(this.autocallResult.getBarrierPDI()- 1).format('0%')}
                options={dataPDIBarrier}
                disabled={!this.state.isEditable}
              />
            </View>
        </View>

 
       <View style={{justifyContent: 'center', alignItems: 'center', padding: 2, borderWidth: 0, paddingTop: 10}}>
           <Text style={setFont('200', 11, 'black', 'Regular')}>
             européen
           </Text>
       </View>
     </View>    
     <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
       <View style={{ justifyContent: 'flex-start', alignItems: 'center', padding: 2,}}>
        <Text style={[setFont('300', 10, 'black', 'Light', 'top'), {textAlign: 'center'}]} numberOfLines={2}>
             {String('protection coupon').toUpperCase()}
         </Text>         
       </View>
       <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIconsIcon name={"shield-half-full"}  size={18} style={{color: this.request.isUpdated('barrierPhoenix') ? setColor('turquoise') : setColor('light')}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center',  alignItems: 'stretch', padding: 2 }}>
              <ModalDropdown
                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                    textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                    dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                      onSelect={(index, value) => {
                        this._updateValue('barrierPhoenix', Math.round(100*(Numeral(value).value() +1))/100, value);
                        this._recalculateProduct();

                    }}
                    adjustFrame={(f) => {
                      return {
                        width: DEVICE_WIDTH/3,
                        height: Math.min(DEVICE_HEIGHT/3, dataPhoenixBarrier.length * 40),
                        left : f.left,
                        right : f.right,
                        top: f.top,
                      }
                    }}
                    defaultIndex={dataPhoenixBarrier.indexOf(Numeral(this.request.getValue('barrierPhoenix') - 1).format('0%'))}
                    defaultValue={Numeral(this.request.getValue('barrierPhoenix') - 1).format('0%')}
                    options={dataPhoenixBarrier}
                    disabled={!this.state.isEditable}
                />
            </View>
       </View>

       <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 0, paddingTop: 10}}>
          <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
            <MaterialCommunityIconsIcon name={"ticket-percent"}  size={18} style={{color: this.request.isUpdated() ? setColor('turquoise') : setColor('light')}}/> 
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 2, paddingBottom: 4}}>
             <Text style={[setFont('200', 11, this.request.isUpdated() ? setColor('turquoise') : 'black','Regular'), {textAlign: 'center'}]}>
              {Numeral(this.autocallResult.getCouponTitle()*this.autocallResult.getFrequencyPhoenixNumber()/12).format('0.00%')} 
              <Text style={setFont('200', 11, this.request.isUpdated('freq') ? setColor('turquoise') : 'black','Regular')}>{' '+ this.autocallResult.getFrequencyPhoenixTitle().toLowerCase()} </Text>
            </Text>
          </View>
       </View>

       <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIconsIcon name={"memory"}  size={18} style={{color: this.request.isUpdated('isMemory') ? setColor('turquoise') : setColor('light')}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 2 }}>
                <ModalDropdown
                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                        //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                        dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                        dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                        onSelect={(index, value) => {
                            //console.log(index + "    - " + value);
                            this._updateValue('isMemory', index == 0  ? true : false, value);
                            this._recalculateProduct();
                        }}
                        adjustFrame={(f) => {
                          return {
                            width: DEVICE_WIDTH/3,
                            height: Math.min(DEVICE_HEIGHT/3, dataMemoryAutocall.length * 40),
                            left : f.left,
                            right : f.right,
                            top: f.top,
                          }
                        }}
                        defaultIndex={this.autocallResult.isPhoenixMemory() ? 0 : 1}
                        defaultValue={dataMemoryAutocall[this.autocallResult.isPhoenixMemory() ? 0 : 1]}
                        options={dataMemoryAutocall}
                        disabled={!this.state.isEditable}
                    >
                     <Text style={[setFont('200', 11, this.request.isUpdated('isMemory') ? setColor('turquoise') : 'black','Regular'), {textAlign: 'center'}]}>
                       {this.autocallResult.isPhoenixMemory() ? 'effet mémoire': 'non mémoire'}
                     </Text>
                   </ModalDropdown>
            </View>
      </View>

      <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}> 
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIconsIcon name={"airbag"}  size={18} style={{color: this.request.isUpdated('airbagLevel') ? setColor('turquoise') : setColor('light')}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 2}}>
                    <ModalDropdown
                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                        //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                        dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                        dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                        onSelect={(index, value) => {
                            var code = 'NA';
                            switch (Number(index))  {
                                case 1 : code = 'SA'; break;
                                case 2 : code = 'FA'; break;
                            }
                            this._updateValue('airbagLevel', code, value);
                            this._recalculateProduct();
                        }}
                        adjustFrame={(f) => {
                          return {
                            width: DEVICE_WIDTH/3,
                            height: Math.min(DEVICE_HEIGHT/3, dataAirbagAutocall.length * 40),
                            left : f.left,
                            right : f.right,
                            top: f.top,
                          }
                        }}
                        defaultIndex={this.autocallResult.getAirbagCode() === 'NA' ?  0 : (this.autocallResult.getAirbagCode() === 'SA' ? 1 : 2)}
                        options={dataAirbagAutocall}
                        disabled={this.state.isEditable ? (this.autocallResult.getCouponPhoenix() === 0 ? false : true) : true}
                    >
                      <Text style={[setFont('200', 11, this.request.isUpdated('airbagLevel') ? setColor('turquoise') : 'black','Regular'), {textAlign: 'center'}]}>
                        {this.autocall.getAirbagTitle()}
                      </Text>
                    </ModalDropdown>
            </View>
      </View>
 
     </View>   
     <View style={{flex: 0.33, flexDirection : 'column', padding: 5}}>
       <View style={{justifyContent: 'flex-start', alignItems: 'center', padding: 2}}>
         <Text style={[setFont('300', 10, 'black', 'Light', 'top'), {textAlign: 'center'}]}>
             RAPPELS DU PRODUIT
         </Text>         
       </View>
       <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center'}}>
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIconsIcon name={"gavel"}  size={18} style={{color: setColor('light')}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center',  alignItems: 'stretch', padding: 2}}>
              <Text style={[setFont('500', 16, setColor('light'), 'Bold'), {textAlign: 'center'}]}>
               { Numeral(this.autocallResult.getAutocallLevel()).format('0%')}
              </Text>
            </View>
       </View>
       <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 10 }}>
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIconsIcon name={"trending-down"}  size={18} style={{color: setColor('light')}}/> 
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 2}}>
                  <ModalDropdown
                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                        //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('turquoise') : setColor('light'), 'Bold'), {textAlign: 'center'}]}
                        dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                        dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                        onSelect={(index, value) => {
                          console.log("DS : " + index);
                            this._updateValue('degressiveStep', Number(index), value);
                            this._recalculateProduct();
                        }}
                        adjustFrame={(f) => {
                          return {
                            width: DEVICE_WIDTH/3,
                            height: Math.min(DEVICE_HEIGHT/3, dataDSAutocall.length * 40),
                            left : f.left,
                            right : f.right,
                            top: f.top,
                          }
                        }}
                        defaultIndex={this.autocallResult.getDegressiveStep()}
                        options={dataDSAutocall}
                        disabled={this.state.isEditable ? (this.autocallResult.getCouponPhoenix() === 0 ? false : true) : true}
                    >
                      <Text style={[setFont('200', 11, this.request.isUpdated('airbagLevel') ? setColor('turquoise') : 'black','Regular'), {textAlign: 'center'}]}>
                           {this.autocallResult.getDegressiveStep() === 0 ? 'sans stepdown' : (Numeral(this.autocallResult.getDegressiveStep()).format('0%') +' / an')}
                      </Text>
                  </ModalDropdown>
            </View>
       </View>
       <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIconsIcon name={"alarm-multiple"}  size={18} style={{color: this.request.isUpdated('freq') ? setColor('turquoise') : setColor('light')}}/> 
            </View>
             <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                <ModalDropdown
                        //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                        //textStyle={setFont('500', 9, (this.request.isUpdated('nncp')) ? 'white' : 'black', 'Regular')}
                        dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                        dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                        onSelect={(index, value) => {
                            let f = '1Y';
                            switch(dataFreqAutocall.indexOf(value)){
                              case 0 : 
                                f = '1M';
                                break;
                              case 1 :
                                f = '3M';
                                break;
                              case 2 : 
                                f = '6M';
                                break;
                              case 3 : 
                                f = '1Y';
                                break;
                              default : break;
                            }
                            this._updateValue('freq', f, value);
                            this._recalculateProduct();

                        }}
                        adjustFrame={(f) => {
                          return {
                            width: DEVICE_WIDTH/3,
                            height: Math.min(DEVICE_HEIGHT/3, dataFreqAutocall.length * 40),
                            left : f.left,
                            right : f.right,
                            top: f.top,
                          }
                        }}
                        defaultIndex={dataFreqAutocall.indexOf(this.autocallResult.getFrequencyAutocallTitle())}
                        //defaultValue={'1er rappel dans ' + this.request.getNNCPLabel()}
                        options={dataFreqAutocall}
                        disabled={!this.state.isEditable}
                    >
                      <Text style={[setFont('200', 11, this.request.isUpdated('freq') ? setColor('turquoise') : 'black','Regular'), {textAlign: 'center'}]}>
                        {this.autocallResult.getFrequencyAutocallTitle().toLowerCase()} 
                      </Text>
                    </ModalDropdown>
              </View>
      </View>
      <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
            <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
              <MaterialCommunityIconsIcon name={"clock-start"}  size={18} style={{color: this.request.isUpdated('nncp') ? setColor('turquoise') : setColor('light')}}/> 
            </View>
             <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
             <ModalDropdown
                //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                //textStyle={setFont('500', 9, (this.request.isUpdated('nncp')) ? 'white' : 'black', 'Regular')}
                dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                  onSelect={(index, value) => {
                    let nncp = 12;
                    switch(dataNNCP.indexOf(value)){
                      case 0 : 
                        nccp = 12;
                        break;
                      case 1 :
                        nccp = 24;
                        break;
                      case 2 : 
                        nccp = 36;
                        break;
                      default : break;
                    }
                    this._updateValue('nncp', nccp, value);
                    this._recalculateProduct();

                }}
                adjustFrame={(f) => {
                  return {
                    width: DEVICE_WIDTH/3,
                    height: Math.min(DEVICE_HEIGHT/3, dataNNCP.length * 40),
                    left : f.left,
                    right : f.right,
                    top: f.top,
                  }
                }}
                defaultIndex={dataNNCP.indexOf(this.request.getValue('nncp'))}
                //defaultValue={'1er rappel dans ' + this.request.getNNCPLabel()}
                options={dataNNCP}
                disabled={!this.state.isEditable}
            >
                      <Text style={[setFont('200', 11, this.request.isUpdated('nncp') ? setColor('turquoise') : 'black','Regular'), {textAlign: 'center'}]}>
                        {this.request.getNNCPLabel()}
                      </Text>
          </ModalDropdown>
    </View>
      </View>
     </View>                                             
   </View>
  )
}

_renderAutocallShortTemplate() {

  

  return (
   <View style={{flexDirection : 'row', backgroundColor: 'white', paddingTop:1}}>
     <View style={{flex : 0.7, flexDirection : 'column', padding: 10, borderWidth: 0}}>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"gavel"}  size={15} style={{color: setColor('light')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, 'black', 'Light')}>{ Numeral(this.autocallResult.getAutocallLevel()).format('0%')} </Text>
                </View>
            </View>
            <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5}}>
                <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"alarm-multiple"}  size={18} style={{color: setColor('light')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, 'black', 'Light')}>{this.autocallResult.getFrequencyPhoenixTitle().toLowerCase()} </Text>
                </View>
            </View>
        </View>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={this.request.getValue('barrierPhoenix') === 1 ? "airbag" : "shield-half-full"}  size={15} style={{color: setColor('light')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, 'black', 'Light')}>{this.request.getValue('barrierPhoenix') === 1  ? this.autocall.getAirbagTitle() : Numeral(this.request.getValue('barrierPhoenix') - 1).format('0%')}</Text>
                </View>
            </View>
            { this.request.getValue('isMemory') ? 
                  <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5}}>
                      <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                        <MaterialCommunityIconsIcon name={"memory"}  size={15} style={{color: setColor('light')}}/>
                      </View>
                      <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                          <Text style={setFont('300', 12, 'black', 'Light')}>{(this.request.getValue('isMemory') ? 'mémoire': 'non mémoire')} </Text>
                      </View>
                  </View>
              : null
            }
        </View>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"shield"}  size={15} style={{color: setColor('light')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, 'black', 'Light')}>{Numeral(this.request.getValue('barrierPDI') - 1).format('0%')}</Text>
                </View>
            </View>
            <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5}}>
                <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"calendar"}  size={18} style={{color: setColor('light')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                    <Text style={setFont('300', 12, 'black', 'Light')}>{this.autocall.getMaturityName()} </Text>
                </View>
            </View>
        </View>
     </View>
     <View style={{flex : 0.3,  padding: 5, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={setFont('400', 16, 'green')} numberOfLines={1}>        
            { Numeral(this.autocallResult.getCouponTitle()).format('0.00%')}
        </Text>
        <Text style={setFont('200', 12)}>p.a.</Text>   
     </View>   
  </View>
  )
}

_renderFooterShortTemplate(isFavorite) {
  //remplisaaage des dropdown
  return (
           <View style={{flex : 0.10, flexDirection : 'row', borderTopWidth : 1, borderTopColor: 'lightgray', padding :3, backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
                <TouchableOpacity style={{flex : 0.33, justifyContent: 'center', alignItems: 'center'}} 
                                  onPress={() => {
                                    if (this.request.isUpdated()) {
                                      alert('Valider votre produit avant de le mettre en favori');
                                      return;
                                    }
                                    //this.props.handleFavorite(this.props.index, !this.state.isFavorite);
                                    this.props.setFavorite(this.object)
                                    .then((fav) => {
                                      this.object  = fav;                                    
                                      console.log("fav : "+fav.isFavorite);
                                      console.log("this.props.object : "+this.object.isFavorite);
                                      this.setState({ isFavorite: fav.isFavorite })
                                    })
                                    .catch((error) => console.log("Erreur de mise en favori : " + error));
                                  }}
                >
                  <MaterialCommunityIconsIcon name={!isFavorite ? "heart-outline" : "heart"} size={20} color={setColor(this.request.isUpdated() ? 'gray' : 'light')}/>
                </TouchableOpacity>

   
                <TouchableOpacity style={{flex : 0.33, justifyContent: 'center', alignItems: 'center'}} >
                  <Ionicons name="md-help" size={20} style={{color: setColor('light')}}/>
                </TouchableOpacity>
                <TouchableOpacity style={{flex : 0.34, justifyContent: 'center', alignItems: 'center'}} 
                                  onPress={() => {
                                    
                                   
                                  }}
                 >
                 
                  <FontAwesome name={"gears"}  size={20} style={{color: setColor('light')}}/> 
                </TouchableOpacity>   
                
              </View>

  );
}


_renderFooterFullTemplate(isFavorite) {
  //remplisaaage des dropdown
  let dataUF = Array(61).fill().map((_, index) => (Numeral(index/1000).format('0.00%')));
  return (
    <View style={{flex : 0.10, flexDirection : 'row', borderTopWidth : 1, borderTopColor: 'lightgray', paddingTop : 5, backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]} 
                                  onPress={() => {
                                    if (this.request.isUpdated()) {
                                      alert('Valider votre produit avant de le mettre en favori');
                                      return;
                                    }
                                    //this.props.handleFavorite(this.props.index, !this.state.isFavorite);
                                    this.props.setFavorite(this.object)
                                    .then((fav) => {
                                      this.object  = fav;                                    
                                      console.log("fav : "+fav.isFavorite);
                                      console.log("this.props.object : "+this.object.isFavorite);
                                      this.setState({ isFavorite: fav.isFavorite })
                                    })
                                    .catch((error) => console.log("Erreur de mise en favori : " + error));
                                  }}
                >
                  <MaterialCommunityIconsIcon name={!isFavorite ? "heart-outline" : "heart"} size={20} color={setColor(this.request.isUpdated() ? 'gray' : 'light')}/>
                </TouchableOpacity>
                <View style={[{flex : 0.2}, globalStyle.templateIcon]}>
                  <FontAwesome name={"microphone-slash"}  size={20} style={{color: setColor('gray')}}/> 
                </View>
   
                <View style={[{flex : 0.2}, globalStyle.templateIcon]}>              
                 <ModalDropdown
                  ref={'UF'}
                  dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                  dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                    onSelect={(index, value) => {
                      this._updateValue('UF', Math.round(1000*(Numeral(value).value()))/1000, value);
                      this._recalculateProduct();

                    }}
                    adjustFrame={(f) => {
                      return {
                        width: DEVICE_WIDTH/3,
                        height: Math.min(DEVICE_HEIGHT/3, dataUF.length * 40),
                        left : f.left,
                        right : f.right,
                        top: f.top,
                      }
                    }}
                    onDropdownWillShow={() => {
                      let idx = dataUF.indexOf(Numeral(this.request.getValue('UF')).format('0.00%'));
                      this.refs['UF'].select(idx);
                      //this.refs['UF'].scrollTo({animated: true}, 100);
                    }}
                    defaultIndex={dataUF.indexOf(Numeral(this.request.getValue('UF')).format('0.00%'))}
                    //defaultValue={Numeral(this.request.getValue('UF') - 1).format('0%')}
                    //defaultValue={''}

                    options={dataUF}
                  >
                    <MaterialCommunityIconsIcon name={"margin"} size={20} style={{color: setColor(this.request.isUpdated('UF') ? 'turquoise' : 'light')}}/>
                  </ModalDropdown>
                </View>
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]}>
                  <Ionicons name="md-help" size={20} style={{color: setColor('light')}}/>
                </TouchableOpacity>
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]} 
                                  onPress={() => {
                                    
                                   
                                  }}
                 >
                 
                  <FontAwesome name={"gears"}  size={20} style={{color: setColor('light')}}/> 
                </TouchableOpacity>   
                
              </View>

  );
}



render () {
      //on affiche ou pas
      if (this.isFiltered) {
        return null;
      }
      if (this.type === TEMPLATE_TYPE.AUTOCALL_CARAC) {
        return this._renderAutocallFullTemplate();
      }




      //check if it is in favorites
      let isFavorite = false;
      this.props.favorites.forEach((fav) => {
        if (isEqual(fav.data, this.data)) {
          //isFavorite = this.item.isFavorite && this.item.toFavorites.active;
          isFavorite = true;
        }
      });
      //remise a jour de l'objet item en fonction de ce qui a été trouve dans favorites
      this.object.isFavorite = isFavorite;
      this.object.toFavorites.active = isFavorite;

      return (
            <View opacity={this.state.isGoodToShow ? 1 : 0.1} style={{flexDirection : 'column', 
                                                                      width: this.screenWidth, 
                                                                      marginLeft : 0.025*DEVICE_WIDTH,
                                                                      shadowColor: 'rgb(75, 89, 101)',
                                                                      shadowOffset: { width: 0, height: 2 },
                                                                      shadowOpacity: 0.9,
                                                                      borderWidth :  1,
                                                                      borderColor : 'white',
                                                                      //borderTopLeftRadius: 15,
                                                                      borderRadius: 10,
                                                                      //overflow: "hidden",
                                                                    }}
            >

                {this._renderModalUpdate()}

                {this.state.typeTemplate === 'FULL' ? this._renderHeaderFullTemplate() : this._renderHeaderShortTemplate()}

                {this.state.messageLoading === '' ? this.state.typeTemplate === 'FULL' ? this._renderAutocallFullTemplate() : this._renderAutocallShortTemplate()
                                                  : this._renderRecalculateProduct()}

                {this.state.typeTemplate === 'FULL' ? this._renderFooterFullTemplate(isFavorite) : this._renderFooterShortTemplate(isFavorite)}
            </View>
        );
    }
}



  const condition = authUser => !!authUser;

  const composedWithNav = compose(
    withAuthorization(condition),
     withNavigation,
     withUser
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(FLTemplateAutocall);

//export default FLTemplateAutocall;