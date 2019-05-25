import React from 'react'
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Image, ScrollView, Picker, TextInput, Platform} from 'react-native'
import { ListItem, CheckBox, Left, Body, Content, Text, Title, Item, InputGroup, Icon, Input, Button, Container } from 'native-base'
import { globalStyle } from '../../Styles/globalStyle'
import  FLPanel  from '../commons/FLPanel'

import { FLSlider } from '../../Components/commons/FLSlider'

import Carousel from 'react-native-snap-carousel';
import { TextInputMask } from 'react-native-masked-text'
import Numeral from 'numeral'
import 'numeral/locales/fr'

import { VictoryBar, VictoryChart, VictoryTheme, VictoryGroup, VictoryStack} from 'victory-native'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import { UserContext } from '../../Session/UserProvider';
import FLSearchInput from '../commons/FLSearchInput';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import { FLBadge } from '../commons/FLBadge'
import botImage from '../../assets/bot.png'
import helpImage from '../../assets/help.png'

import Dimensions from 'Dimensions';

import underlyings from '../../Data/underlyings.json'



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;


const data = [
  {année: 1, coupon: 3},
  {année: 2, coupon: 6},
  {année: 3, coupon: 9},
  {année: 4, coupon: 12}
];

const getBarData = () => {
  return [1, 2, 3, 4, 5].map(() => {
    return [
      { x: 1, y: Math.random() },
      { x: 2, y: Math.random() },
      { x: 3, y: Math.random() }
    ];
  });
};

const productList = [
  {
    name: 'Autocall',
    class: 'FIN',
    id: 'classicAutocall'
  },
  {
   // name: { title: 'mrs', first: 'asuncion', last: 'gomez' },
   name: 'Autocall\nairbag',
   class: 'FIN',
   id: 'airbagAutocall'
  },
  {
    name: 'Phoenix',
    class: 'FIN',
    id: 'classicPhoenix'
  },
  {
    name: 'Phoenix\nmémoire',
    class: 'FIN',
    id: 'memoryPhoenix'
  },
  {
    name: 'Reverse\nconvertible',
    class: 'FIN',
    id: 'reverse'
  },
]

const frequencyList = [
  {
    name: 'Mensuel',
    commonName : 'mois',
    freq: 1,
  },
  {
    name: 'Trimestriel',
    commonName : 'trimestre',
    freq: 3,
  },
  {
    name: 'Semestriel',
    commonName : 'semestre',
    freq: 6,
  },
  {
    name: 'Annuel',
    commonName : 'an',
    freq: 12,
  },
  {
    name: 'Biannuel',
    commonName : 'an',
    freq: 24,
  },
]

class PricerScreen extends React.Component {

  constructor(props) {
    super(props);
    Numeral.locale('fr');
    this.state = {
 
      product: {
        'name' : {
          'value' : productList[0].name,
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
          'isActivated' : false,
        },
        'maturity': {
          'valueMin' : 4,
          'valueMax' : 8,
          'value' : '',
          'isActivated' : false,
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


   
   
    // var obj = JSON.parse(underlyings);
  var length = Object.keys(underlyings).length;
  console.log(length);
  //console.log("ACTIVATED.UF : "+this.activated["UF"])
  }


  static navigationOptions = ({ navigation }) => {
    return {
    header: (
      <SafeAreaView style={globalStyle.header_safeviewarea}>
        <View style={globalStyle.header_left_view} />
        <View style={globalStyle.header_center_view_leftAlign} >
          <Title style={globalStyle.header_left_text_medium}>Nouveau produit</Title>
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
  


  //update props to identiy compoent activated or desactivated
  changeStateActivatedDesactivated = (activated, componentId) => {
    var product = this.state.product;
    product[componentId].isActivated = activated;
    this.setState({ product });
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

  _UFTitle(){
    let title = "Rétrocession";
 
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
    product['name']['value'] = productList[currentProductIndex].id;
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
      singularName = pluralName;
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


  render() {
    let i =0;
    return (
      <ScrollView style={[globalStyle.bgColor, {flex: 1}]}>
          <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*DEVICE_WIDTH, marginRight: 0.05*DEVICE_WIDTH, borderWidth:0}}>
 
 
            <View style={{alignItems:'center'}}> 
              <Icon name="md-arrow-dropdown"  style={{color : "#85B3D3"}}/>
              <Carousel
                ref={(c) => { this._carousel = c; }}
                data={productList}
                renderItem={this._displayProductList}
                sliderWidth={DEVICE_WIDTH}
                itemWidth={100}
                onSnapToItem={this._changeProduct}
              />
              <Icon name="md-arrow-dropup"  style={{color : "#85B3D3"}}/>
            </View>
 
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.6, justifyContent: 'center', borderRadius: 20, borderWidth:1, borderColor: '#85B3D3', height:35, paddingRight:5, paddingLeft: 5}}>
                    <TextInput
                      style={{height: 33, borderColor: 'gray', borderWidth: 1}}
                      onChangeText={text => {
                        var product = this.state.product;
                        if (typeof text === 'null') {
                          text = 0;
                        }
                        product['nominal']['value'] = Numeral(text).value();
                        this.setState({ product });
                      }}
                      style={{  backgroundColor: 'white', textAlign: 'right' , fontSize:22}}
                      returnKeyType={ "done" }
                      blurOnSubmit={ true }
                      keyboardType='number-pad'
                      placeholder={this.state.product['currency'].value}
                      value={this.state.product['nominal'].value === 0 ? '' : Numeral(this.state.product['nominal'].value).format('0,0[.]00 $')}
                    />
              </View> 
              <View style={{flex: 0.4, marginLeft : 0.05*DEVICE_WIDTH}}>
                  <Button rounded style={{height:35, alignItems: 'center', justifyContent:'center', backgroundColor: '#188D2D'}}>
                      <Icon name="md-arrow-dropright"  style={{color : "#FFF"}}/>
                      <Text>Optimiser</Text>
                  </Button>
              </View>
            </View>


           
            <FLPanel 
                title={this._UFTitle()} 
                updateActivatedDesactivated={this.changeStateActivatedDesactivated.bind(this)}
                idComponent={"UF"} 
                hauteur={130} 
                activated={this.state.product["UF"].isActivated }
                isExpandable={true}
                marginTop={20}
            >
              <View>
                <FLSlider
                    min={0}
                    max={6}
                    step={0.05}
                    initialMin={0}
                    initialMax={this.state.product['UF'].value*100}
                    isPercent={true}
                    spreadScale={1}
                    //activated={!this.state.product["UF"].isActivated}
                    sliderLength={DEVICE_WIDTH*0.8}
                    callback={(value) => {
                      var product = this.state.product;
                      product['UF'].value = value[0].toFixed(2)/100;
                      this.setState({ product });
                    }}
                    single={true}
                  />
                  <Text style={{color: 'black', marginBottom: 80}}>
                    Votre commission sur ce produit : {Numeral(this.state.product['nominal'].value*this.state.product['UF'].value).format('0,0')} {this.state.product['currency'].value}
                    {'\n'}
                    Pour votre association : 
                  </Text>
                </View>
            </FLPanel>
           


   
            <FLPanel 
                title="COUPONS AUTOCALL" 
                activated={this.state.product["callableCoupon"].isActivated}
                hauteur={400} 
                style={{paddingBottom:0}}
                updateActivatedDesactivated={this.changeStateActivatedDesactivated.bind(this)}
                idComponent={"callableCoupon"} 
                marginTop={20}
            >
               <Text style={{fontWeight: 'bold'}}>Coupon de rappel : {Numeral(this.state.product['callableCoupon'].value).format('0.00 %')}</Text>
              <FLSlider
                  min={0}
                  max={10}
                  step={0.1}
                  initialMin={0}
                  initialMax={this.state.product['callableCoupon'].value*100}
                  isPercent={true}
                  spreadScale={2}
                  //activated={!this.state.product["callableCoupon"].isActivated}
                  sliderLength={DEVICE_WIDTH*0.8}
                  callback={(value) => {
                    var product = this.state.product;
                    product['callableCoupon'].value = value[0].toFixed(2)/100;
                    this.setState({ product });
                  }}
                  single={true}
                />  

              <Text style={{fontWeight: 'bold'}}>Seuil de rappel: {Numeral(this.state.product['callableLevel'].value).format('0.00 %')}</Text>
              <FLSlider
                  min={80}
                  max={110}
                  step={1}
                  initialMin={80}
                  initialMax={this.state.product['callableLevel'].value*100}
                  isPercent={true}
                  spreadScale={5}
                  sliderLength={DEVICE_WIDTH*0.8}
                  //activated={!this.state.product["callableCoupon"].isActivated}
                  callback={(value) => {
                    var product = this.state.product;
                    product['callableLevel'].value = value[0].toFixed(2)/100;
                    this.setState({ product });
                  }}
                  single={true}
                />  

                <FLPanel 
                  title={"Fréquence rappel"} 
                  updateActivatedDesactivated={this.changeStateActivatedDesactivated.bind(this)}
                  idComponent={"callableFrequency"} 
                  hauteur={150} 
                  activated={this.state.product["callableFrequency"].isActivated && this.state.product["callableCoupon"].isActivated}
                  isExpandable={false}
                  fontSizeTitle={16}
                  marginRight={0}
                >
                 <View style={{flex: 1, flexDirection :'row', borderBottomWidth:0, justifyContent:'center'}}>
                      <View style={{flex: 0.5 ,height:100, marginRight: 5, borderBottomtWidth: 0}}>
                        <Picker
                            selectedValue={this.state.product['callableFrequency'].value}
                            style={{height : 90}} 
                            itemStyle={{height : 90, fontSize : 14}} 
                            onValueChange={(itemValue, itemIndex) =>{
                              var product = this.state.product;
                              product['callableFrequency'].value = frequencyList[itemIndex].freq;
                              product['callableFrequency'].commonName = frequencyList[itemIndex].commonName;
                              this.setState({ product });
                            }}
                            >
                            {
                                frequencyList.map((item) =>{
                                  return(
                                  <Picker.Item  label={item.name} value={item.freq} key={item.freq}/>
                                  );
                                })
                            }
                          </Picker>
                        </View>
                        <View style={{
                                  flex: 0.5 ,
                                  height:100,
                                  borderLeftWidth : this.state.product["callableFrequency"].isActivated && this.state.product["callableCoupon"].isActivated ? 1 : 0, 
                                  borderLeftColor :'#85B3D3'
                        }}>
                            <Text style={{textAlign: 'center', fontWeight:'bold', fontSize: 14}}>1er rappel à :</Text>
                            <View style={{borderWidth:0, flex:1, marginLeft: 5}}>
                               {this.pickerCallableFrequency()} 
                            </View>
                        </View>
                      </View>
                  </FLPanel>


                  <FLPanel 
                      title={"Dégressivité du seuil de rappel"} 
                      updateActivatedDesactivated={this.changeStateActivatedDesactivated.bind(this)}
                      idComponent={"callableLevelDegression"} 
                      hauteur={50} 
                      activated={this.state.product["callableLevelDegression"].isActivated && this.state.product["callableCoupon"].isActivated}
                      isExpandable={true}
                      fontSizeTitle={16}
                      marginTop={15}
                    >
                        <View style={{flex: 1, flexDirection :'row', borderBottomWidth:0, justifyContent:'center'}}>
                          <View style={{flex: 0.5 ,height:100, marginRight: 5, borderBottomtWidth: 0}}>
                            <Picker
                              selectedValue={this.state.product['callableLevelDegression'].value}
                              style={{height : 90}} 
                              itemStyle={{height : 90, fontSize : 14}} 
                              onValueChange={(itemValue, itemIndex) =>{
                                var product = this.state.product;
                                product['callableLevelDegression'].value = itemValue;
                                this.setState({ product });
                              }}
                              >
                                <Picker.Item  label={"O,5% par "+this.state.product["callableFrequency"].commonName} value={0.5} key={0.5}/>
                                <Picker.Item  label={"1% par "+this.state.product["callableFrequency"].commonName} value={1} key={1}/>
                                <Picker.Item  label={"2% par "+this.state.product["callableFrequency"].commonName} value={2} key={2}/>
                                <Picker.Item  label={"3% par "+this.state.product["callableFrequency"].commonName} value={3} key={3}/>
                                <Picker.Item  label={"4% par "+this.state.product["callableFrequency"].commonName} value={4} key={4}/>
                                <Picker.Item  label={"5% par "+this.state.product["callableFrequency"].commonName} value={5} key={5}/>
                                    
                            </Picker>
                            </View>
                            <View style={{
                                      flex: 0.5 ,
                                      height:100,
                                      borderLeftWidth : this.state.product["callableLevelDegression"].isActivated && this.state.product["callableCoupon"].isActivated ? 1 : 0, 
                                      borderLeftColor :'#85B3D3'
                            }}>
      
                            </View>
                          </View>
                      </FLPanel>
 
            </FLPanel>
            

            <Text>Votre choix : {this.state.product['name'].value}</Text>  
            <Button rounded style={{backgroundColor: '#85B3D3'}}>
              <Text>JE VEUX TRAITER</Text>
            </Button>
            <VictoryChart height={200} width={350} theme={VictoryTheme.material}>
                    <VictoryBar data={data} x="année" y="coupon" />
                </VictoryChart>      

          </View>
     </ScrollView>
    );
  }
}



function segmentUnderlyingStyle (position, totalNumber, active) {
  let bgColor = "transparent"
  let borderTopLeftRadius = 0;
  let borderBottomLeftRadius = 0;
  let borderTopRightRadius = 0;
  let borderBottomRightRadius = 0;
  let borderLeftWidth=0;
  
  if (active) {
      bgColor = '#85B3D3';
  }
  if (position === 1) {
    borderTopLeftRadius = 10;
    borderBottomLeftRadius = 10;
    borderLeftWidth=1;
  }
  if (position === totalNumber) {
    borderTopRightRadius = 10;
    borderBottomRightRadius = 10;
  }
  return {
      backgroundColor: bgColor,
      borderColor: '#85B3D3',
      //alignItems: 'center',
      borderLeftWidth: borderLeftWidth,
      borderRadius: 0,
      borderTopLeftRadius: borderTopLeftRadius,
      borderBottomLeftRadius: borderBottomLeftRadius,
      borderTopRightRadius: borderTopRightRadius,
      borderBottomRightRadius:borderBottomRightRadius,
    //  overflow:'hidden',
   //   borderWidth: borderWidth,
    //  borderColor: '#85B3D3'

  }
}




const condition = authUser => !!authUser;


const composedPricerScreen = compose(
 withAuthorization(condition),
  withNavigation,
);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(PricerScreen);


//<UserContext.Consumer>
//{value => <Label>{value.searchInputText}</Label>}
//</UserContext.Consumer> 