import React, { Component } from 'react';
import { Animated, Image, TextInput, TouchableOpacity,ImageBackground, StatusBar, Platform, 
        StyleSheet, Easing, View, Text, FlatList, SafeAreaView } from 'react-native';
import { Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import { globalStyle , blueFLColor, backgdColor, apeColor, FLFontFamily, headerTabColor} from '../../Styles/globalStyle'
  
import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';

import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';

import FLTicketTemplateAPE  from './FLTicketTemplateAPE';
import FLTicketTemplatePP  from './FLTicketTemplatePP';

import Dimensions from 'Dimensions';


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


const NAVBAR_HEIGHT = 45;
//determination de la hauteur des status bar
const STATUS_BAR_HEIGHT = sizeByDevice(44, 20, StatusBar.currentHeight);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);


class TicketScreen extends React.Component {
 
  constructor(props) {
    super(props);

    //utiliser pour dispzarition en-tete
    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);

    this.state = {

      //animation barre de recherche
      positionLeft: new Animated.Value(DEVICE_WIDTH), //indicateur si recherche ou pas 


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
    //this.dataSource = Array(19).fill().map((_, index) => ({id: index}));
    this.filterOnAir = false;
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
      this._clampedScrollValue > (NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
      ? this._offsetValue + NAVBAR_HEIGHT
      : this._offsetValue - NAVBAR_HEIGHT;

   /* Animated.timing(this.state.offsetAnim, {
      toValue,
      duration: 350,
      useNativeDriver: true,
    }).start();*/
  };

  _renderTicket = (item, index) => {
    let type = item['currentStep'][0].codeOperation;
    //let type = 'ape';
    //console.log(item);
    switch (type) {
      case 'ape' : 
        return <FLTicketTemplateAPE ticket={item} />
      case 'pp' : 
        return <FLTicketTemplatePP ticket={item} />
      default :
        return (
            <View style={[globalStyle.itemTicket, {flexDirection : 'column', width: DEVICE_WIDTH*0.925, borderBottomWidth : 1, height : 50}]}>
                <View style={{backgroundColor: type === 'ape' ? apeColor : headerTabColor }}>
                  <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 16, color: 'white', padding: 5}}>
                      {item['subject']}
                  </Text>
                </View>
            </View>
          );
    }

  }

  render() {
    const { clampedScroll } = this.state;

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
      outputRange: [0, -STATUS_BAR_HEIGHT],
      extrapolate: 'clamp',
    });

    //console.log(this.props.tickets);
// <Animated.View style={[styles.navbar, { transform: [{ translateY: navbarTranslate }] }]}>
    return (
      <SafeAreaView style={{flex : 1, backgroundColor: blueFLColor}}>

      <View style={{flex :1, height: DEVICE_HEIGHT, WIDTH: DEVICE_WIDTH, backgroundColor: backgdColor}}>
        <AnimatedFlatList
          //contentContainerStyle={styles.contentContainer}
          contentContainerStyle={{alignItems : 'center', marginTop :  20 + NAVBAR_HEIGHT}}
          //data={this.dataSource}
          data={this.props.tickets}
          //data={data}
          renderItem={this._renderRow}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item, id}) => (
            this._renderTicket(item, id)     
          )}
          scrollEventThrottle={1}
          onMomentumScrollBegin={this._onMomentumScrollBegin}
          onMomentumScrollEnd={this._onMomentumScrollEnd}
          onScrollEndDrag={this._onScrollEndDrag}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }],
            { useNativeDriver: true },
          )}
          ListFooterComponent={() => {
            return (
              <TouchableOpacity onPress={() => {
                      Alert.alert("FinLive SAS","Copyright ©")
                  }}
                  style={{height : 100, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily : 'FLFontFamily'}}>F i n L i v e</Text>
              </TouchableOpacity>
            );
          }}
        />

        <Animated.View style={[styles.navbar, { transform: [{ translateY: this.filterOnAir ? 0 : navbarTranslate }] }]}>
         
        <Animated.View style={{
                  display: 'flex',
                  backgroundColor: 'white',
                  //borderRadius: 3,
                  borderWidth:0,
                  opacity: this.filterOnAir ? 1 : navbarOpacity,
                  height: 45,
                  marginTop: 0,
                  width: DEVICE_WIDTH*1,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}> 
                  <View style={{flex: 1, height: 45, borderWidth: 0, width: DEVICE_WIDTH*0.925,flexDirection: 'row'}}>   
                    <View style={{flex:0.8, borderWidth: 0, height: 45,justifyContent: 'center', alignItems: 'flex-start'}}>
                      <TouchableOpacity onPress={() => {
                                  console.log("qsjhfjhdfjd");
                      }}>
                        <Text style={{paddingLeft : 5,fontFamily: this.state.fontLoaded ? 'FLFontTitle' : FLFontFamily, fontWeight:'200', fontSize : 18, color:blueFLColor}}>Mes tickets</Text>    
                      </TouchableOpacity>
                    </View>   

                    <TouchableOpacity style={{ flex:0.1, height: 45, borderWidth: 0,justifyContent: 'center', alignItems: 'center'}}
                         onPress={() => {
                          this.props.navigation.setParams({ hideBottomTabBar : true});
                           this.setState ({ showModalTitle : !this.state.showModalTitle });
                           this.filterOnAir = true;
                            Animated.parallel([
                              Animated.timing(
                                  this.state.positionLeft,
                                    {
                                      toValue: 0,
                                      duration : 1000,
                                      easing: Easing.elastic(),
                                      speed : 1
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
                            color={blueFLColor}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ flex:0.1, height: 45, borderWidth: 0,justifyContent: 'center', alignItems: 'center'}}
                                        onPress={() => {
                                          alert("Vers ecran des notifs");
                                        }}> 
                         <Icon
                            name='ios-notifications-outline' 
                            size={25} 
                            style={{color : blueFLColor}}
                          />
                      </TouchableOpacity>
                    
                  </View>
                  <Animated.View style={{flexDirection:'row', top: 0, width: DEVICE_WIDTH, backgroundColor: 'white',left: this.state.positionLeft, height: 45}}>
                      <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
                          <TouchableOpacity onPress={() => {
                                       //this.setState ({ showModalTitle : !this.state.showModalTitle });
                                       //console.log("SCROLL Y : "+ JSON.stringify(animation.scrollY));
                                       this.filterOnAir = false;
                                       
                                        Animated.parallel([
                                          Animated.timing(
                                              this.state.positionLeft,
                                                {
                                                  toValue: DEVICE_WIDTH,
                                                  duration : 1000,
                                                  easing: Easing.elastic(),
                                                  speed : 1
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
    //paddingTop: STATUS_BAR_HEIGHT,
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
export default hoistStatics(composedPricerScreen)(TicketScreen);

/*

 <Animated.Text style={[styles.title, { opacity: navbarOpacity }]}>

 */
