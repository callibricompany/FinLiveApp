import React from 'react'
import { SafeAreaView, View, TouchableOpacity, Image, ScrollView, FlatList, TextInput, Platform} from 'react-native'
import { Segment, Right, Left, Body, Content, Text, Title, Item, InputGroup, Icon, Input, Button, Container } from 'native-base'
import { globalStyle } from '../../Styles/globalStyle'
import  FLPanel  from '../commons/FLPanel'

import { FLSlider } from '../../Components/commons/FLSlider'

import Carousel from 'react-native-snap-carousel';
import { TextInputMask } from 'react-native-masked-text'
import Numeral from 'numeral'
import 'numeral/locales/fr'

import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native'
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import { UserContext } from '../../Session/UserProvider';
import FLSearchInput from '../commons/FLSearchInput';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import { FLBadge } from '../commons/FLBadge'
import botImage from '../../assets/bot.png'

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


const productList = [
  {
    name: 'Autocall',
    class: 'FIN',
    underlying : '',
    maturity: '',
    callable :''
  },
  {
   // name: { title: 'mrs', first: 'asuncion', last: 'gomez' },
   name: 'Phoenix',
   class: 'FIN',
  },
  {
    name: 'Reverse',
    class: 'FIN',
  },
  {
    name: 'Yeti',
    class: 'FIN',
  },
]

const frequencyList = [
  {
    name: 'Mensuel',
    identifiant: 'monthly',
  },
  {
    name: 'Trimestriel',
    identifiant: 'quaterly',
  },
  {
    name: 'Semestriel',
    identifiant: 'half',
  },
  {
    name: 'Annuel',
    identifiant: 'annual',
  },
  {
    name: 'Biannuel',
    identifiant: '2years',
  },
]

class PricerScreen extends React.Component {

  constructor(props) {
    super(props);
    Numeral.locale('fr');
    this.state = {
      currency: 'EUR',
      currentProductIndex: 0,
      UF: 0.02,
      product: {
        nominal: 0,
        underlying: 'SOUS-JACENT',
        maturityMin: 4,
        maturityMax : 8, 
        callableCoupon: 0,
        isCallableCouponIncremental : false,
        callableCouponProgression: 1,
        putStrike : 100,
        putActivationLevel : 60,
        nbPuts : 1, 
        callableFrequency: 1 ,
        callableLevel : 1, //en pourcent
        firstObservation : 1 // en frequence
      }
    }
   // var obj = JSON.parse(underlyings);
    var length = Object.keys(underlyings).length;
    console.log(length);
  }


  static navigationOptions = ({ navigation }) => {
    return {
    header: (
      <SafeAreaView style={globalStyle.header_safeviewarea}>
        <View style={globalStyle.header_left_view} />
        <View style={globalStyle.header_center_view_leftAlign} >
          <Title style={globalStyle.header_left_text_medium}>Nouveau produit</Title>
        </View>
        <View style={globalStyle.header_right_view} >
            <Image style={{width: 40, height: 40}} source={botImage} />
        </View>
      </SafeAreaView>
    ),
    tabBarVisible: false,
    }
  }
  

  _handleUnderlyingActive(ticker) {
    const array = this.state.product;
    array.underlying = ticker;
    this.setState({ product : array });
    //console.log(this.state.product);
  }


  _displayProductList = ({ item }) => {
    return (
     <View style={{justifyContent : 'center', alignItems: 'center', width: DEVICE_WIDTH*0.2}}>
        <Text style={{fontSize:20}}>{item.name}</Text>
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
 
    if (this.state.UF !== 0) {
      title = title.concat(" : " + Numeral(this.state.UF).format('0.00 %'));
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


  changeIndex = (currentProductIndex) => {
    this.setState({ currentProductIndex });
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
                itemWidth={90}
                onSnapToItem={this.changeIndex}
              />
              <Icon name="md-arrow-dropup"  style={{color : "#85B3D3"}}/>
            </View>
            
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.6, justifyContent: 'center', borderRadius: 20, borderWidth:1, borderColor: '#85B3D3', height:35, paddingRight:5, paddingLeft: 5}}>
                  <TextInput
                    style={{height: 33, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={text => {
                      const array = this.state.product;
                      array.nominal = Numeral(text).value();
                      this.setState({ product : array });
                    }}
                    style={{  backgroundColor: 'white', textAlign: 'right' , fontSize:22}}
                    returnKeyType={ "done" }
                    blurOnSubmit={ true }
                    keyboardType='number-pad'
                    placeholder={this.state.currency}
                    value={this.state.product.nominal === 0 ? '' : Numeral(this.state.product.nominal).format('0,0[.]00 $')}
                  />
      

              </View>
              <View style={{flex: 0.4, marginLeft : 0.05*DEVICE_WIDTH}}>
                <Button rounded style={{height:35, alignSelf: 'center', backgroundColor: '#188D2D'}}>
                    <Icon name="md-arrow-dropright"  style={{color : "#FFF"}}/>
                    <Text>Optimiser</Text>
                </Button>
              </View>
            </View>
             <View>

   
                    <FLPanel title={this._UFTitle()} hauteur={130} activated={true}>
                      <View>
                        <FLSlider
                            min={0}
                            max={6}
                            step={0.05}
                            initialMin={0}
                            initialMax={this.state.UF*100}
                            isPercent={true}
                            spreadScale={1}
                            sliderLength={DEVICE_WIDTH*0.8}
                            callback={(value) => {
                              //console.log(value);
                              this.setState({ UF : value[0].toFixed(2)/100 });
                            }}
                            single={true}
                          />
                          <Text style={{color: 'black', marginBottom: 80}}>
                            Votre commission sur ce produit : {Numeral(this.state.product.nominal*this.state.UF).format('0,0')} {this.state.currency}
                            {'\n'}
                            Pour votre association : 
                          </Text>
                        </View>
                    </FLPanel>
                    
                    <FLPanel title="Rappels" activated={true} hauteur={600} style={{paddingBottom:200}}>
                      <Text>Coupon minimum :</Text>
                      <FLSlider
                          min={0}
                          max={6}
                          step={0.05}
                          initialMin={0}
                          initialMax={2}
                          isPercent={true}
                          spreadScale={1}
                          sliderLength={DEVICE_WIDTH*0.8}
                          callback={(value) => {
                            //console.log(value);
                            this.setState({ UF : value[0].toFixed(2)/100 });
                          }}
                          single={true}
                        />  
                        
                        <View style={{flexDirection:'column', height: DEVICE_WIDTH*0.8,justifyContent:'center', alignItems: 'center'}}>     
                            <View style={{flex: 0.5, flexDirection :'row', borderBottomWidth:1, justifyContent:'center'}}>
                              <View style={{flex: 0.5 , borderRightWidth: 1}}>
                                <Text>Fréquence de rappel : </Text>
                                <View style={{flexDirection:'row', borderWidth:1,justifyContent:'center'}}>
                                    <View style={{borderWidth:1, justifyContent:'center', marginRight:5}}>
                                      <Icon name="md-arrow-dropright"  style={{color : "#85B3D3"}}/>
                                      </View>
                                      <View style={{borderWidth:1, marginTop:10, justifyContent:'center'}}>
                                      <Carousel
                                        ref={'carouselFrequency'}
                                        data={frequencyList}
                                        renderItem={this._displayFrequencyList}
                                        sliderWidth={DEVICE_WIDTH*0.2}
                                        sliderHeight={DEVICE_WIDTH*0.3}
                                        itemHeight={35}
                                        itemWidth={DEVICE_WIDTH*0.2}
                                        firstItem={3}
                                        vertical={true}
                                        decelerationRate={'fast'}
                                        onSnapToItem={(index) => {
                                          const array = this.state.product;
                                          array.callableFrequency = index
                                          this.setState({ product : array });
                                         }
                                        }
                                        removeClippedSubviews={false}
                             
                                      />
                                      </View>
                                      <View style={{borderWidth:1, justifyContent:'center', marginLeft:5}}>
                                      <Icon name="md-arrow-dropleft"  style={{color : "#85B3D3"}}/>
                                      </View>
                                </View>
                              </View>
                              <View style={{flex: 0.5 }}>
                                <Text>Coupon incrémental</Text>
                              </View>
                            </View>
                            <View style={{flex: 0.5, flexDirection :'row', justifyContent:'center'}}>
                              <View style={{flex: 0.5 , borderRightWidth: 1}}>
                                <Text>Date 1er rappel</Text>
                              </View>
                              <View style={{flex: 0.5 }}>
                                <Text>Airbag</Text>
                              </View>
                            </View>
                        </View>
                        <VictoryChart height={200} width={350} theme={VictoryTheme.material}>
                            <VictoryBar data={data} x="année" y="coupon" />
                        </VictoryChart>
                    </FLPanel>
              

                    <FLPanel title={this.state.product.underlying} activated={false}>
                      <Body>
                        <Segment style={{backgroundColor: 'transparent'}}>
                          {underlyings.map((underlying) => {
                                i=i+1;
                                //console.log("i : " +i);
                                return (
                                    <Button   style={segmentUnderlyingStyle(i,Object.keys(underlyings).length,this.state.product.underlying === underlying.name)} 
                                              key={underlying.ticker} 
                                              active={this.state.product.underlying === underlying.name}  
                                              onPress={this._handleUnderlyingActive.bind(this,underlying.name)}
                                    >
                                      <Text style={{color: this.state.product.underlying !== underlying.name ? "#85B3D3" : "white"}}>
                                        {underlying.name}
                                      </Text>
                                    </Button>
                                );
                            })
                          }
                      </Segment>
                      </Body>
                    </FLPanel>
                    <FLPanel title={this._maturityTitle()} hauteur={80} activated={false}>
                      <FLSlider
                          min={0}
                          max={10}
                          step={0.5}
                          initialMin={4}
                          initialMax={8}
                          spreadScale={1}
                          isPercent={false}
                          sliderLength={DEVICE_WIDTH*0.8}
                          callback={(values) => {
                            const array = this.state.product;
                            array.maturityMin = values[0];
                            array.maturityMax = values[1];
                            this.setState({ product : array });
                          }}
                          single={false}
                        />
                        <Text style={{color: 'silver', marginBottom: 50}}>Maturité du produit</Text>
                      </FLPanel>
                      <FLPanel title="Protection du capital" activated={false}>
                      </FLPanel>


 
              <Text>Votre choix : {productList[this.state.currentProductIndex].name}</Text>
  
                <Button rounded style={{backgroundColor: '#85B3D3'}}>
                  <Text>JE VEUX TRAITER</Text>
                </Button>

              </View>
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