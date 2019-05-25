import React from 'react'
import { Modal, SafeAreaView, TouchableWithoutFeedback, View, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView, Picker, TextInput, Platform} from 'react-native'
import { ListItem, CheckBox, Left, Body, Content, Text, Title, Item, InputGroup, Icon, Input, Button, Container } from 'native-base'
import { globalStyle } from '../../Styles/globalStyle'
import { maturityToDate, calculateBestCoupon } from '../../Utils/math'
import  FLPanel  from '../commons/FLPanel'

import SwipeGesture from '../../Gesture/SwipeGesture'

import { FLSlider } from '../../Components/commons/FLSlider'

import Carousel, { Pagination } from 'react-native-snap-carousel';
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

import Dimensions from 'Dimensions';

import UNDERLYINGS from '../../Data/underlyings.json'
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
      activeOptionsSlide : 0,
      product: {
        'name' : {
          //'value' : productList[0].name,
          'value' : "toto",
          'isActivated' : true,
        },
        'nominal' : {
          'value' : 100000,
          'isActivated' : true,
        },
        'currency': {
          'value' : 'EUR',
          'isActivated' : true,
        },
        'UF' : {
          'value' : 0.02,
          'isActivated' : true,
        },
       'underlying': {
          'value' : '',
          'isActivated' : true,
        },
        'maturity': {
          'valueMin' : 4,
          'valueMax' : 8,
          'value' : '',
          'isActivated' : true,
        },
        'callableCoupon' : {
          'value' : 0.05,
          'isActivated' : false,
        },
        'isCallableCouponIncremental' : {
          'value' : false,
          'isActivated' : false,
        },    
        'callableCouponProgression' : {
          'value' : 0,
          'isActivated' : false,
        }, 
        'callableFrequency' :{
          'value' : 12,
          'commonName': 'an',
          'isActivated' : false,
        }, 
        'callableLevelDegression' :{
          'value' : 0,
          'isActivated' : false,
        }, 
        'callableLevel' : {
          'value' : 1,
          'isActivated' : false,
        }, 
        'firstCallablePeriod' : {
          'value' : 1,
          'isActivated' : false,
        }, 
        'airbag' : {
          'value' : 0.7,
          'isActivated' : false,
        }, 
        'putStrike' : {
          'value' : 1,
          'isActivated' : false,
        }, 
        'putActivationLevel' : {
          'value' : 0.7,
          'isActivated' : false,
        }, 
        'nbPuts' : {
          'value' : 1,
          'isActivated' : false,
        }, 
      },
    }
    this.allPricesDF;
    this.underlyingsList = [];
    this.structuredProductsList = [];
    this.bestProducts = [];
    this.theBestProduct = [];
   
    // var obj = JSON.parse(underlyings);
  var length = Object.keys(UNDERLYINGS).length;
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
      console.log("allo");
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
    return new Promise ((resolve, reject) => {
      let filteredDf =  this.allPricesDF.where(row => maturityToDate(row.maturity) <= maturityToDate('4y'));
      filteredDf =  filteredDf.where(row => row.barrierPDI <= 0.6);

      let serieCoupon = filteredDf.getSeries('coupon');
      let maxCoupon = serieCoupon.max();
      filteredDf = filteredDf.where(row => row.coupon === maxCoupon);

      let seriePrice = filteredDf.getSeries('Price');     
      let minPrice = seriePrice.min();
      filteredDf = filteredDf.where(row => row.Price === minPrice);

      let bestCoupon = calculateBestCoupon(filteredDf.head(1).toArray(), this.allPricesDF);
      console.log("MEILLEUR COUPON : " + bestCoupon);
      
      this.theBestProduct = filteredDf.head(1).toArray();
      this.theBestProduct[0].coupon = bestCoupon;
      console.log(this.theBestProduct);
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
     
      let productName = STRUCTUREDPRODUCTS.filter(({id}) => id === item.product);
      let underlyingName = UNDERLYINGS.filter(({ticker}) => ticker === item.underlying);
      let freqAutocall = FREQUENCYLIST.filter(({ticker}) => ticker === item.freqAutocall);

      return(

      <TouchableOpacity onPress={() => {
              this.props.navigation.navigate('StructuredProductDetail', {
                product: item,
              })
            }
        }>
      <View style={[globalStyle.rectangle, 
                      {flex:1,
                        flexDirection:'column',
                        width: DEVICE_WIDTH*0.94, 
                        height: 100,  
                        marginRight: 0, 
                        marginLeft:0,
                        backgroundColor : 'pink'}]}>
        <View style={{flex:0.75, borderWidth:0}}>
          <View style={{flex:1, flexDirection:'row'}}>
            <View style={{flex:0.8}}>
              <Text style={{fontSize:16, fontWeight:'bold'}}> {productName[0].name} - {underlyingName[0].name}</Text>
              <Text style={{fontSize:14, marginTop:3}}> Seuil de rappel : {Numeral(item.levelAutocall).format('0 %')} / {freqAutocall[0].name}</Text>
              <Text style={{fontSize:14, }}> Protection du capital : {Numeral(1-item.barrierPDI).format('0 %')}</Text>
           </View>
           <View style={{flex:0.2,}}>
             <View style={{flex:1, flexDirection:'column',  justifyContent:'center'}}>
                <View style={{flex:0.3, backgroundColor : '#85B3D3', justifyContent:'center', alignItems:'center', marginTop:3, marginRight:3}}>
                  <Text style={{fontWeight:16, color:'white', fontWeight:'bold'}}>{item.maturity.substring(0,item.maturity.length-1)} an{item.maturity.substring(0,item.maturity.length-1)>1?'s':''}</Text>
                </View>
                <View style={{flex:0.7,  justifyContent:'center', alignItems:'center'}}>
                  <Text style={{fontSize:18, fontWeight:'bold'}}>{Numeral(item.coupon).format('0.00 %')}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{flex:0.25, borderWidth:0, borderTopWidth:0,borderTopColor:'lightgrey',borderTopStyle: 'dashed',}}>
          <View style={{flex:1, flexDirection:'row'}}>
              <View style={{flex:0.2,backgroundColor : 'mistyrose', justifyContent:'center', alignItems:'center', marginTop:3, marginLeft:3, marginBottom:3 }}>
                <Text>{item.currency}</Text>
              </View>
              <View style={{flex:0.2}}>
                <Text></Text>
              </View>
              <View style={{flex:0.2}}>
                <Text></Text>
              </View>
              <View style={{flex:0.2}}>
                <Text></Text>
              </View>
              <View style={{flex:0.2}}>
                <Text></Text>
              </View>
          </View>
        </View>
      </View>
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
                                    {/*<Text>Calculs des structures en cours...</Text>*/}
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

  _displayExpert () {
    //trouve le meilleur prix selon les conditions
    bestPrice = this.theBestProduct;

    let render = this.state.isLoadingTheBestProduct  ?  
         <View style={{flex: 1, alignItems:'center',justifyContent: 'center'}}
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
    return (
      <ScrollView style={[globalStyle.bgColor, 
        {borderWidth: 0,
        marginLeft   : -10,
        marginTop  : -10,
        marginRight: -10,
        marginBottom : -30,
        }]}>
        {render}
        <Button rounded style={{width: DEVICE_WIDTH*0.95, height:35, alignItems: 'center', justifyContent:'center', backgroundColor: 'orange'}}
                        onPress={()=>{
                         this.setState({showModalOptions : true})
                        }}
        >
             <Text style={{fontSize: 20, fontWeight:'bold'}}>CHOISSISSEZ VOS PREFERENCES</Text>
        </Button>
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
  _displayOptions = ({ item , index}) => {
    return (
          <View>
              <Button><Text>
             
             {item.title}
             </Text></Button>
              </View>

    )
  }


  _UFTitle(){
    let title = "VOTRE RETROCESSION";
 
    if (this.state.product['UF'].value !== 0) {
      title = title.concat(" : " + Numeral(this.state.product['UF'].value).format('0.00 %'));
    }

    return (title);
  }
  _maturityTitle(){
    let title = "Maturité : ";
    let ans = " ans";
    if (this.state.product.maturityMax <= 1) {
      ans = " an";
    }
    if (this.state.product.maturityMin < this.state.product.maturityMax) {
      title=title.concat(this.state.product.maturityMin + " à " + this.state.product.maturityMax + ans);
    } else {
      title=title.concat(this.state.product.maturityMax + ans);
    }
    
    return (title);
  }


  _changeProduct = (currentProductIndex) => {
    //console.log(this.setState.product.name)
    var product = this.state.product;
    //product['name']['value'] = productList[currentProductIndex].id;
    this.setState({ product }, () => console.log(this.state));
  }

  ////////////////////////////////////////////
  // CHECK IF MEMORY COUPON
  ////////////////////////////////////////////
  checkIfMemory () {
    return (
      <CheckBox 
        checked={this.state.product['isCallableCouponIncremental'].value} 
        onPress={(value) => {
          var product = this.state.product;
          product['isCallableCouponIncremental'].value = !this.state.product['isCallableCouponIncremental'].value;
          this.setState({ product });
          
        }}
      />
    );
  }

  ////////////////////////////////////////////
  // PICKER CALLABLE FREQUENCY
  ////////////////////////////////////////////
  pickerCallableFrequency () {

    let singularName = this.state.product["callableFrequency"].commonName;
    let pluralName = this.state.product["callableFrequency"].commonName;
    if (pluralName !== "mois") {
      pluralName = pluralName + "s";
    }
    let un = 1;
    let deux = 2;
    let trois = 3;
    let quatre = 4;
    if (this.state.product["callableFrequency"].value === 24){
      un = 2 * un;
      deux = 2 * deux;
      trois = 2 * trois;
      quatre = 2 * quatre;
      singularName = pluralName;<TouchableOpacity onPress={this._onPressButton}></TouchableOpacity>
    }
    return (
      <Picker
      selectedValue={this.state.product['firstCallablePeriod'].value}
      style={{height : 90}} 
      itemStyle={{height : 90, fontSize : 14}} 
      onValueChange={(itemValue, itemIndex) =>{
        var product = this.state.product;
        product['firstCallablePeriod'].value = itemValue;
        this.setState({ product });
      }}
      >
        <Picker.Item  label={un + " "+ singularName} value={1} key={1}/>
        <Picker.Item  label={deux + " "+ pluralName} value={2} key={2}/>
        <Picker.Item  label={trois + " "+ pluralName} value={3} key={3}/>
        <Picker.Item  label={quatre + " "+ pluralName} value={4} key={4}/>
      </Picker>                           
    );
  }

  onSwipePerformed = (action) => {
    console.log("ACTION : "+ action);
    if (action === 'left') {
      this.refs['carouselOptions'].snapToNext();
    }
    if (action === 'right') {
      this.refs['carouselOptions'].snapToPrev();
    }

  }
  get pagination () {
    const { activeOptionsSlide } = this.state;
    return (
        <Pagination
          dotsLength={PARAMETERSSTRUCTUREDPRODUCT.length}
          //activeDotIndex={this.refs['carouselOptions'].currentIndex}
          activeDotIndex={activeOptionsSlide}
          containerStyle={{  backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
          dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.92)'
          }}
          inactiveDotStyle={{
              // Define styles for inactive dots here
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
    );  
  }


  render() {
    let i =0;
    console.log("RENDER");
    return (
      <ScrollView style={[globalStyle.bgColor, {flex: 1}]}>
        <Modal

            animationType="fade"
            transparent={true}
            visible={this.state.showModalOptions}
            onRequestClose={() => {
              console.log('Modal has been closed');
            }
            }>
                <TouchableOpacity 
                  //style={styles.container} 
                  activeOpacity={1} 
                  onPressOut={() => {this.setState({showModalOptions:false})}}
                >
                  <ScrollView 
                    directionalLockEnabled={true} 

                    contentContainerStyle={{
                        backgroundColor: 'white',
                        borderWidth :1,
                        borderRadius:10,
                        borderColor : '#85B3D3',
                        width: DEVICE_WIDTH*0.8,
                        height: DEVICE_HEIGHT*0.6,
                        alignSelf: 'center',
                        //top: DEVICE_HEIGHT*0.15,
                        marginTop:150,
                        
                        //borderRadius: DEVICE_HEIGHT*0.03,
                        alignItems: 'center'
                    }}
                  >
                    <SwipeGesture onSwipePerformed={this.onSwipePerformed.bind(this)}>
                      <View style={{flex:1, width:DEVICE_WIDTH*0.8, borderWidth:1, borderColor:'red'}}>
                      { this.pagination }
                        <Carousel
                            ref={'carouselOptions'}
                            data={PARAMETERSSTRUCTUREDPRODUCT}
                            renderItem={this._displayOptions}
                            sliderWidth={DEVICE_WIDTH*0.75}
                            //sliderHeight={DEVICE_WIDTH*0.3}
                            //itemHeight={35}
                            itemWidth={DEVICE_WIDTH*0.75}
                            firstItem={0}
                            decelerationRate={'fast'}
                            onSnapToItem={(index) => {
                              this.setState({ activeOptionsSlide: index })
                              //const array = this.state.product;
                              //array.callableFrequency = index
                              //this.setState({ product : array });
                              }
                            }
                            removeClippedSubviews={false}
                          />
                      </View>
                    </SwipeGesture>
                  </ScrollView>
                </TouchableOpacity> 
          </Modal>
          <View style={[globalStyle.bgColor, {flex : 1, flexDirection : 'column', marginLeft: 0.0*DEVICE_WIDTH, marginRight: 0.0*DEVICE_WIDTH, borderWidth:0}]}>
         
            <FLPanel 
                title={''} 
                fontSizeTitle={18}
                updateActivatedDesactivated={this.changeStateActivatedDesactivated.bind(this)}
                idComponent={"UF"} 
                hauteur={120} 
                //activated={this.state.product["UF"].isActivated }
                activated={true}
                isDesactivable={false}
                marginTop={0}
                activated={true}
                isExpandable={false}
                customLeftRight={null}
                borderColor={'transparent'}
            >
                <Text style={{fontSize: 14, fontWeight: 'bold', color: 'black', marginBottom: 0}}>
                    {this._UFTitle()}
                </Text>
                <Text style={{fontSize: 12, color: 'black', marginBottom: 0}}>
                    Pour votre association : 0,10%
                </Text>  
                <FLSlider
                    min={0}
                    max={6}
                    step={0.05}
                    initialMin={0}
                    initialMax={this.state.product['UF'].value*100}
                    isPercent={true}
                    spreadScale={1}
                    //activated={!this.state.product["UF"].isActivated}
                    sliderLength={DEVICE_WIDTH*0.9}
                    callback={(value) => {
                      var product = this.state.product;
                      product['UF'].value = value[0].toFixed(2)/100;
                      this.setState({ product, isLoadingBestProduct : true }, () => {
                        this.calculateBestProducts()
                        .then(() => this.setState({isLoadingBestProduct:false}) )
                        .catch((error) => {
                            this.setState({isLoadingBestProduct:false});
                            console.log("ERREUR CALCULATE BEST PRODUCTS : "+error);
                        });
                      });
                      
                    }}
                    single={true}
                  />
 
            </FLPanel>
   
           
              <View style={{flex : 1, flexDirection : 'row', height:35, marginTop:0, width: DEVICE_WIDTH*1.00}}>
                  
                      <TouchableOpacity style={{flex: 0.5,justifyContent:'center' , alignItems:'center', borderWidth:0, 
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
                      
  
                      <TouchableOpacity style={{flex: 0.5, justifyContent:'center' ,alignItems:'center',backgroundColor: this.state.isExpert ?  '#85B3D3': '#DDE0E2'}}
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
              
            </View>

            <View style={[globalStyle.bgColor, {flex : 1, flexDirection : 'column',borderColor:'red', borderWidth:0}]}>
           
              <Carousel
                ref={'carouselExpert'}
                data={screenResultList}
                renderItem={this._displayPricing}
                sliderWidth={DEVICE_WIDTH}
                //sliderHeight={DEVICE_WIDTH*0.3}
                //itemHeight={35}
                itemWidth={DEVICE_WIDTH*0.95}
                firstItem={1}
                //vertical={true}
                decelerationRate={'fast'}
                onSnapToItem={(index) => {
                  //const array = this.state.product;
                  //array.callableFrequency = index
                  //this.setState({ product : array });
                  }
                }
                removeClippedSubviews={false}
      
              />
           
          </View>
          
     </ScrollView>
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