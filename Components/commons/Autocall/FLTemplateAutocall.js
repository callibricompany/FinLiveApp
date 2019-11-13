import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Modal } from 'react-native';
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

import AnimatedProgressWheel from 'react-native-progress-wheel';

import {  
    generalFontColor, 
    tabBackgroundColor,
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
    setFont
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






const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class FLTemplateAutocall extends React.Component {


  constructor(props) {
    super(props);

    this.state = {

      isGoodToShow : typeof this.props.isGoodToShow !== 'undefined' ? this.props.isGoodToShow : true,
      editMode : false,
      showModalUpdate : false,
      currentParameter: '',
      messageLoading: '',
      toto : true,

    }
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

    //console.log(this.autocall);
    //console.log(this.data);
    //le produit-ticket est filtre ou pas
    this.isFiltered = false;
  }

  componentWillReceiveProps (props) {
    //console.log("Prop received in FLTemplateAutocall : " + props.data);
    typeof props.isGoodToShow !== 'undefined' ? this.setState({ isGoodToShow : props.isGoodToShow }) : null;
    typeof props.filters !== 'undefined' ? this.updateFilters(props.filters) : null;
  }


  //va aider pour savoir si on affiche ou pas 
  updateFilters(filters) {
    

    this.isFiltered = false;
    if (filters.hasOwnProperty('filterText') && String(filters['filterText']) !== '') {
      //console.log("pass : "+filters['filterText'])
      //construit une chaine de caractere avec tous mots clés
      let description = this.autocall.getDescription();
      
      description.toLowerCase().includes(String(filters['filterText']).toLowerCase()) ? this.isFiltered = false : this.isFiltered = true;
    } else if (filters.length !== 0) {
      if (filters["subcategory"].codeSubCategory !== "PS") {   //on montre pas tout
        if (filters["subcategory"].subCategoryHead) { // c('st PSACTIONS ou PSINDICES qui est choisi
          filters["subcategory"].codeSubCategory !== this.object['category'] ? this.isFiltered = true : null;
        } else if (filters["subcategory"].groupingHead) {//c'est un secteur qui a été choisi
          //on recuepere toutes les actions du secteurs
          let underlyings = this.props.categories.filter(({codeCategory}) => codeCategory === 'PS')[0].subCategory;
          this.sectorList = [];
          this.isFiltered = true;
          underlyings.filter(obj => obj.groupingName === filters["subcategory"].groupingName).forEach((value) => {
            //console.log(JSON.stringify(value));
            value.underlyingCode === this.object['code'] ? this.isFiltered = false : null;
          });
        } else { //c'est donc un sous-jacent final
          filters["subcategory"].underlyingCode !== this.object['code'] ? this.isFiltered = true : null;
        }
      }

      //on filtre ensuite les favoris
      if (filters["category"] === "PSFAVORITES") {
        //console.log("Item favori : " + this.object['isFavorite']);
        this.object['isFavorite'] === false ? this.isFiltered = true : null;
      }
    }
  }




 _getAutocallCaracTemplate() {

   
   return (
    <View style={{flex : 0.55, flexDirection : 'row', backgroundColor: 'white', paddingTop:5, width: DEVICE_WIDTH*0.975-4 }}>
      <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
        <TouchableOpacity style={{height: 30, justifyContent: 'flex-start', alignItems: 'center', padding: 2, borderColor : 'red', borderWidth : this.state.editMode ? 1 : 0}}
                                onPress={() => {
                                  if (!this.state.editMode)
                                    return;
                                  
                                  this.setState({ showModalUpdate : true , currentParameter : "barrierPDI"});
                                }}
        >
          <Text style={[setFont('bold', 10, 'black', 'FLFontFamily', 'top'), {textAlign: 'center'}]}>
              PROTECTION CAPITAL
          </Text>         
        </TouchableOpacity>
        <View style={{justifyContent: 'center', alignItems: 'center', padding: 2, backgroundColor : (this.state.editMode && this.request.isUpdated('barrierPDI')) ? 'red' : 'transparent'}}>
            <Text style={setFont('500', 16, (this.state.editMode && this.request.isUpdated('barrierPDI')) ? 'white' : 'red')}>
            { Numeral((this.state.editMode ? this.request.getValue('barrierPDI') : this.autocall.getBarrierPDI()) - 1).format('0%')}
            </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', padding: 2}}>
            <Text style={setFont('200', 9)}>
              européen
            </Text>
        </View>
      </View>    
      <View style={{flex : 0.33, flexDirection : 'column', padding: 5}}>
        <TouchableOpacity style={{height: 30, justifyContent: 'flex-start', alignItems: 'center', padding: 2, borderColor : 'red', borderWidth : this.state.editMode ? 1 : 0 }}
                          onPress={() => {
                            if (!this.state.editMode)
                              return;
                            
                            this.setState({ showModalUpdate : true , currentParameter : "barrierPhoenix"});
                          }}
        >
        <Text style={[setFont('bold', 10, 'black', 'FLFontFamily', 'top'), {textAlign: 'center'}]}>
              PROTECTION COUPON
          </Text>         
        </TouchableOpacity>
        <View style={{justifyContent: 'center', alignItems: 'center', padding: 2, paddingBottom: 4,backgroundColor : (this.state.editMode && this.request.isUpdated('barrierPhoenix')) ? 'red' : 'transparent'}}>
            <Text style={setFont('500', 16, (this.state.editMode && this.request.isUpdated('barrierPhoenix')) ? 'white' : 'green')}>
            { Numeral((this.state.editMode ? this.request.getValue('barrierPhoenix') : this.autocall.getBarrierPhoenix())-1).format('0%')}
            </Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
            <Text style={setFont('200', 9)}>
              {Numeral(this.autocall.getCouponTitle()*this.autocall.getFrequencyPhoenixNumber()/12).format('0.00%')} {this.autocall.getFrequencyPhoenixTitle().toLowerCase()} 
            </Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor : (this.state.editMode && this.request.isUpdated('isMemory')) ? 'red' : 'transparent'}}>
            <Text style={setFont('200', 9, (this.state.editMode && this.request.isUpdated('isMemory')) ? 'white' : 'black')}>
              {this.state.editMode ? (this.request.getValue('isMemory') ? 'effet mémoire': '') : (this.autocall.isPhoenixMemory() ? 'effet mémoire' : '')} {this.autocall.getAirbagTitle()}
            </Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center'}}>
            <Text style={setFont('200', 9)}>
            {this.autocall.isIncremental() ? ' incrémental ' : ''}
            </Text>
        </View>
      </View>   
      <View style={{flex: 0.33, flexDirection : 'column', padding: 5}}>
        <TouchableOpacity style={{height: 30, justifyContent: 'flex-start', alignItems: 'center', padding: 2, borderColor : 'red', borderWidth : this.state.editMode ? 1 : 0}}
                                  onPress={() => {
                                    if (!this.state.editMode)
                                      return;
                                    
                                    this.setState({ showModalUpdate : true , currentParameter : "airbagLevel"});
                                  }}
        >
          <Text style={[setFont('bold', 10, 'black', 'FLFontFamily', 'top'), {textAlign: 'center'}]}>
              RAPPELS DU PRODUIT
          </Text>         
        </TouchableOpacity>
        <View style={{justifyContent: 'center', alignItems: 'center', padding: 2}}>
            <Text style={setFont('500', 16, 'green')}>
            { Numeral(this.autocall.getAutocallLevel()-1).format('0%')}  <Text style={setFont('200', 9, 'green')}>{this.autocall.getDegressiveStep() === 0 ? '' : ('stepdown ' + Numeral(this.autocall.getDegressiveStep()).format('0%') +' / an')}
            </Text></Text>
        </View>
        <TouchableOpacity style={{flexDirection: 'column',justifyContent: 'center', alignItems: 'stretch', borderColor : 'red', borderWidth : this.state.editMode ? 1 : 0 }}
                          onPress={() => {
                            if (!this.state.editMode)
                              return;
                            
                            this.setState({ showModalUpdate : true , currentParameter : "freq"});
                          }}
        >
          <View style={{paddingTop :2, alignItems: 'center', backgroundColor : (this.state.editMode && this.request.isUpdated('freq')) ? 'red' : 'transparent'}}>
            <Text style={setFont('200', 9 , (this.state.editMode && this.request.isUpdated('freq')) ? 'white' : 'black')}>
              {this.state.editMode  ? this.autocallResult.getCouponAutocall() !== 0 ? Numeral(this.autocallResult.getCouponAutocall()).format('0.00%')  : ''
                                    : this.autocall.getCouponAutocall() !== 0 ? Numeral(this.autocall.getCouponAutocall()).format('0.00%')  : ''} {this.state.editMode ?  this.request.getValue('freq') : this.autocall.getFrequencyAutocallTitle().toLowerCase()} 
            </Text>
          </View>
          <View style={{alignItems: 'center', backgroundColor : (this.state.editMode && this.request.isUpdated('nncp')) ? 'red' : 'transparent'}}>
            <Text style={setFont('200', 9, (this.state.editMode && this.request.isUpdated('nncp')) ? 'white': 'black')}>
              1er rappel {this.state.editMode ?  this.request.getNNCPLabel() : this.autocall.getNNCPLabel()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>                                             
    </View>
   )
 }

_renderRecalculateProduct() {
        //on est en train de recalcler le produit
        if (this.state.messageLoading !== '') {
          return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding : 10, backgroundColor:'white'}}>
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
                </View>
          );
        } 
}

 _renderModalUpdate ()  {
   let render = null;
  switch (this.state.currentParameter) {
    //case 'typeAuction' : return  <FLAuctionDetail updateValue={this._updateValue} initialValue={this.product['typeAuction'].value}/>
    //case 'type' : return  <FLProductDetail updateValue={this._updateValue} initialValue={this.product['type'].value}/>
    //case 'underlying' : return  <FLUnderlyingDetail underlyings={this.underlyings} updateValue={this._updateValue} initialValue={this.product['underlying'].value}/>
    //case 'maturity' : return  <FLMaturityDetail updateValue={this._updateValue} initialValue={this.product['maturity'].value}/>
    case 'barrierPDI' :     render =   <FLPDIDetail updateValue={this._updateValue} initialValue={this.state.editMode ? this.request.getValue('barrierPDI') : this.autocall.getBarrierPDI()}/>
                            break;
    case 'barrierPhoenix' : render =  <FLPhoenixBarrierDetail updateValue={this._updateValue} 
                                                              initialValueBP={this.state.editMode ? this.request.getValue('barrierPhoenix') : this.autocall.getBarrierPhoenix()} 
                                                              initialValueIM={this.state.editMode ? this.request.getValue('isMemory') : this.autocall.isPhoenixMemory()}
                                      />
                            break;
    case 'freq' :           render = <FLFreqDetail updateValue={this._updateValue} 
                                                  initialValueFreq={this.state.editMode ? this.request.getValue('freq') : this.autocall.getFrequencyAutocall()} 
                                                  initialValueNNCP={this.state.editMode ? this.request.getValue('nncp') : this.autocall.getNNCP()} 
                                      />
                            break;
    case 'UF'   :          render =  <FLUFDetail updateValue={this._updateValue} 
                                          initialValueUF={this.state.editMode ? this.request.getValue('UF') : this.autocall.getUF()} 
                                          initialValueUFAssoc={this.state.editMode ? this.request.getValue('UFAssoc') : this.autocall.getUFAssoc()} 
                                      />
                            break;
    case 'UFAssoc' :        render =  <FLUFDetail updateValue={this._updateValue} 
                                          initialValueUF={this.state.editMode ? this.request.getValue('UF') : this.autocall.getUF()} 
                                          initialValueUFAssoc={this.state.editMode ? this.request.getValue('UFAssoc') : this.autocall.getUFAssoc()} 
                                      />
                            break;   
    case 'airbagLevel' :    render = <FLAirbagDetail updateValue={this._updateValue} 
                                                     initialValueAB={this.autocall.getAirbagCode()} 
                                                     initialValueDS={this.autocall.getDegressiveStep()} 
                                                     initialValueII={this.autocall.isIncremental()}
                                      />
                            break;
    //case 'degressiveStep' : return  <FLDegressiveDetail updateValue={this._updateValue} initialValue={this.product['degressiveStep'].value}/>

    default : break;
  }

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
                      <View style={{width: DEVICE_WIDTH/3, height : 4, backgroundColor: tabBackgroundColor}}><Text></Text></View>
                    </View>
                    <View style={{flex:0.1 , flexDirection: 'row',justifyContent: 'center',alignItems: 'flex-start', borderWidth: 0}}>
                          <View  style={{flex : 0.15, justifyContent: 'center',alignItems: 'flex-end', borderWidth: 0}}>
                            
                          </View>
                          <View style={{flex : 0.7, justifyContent: 'center',alignItems: 'center', borderWidth: 0}}>
                                <Text style={[setFont('600', 21), { textAlign: 'center'}]}>
                                  {this.state.editMode ? this.request.getTitle(this.state.currentParameter) : null}
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
  this.setState({ toto: this.state.toto });
  /*this.product[id].value = value;
  this.product[id].valueLabel = valueLabel;


  //mise a jour de produit dans pricerScreen
  this.props.parameterProductUpdated(this.product);
  

  this.props.needToRefresh();*/
}

 render () {

      if (this.type === TEMPLATE_TYPE.AUTOCALL_CARAC) {
        return this._getAutocallCaracTemplate();
      }
      //on affiche ou pas
      if (this.isFiltered) {
        return null;
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
                                                                      width: DEVICE_WIDTH*0.975, 
                                                                      //height: 200,
                                                                      //backgroundColor: tabBackgroundColor,
                                                                      borderBottomWidth : this.state.editMode ? 2 : 0,
                                                                      marginBottom: 20,
                                                                      shadowColor: 'rgb(75, 89, 101)',
                                                                      shadowOffset: { width: 0, height: 2 },
                                                                      shadowOpacity: 0.9,
                                                                      borderWidth : this.state.editMode ? 2 : 1,
                                                                      borderColor : this.state.editMode ? 'red' : 'white',
                                                                      borderTopLeftRadius: 15,
                                                                      //overflow: "hidden",
                                                                    }}
            >

            {this._renderModalUpdate()}
              <View style={{flex : 0.35, flexDirection : 'row'}}>
                <TouchableOpacity style={{
                              flex : 0.6, 
                              flexDirection : 'column', 
                              paddingLeft : 20,  
                              backgroundColor: this.state.editMode ? 'white' : tabBackgroundColor, 
                              borderTopLeftRadius: 15, 
                              borderBottomWidth : this.state.editMode ? 1 : 0,
                              borderColor : 'red',
                              borderRightWidth : this.state.editMode ? 1 : 0,
                              //borderRightColor : 'red',
                              }}
                              onPress={() => {

                              }}
                >                                                    
                  <View style={{flex : 0.6, justifyContent: 'center' }}>
                      <Text style={setFont('400', 20, this.state.editMode ? 'black' : 'white')}>
                        {this.autocall.getProductName()} {this.autocall.getMaturityName()}
                      {/*</Text>                                                
                  </View>
                  <View style={{flex : 0.4,}}>
                      <Text style={setFont('400', 16, 'white')}>*/}
                       {' '}sur {this.autocall.getFullUnderlyingName(this.props.categories)}
                    </Text>   
                  </View>
                </TouchableOpacity>
                <View style={{flex : 0.4, flexDirection : 'column', backgroundColor: tabBackgroundColor,borderWidth: 0, height: 60}}>
                  <View style={{flex : 0.5, backgroundColor: 'white',justifyContent: 'center', alignItems: 'center', paddingRigth : 5, borderWidth: 0, marginTop:0, borderWidth: 0, borderColor: 'white'}}>
                    <Text style={setFont('600', 24, 'green')} numberOfLines={1}>
                        { this.state.editMode ? (this.request.isUpdated() ? '[XX]' : Numeral(this.autocallResult.getCouponTitle()).format('0.00%')) : Numeral(this.autocall.getCouponTitle()).format('0.00%')}<Text style={setFont('200', 12)}> p.a.</Text>   
                    </Text>  
                  </View> 
                  <TouchableOpacity style={{flex : 0.5, backgroundColor: (this.state.editMode) ? this.request.isUpdated() ? 'red' : 'green' : subscribeColor, justifyContent: 'center', alignItems: 'center',  borderWidth: 0, }}
                                                   onPress={() => {
                                                    //envoi du produit
                                                    if (this.state.editMode) {
                                                      if (this.request.isUpdated()) {
                                                          //on va recalculer le produit
                                                            //console.log("AVANT LACEMENT CALCUL");
                                                            this.setState({ messageLoading : 'Interrogation du marché...', isGoodToShow : true});
                                                            searchProducts(this.props.firebase, this.request.getCriteria())
                                                            .then((data) => {
                                                              this.setState({ messageLoading : 'Réception et analyse des prix' });
                                                
                                                              autocall = interpolateBestProducts(data, this.request);

                                                              if (autocall.length === 1){
                                                                console.log(autocall);
                                                                this.autocallResult.updateProduct(autocall[0]);
                                                                this.request.setRequestFromCAutocall(this.autocallResult);
                                                              }
                                                              
                                                              this.setState({ messageLoading : '', isGoodToShow : true});
                                                            
                                                            })
                                                            .catch(error => {
                                                              console.log("ERREUR recup prix: " + error);
                                                              alert('ERREUR calcul des prix', '' + error);
                                                              this.setState({ isLoading : false , messageLoading : ''});
                                                            });
                                                          } else { //on valide
                                                            this.setState({ editMode: false });
                                                          }
                                                          
                                                    } else {
                                                      this.props.navigation.navigate('FLAutocallDetail', {
                                                        item: this.object,
                                                        //ticketType: TICKET_TYPE.PSCREATION
                                                      })
                                                    }
                                                  }}
                  >
                    <Text style={setFont('600', 14, 'white')}>
                    { (this.state.editMode) ? this.request.isUpdated() ? 'RECALCULER' : 'VALIDER' : 'TRAITER >'}
                    </Text>   
                  </TouchableOpacity>
                </View>

              </View>
              {/*this.state.editMode  ?  <View>
                                         <View style={{flexDirection : 'row',  paddingLeft:5, paddingTop:5,  justifyContent:'flex-start', alignItems:'center', backgroundColor:'white'}}>
                                              <View style={{paddingLeft: 10}}>
                                                <Text style={setFont('300', 12)}>Sous-Jacent : </Text>
                                              </View>
                                              <View style={{borderWidth: 1, borderColor : 'red', padding: 5}}>
                                                <Text style={setFont('300', 12)}>
                                                {this.autocall.getUnderlyingName()}
                                                </Text>
                                              </View>
                                          </View>
                                          <View style={{flexDirection : 'row',  padding:5, justifyContent:'flex-start', alignItems:'center', backgroundColor:'white'}}>
                                              <View style={{paddingLeft: 10}}>
                                                <Text style={setFont('300', 12)}>Maturité : </Text>
                                              </View>
                                              <View style={{borderWidth: 1, borderColor : 'red', padding: 5}}>
                                                <Text style={setFont('300', 12)}>
                                                {this.autocall.getMaturityName()}
                                                </Text>
                                              </View>
                                              <View style={{paddingLeft: 10}}>
                                                <Text style={setFont('300', 12)}>Fréquence de rappel : </Text>
                                              </View>
                                              <View style={{borderWidth: 1, borderColor : 'red', padding: 5}}>
                                                <Text style={setFont('300', 12)}>
                                                {this.autocall.getFrequencyAutocallTitle()}
                                                </Text>
                                              </View>
                                          </View>
                                      </View>
                                      : null 
              */}
                {this.state.messageLoading === '' ? this._getAutocallCaracTemplate() : this._renderRecalculateProduct()}
                {this.state.editMode  ?  <View style={{flexDirection : 'row',  padding:5, justifyContent:'flex-start', alignItems:'center', backgroundColor:'white'}}>
                                            <View style={{paddingLeft: 10}}>
                                              <Text style={setFont('300', 12)}>Rétro : </Text>
                                            </View>
                                            <TouchableOpacity style={{borderWidth: 1, borderColor : 'red', padding: 5, backgroundColor : (this.state.editMode && this.request.isUpdated('UF')) ? 'red' : 'transparent'}}
                                                                            onPress={() => {
                                                                              if (!this.state.editMode)
                                                                                return;
                                                                              
                                                                              this.setState({ showModalUpdate : true , currentParameter : "UF"});
                                                                            }}
                                            >
                                              <Text style={setFont('300', 12, (this.state.editMode && this.request.isUpdated('UF')) ? 'white' : 'black')}>
                                               {Numeral((this.state.editMode) ? this.request.getValue('UF') : this.autocall.getUF()).format('0.00%')}
                                              </Text>
                                            </TouchableOpacity>
                                            <View style={{ paddingLeft: 10}}>
                                              <Text style={setFont('300', 12)}>    Association : </Text>
                                            </View>
                                            <TouchableOpacity style={{borderWidth: 1, borderColor : 'red', padding: 5, backgroundColor : (this.state.editMode && this.request.isUpdated('UFAssoc')) ? 'red' : 'transparent'}}
                                                                            onPress={() => {
                                                                              if (!this.state.editMode)
                                                                                return;
                                                                              
                                                                              this.setState({ showModalUpdate : true , currentParameter : "UFAssoc"});
                                                                            }}
                                            >
                                              <Text style={setFont('300', 12, (this.state.editMode && this.request.isUpdated('UFAssoc')) ? 'white' : 'black')}>
                                              {Numeral((this.state.editMode) ? this.request.getValue('UFAssoc') : this.autocall.getUFAssoc()).format('0.00%')}
                                              </Text>
                                            </TouchableOpacity>
                                         </View>
                                      : null 
                }
              <View style={{flex : 0.10, flexDirection : 'row', borderTopWidth : 1, paddingTop : 5, backgroundColor: 'white'}}>
                <TouchableOpacity style={[{flex : 0.25}, globalStyle.templateIcon]} 
                                  onPress={() => {
                                    if (this.state.editMode) {
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
                  <MaterialCommunityIconsIcon name={!isFavorite ? "heart-outline" : "heart"} size={20} color={this.state.editMode ? 'lightgray' : 'black'}/>
                </TouchableOpacity>
                <TouchableOpacity style={[{flex : 0.25}, globalStyle.templateIcon]} 
                                  onPress={() => {
                                    //on passe en mode edition
                                    this.setState({ editMode : !this.state.editMode });
                                    this.request = new CPSRequest();
                                    this.request.setRequestFromCAutocall(this.autocall);
                                  }}>
                  <FontAwesome name={"gears"}  size={20} style={{color: this.state.editMode ? 'red' : 'black'}}/> 
                </TouchableOpacity>
                <TouchableOpacity style={[{flex : 0.25}, globalStyle.templateIcon]} 
                                  onPress={() => {
                                    //envoi du produit
                                    alert("En développement : ouverture de la fiche produit généré automatiquement");
                                  }}
                 >
                  <Text >Fiche</Text>
                </TouchableOpacity>      
                <TouchableOpacity style={[{flex : 0.25}, globalStyle.templateIcon]} >
                  <Ionicons name="md-help" size={20} />
                </TouchableOpacity>
              </View>

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