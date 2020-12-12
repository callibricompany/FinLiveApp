import React from "react";
import { Image, ScrollView, Text, View, Animated, StyleSheet, KeyboardAvoidingView, Dimensions, TouchableOpacity, TextInput, StatusBar, Modal, Keyboard, FlatList, ClippingRectangle } from "react-native";
var _ = require('lodash');
import { NavigationActions } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import FLTemplateAutocall2 from "./FLTemplateAutocall2";
import { setFont, setColor , globalStyle  } from '../../../Styles/globalStyle';

import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual, getConstant } from '../../../Utils';
import { interpolateColorFromGradient } from '../../../Utils/color';

import FLAnimatedSVG from '../FLAnimatedSVG';
import StepIndicator from 'react-native-step-indicator';
import Accordion from 'react-native-collapsible/Accordion';

import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';

import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import { CAutocall2 } from '../../../Classes/Products/CAutocall2';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';
import { reprice } from '../../../API/APIAWS';
import { interpolateBestProducts } from '../../../Utils/interpolatePrices';

import Numeral from 'numeral'
import 'numeral/locales/fr'
import Moment from 'moment';
import localization from 'moment/locale/fr'

import logo_white from '../../../assets/LogoWithoutTex_white.png';
import logo from '../../../assets/LogoWithoutText.png';

import * as TEMPLATE_TYPE from '../../../constants/template';
import { CWorkflowTicket } from "../../../Classes/Tickets/CWorkflowTicket";

import { FLIssuer } from "./FLIssuer";
import { FLStrike } from "./FLStrike";
import { FLUF } from "./FLUF";
import { FLCallable } from "./FLCallable";
import { FLCoupons } from "./FLCoupons";
import { FLPDI } from "./FLPDI";




class FLAutocallDetail extends React.Component {
   
  constructor(props) {
    super(props);   

    //recuperation de l'autocall
   // this.autocall =  this.props.navigation.getParam('autocall', '...');
   //this.autocall = this.props.autocall;
   //this.isEditable = typeof this.props.isEditable !== 'undefined' ? this.props.isEditable : true,
   this.autocall =  this.props.navigation.getParam('autocall', '...');
   this.isEditable =  this.props.navigation.getParam('isEditable', true);
    
    this.state = { 

        //gestion du nominal (deja traité ou pas)
        nominal :  this.autocall.getNominal(),
        finalNominal :  this.autocall.getNominal(),
        hideCC : false,

        //gestion du step indicator
        activeSections: [0],
        activeUnderSection : -1,

        //gestion du fondu de l'en tete
        scrollOffset: new Animated.Value(0),

        //gestion des boutons
        showButtonsToTrade : false,
  
        //gestion du clavier
        keyboardHeight: 0,
        isKeyboardVisible: false,
  
        //affchage du modal description avant traiter
        showModalDescription : false,
        description : '',
        isAutomatique : true,
       
        isLoadingCreationTicket : false,
        isLoadingUpdatePrice : false,
        messageUpdatePrice : '',
        toto : true,

    };

    //this.viewabilityConfig = { itemVisiblePercentThreshold: 40 }

    this.props.navigation.setParams({ hideBottomTabBar : true });


    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);

    this._constructMenu();

  }

 _constructMenu() {

    this.descProduct = [];
    this.descProduct.push(
      {
        key : 'ISSUER',
        iconName : 'bank-transfer-out', //'handshake-o',
        iconFamily : 'MaterialCommunityIcons',
        level : 1, 
        title: 'Emission',
        body: ''
      });

      if (!this.state.hideCC) { 
        this.descProduct.push(
          {
            key : 'CC',
            iconName : 'margin',
            iconFamily : 'MaterialCommunityIcons',
            level : 2, 
            title: 'Rémunération',
            body: ''
          });
      }

      this.descProduct.push(
      {
        key : 'PAYOFF',
        iconName : 'calculator',
        iconFamily : 'SimpleLineIcons',
        level : 1, 
        title: 'Payoff',
        body: "Découvrez le comportement de votre produit en fonction de l'évoltion du sous-jacent. "
      });
      this.descProduct.push(
        {
          key : 'STRIKE',
          iconName : 'md-calendar', //'strikethrough',
          iconFamily : 'Ionicons',
          // iconName : 'dot-circle-o',
          // iconFamily : 'FontAwesome',
          level : 2, 
          title: 'Détermination des dates de constations initiales',
          body: ''
        });
      this.descProduct.push(
      {
        key : 'CALLABLE',
        iconName : 'gavel',
        iconFamily : 'MaterialCommunityIcons',
        level : 2, 
        title: 'Rappels du produit',
        body: ''
      });
      
      if (this.autocall.isPhoenix()) {
        this.descProduct.push({
          key : 'COUPON',
          iconName : 'ticket-percent',
          iconFamily : 'MaterialCommunityIcons',
          level : 2, 
          title: 'Coupons',
          body: ''
        });
      }


      this.descProduct.push(
      {
        key : 'CAPITAL',
        iconName : 'shield',
        iconFamily : 'MaterialCommunityIcons',
        level : 1, 
        title: 'Protection du capital',
        body: ''
      });

      this.descProduct.push(
        {
          key : 'EMPTY_SECTION',
          iconName : '',
          iconFamily : '',
          level : 1, 
          title: '',
          body: ''
        });
 
 }


  static navigationOptions = ({ navigation }) => {
    return ({
      header : null,
    }
    );
 }

  async componentDidMount() {
    if (!isAndroid()) {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle(Platform.OS === 'Android' ? 'light-content' : 'dark-content');
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
    });
  }

  //il faut updater l'autocall (fonction de callback du template)
  _updateAutocall=(autocall) => {
      this.autocall = autocall;
      this._constructMenu();
      this.setState({ toto : !this.state.toto }, () => console.log(this.autocall.getProductJSON()));
  }

  //une modif a été faite il faut recalculer
  _updateProduct=(id, value, valueLabel, needToRecalculate=true) => {

    if (needToRecalculate) {
        // let request = new CPSRequest();
        // request.setRequestFromCAutocall(this.autocall);
        console.log(id + "  :  "+value+"  :  "+valueLabel);
        // request.setCriteria(id, value, valueLabel);
        //this.autocallResult = Object.assign(Object.create(Object.getPrototypeOf(this.autocall)), this.autocall);
        
        this.autocallResult = _.cloneDeep(this.autocall);
        switch(id) {
          case 'typeAuction' :
              this.autocallResult.setAuctionType(value);
              break;
          case 'nominal' :
              this.autocallResult.setNominal(value);
              break;
          default : break;
        }

        this.setState({ isLoadingUpdatePrice : true, messageUpdatePrice : 'Raffraichissement du prix indicatif'});
        reprice(this.props.firebase, this.autocallResult.getProductJSON(), this.autocall.getProductJSON())
        .then((data) => {
          //console.log(data);
          console.log("===================================");
          this.autocall = new CAutocall2(data);
          this.setState({isLoadingUpdatePrice : false, messageUpdatePrice : ''});
          
        })
        .catch(error => {
          console.log("ERREUR recupération du  prix: " + error);
          alert('ERREUR calcul des prix', '' + error);
          this.setState({ isLoadingUpdatePrice : false, messageUpdatePrice : ''});
        });
    } else {
      switch(id) {
        case 'UF' :
            this.autocall.setUF(value);
            break;
        case 'UFAssoc' :   
            this.autocall.setUFAssoc(value);
            break;
        case 'issuingDate' : 
            this.autocall.setIssuingDate(value);
          break;
        case 'endIssuingDate' : 
            this.autocall.setEndIssuingDate(value);
          break;
        case 'strikingDate' : 
            this.autocall.setStrikingDate(value);
            break;
            
        default : break;
      }
    }
  }



  //render des sections de la flatlist
  renderPage = rowData => {
    const item = rowData.item;
    let body = null;
    switch(item.key) {
      case 'ISSUER' : 
          body = <FLIssuer  codeAuction={this.autocall.getAuctionType()} 
                            isEditable={this.state.showButtonsToTrade ? false :  this.isEditable} 
                            issueDate={this.autocall.getIssueDate()}
                            endIssueDate={this.autocall.getEndIssueDate()}
                            notionnal={this.autocall.getNominal()}
                            updateProduct={this._updateProduct} 
                            currency={this.autocall.getCurrency()}
                  />;
          break;
      case 'CC' : 
          body = <FLUF      showSlider={this.isEditable} 
                            UF={this.autocall.getUF()}
                            UFAssoc={this.autocall.getUFAssoc()}
                            nominal={this.autocall.getNominal()}
                            currency={this.autocall.getCurrency()}
                            company={this.props.user.getCompany()}
                            updateProduct={this._updateProduct} 
                  />;
          break;
      case 'STRIKE' : 
          body = <FLStrike  isEditable={this.isEditable} 
                            strikedate={this.autocall.getStrikingDate()}
                            updateProduct={this._updateProduct}
                            maximumDate={this.autocall.getIssueDate()}
                            minimumDate={new Date(Date.now())}
                  />;
          break;
      case 'CALLABLE' : 
          body = <FLCallable  autocalldatas = {this.autocall.getAutocallDatas('AUTOCALL')}
                              updateProduct={this._updateProduct} 
                  />;
          break;
      case 'COUPON' : 
          body = <FLCoupons   phoenixDatas = {this.autocall.getAutocallDatas('DIGIT')}
                              isMemory={this.autocall.isMemory()}
                              updateProduct={this._updateProduct} 
                  />;
          break;
      case 'CAPITAL' : 
          body = <FLPDI       barrierPDI = {this.autocall.getBarrierPDI()}
                              isPDIUS={this.autocall.isPDIUS()}
                              updateProduct={this._updateProduct} 
                  />;
          break;  
      case 'EMPTY_SECTION' : 
          body = <View style={{ height: 150}}/>;
          break;         
      default : 
          body = <Text style={{
                    flex: 1,
                    fontSize: 15,
                    color: '#606060',
                    lineHeight: 24,
                  }}>
                    {item.body}
                  </Text>;
          break;
    }

    let icon = <View />;
    switch(item.iconFamily) {
      case 'FontAwesome5' :
        icon = <FontAwesome5 name={item.iconName}  size={item.level === 1 ? 30 : 25} color={'black'}/>;
        break;
      case 'FontAwesome' :
        icon = <FontAwesome name={item.iconName}  size={item.level === 1 ? 30 : 25} color={'black'}/>;
        break;
      case 'Ionicons' :
        icon = <Ionicons name={item.iconName}  size={item.level === 1 ? 30 : 25} color={'black'}/>;
        break;
      case 'SimpleLineIcons' :
          icon = <SimpleLineIcons name={item.iconName}  size={item.level === 1 ? 30 : 25} color={'black'}/>;
          break;   
      case 'MaterialCommunityIcons' :
          icon = <MaterialCommunityIcons name={item.iconName}  size={item.level === 1 ? 30 : 25} color={'black'}/>;
          break;          
          
      default : 
       //icon = <MaterialCommunityIcons name={item.iconName}  size={item.level === 1 ? 30 : 25} color={'black'}/>;
       break;
    }
    return (
      <View style={{flex : 1, paddingBottom : 55}}>
        {item.level === 2
         ?
            <View style={{opacity: this.state.isLoadingUpdatePrice ? 0.2 : 1}}>
                <View style={{flexDirection: 'row', paddingBottom : 10, marginRight : 10}}>
                    <View style={{alignItems: 'flex-start', justifyContent : 'center', borderWidth: 0}}>
                        {icon}
                    </View>
                    <View style={{alignItems: 'flex-start', justifyContent : 'center', paddingLeft : 10}}>
                      <Text style={setFont('600', item.level === 1 ? 24 : 14, setColor('darkBlue'), 'Regular')}>{item.title}</Text>
                    </View>
                </View>
               
                {body}
            </View>
          :           
            <View style={{}}><Text style={[setFont('600', item.level === 1 ? 24 : 14, setColor('darkBlue'), 'Regular'), {paddingBottom: 16}]}>{item.title}</Text>
              {body}
            </View>
        }

      </View>
    );

  }


  //prend en charge le changemet de sections
  onViewableItemsChanged = ({ viewableItems, changed }) => {
    const visibleItemsCount = viewableItems.length;
    

    if (visibleItemsCount != 0) {
      //console.log(changed);
      //console.log(viewableItems);
      let item
      //il faut transformer sur les sections et les sous-sections
      //let flatListIndex = viewableItems[visibleItemsCount - 1].index;
      let flatListIndex = viewableItems[0].index;

      //let indexInMainSections = this.descProduct.filter(({ level }) => level === 1).indexOf(viewableItems[0].item);
      let mainSections = this.descProduct.filter(({ level }) => level === 1);


      let lastLevel_1 = 0;
      let lastLevel_2 = 0;
      let found = false;
      this.descProduct.map((d, index) => {
          if (!found) {
              if (d.level === 1){
                lastLevel_1 = index;
                lastLevel_2 = 0;
              } else {
                lastLevel_2 = index - lastLevel_1;
              }
              if (index === flatListIndex) {
                found = true;
              }
          }
      });
      let indexInMainSections = mainSections.indexOf(this.descProduct[lastLevel_1]);
      //console.log("INDEX : " + indexInMainSections + "   : " +lastLevel_2);
    
      this.setState({ activeSections: [indexInMainSections], activeUnderSection : lastLevel_2 - 1 })
      //this.setState({ activeSections: [viewableItems[visibleItemsCount - 1].index] });
    }
 
  }


  //gestion des icones a gauche (partie 1/2)
  _renderHeaderLeftMenu = (content, index, isActive, sections) => {
    //console.log(content);
    //calcul de l'index equivalent dans flatlist
    let flatListIndex = this.descProduct.indexOf(content);
    if (flatListIndex === -1) { flatListIndex = index }

    let color = interpolateColorFromGradient('Cool Sky', Math.round(100*index/sections.length));
    //let color = setColor('');
    //if (isActive) { color = setColor('darkBlue')}

    //creation de l'icone
    let icon = <View />;
    switch(content.iconFamily) {
      case 'FontAwesome5' :
        icon = <FontAwesome5 name={content.iconName}  size={30} color={isActive ?  'white' : color}/>;
        break;
      case 'FontAwesome' :
        icon = <FontAwesome name={content.iconName}  size={30} color={isActive ?  'white' : color}/>;
        break;
      case 'Ionicons' :
        icon = <Ionicons name={content.iconName}  size={30} color={isActive ?  'white' : color}/>;
        break;
      case 'SimpleLineIcons' :
          icon = <SimpleLineIcons name={content.iconName}  size={30} color={isActive ?  'white' : color}/>;
          break;  
      case 'MaterialCommunityIcons' : 
          icon = <MaterialCommunityIcons name={content.iconName}  size={30} color={isActive ?  'white' : color}/>;
          break;  
      default : 
       break;
    }
    return (
         <TouchableOpacity style={{height : 46, width : 46,   borderWidth : isActive ? 1 : 0, borderRadius : 23,  borderColor : color, alignItems: 'center', justifyContent: 'space-around', backgroundColor : isActive ? color: null}} 
                        onPress={() => {
                          this.setState({ activeSections : [index] });
                          this.flatListRef.scrollToIndex({animated: true, index: flatListIndex});
                        }}                
                  >
                  {icon}
      
        </TouchableOpacity>  
 
    );
  }

  //gestion des icones a chauche (partie 2/2)
  _renderContentLeftMenu = (content, index, isActive, sections) => {
    //console.log(content);
    return null;
    //recuperation des levels 2
    let data = [];
    let flatListIndex = this.descProduct.indexOf(content);
    if (flatListIndex === -1) { 
      return null;
    }



    //console.log("DATA INDEX : "+flatListIndex + "  " + index);
    let endOfLevelFound = false;
    this.descProduct.map((d, index) => {
        if (!endOfLevelFound) {
          if (index > flatListIndex) {
            if (d.level === 1) {
              endOfLevelFound = true;
            } else {
              data.push(d);
            }
          }
        }
        
    });
    //console.log(data);
    let color = interpolateColorFromGradient('Cool Sky', Math.round(100*index/sections.length));
    return (
      <View style={{marginTop : 0}}>
          {data.map((d, i) => {
                //creation de l'icone
              let icon = '';
              let iconColor = i <= this.state.activeUnderSection ?  'white' : color;
              let size = 20;

              //determination de l'index
              let indexInDescProduct = this.descProduct.indexOf(d);
              switch(d.iconFamily) {
                case 'FontAwesome5' :
                  icon = <FontAwesome5 name={d.iconName}  size={size} color={iconColor}/>;
                  break;
                case 'FontAwesome' :
                  icon = <FontAwesome name={d.iconName}  size={size}  color={iconColor}/>;
                  break;
                case 'Ionicons' :
                  icon = <Ionicons name={d.iconName}  size={size}  color={iconColor}/>;
                  break;
                default : 
                icon = <MaterialCommunityIcons name={d.iconName}  size={size}  color={iconColor}/>;
                break;
              }
              return (
                <View style={{justifyContent : 'center', alignItems : 'center'}} key={i}>
                  {
                    i !== data.length 
                    ?
                      <View style={{width : 2, borderWidth : 1,  borderColor : color, height : 20,}} />
                    : null
                  }
                    <TouchableOpacity style={{width : 30, height : 30, borderRadius : 15, justifyContent : 'center', alignItems : 'center', borderWidth :  i <= this.state.activeUnderSection ? 1 : 0, borderColor : color, backgroundColor :  i <= this.state.activeUnderSection ? color : 'transparent'}} 
                              onPress={() => {

                                   this.flatListRef.scrollToIndex({animated: true, index: indexInDescProduct});
                               }}   
                    >
                      {icon}
                    </TouchableOpacity>
                </View>
              )
            })
          }
      </View>
    );

  }



  _renderButtonsTotrade() {

    return (
      <Animated.View  style={{position : 'absolute',top: getConstant('height')-220-this.state.keyboardHeight - (isAndroid() ? 30 : 0), right : 20,  marginLeft : 10, zIndex: 10, backgroundColor:'transparent', transform: [{ translateY: this.state.scrollOffset }]}}>

            <TouchableOpacity style ={{ flexDirection: 'row',  borderWidth : 1, height: 40,  borderColor: setColor('darkblue'), borderRadius: 20, marginLeft : 10, marginRight : 0,  backgroundColor: setColor('darkblue'), marginBottom : 15, justifyContent : 'space-between'}}
                            onPress={() => {
                              this.setState({ showButtonsToTrade : !this.state.showButtonsToTrade });
                              this.props.navigation.navigate('FLAutocallDetailBroadcastPP', {
                                autocall: this.autocall,
                              });
                            }}  
            >
                <View style={{alignItems: 'center', justifyContent: 'center', padding : 5, paddingLeft : 10, paddingRight : 10}}>
                    <Text style={setFont('400', 14, 'white', 'Regular')}>{String('partager').toUpperCase()}</Text>
                </View>
                <View style={{paddingRight : 10, alignItems: 'flex-end', justifyContent: 'center', borderWidth : 0}}>
                    <Ionicons name={"md-share"} size={25} color={'white'} />
                </View>

            </TouchableOpacity>

            <TouchableOpacity style ={{  flexDirection: 'row',  borderWidth : 1, height: 40,  borderColor: setColor('darkblue'), borderRadius: 20, marginLeft : 10, marginRight : 0,  backgroundColor: setColor('darkblue'), justifyContent : 'space-between'}}
                            onPress={() => {
                                if(this.state.nominal === 0) {
                                  alert("Renseigner un nominal avant de demander une cotation");
                                  return;
                                } else if(this.state.nominal < 50000) {
                                    alert("Renseigner un nominal supérieur à 50 000 EUR pour demander une cotation");
                                    return;
                                }
                                this.setState({ showButtonsToTrade : !this.state.showButtonsToTrade });
                                this.props.navigation.navigate('FLAutocallDetailTrade', {
                                  autocall: this.autocall,
                                });
                            }}  
            >
                <View style={{alignItems: 'center', justifyContent: 'center', padding : 5, paddingLeft : 10, paddingRight : 10}}>
                    <Text style={setFont('400', 14, 'white', 'Regular')}>{String('traiter').toUpperCase()}</Text>
                </View>
                <View style={{paddingRight : 10, alignItems: 'flex-end', justifyContent: 'center', borderWidth : 0}}>
                    <MaterialIcons name={"euro-symbol"} size={25} color={'white'} />
                </View>

            </TouchableOpacity>

      </Animated.View>
    );
  }

  _renderButtonTotrade() {


    return (
      <Animated.View style={{position : 'absolute',top: getConstant('height')-110-this.state.keyboardHeight - (isAndroid() ? 30 : 0) , right : 20,  marginLeft : 10, zIndex: 10, backgroundColor:'transparent', transform: [{ translateY: this.state.scrollOffset }]}}>
            <TouchableOpacity style ={{  flexDirection: 'column',  borderWidth : 1, height: 70, width: 70, borderColor: setColor('subscribeBlue'), borderRadius: 35, marginLeft : 10, padding : 10, backgroundColor: setColor('subscribeBlue')}}
                            onPress={() => {
                                this.setState({ showButtonsToTrade : !this.state.showButtonsToTrade });
                            }}  
            >
                <View style={{marginTop: -5, alignItems: 'center', justifyContent: 'center'}}>
                    <Image style={{width: 40, height: 40}} source={logo_white} />
                </View>
                <View style={{marginTop: -2, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={setFont('400', 16, 'white', 'Bold')}>{String('...').toUpperCase()}</Text>
                </View>
            </TouchableOpacity>

      </Animated.View>
    );
  }

  render() {
    let dataOptions = ['Clone', 'Shadow'];
    return (
      <View  style={{ flex: 1, backgroundColor: "white" , opacity: (this.state.showModalDescription) ? 0.3 : (this.state.isLoadingCreationTicket || this.state.isLoadingUpdatePrice) ? 0.2 : 1}} 
                        onStartShouldSetResponder={evt => {
                        //console.log('Tapped outside');
                        
                        this.setState({ showButtonsToTrade : false });
                        // evt.persist();
                        // if (this.childrenIds && this.childrenIds.length) {
                        //   if (this.childrenIds.includes(evt.target)) {
                        //     return;
                        //   }
                        //   console.log('Tapped outside 2');
                        // }
                      }}
      >
         
            {/* <FLAnimatedSVG name={'robotBlink'} visible={this.state.isLoadingCreationTicket} text={String("création d'une demande de cotation").toUpperCase()}/> */}
            <FLAnimatedSVG name={'robotBlink'} visible={this.state.isLoadingUpdatePrice} text={String(this.state.messageUpdatePrice).toUpperCase()}/>
        
            <View style={{ flexDirection : 'row', marginTop : getConstant('statusBar')-(isIphoneX() ? 45 : isAndroid() ? 30 : 20) ,height: 40 + getConstant('statusBar'), width : getConstant('width'), paddingLeft : 10, backgroundColor: setColor(''), paddingTop : isAndroid() ? 10 : isIphoneX() ? 40 : 20, alignItems : 'center', justifyContent: 'space-around', opacity: this.state.isLoadingUpdatePrice ? 0.2 : 1}} >
                            <TouchableOpacity style={{ flex: 0.2, flexDirection : 'row', borderWidth: 0, padding : 5}}
                                                onPress={() => this.props.navigation.goBack()}
                            >
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Ionicons name={'md-arrow-back'}  size={25} style={{color: 'white'}}/>
                                    </View>
                  
                            </TouchableOpacity>
                            <View style={{flex: 0.6, alignItems: 'center', justifyContent: 'center'}} >
                              <Text style={setFont('400', 18, 'white', 'Regular')}>
                                {this.isEditable
                                ? "Nouveau produit"
                                : this.autocall.getProductName() 
                                }
                              </Text>
                            </View>
                            <View style={{flex: 0.2, flexDirection : 'row', justifyContent: 'flex-end', alignItems: 'flex-end', borderWidth: 0, marginRight: 0.05*getConstant('width')}}>
                                    <ModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                    onSelect={(index, value) => {
                                                      if(value === 'Clone') {
                                                          let r = new CPSRequest();
                                                            r.setRequestFromCAutocall(this.autocall);
                                                            this.props.navigation.dispatch(NavigationActions.navigate({
                                                                routeName: 'Pricer',
                                                                action: NavigationActions.navigate({ routeName: 'PricerEvaluate' , params : {request : r}} ),
                                                            }));
                                                      }
                                    }}
                                    onDropdownWillShow={() => this.setState({ showModalDropdown : true })}
                                    onDropdownWillHide={() => this.setState({ showModalDropdown : false })}
                                    adjustFrame={(f) => {
                                      return {
                                        width: getConstant('width')/2,
                                        height: Math.min(getConstant('height')/3, dataOptions.length * 40),
                                        left : f.left,
                                        right : f.right,
                                        top: f.top,
                                        borderWidth : 1,
                                        borderColor : 'gray',
                                        borderRadius : 3
                                      }
                                    }}
                                    renderRow={(option, index, isSelected) => {
                                      switch(option) {
                                        case 'Shadow' :
                                              return (
                                                  <View style={{flexDirection : 'row', height: 40}}>
                                                      <View style={{flex : 0.8, paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                          <Text style={setFont('500', 14, 'black', 'Regular')}>Mode shadow</Text>
                                                      </View>
                                                      <TouchableOpacity style={{paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}
                                                                        onPress={() => {
                                                                          // let optimi = this.state.hideCC ? this.state.optimizer : 'CPN';
                                                                          this.setState({ hideCC : !this.state.hideCC }, () => {
                                                                              this._constructMenu();
                                                                              this.setState({ toto : !this.state.toto });
                                                                          });
                                                                        }}
                                                      >
                                                          <FontAwesome name={this.state.hideCC ? "toggle-on" : "toggle-off"}  size={25} style={{color: 'black'}}/> 
                                                      </TouchableOpacity>
                                                  </View>
                                              );
                                        case 'Clone' :
                                              return (
                                                    <View style={{height: 40, flex : 0.8, paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                        <Text style={setFont('500', 14, 'black', 'Regular')}>Cloner</Text>
                                                    </View>

                                              );
                                        default : 
                                                return (
                                                  <View style={{paddingLeft : 4, paddingRight : 4, height: 40, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                    <Text style={setFont('500', 16, 'gray', 'Regular')}>{option}</Text>
                                                  </View>
                                              );
                                      }
          
                                    }}
                                    //defaultIndex={dataOptions.indexOf(this.autocallResult.getProductTypeName())}
                                    options={dataOptions}
                                    //ref={component => this._dropdown['options'] = component}
                                    disabled={false}
                  >
                      <View style={{ borderWidth : 0, width : 0.1*getConstant('width'),  height: 40, justifyContent: 'center', alignItems: 'center'}}>
                        <MaterialCommunityIcons name={'dots-vertical'} size={30} style={{color: 'white'}}/>
                      </View>
                  </ModalDropdown>
                   
                            </View>
            </View>
            <View style={{  width : getConstant('width'), justifyContent : 'center', alignItems : 'center', marginLeft : 0}}>
                <FLTemplateAutocall2 autocall={this.autocall} templateType={TEMPLATE_TYPE.AUTOCALL_HEADER_MEDIUM_TEMPLATE} isEditable={false/*this.isEditable*/} callbackUpdate={this._updateAutocall} nominal={this.state.finalNominal} screenWidth={1} />
            </View>
            {/* <View style={{  width : getConstant('width'), justifyContent : 'center', alignItems : 'center'}}>
                <FLTemplateAutocall autocall={this.autocall} templateType={TEMPLATE_TYPE.AUTOCALL_DETAIL_FULL_TEMPLATE} isEditable={this.isEditable} source={'Home'} callbackUpdate={this._updateAutocall} nominal={this.state.finalNominal} screenWidth={1} />
            </View> */}
     
        

            <View style={{opacity : this.state.showButtonsToTrade ? 0.3 : 1, flex : 1, flexDirection : 'row', opacity: this.state.isLoadingUpdatePrice ? 0.2 : 1}}>
                <View style={{width : 50,  marginLeft : 0,  zIndex : 10, borderWidth : 0, justifyContent : 'flex-start', alignItems : 'center', backgroundColor : setColor('background')}}>
                      <Accordion
                         
                          sections={this.descProduct.filter(({ level }) => level === 1)}            
                          //underlayColor={'transparent'}
                          activeSections={this.state.activeSections}
                          renderHeader={this._renderHeaderLeftMenu}
                          //renderFooter={this._renderFooterUnderlying}
                          renderContent={this._renderContentLeftMenu}
                          expandMultiple={false}
                          onChange={(activeSections) => {
                              this.setState( { activeSections : activeSections });
                              this.flatListRef.scrollToIndex({animated: true, index: activeSections[0]});
                          }}
                          sectionContainerStyle={{marginTop : 10 }}
                          keyExtractor={item => item.title}
                      />





                </View>
                <View style={{flex : 1, backgroundColor : setColor('background')}}>
                    <View style={{height : 20, backgroundColor : 'white', borderWidth : 1, borderColor: 'white', borderTopLeftRadius : 20}} />
                    <FlatList
                      style={{ flexGrow: 1, backgroundColor : 'white', paddingLeft : 15}}
                      ref={(ref) => { this.flatListRef = ref; }}
                      data={this.descProduct}
                      renderItem={this.renderPage}
                      onViewableItemsChanged={this.onViewableItemsChanged}
                      viewabilityConfig={{ viewAreaCoveragePercentThreshold: 40, minimumViewTime : 500 }}
                      keyExtractor={item => item.key}
                    />

                  </View>
            </View>
            
            {this.state.showButtonsToTrade ? this._renderButtonsTotrade() : null}     
            {(/*this.state.finalNominal === -1 && */this.isEditable) ? this._renderButtonTotrade() : null}
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