import React from 'react'
import { Modal, SafeAreaView, TouchableWithoutFeedback, Text,View, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView, Picker, StatusBar, Platform} from 'react-native'
import { ListItem, List, Left, Body, Content,  Title, Item, Right, Icon, Input, Button, Thumbnail } from 'native-base'
import { globalStyle } from '../../Styles/globalStyle'
import { maturityToDate, calculateBestCoupon } from '../../Utils/math'
import  FLPanel  from '../commons/FLPanel'
import FLProductTicket from '../commons/FLProductTicket'

import SwipeGesture from '../../Gesture/SwipeGesture'


import { FLSlider } from '../../Components/commons/FLSlider'
import { FLSlider2 } from '../../Components/commons/FLSlider2'

import Carousel, { Pagination } from 'react-native-snap-carousel';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { TextInputMask } from 'react-native-masked-text'
import Numeral from 'numeral'
import 'numeral/locales/fr'

import { VictoryBar, VictoryChart, VictoryTheme, VictoryGroup, VictoryStack} from 'victory-native'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import { UserContext } from '../../Session/UserProvider';
import FLSearchInput from '../commons/FLSearchInput';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withFirebase } from '../../Database';
import { compose, hoistStatics } from 'recompose';

import { FLBadge } from '../commons/FLBadge'
import botImage from '../../assets/bot.png'
import helpImage from '../../assets/help.png'
import calculateImage from '../../assets/calculate.png'
import productTicketImage from '../../assets/productTicket.jpg'
import FontAwesomeI from 'react-native-vector-icons/FontAwesome'

import Dimensions from 'Dimensions';

import UNDERLYINGS from '../../Data/subCategories.json'
import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json'
import FREQUENCYLIST from '../../Data/frequencyList.json'
import PARAMETERSSTRUCTUREDPRODUCT from '../../Data/optionsPricingPS.json'

const dataForge = require('data-forge');



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;



const screenResultList = [
  {
    name: 'Meilleurs résultats',
    id: 'bestResults'
  },
  {
   name: 'Avancé',
   id: 'expert'
  },
]

class PricerScreen extends React.Component {

  constructor(props) {
    super(props);
    Numeral.locale('fr');
    this.state = {
      expertMode: false,
      isLoadingBestProduct : true,
      isLoadingTheBestProduct : true,
      showModalOptions : false,
      isExpertPricable: false,
      activeOptionsSlide : 0,
      isRecalculationNeeded : false,
      product: {
        'type' : {
          'value' : 'classicAutocall',
          'valueLabel' : 'Autocall',
          'isActivated' : false,
          'icon': 'TP'
        },
        'nominal' : {
          'value' : 100000,
          'isActivated' : true,
          'icon': 'N'
        },
        'currency': {
          'value' : 'EUR',
          'isActivated' : true,
          'icon': 'T'
        },
        'UF' : {
          'value' : 0.02,
          'isActivated' : true,
          'icon': 'UF'
        },
       'underlying': {
          'value' : 'CAC',
          'valueLabel' : 'CAC 40',
          'isActivated' : false,
          'icon': 'SJ'
        },
        'maturity': {
          'valueMin' : 6,
          'valueMax' : 10,
          'value' : '',
          'valueLabel' : '6 à 10 ans',
          'isActivated' : true,
          'icon': 'M'
        },
        'barrierPDI' : {
          'value' : 0.3,
          'isActivated' : false,
          'valueLabel' : Numeral(0.3).format('0.00 %'),
          'icon': 'PDI'
        },
        'freqAutocall' : {
          'value' : 0.5,
          'isActivated' : false,
          'icon': 'FA'
        },
        'degressiveStep' : {
          'value' : 0.5,
          'isActivated' : false,
          'icon': 'DS'
        }, 
        'airbagLevel' : {
          'value' : 0.5,
          'isActivated' : false,
          'icon': 'EA'
        },
        'barrierPhoenix' : {
          'value' : 0.5,
          'isActivated' : false,
          'icon': 'BP'
        },
        'freqPhoenix' : {
          'value' : 0.5,
          'isActivated' : false,
          'icon': 'FP'
        },
        

      },
    }
    
    this.allPricesDF;
    this.underlyingsList = [];
    this.structuredProductsList = [];
    this.bestProducts = [];
    this.theBestProduct = [];

    this.desactivatedParameters = [];
    this.desactivatedParameterSelected = {};
   
    // var obj = JSON.parse(underlyings);
    var length = Object.keys(UNDERLYINGS).length;

   //this.activatedParameters = PARAMETERSSTRUCTUREDPRODUCT.filter(d => d.activated);

 
   //this.desactivatedParameters = PARAMETERSSTRUCTUREDPRODUCT.filter(d => !d.activated);
   
  //console.log(STRUCTUREDPRODUCTS.filter(({name}) => name === 'classicAutocall'));
  //console.log("ACTIVATED.UF : "+this.activated["UF"])
  }


  static navigationOptions = ({ navigation }) => {
    return {
    header: (
      <SafeAreaView style={globalStyle.header_safeviewarea}>
        <View style={globalStyle.header_left_view} />
        <View style={globalStyle.header_center_view_leftAlign} >
          <Title style={globalStyle.header_left_text_medium}>Produit structuré</Title>
        </View>
        <View style={[globalStyle.header_right_view_x2, {flexDirection:'row'}]} >
          <View style={{flex:0.5}}>
           <Image style={{width: 47, height: 47}} source={helpImage} />
          </View>
          <View style={{flex:0.5}}>
            <Image style={{width: 40, height: 40}} source={botImage} />
          </View>
        </View>
      </SafeAreaView>
    ),
    tabBarVisible: false,
    }
  }


  //apres chargement du composant
   async componentDidMount() {
    //chargements de tous les prix
    //extraction des sous-jacents et des produits distincts
    console.log("DEBUT COMPONENT DIDMOUNT");
    this.props.firebase.getAllLastPrices()
    .then((prices) => {
      //console.log("allo");
      this.allPricesDF = dataForge.fromJSON(JSON.stringify(prices));
      
      //console.log("Nombre de produits analysés : "+this.allPricesDF.toArray().length);
      
  
  
      //retrouve tous les sous jacents distincts
      const distinctUnderlyings = this.allPricesDF.getSeries('underlying').distinct();
      distinctUnderlyings.forEach(value => {
        let obj = UNDERLYINGS.filter(({ticker}) => ticker === value);
        this.underlyingsList.push(obj);
      }); 
      console.log("LISTE DES SOUS-JACENTS : "+ JSON.stringify(this.underlyingsList));


       //retrouve tous les produits distincts
       const distinctStructuredProducts = this.allPricesDF.getSeries('product').distinct();
       distinctStructuredProducts.forEach(value => {
         let obj = STRUCTUREDPRODUCTS.filter(({id}) => id === value);
         this.structuredProductsList.push(obj);
       }); 
       console.log("LISTE DES PRODUITS : "+ JSON.stringify(this.structuredProductsList));
       
       this.calculateBestProducts()
       .then((message) => {
         console.log("MESSAGE DE CALCULATE BEST PRODUCTS : " +message);
         this.setState({ isLoadingBestProduct: false});
       })
       .catch((error) =>{
          console.log(error);
       });
       
       this.calculateTheBestProduct()
       .then((message) => {
         console.log("MESSAGE DE CALCULATE THE BEST PRODUCT : " +message);
         this.setState({ isLoadingTheBestProduct: false});
       })
       .catch((error) =>{
          console.log(error);
       });
      
       
    })
    .catch((error) => {
      console.log("ERREUR RECUPERATION TOUS LES PRIX : " + error);
      this.setState({isLoadingTheBestProduct: false, isLoadingBestProduct: false});
    })
    .finally(() => {
      
    });

  }
  


  //caclue les meilleurs produits de tous les sous-jacents
  calculateBestProducts () {
    //on filtre tous les prix ne correspondant pas à la marge
    return new Promise ((resolve, reject) => {
      //console.log("DF GLOBAL : "+this.allPricesDF.toArray().length);
      var df = new dataForge.DataFrame();
      var filteredDf = this.allPricesDF.where(row => row.Price < -this.state.product['UF'].value);
      //console.log(filteredDf.head(3).toString());
      //console.log("DF FILTRE PRIX UNDER UF : "+filteredDf.toArray().length);
      //on passe sur chaque sous jacent
      this.underlyingsList.forEach((underlying) => {
        var filteredDfUnderlying = filteredDf.where(row => row.underlying === underlying[0]['ticker']);
        //console.log("SOUS-JACENT : " +  underlying[0]['ticker'] + "   :  "+filteredDfUnderlying.toArray().length);
        //on passe sur tous les produits
        this.structuredProductsList.forEach((product) => {
          //console.log(product[0]['id']);
          var filteredDfProduct = filteredDfUnderlying.where(row => row.product === product[0]['id']);
          
          var serieCoupon = filteredDfProduct.getSeries('coupon');
          let maxCoupon = serieCoupon.max();
          var dfTemp = filteredDfProduct.where(row => row.coupon === maxCoupon);

          var seriePrice = dfTemp.getSeries('Price'); 
          let minPrice = seriePrice.min();    
          df=df.concat(dfTemp.where(row => row.Price === minPrice));
        })
      });
      this.bestProducts = df.toArray();
      setTimeout(() => {
        console.log('on attend le best product');
        this.bestProducts.length === 0 ? reject('Aucun produit trouvé') : resolve("ok");
       }, 200);
      //this.bestProducts.length === 0 ? reject('Aucun produit trouvé') : resolve("ok");
    });
  }

   //caclue le meilleur  produit
   calculateTheBestProduct () {
    //on filtre tous les prix ne correspondant pas à la marge
    this.theBestProduct = [];
    return new Promise ((resolve, reject) => {
      
      //let filteredDf =  this.allPricesDF.where(row => maturityToDate(row.maturity) <= maturityToDate('4y'));
      // premier filtre prix inferieurs aux marges 
      console.log("UF : " + this.state.product['UF'].value );
      let filteredDf =  this.allPricesDF.where(row => row.Price <= -(this.state.product['UF'].value + 0.001));

      if (this.state.product['barrierPDI'].isActivated) {
        filteredDf =  filteredDf.where(row => row.barrierPDI <= (1 - this.state.product['barrierPDI'].value));
      }

      //on verifie et filtre eventuellement la mturite (il faut au moins en garder 2 pour interpoler)

      //type choisi si activé
      if (this.state.product['type'].isActivated) {
        filteredDf =  filteredDf.where(row => row.product === this.state.product['type'].value);
      }

      //sous-jacent
      if (this.state.product['underlying'].isActivated) {
        filteredDf =  filteredDf.where(row => row.underlying === this.state.product['underlying'].value);
      }

      //maturite
      if (this.state.product['maturity'].isActivated) {
        let matMin = new Date(Date.now() + this.state.product['maturity'].valueMin * 365.25 * 86400 * 1000);
        let matMax = new Date(Date.now() + this.state.product['maturity'].valueMax * 365.25 * 86400 * 1000);
        filteredDf =  filteredDf.where(row => maturityToDate(row.maturity) >= matMin);
        filteredDf =  filteredDf.where(row => maturityToDate(row.maturity) <= matMax);

      }

      let seriePrice = filteredDf.getSeries('Price');     
      let minPrice = seriePrice.min();
      console.log("MIN PRICE : " + minPrice);
      filteredDf = filteredDf.where(row => row.Price === minPrice);
      console.log("APRES MIN PRICE : " + filteredDf.toArray().length);
      console.log("A VOIR  : " + filteredDf.head(1).toString());


      let bestCoupon = calculateBestCoupon(filteredDf.head(1).toArray(), this.allPricesDF, this.state.product['UF'].value + 0.001);
      console.log("MEILLEUR COUPON : " + bestCoupon);
      
      //copie de l'array 
      this.theBestProduct = JSON.parse(JSON.stringify(filteredDf.head(1).toArray()));
      this.theBestProduct[0].coupon = bestCoupon;
      //console.log(this.theBestProduct);
      setTimeout(() => {
            console.log('on attend');
        this.theBestProduct.length === 0 ? reject('Aucun produit trouvé') : resolve("ok");
      }, 200);
    });
  }

  //update props to identiy compoent activated or desactivated
  changeStateActivatedDesactivated = (activated, componentId) => {
    var product = this.state.product;
    //product[componentId].isActivated = activated;
    //this.setState({ product });
  }

  _handleUnderlyingActive(ticker) {
    const array = this.state.product;
    array.underlying = ticker;
    this.setState({ product : array });
    //console.log(this.state.product);
  }


  _displayProductList = ({ item }) => {
    return (
     <View style={{flex:1, justifyContent : 'center', alignItems: 'center', borderWidth:0}}>
        <Text style={{fontSize:20, textAlign: 'center'}}>{item.name}</Text>
    </View>
    )
  }

  _displayFrequencyList = ({ item , index}) => {
    return (
     <View style={{justifyContent : 'center', alignItems: 'center', width:70}}>
        <Text style={{fontSize:14}}>{item.name}</Text>
    </View>
    )
  }

  _renderBestProduct=({item, index}) => {
     



      return(

      <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('StructuredProductDetail', {
                product: item,
                UF : this.state.product['UF'].value
              })
            }
        }>
        <FLProductTicket item={item} />
      </TouchableOpacity>
      );
  }

  //analyse les meileeures offres
  // par sous jacents et par produits
  _displayBestResult () {

    prices = this.bestProducts;
    let render = this.state.isLoadingBestProduct  ?  
            
                                    <View style={{flex: 1, alignItems:'center',justifyContent: 'center'}}
                                      ><ActivityIndicator size="large" color="#85B3D3" />
                                    <Text>Calculs des structures en cours...</Text>
                                     </View>
                                    :
                                    prices.length === 0 ? <Text>Vous avez été trop gourmand !</Text>
                                    :
                                    <FlatList
                                    data={prices}
                                    //extraData={prices}
                                    keyExtractor={(item) => item.code}
                                    renderItem={this._renderBestProduct}
                                  />
    return (
      <ScrollView style={[globalStyle.bgColor, 
                          {borderWidth: 0,
                          marginLeft   : -10,
                          marginTop  : -10,
                          marginRight: -10,
                          marginBottom : -30,
                          }]}>
          {render}
      </ScrollView>
    );
  }

  //affiche l'onglet expert
  _displayExpert () {
    //trouve le meilleur prix selon les conditions
    bestPrice = this.theBestProduct;

    let render = this.state.isRecalculationNeeded ? 
                  <View   >
                  <Image style={{width: DEVICE_WIDTH, height: 100}} source={productTicketImage} blurRadius={10}/>
                      <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        position: 'absolute', 
                          borderWidth:0,
                          borderColor:'black',
                          alignItems:'center',
                          justifyContent:'center',
                          width:60,                                     
                          bottom: 20,                                                    
                          right: 0.95*DEVICE_WIDTH/2 -30,
                          height:60,
                          backgroundColor:'#85B3D3',
                          borderRadius:30,
                        }}
                        onPress={()=>{
                          console.log("Recalcul lancé");
                          this.setState({ 
                            isLoadingTheBestProduct: true,
                            isRecalculationNeeded : false
                          },
                              () => {
                                    this.calculateTheBestProduct()
                                    .then((message) => {
                                      console.log("MESSAGE DE CALCULATE THE BEST PRODUCT : " +message);
                                      this.setState({ isLoadingTheBestProduct: false});
                                    })
                                    .catch((error) =>{
                                      console.log(error);
                                    });
                                  });       
                        }}
                    >
                      <FontAwesomeI name="caret-square-o-right"  size={30} color="white" />
                    </TouchableOpacity>
                    </View>
                  :
                      this.state.isLoadingTheBestProduct  ?  
                    
                     <View style={{width: DEVICE_WIDTH, height: 100, alignItems:'center',justifyContent: 'center'}}
                      ><ActivityIndicator size="large" color="#85B3D3" />
                      </View>
                    :
                    bestPrice.length === 0 ? <Text>Aucun produit disponible selon ces critères</Text>
                    :
                    <FlatList
                    data={bestPrice}
                    //extraData={prices}
                    keyExtractor={(item) => item.code}
                    renderItem={this._renderBestProduct}
                  />
    
    var activatedParameters = [];
    var product = this.state.product;
    
    PARAMETERSSTRUCTUREDPRODUCT.forEach(item => {
      if (product[item.name].isActivated){
        let param = product[item.name];
        param['name'] = item.name;
        param['label'] = item.title;
        activatedParameters.push(param);
      } 

    }); 
    //let activatedParameters = product.filter(d => d.isActivated);
    //console.log("PARAMETRES ACTIFS : "+JSON.stringify(activatedParameters));
    //console.log("PARAMETRES ACTIFS : "+activatedParameters.length);
    let renderParameters =          
          <View style={{width: DEVICE_WIDTH, marginBottom:10}}>
            {activatedParameters.map((choosenParameter) => {
                        
                         return (
                          <TouchableOpacity onPress={() => {
                            //var product = this.state.product;
                            this.desactivatedParameters = [];
                            PARAMETERSSTRUCTUREDPRODUCT.forEach(item => {
                               if (item.name === choosenParameter.name){
                                 this.desactivatedParameters.push(item);
                                 this.desactivatedParameterSelected = item;
                               }
                             });
                             this.setState({showModalOptions:true});

                          }}
                          key = {(item => TimeRanges.code)}>
                              <View key={choosenParameter.name} style={[globalStyle.rectangle, 
                                {flex:1,
                                  flexDirection:'row',
                                  width: DEVICE_WIDTH*0.94, 
                                  height: 50,  
                                  marginRight: 0, 
                                  marginLeft:0,
                                  backgroundColor : 'white'}]}>
                          
                                  <View style={{flex:0.15, justifyContent:'center', alignItems: 'center'}}>
                                  <View style={{ height:30, width:30, backgroundColor:'#85B3D3' ,alignSelf:'center',justifyContent:'center', alignItems:'center', borderRadius:30}}>
                                    {/*<Thumbnail source={botImage} />*/}
                                      <Text style={{fontSize:18, fontWeight:'bold',color:'white'}}>{choosenParameter.icon}</Text>
                                  </View>
                                  </View>
                              
                                  <View style={{flex:0.65}}>
                                      <View style={{marginTop:3, marginLeft : 10}}>
                                        <Text style={{fontWeight:'bold'}}>{choosenParameter.label}</Text>
                                        <Text>{choosenParameter.valueLabel}</Text>
                                      </View>
                                  </View>
                                  <View style={{flex:0.2,justifyContent: 'center',alignItems:'center'}}>
                      
                                        <Text style={{ color : "gray"}}>o o o</Text>
              
                                  </View>
                              </View>
                           </TouchableOpacity>
                         );
                   
            })}
          </View>

    return (
      <ScrollView style={[globalStyle.bgColor, 
        {borderWidth: 0,
        marginLeft   : -10,
        marginTop  : 0,
        marginRight: -10,
        marginBottom : -30,
        }]}>
        {render}
        {renderParameters}

      </ScrollView>

    );
  }

  //affiche les oglets du carousel pricing
  _displayPricing = ({ item , index}) => {
    return (
          <View style={[globalStyle.bgColor, {justifyContent:'center', borderWidth:0}]}>
          <FLPanel 
              title={''} 
              fontSizeTitle={18}
              updateActivatedDesactivated={this.changeStateActivatedDesactivated.bind(this)}
              idComponent={item.id}
              hauteur={DEVICE_HEIGHT-270} 
              activated={true}
              isDesactivable={false}
              isExpandable={false}
              marginTop={0}
              customLeftRight={null}
              borderColor={'transparent'}
          >
             
              {index === 0 ? this._displayBestResult() : this._displayExpert()}
            
          </FLPanel>
          </View>
    )
  }

  //affiche les oglets du carousel des options
  _displayParameters = ({ item , index}) => {  
    return (
              <ScrollView style={{ margin:7}} scrollEnabled={this.state.showModalOptions}>
              <TouchableWithoutFeedback>
                <View>
                  <View style={{marginTop:7}}>
                    <Text style={{fontWeight:'bold'}}>{item.description[0].short_description}</Text>
                    <Text>{item.description[0].long_description}</Text>
                  </View>
                  <View style={{marginTop:7}}>
                    <Text style={{fontWeight:'bold'}}>{item.description[1].short_description}</Text>
                    <Text>{item.description[1].long_description}</Text>
                  </View>
                  <View style={{marginTop:7}}>
                    <Text style={{fontWeight:'bold'}}>{item.description[2].short_description}</Text>
                    <Text>{item.description[2].long_description}</Text>
                  </View>
                  <View style={{marginTop:7}}>
                    <Text style={{fontWeight:'bold'}}>{item.description[3].short_description}</Text>
                  </View>
                  </View>
                </TouchableWithoutFeedback>
               </ScrollView>


    )
  }

  //affiche le titre de la retrocession
  _UFTitle(){
    let title = "VOTRE RETROCESSION";
 
    if (this.state.product['UF'].value !== 0) {
      title = title.concat(" : " + Numeral(this.state.product['UF'].value).format('0.00 %'));
    }

    return (title);
  }



  onSwipePerformed = (action) => {
    console.log("ACTION : "+ action);
    if (action === 'left') {
      //this.refs['carouselOptions'].snapToNext();
    }
    if (action === 'right') {
      //this.refs['carouselOptions'].snapToPrev();
    }
    if (action === 'tap') {
     // console.log('taptap');
    }

  }

  //permet de choisir les parametres optionnels pour le pricing
  modalParameterChoice = () => {
    let render =<Text></Text>;
    let buttonLeft=<Text></Text>;
    let buttonRight=<Text></Text>;

    if(this.desactivatedParameterSelected.length !== 0) {
      //console.log(this.desactivatedParameterSelected.name);
      
      this.desactivatedParameters.forEach((item, index) => {
        //console.log(item.title + "   -   "+index);
        if (this.desactivatedParameterSelected === item) {
          switch (item.name) {
            case 'type' :
                render= <RadioForm
                          formHorizontal={false}
                          animation={true}
                        >
                          {this.structuredProductsList.map((product, i) => {
                            //on met les clés adequate pour le radiogroup
                            pString = JSON.stringify(product);
                            var regValue = /id/gi;
                            var regLabel = /name/gi;
                            pString = pString.replace(regValue, 'value');
                            pString = pString.replace(regLabel, 'label');
                            product = JSON.parse(pString);
                            return (
                            <RadioButton labelHorizontal={true} key={i} >
                              {/*  You can set RadioButtonLabel before RadioButtonInput */}
                              <RadioButtonInput
                                obj={product[0]}
                                index={i}
                                isSelected={this.state.product['type'].value=== product[0].value}
                                onPress={(itemValue) =>{
                                  //console.log("ITEM VALUE : "+itemValue);
                                  let label = STRUCTUREDPRODUCTS.filter(d => d.id === itemValue);
                                  var product = this.state.product;
                                  product['type'].value = itemValue;
                                  product['type'].valueLabel = label[0].name;
                                  this.setState({ product : product, isRecalculationNeeded : true});
                                }}
                                borderWidth={1}
                                //buttonInnerColor={'#e74c3c'}
                                //buttonOuterColor={this.state.value3Index === i ? '#2196f3' : '#000'}
                                //buttonSize={40}
                                //buttonOuterSize={80}
                                buttonStyle={{}}
                                //buttonWrapStyle={{marginLeft: 10}}
                              />
                              <RadioButtonLabel
                                obj={product[0]}
                                index={i}
                                labelHorizontal={true}
                                onPress={() => console.log()}
                                //labelStyle={{fontSize: 20, color: '#2ecc71'}}
                                labelWrapStyle={{}}
                              />
                              </RadioButton>
                            );
                          })}                  
                        </RadioForm> 
                break;  
            case 'underlying' :
              render= <RadioForm
              formHorizontal={false}
              animation={true}
            >
              {this.underlyingsList.map((product, i) => {
                //on met les clés adequate pour le radiogroup
                pString = JSON.stringify(product);
                var regValue = /ticker/gi;
                var regLabel = /name/gi;
                pString = pString.replace(regValue, 'value');
                pString = pString.replace(regLabel, 'label');
                product = JSON.parse(pString);
                return (
                <RadioButton labelHorizontal={true} key={i} >
                  {/*  You can set RadioButtonLabel before RadioButtonInput */}
                  <RadioButtonInput
                    obj={product[0]}
                    index={i}
                    isSelected={this.state.product['underlying'].value=== product[0].value}
                    onPress={(itemValue) =>{
                      //console.log("ITEM VALUE : "+itemValue);
                      let label = UNDERLYINGS.filter(d => d.ticker === itemValue);
                      var product = this.state.product;
                      product['underlying'].value = itemValue;
                      product['underlying'].valueLabel = label[0].name;
                      this.setState({ product : product, isRecalculationNeeded : true});
                    }}
                    borderWidth={1}
                    //buttonInnerColor={'#e74c3c'}
                    //buttonOuterColor={this.state.value3Index === i ? '#2196f3' : '#000'}
                    //buttonSize={40}
                    //buttonOuterSize={80}
                    buttonStyle={{}}
                    //buttonWrapStyle={{marginLeft: 10}}
                  />
                  <RadioButtonLabel
                    obj={product[0]}
                    index={i}
                    labelHorizontal={true}
                    //onPress={onPress}
                    //labelStyle={{fontSize: 20, color: '#2ecc71'}}
                    labelWrapStyle={{}}
                  />
                  </RadioButton>
                );
              })}                  
            </RadioForm> 
          break;
        case 'maturity' :
            render=  
            <View>
            <FLSlider
                min={2}
                max={10}
                step={1}
                initialMin={this.state.product['maturity'].valueMin}
                initialMax={this.state.product['maturity'].valueMax}
                isPercent={false}
                spreadScale={1}
                //activated={!this.state.product["UF"].isActivated}
                sliderLength={DEVICE_WIDTH*0.65}
                callback={(value) => {
                  var product = this.state.product;
                  product['maturity'].valueMin = value[0];
                  product['maturity'].valueMax = value[1];

                  let title = "";
                  let ans = " ans";
                  if (this.state.product.maturityMax <= 1) {
                    ans = " an";
                  }
                  if (product['maturity'].valueMin < product['maturity'].valueMax) {
                    title=title.concat(product['maturity'].valueMin + " à " + product['maturity'].valueMax + ans);
                  } else {
                    title=title.concat(product['maturity'].valueMax + ans);
                  }
                  product['maturity'].valueLabel = title;

                  this.setState({ product : product, isRecalculationNeeded : true});
                }}
                single={false}
              />
              <View style={{margin: 10,justifyContent:'center', alignItems:'center', alignSelf:'center', borderWidth: 1}}>
                <Text style={{fontWeight:'bold'}}>{this.state.product['maturity'].valueLabel}</Text>
              </View>
              </View>
            break;
        case 'barrierPDI' :
            render=  
            <View>
            <FLSlider
                min={10}
                max={50}
                step={5}
                initialMin={0}
                initialMax={this.state.product['barrierPDI'].value*100}
                isPercent={true}
                spreadScale={10}
                //activated={!this.state.product["UF"].isActivated}
                sliderLength={DEVICE_WIDTH*0.7}
                callback={(value) => {
                  var product = this.state.product;
                  product['barrierPDI'].value = value[0]/100;
                  product['barrierPDI'].valueLabel = Numeral(value[0]/100).format('0.00 %');
                  this.setState({ product : product, isRecalculationNeeded : true});
                }}
                single={true}
              />
               <View style={{margin: 10,justifyContent:'center', alignItems:'center', alignSelf:'center', borderWidth: 1}}>
                <Text style={{textAlign: 'center', fontWeight:'bold'}}>Capital protégé jusqu'à une baisse de {this.state.product['barrierPDI'].valueLabel}</Text>
              </View>
              </View>
            break;
        default :
          break;
            }
        }
      })
    }
    return (
      <View style={{margin : 10}}>
         {render}
      </View>
    );
  }

  //boutons de navigation sur fenetre modal de choix de parametres
  modalNavigation = () => {
    let render =<Text></Text>;
    let buttonLeft=<Text></Text>;
    let buttonRight=<Text></Text>;

    if(this.desactivatedParameterSelected.length !== 0) {
      //console.log(this.desactivatedParameterSelected.name);
      
      this.desactivatedParameters.forEach((item, index) => {
        //console.log(item.title + "   -   "+index);
        if (this.desactivatedParameterSelected === item) {
          let parameter = this.state.product[item.name];
          let isActivated = false;
          if (typeof parameter !== 'undefined') {
            //console.log("PArametre defini" + JSON.stringify(parameter));
            isActivated = parameter.isActivated;
          }

          if (index !== 0){
            buttonLeft =  <TouchableOpacity onPress={() => this.refs['carouselOptions'].snapToPrev()}>
                             <Icon name="md-arrow-dropleft-circle"  style={{color : "#85B3D3"}}/>
                          </TouchableOpacity>
          }

          if (index !== this.desactivatedParameters.length-1){
            buttonRight = <TouchableOpacity onPress={() => this.refs['carouselOptions'].snapToNext()}>
                            <Icon name="md-arrow-dropright-circle"  style={{color : "#85B3D3"}}/>
                          </TouchableOpacity>
          }
          render=  <View style={{flex:1, borderWidth:0, flexDirection:'row', justifyContent:'center', alignItems:'center',marginTop:2, marginBottom:2}}>
                      <View style={{flex: 0.2, borderWidth:0, alignItems:'center',justifyContent:'center'}}>
                        {buttonLeft}
                      </View>
                      <View style={{flex: 0.6, borderWidth:0,alignItems:'center',justifyContent:'center'}}>
                        <Button 
                            //disabled={this.state.product['type'].isActivated}
                            style={{backgroundColor: !isActivated ? '#85B3D3' : 'lightgrey',alignSelf:'center',alignItems:'center',justifyContent:'center'}}
                            onPress={() => {
                              //console.log("Item name : "+ item.name);
                              var product = this.state.product;
                              product[item.name].isActivated = !product[item.name].isActivated;
                              this.setState({ product });
                        }}>
                          <Text style={{color: !isActivated ? 'white' : 'darkgrey'}}>{!isActivated ? 'ACTIVER' : 'DESACTIVER'}</Text>
                        </Button>
                      </View>
                      <View style={{flex: 0.2, alignItems:'center',justifyContent:'center'}}>
                          {buttonRight}             
                      </View>
                </View>    
        }
      })
    }
    return (
      <View style={{flex:1, }}>
         {render}
      </View>
    );
  }

  render() {

    let renderFABOptions = this.state.isExpert ?
                              <TouchableOpacity
                                  activeOpacity={0.7}
                                  style={{
                                    position: 'absolute', 
                                      borderWidth:0,
                                      borderColor:'black',
                                      alignItems:'center',
                                      justifyContent:'center',
                                      width:60,                                     
                                      bottom: 120,                                                    
                                      right: 20,
                                      height:60,
                                      backgroundColor:'#85B3D3',
                                      borderRadius:30,
                                    }}
                                    onPress={()=>{
                                      var product = this.state.product;
                                      this.desactivatedParameters = [];
                                      PARAMETERSSTRUCTUREDPRODUCT.forEach(item => {
                                        if (!product[item.name].isActivated){
                                          this.desactivatedParameters.push(item);
                                        }
                                        if (this.desactivatedParameters.length !== 0 ) {
                                          this.desactivatedParameterSelected = this.desactivatedParameters[0];
                                        }
                                      });
                                    this.setState({showModalOptions : true})
                                    }}
                                >
                                  <FontAwesomeI name="edit"  size={30} color="white" />
                                </TouchableOpacity>
                                :
                                <Text></Text>


    return (
      <View style={[globalStyle.bgColor, {flex: 1}]} >
    
  
      


        <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showModalOptions}
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
                    let verifY = y < DEVICE_HEIGHT*0.15  || y > DEVICE_HEIGHT*0.85 ? true : false;
                    if (verifX || verifY) {
                      this.setState({showModalOptions : false})
                    }

                  }}
    
                >
                  <View 
                    //directionalLockEnabled={true} 
                    //contentContainerStyle={{
                      style={{
                        backgroundColor: 'white',
                        borderWidth :1,
                        borderRadius:10,
                        borderColor : '#85B3D3',
                        width: DEVICE_WIDTH*0.8,
                        height: DEVICE_HEIGHT*0.7,
                        alignSelf: 'center',
                        //top: DEVICE_HEIGHT*0.15,
                        marginTop:DEVICE_HEIGHT*0.15,                       
                        //borderRadius: DEVICE_HEIGHT*0.03,
                        alignItems: 'center'
                    }}
                  >
                      <View style={{flex:1, width: DEVICE_WIDTH*0.8, flexDirection:'column', backgroundColor:'transparent'}}>
                        <View style={{flex:0.1 , flexDirection: 'row',justifyContent: 'center',alignItems: 'center',borderBottomWidth:1, borderBottomColor: '#85B3D3'}}>
                            <View style={{flex : 0.9, justifyContent: 'center',alignItems: 'center'}}>
                                  <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                                  {this.desactivatedParameterSelected.title}
                                  </Text>
                            </View>
                            <View  style={{flex : 0.1}}>
                               <TouchableOpacity onPress={() => this.setState({showModalOptions : false})}>
                                  <Icon name="md-close"  style={{color : "#85B3D3"}}/>
                              </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flex:0.75 }}>    
                            {this.modalParameterChoice()}
          
                     
                          <Carousel
                              ref={'carouselOptions'}
                              data={this.desactivatedParameters}
                              renderItem={this._displayParameters}
                              sliderWidth={DEVICE_WIDTH*0.8}
                              sliderHeight={50}
                              //itemHeight={35}
                              itemWidth={DEVICE_WIDTH*0.8}
                              firstItem={0}
                              decelerationRate={'fast'}
                              onSnapToItem={(index) => {
                                this.desactivatedParameterSelected = this.desactivatedParameters[index];
                                this.setState({ activeOptionsSlide: index })
                                //const array = this.state.product;
                                //array.callableFrequency = index
                                //this.setState({ product : array });
                                }
                              }
                              removeClippedSubviews={false}
                            />
    
                          </View>
                          <View style={{flex:0.05 }}>
                              <View style={{flex:1, flexDirection:'row', justifyContent:'space-evenly'}}>
                              {this.desactivatedParameters.map((param, index) => {
                                   let plot = 'o';
                                   if(this.desactivatedParameterSelected.length !== 0) { 
                                      if (this.desactivatedParameterSelected === param) {
                                        plot = 'O';
                                      }
                                   }
                                   if (this.desactivatedParameters.length === 1) {
                                     plot='';
                                   }
                                    return (
                                        <Text  key={index}>{plot}</Text>
                                    );
                                })}
                              </View>
                          </View>
                        <View style={{flex:0.1 , borderTopWidth:1, borderTopColor: '#85B3D3'}}>
                              {this.modalNavigation()}
                        </View>
                      </View>
                  </View>
                </View> 

          </Modal>
          <View style={[globalStyle.bgColor, {flexDirection : 'column', marginLeft: 0.0*DEVICE_WIDTH, marginRight: 0.0*DEVICE_WIDTH, borderWidth:0}]}>
         
                  <FLPanel 
                      title={this._UFTitle()} 
                      title2={'Pour votre association : 0,10%'}
                      fontSizeTitle={14}
                      updateActivatedDesactivated={this.changeStateActivatedDesactivated.bind(this)}
                      idComponent={"UF"} 
                      hauteur={60} 
                      //activated={this.state.product["UF"].isActivated }
                      activated={true}
                      expanded={true}
                      isDesactivable={false}
                      marginTop={0}
                      activated={true}
                      isExpandable={true}
                      customLeftRight={null}
                      borderColor={'transparent'}
                  >

                                
                      <FLSlider2
                          min={0}
                          max={6}
                          step={0.05}
                          value={this.state.product['UF'].value*100}
                          isPercent={true}
                          spreadScale={1}
                          //activated={!this.state.product["UF"].isActivated}
                          sliderLength={DEVICE_WIDTH*0.9}
                          callback={(value) => {
                            var product = this.state.product;
                            product['UF'].value = value.toFixed(2)/100;
                            this.setState({ product, isLoadingBestProduct : true }, () => {
                              this.calculateBestProducts()
                              .then(() => this.setState({isLoadingBestProduct:false, isRecalculationNeeded : true}) )
                              .catch((error) => {
                                  this.setState({isLoadingBestProduct:false});
                                  console.log("ERREUR CALCULATE BEST PRODUCTS : "+error);
                              });
                            });
                            
                          }}
                          single={true}
                        />
                        {/*} <Slider
                            
                            minimumValue={0}
                            maximumValue={6}
                            step={0.05}
                            value={this.state.product['UF'].value*100}
                            minimumTrackTintColor={'green'}

                            onSlidingComplete={(value) => {
                              console.log("VALUE SLIDER : "+value);
                              var product = this.state.product;
                              product['UF'].value = value.toFixed(2)/100;
                              
                              this.setState({ product, isLoadingBestProduct : true }, () => {
                                this.calculateBestProducts()
                                .then(() => this.setState({isLoadingBestProduct:false, isRecalculationNeeded : true}) )
                                .catch((error) => {
                                    this.setState({isLoadingBestProduct:false});
                                    console.log("ERREUR CALCULATE BEST PRODUCTS : "+error);
                                });
                              });
                              
                            }}
       
                          />*/}
  
      
                  </FLPanel>
        
                
                    <View style={{ borderWidth:0,flexDirection : 'row', marginTop:0, width: DEVICE_WIDTH*1.00}}>
                        
                            <TouchableOpacity style={{flex: 0.5,height:30,justifyContent:'center' , alignItems:'center', borderWidth:0, 
                                          backgroundColor: this.state.isExpert ? '#DDE0E2' : '#85B3D3'}}
                                          onPress={() => {  
                                            this.setState({isExpert : false},
                                              () => this.refs['carouselExpert'].snapToPrev())
                                          }
                              }>
                              <Text style={{
                                      fontSize: 16, 
                                      color : this.state.isExpert ? 'darkgrey' : 'white',
                                      //color:  this.refs['carouselExpert'].currentIndex === 0 ? '#85B3D3': '#DDE0E2',
                                      fontWeight: !this.state.isExpert ? 'bold' : 'normal',
                                    }}>
                                  Meilleures offres
                              </Text>
                            </TouchableOpacity>
                            
        
                            <TouchableOpacity style={{flex: 0.5, height:30, justifyContent:'center' ,alignItems:'center',backgroundColor: this.state.isExpert ?  '#85B3D3': '#DDE0E2'}}
                                              onPress={() => {    
                                            this.setState({isExpert : true},
                                              () => this.refs['carouselExpert'].snapToNext());
                                          }
                              }>
                              <Text style={{
                                      fontSize: 16, 
                                      color : this.state.isExpert ? 'white' : 'darkgrey',
                                      //color:  this.refs['carouselExpert'].currentIndex === 0 ? '#85B3D3': '#DDE0E2',
                                      fontWeight: this.state.isExpert ? 'bold' : 'normal',
                                    }}>
                                  Avancé
                              </Text>
                            </TouchableOpacity>
                    </View>
              
           
                    <Carousel
                      ref={'carouselExpert'}
                      data={screenResultList}
                      renderItem={this._displayPricing}
                      sliderWidth={DEVICE_WIDTH}
                      //sliderHeight={DEVICE_WIDTH*0.3}
                      //itemHeight={35}
                      itemWidth={DEVICE_WIDTH*0.95}
                      firstItem={0}
                      //vertical={true}
                      decelerationRate={'fast'}
                      onSnapToItem={(index) => {
                          index === 1 ? this.setState({isExpert : true}) : this.setState({isExpert : false});
                        }
                      }
                      removeClippedSubviews={false}
            
                    />

                    {renderFABOptions}
     
           
          </View>
          
     </View>
    );
  }
}







const condition = authUser => !!authUser;


const composedPricerScreen = compose(
 withAuthorization(condition),
  withFirebase,
  withNavigation,
);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(PricerScreen);


//<UserContext.Consumer>
//{value => <Label>{value.searchInputText}</Label>}
//</UserContext.Consumer> 
