import React, { Component } from 'react';
import { Animated, Image, TextInput, TouchableOpacity,ImageBackground, StatusBar, Dimensions, 
        StyleSheet, Easing, View, Text, FlatList, SafeAreaView } from 'react-native';
import { Icon } from 'native-base';

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyle , setColor, setFont} from '../../Styles/globalStyle'
  
import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';

import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import { ifIphoneX, ifAndroid, currencyFormatDE , getConstant } from '../../Utils';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import Moment from 'moment';

const NAVBAR_HEIGHT = 45;




const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);


class FollowingScreen extends React.Component {
 
  constructor(props) {
    super(props);

    //const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);

    this.state = {
      //animation barre de recherche
      positionLeft: new Animated.Value(getConstant('width')), //indicateur si recherche ou pas 

      scrollAnim,
      offsetAnim,
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          offsetAnim,
        ),
        0,
        NAVBAR_HEIGHT ,
      ),
    };
    console.log(this.props.productsFollowed.length);
  }

  

  _clampedScrollValue = 0;
  _offsetValue = 0;
  _scrollValue = 0;

  static navigationOptions = ({ navigation }) => {
      return ({
        header : null,
      }
      );
  }

  componentDidMount() {

    //StatusBarManager.getHeight(({height}) => console.log("HAUTEUR STATUS BAR : " + height));
    this.state.scrollAnim.addListener(({ value }) => {
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, 0),
        NAVBAR_HEIGHT ,
      );
    });
    this.state.offsetAnim.addListener(({ value }) => {
      this._offsetValue = value;
    });
  }

  componentWillUnmount() {
    this.state.scrollAnim.removeAllListeners();
    this.state.offsetAnim.removeAllListeners();
  }

  _onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };

  _onMomentumScrollEnd = () => {
    const toValue = this._scrollValue > NAVBAR_HEIGHT &&
      this._clampedScrollValue > (NAVBAR_HEIGHT - getConstant('statusBar')) / 2
      ? this._offsetValue + NAVBAR_HEIGHT
      : this._offsetValue - NAVBAR_HEIGHT;

   /* Animated.timing(this.state.offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();*/
  };


  _renderProduct(item, id) {

    let valo = 0.94+ Math.random()/10;
    let alea = Math.random();
    return (
      
      <View style={{width : getConstant('width'), flexDirection: 'column', justifyContent: 'center', marginTop : 10, backgroundColor: 'white' }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems : 'center', marginTop : 5}} >
              <View style={{flex : 0.8, paddingLeft : 20}}>
                  <Text style={setFont('400', 16,  setColor(''), 'Bold')}>
                     {item.getProductName()} {item.getFullUnderlyingName(this.props.categories).toUpperCase()} {item.getMaturityName()}
                  </Text>
              </View>
              <View style={{flex : 0.2, justifyContent : 'flex-start', alignItems: 'flex-start',   paddingRight : 20}}>
                  <Text style={setFont('400', 16, valo >= 1 ? setColor('granny') : setColor('red'), 'Regular')}>
                      {Numeral(valo).format('0.00%')}
                  </Text>
              </View>

          </View>

          <View style={{flexDirection : 'row', marginLeft : 20, marginRight : 20, marginTop : 5}}>
                  <View style={{flex : 0.8}}>
                      <Text style={setFont('200', 10, 'gray')}>ISIN :</Text>
                              <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center', height : 19}}>
                                    <View style={{justifyContent : 'flex-start', alignItems : 'flex-start', padding : 0}}>  
                                        <Text style={setFont('200', 12, setColor('darkBlue'), 'Regular')}>FR000456377829</Text>
                                    </View>
                                
                              </View>
                  </View>  

                  <View style={{flex : 0.2, backgroundColor : setColor(''), justifyContent : 'center', alignItems: 'center', margin : 5, borderWidth : 1, borderColor : setColor(''), borderRadius : 2}}>
                      <Text style={setFont('300', 12, 'white', 'Regular')}>Vendre</Text>
                  </View>  
           
          </View>

          <View style={{flexDirection : 'row', marginLeft : 20, marginRight : 20, marginTop : 5}}>
                  <View style={{flex : 0.33}}>
                      <Text style={setFont('200', 10, 'gray')}>Nominal :</Text>
                              <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center', height : 19}}>
                                    <View style={{justifyContent : 'flex-start', alignItems : 'flex-start', padding : 0}}>  
                                        <Text style={setFont('200', 12, setColor('darkBlue'), 'Regular')}>{currencyFormatDE(item.getNominal())}  </Text>
                                    </View>
                                    <View style={{justifyContent : 'center', alignItems : 'center', paddingRight : 3}}>  
                                        <Text style={setFont('200', 12, setColor('darkBlue'), 'Regular')}>{item.getCurrency()}</Text>
                                    </View>
                              </View>
                  </View>  

                  <View style={{flex : 0.33}}>
                      <Text style={setFont('200', 10, 'gray')}>Proch. obs. :</Text>
                              <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center', height : 19}}>
          
                                    <View style={{justifyContent : 'center', alignItems : 'flex-start',  paddingLeft : 0}}>  
                                        <Text style={setFont('200', 12, setColor('darkBlue'), 'Bold')}> 24/12/2027 </Text>
                                    </View>
                         
                              </View>
                  </View>  
                  <View style={{flex : 0.33}}>
                      <Text style={setFont('200', 10, 'gray')}>Mat :</Text>
                              <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center', height : 19}}>
          
                                    <View style={{justifyContent : 'center', alignItems : 'flex-start',  paddingLeft : 0}}>  
                                        <Text style={setFont('200', 12, setColor('darkBlue'), 'Bold')}>{Moment(item.getLastConstatDate()).format('DD/MM/YYYY')}</Text>
                                    </View>
                             
                              </View>
                  </View> 
          </View>

          <View style={{margin : 5, justifyContent : 'center', alignItems : 'center', backgroundColor :  alea > 0.5 ? 'transparent' : 'green'}}>
           
                      <Text style={setFont('200', alea > 0.5 ?  10 : 14,  alea > 0.5 ? 'gray' : 'white')}>{String( alea > 0.5 ? "pas d'évènement prévu" : "rappel imminent").toUpperCase()}</Text>
     
          </View>

        </View>


    );
  }


  render() {
    const { clampedScroll } = this.state;

    //console.log("RENDER :");
    //console.log(this.state.scrollAnim);

    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT ],
      outputRange: [0, -(NAVBAR_HEIGHT )],
      extrapolate: 'clamp',
    });
    const navbarOpacity = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT ],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const navbarTop = clampedScroll.interpolate({
      inputRange: [0, NAVBAR_HEIGHT ],
      outputRange: [0, -getConstant('statusBar')],
      extrapolate: 'clamp',
    });
// <Animated.View style={[styles.navbar, { transform: [{ translateY: navbarTranslate }] }]}>
    return (
      <SafeAreaView style={{flex : 1, backgroundColor: setColor('')}}>

      <View style={{flex :1, height: getConstant('height'), WIDTH: getConstant('width')}}>

        <AnimatedFlatList
            style={{  backgroundColor: setColor('background')}}
            contentContainerStyle={{alignItems : 'center', marginTop :   NAVBAR_HEIGHT}}
            data={this.props.productsFollowed}
            keyExtractor={(item) => Math.random()+""}
            //tabRoute={this.props.route.key}
            //numColumns={3}
            renderItem={({item, id}) => {
  
              return this._renderProduct(item, id);
              //this._renderPrice(item, id)    

            }}
            horizontal={false}
            scrollEventThrottle={1}
            //extraData={this.state.allNotificationsCount}
            onMomentumScrollBegin={this._onMomentumScrollBegin}
            onMomentumScrollEnd={this._onMomentumScrollEnd}
            onScrollEndDrag={this._onScrollEndDrag}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
              { useNativeDriver: true },
            )}
            ListFooterComponent={() => {
              return (
                <View style={{height : 150, justifyContent: 'center', alignItems: 'center'}} />
              );
            }}
        />

        <Animated.View style={[styles.navbar, { transform: [{ translateY: navbarTranslate }] }]}>
         
        <Animated.View style={{
                  display: 'flex',
                  backgroundColor: setColor(''),
                  //borderRadius: 3,
                  borderWidth:0,
                  opacity: navbarOpacity,
                  height: 45,
                  marginTop: 0,
                  width: getConstant('width')*1,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}> 
                  <View style={{flex: 1, height: 45, borderWidth: 0, width: getConstant('width')*0.925,flexDirection: 'row'}}>   
                    <View style={{flex:0.8, borderWidth: 0, height: 45,justifyContent: 'center', alignItems: 'flex-start'}}>
                      <TouchableOpacity onPress={() => {
                                  console.log("qsjhfjhdfjd");
                      }}>
                        <Text style={setFont('200', 18, 'white')}>
                            Vos produits suivis
                        </Text>    
                      </TouchableOpacity>
                    </View>   

                    <TouchableOpacity style={{ flex:0.1, height: 45, borderWidth: 0,justifyContent: 'center', alignItems: 'center'}}
                         onPress={() => {
                          this.props.navigation.setParams({ hideBottomTabBar : true});
                           this.setState ({ showModalTitle : !this.state.showModalTitle });

                            Animated.parallel([
                              Animated.timing(
                                  this.state.positionLeft,
                                    {
                                      toValue: 0,
                                      duration : 1000,
                                      easing: Easing.elastic(),
                                      speed : 1,
                                      useNativeDriver: true,
                                    }
                              ),
                                /*Animated.timing(
                                  this.state.categoryHeight,
                                  {
                                    toValue: 0,
                                    duration : 1000,
                                    easing: Easing.elastic(),
                                    speed : 1
                                  }
                                )  */
                            ]).start(() => {
                              //force le render avec un changement de state dont on se fiche 
                              //this.setState ({ showModalTitle : !this.state.showModalTitle });
                              
  
                              
                          });
                            
                            if (this.inputSearch !== null && this.inputSearch !== undefined) {
                              this.inputSearch.focus();
                            }
                           

                        }}>  
                          <MaterialIcons
                            name='search' 
                            size={25} 
                            color='white'
                          />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ flex:0.1, height: 45, borderWidth: 0,justifyContent: 'center', alignItems: 'center'}}
                                        onPress={() => {
                                          alert("Vers ecran des notifs");
                                        }}> 
                         <MaterialCommunityIcons
                            name='plus' 
                            size={25} 
                            style={{color : 'white'}}
                          />
                      </TouchableOpacity>
                    
                  </View>
                  <Animated.View style={{flexDirection:'row', top: 0, width: getConstant('width'), backgroundColor: 'white',left: this.state.positionLeft, height: 45}}>
                      <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
                          <TouchableOpacity onPress={() => {
                                       //this.setState ({ showModalTitle : !this.state.showModalTitle });
                                       //console.log("SCROLL Y : "+ JSON.stringify(animation.scrollY));
                                       
                                       
                                        Animated.parallel([
                                          Animated.timing(
                                              this.state.positionLeft,
                                                {
                                                  toValue: getConstant('width'),
                                                  duration : 1000,
                                                  easing: Easing.elastic(),
                                                  speed : 1,
                                                  useNativeDriver: true,
                                                }
                                          ),
                                            /*Animated.timing(
                                              this.state.categoryHeight,
                                              {
                                                toValue: 45,
                                                duration : 1000,
                                                easing: Easing.elastic(),
                                                speed : 1
                                              }
                                            )  */
                                        ]).start(() => {
                                              //force le render avec un changement de state dont on se fiche 
                                              this.setState ({ showModalTitle : !this.state.showModalTitle });
                                              this.props.navigation.setParams({ hideBottomTabBar : false});
                                        });

                                        if (this.inputSearch !== null && this.inputSearch !== undefined) {
                                          this.inputSearch.blur();
                                        }
                                        this.searchText = '';
                                        //this.props.filterUpdated(this.state.selectedCategory, this.state.selectedSubCategory, '');
                              }}>  
                                <MaterialIcons
                                      name='arrow-back' 
                                      size={22} 
                                      color='lightgray'
                                      style={{paddingLeft: 20}}
                                    />
                            </TouchableOpacity>
                       </View>
                       <View style={{flex: 0.9}}>
                          <TextInput 
                              style={styles.inputText}
                              placeholder={'Filtre ...'}
                              placeholderTextColor={'#999'}        
                              underlineColorAndroid={'#fff'}
                              autoCorrect={false}
                              //editable={false}
                              onSubmitEditing={() => {
                                this.props.navigation.setParams({ hideBottomTabBar : false});
                                //this.props.filterUpdated(this.state.selectedCategory, this.state.selectedSubCategory, this.searchText);
                              }}
                              ref={(inputSearch) => {
                                //if (this.inputSearch !== null && this.inputSearch !== undefined) {
                                  this.inputSearch = inputSearch;
                                  //inputSearch.focus();
                              //  }
                              }}
                              onChangeText={(text) => this.searchText = text}
                            />
                          </View>
                  </Animated.View>                    
            </Animated.View>
           </Animated.View>
      </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    height: NAVBAR_HEIGHT,
    justifyContent: 'center',
    //paddingTop: getConstant('statusBar),
  },
  contentContainer: {
    paddingTop: NAVBAR_HEIGHT,
  },
 
  row: {
    height: 300,
    width: null,
    marginBottom: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  rowText: {
    color: 'white',
    fontSize: 18,
  },
  inputText: {
    display: 'flex',
    ...ifAndroid({
      marginTop: 9
    }, {
      marginTop: 13
    }),
    marginLeft: 20,
    fontSize: 18,
    color: '#999',
  },
});


const condition = authUser => !!authUser;
const composedPricerScreen = compose(
 withAuthorization(condition),
  withUser,
  withNavigation,
);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(FollowingScreen);