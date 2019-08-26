import React, { Component } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Font } from 'expo';
import { Icon, Button } from 'native-base'
import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';
import { getAllUnderlying } from '../../Utils';

import FadeInLeft  from '../../Animated/FadeInLeft';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  Text,
  Platform,
  Modal,
  Dimensions,
  SectionList,
  Easing,
  Keyboard
} from 'react-native';

import {  globalSyle, 
          generalFontColor, 
          tabBackgroundColor,
          headerTabColor,
          selectElementTab,
          FLFontFamily,
          backgdColor
} from '../../Styles/globalStyle';



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;



export default class SearchBarHome extends Component {

  constructor(props) {
    super(props);



    //rajout des favoris et de l'organisation 
    this.categories = JSON.parse(JSON.stringify(this.props.categories));
    let obj = {};
    obj["active"] = true;
    obj["categoryName"] = "Favoris";
    obj["codeCategory"] = "PS";
    obj["subCategory"] = this.props.categories.filter(({codeCategory}) => codeCategory === 'PS')[0].subCategory;
    this.categories.push(obj);
    obj = {};
    obj["active"] = true;
    obj["categoryName"] = "Institut du Patrimoine";
    obj["codeCategory"] = "PS";
    obj["subCategory"] = this.props.categories.filter(({codeCategory}) => codeCategory === 'PS')[0].subCategory;
    this.categories.push(obj);   
   
  
    //on selectionne les produits structures par defaut 
    let selectedCategory = this.categories.filter(({codeCategory}) => codeCategory === 'PS')[0];  

    this.state = {
      //font 
      fontLoaded : false, 

      //hide or show category and sub-category if searchtext is showed
      categoryHeight : new Animated.Value(45),
      //paddingCategoryHeight : new Animated.Value(50),
      showModalTitle : true,
      
      //animation barre de recherche
      positionLeft: new Animated.Value(DEVICE_WIDTH),
      bgInputTextColor : new Animated.Value(0),


      showModalCategory: false,
      selectedCategory : selectedCategory,

      showModalSubCategory : false,
      selectedSubCategory : selectedCategory.subCategory[0],
    }

    //texte de la barre de filtre
    this.searchText = '';
    
    //console.log(this.categories);
  }



  componentWillMount() {
    //fait pour palier au bug android d'apparition des tabbar quand les claviers apparaissent
    //this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => console.log("CLAVIER DEACTIVE"));
    //this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => console.log("CLAVIER ACTIVE"));
  }

  componentWillUnmount() {
      //this.keyboardDidShowListener.remove();
      //this.keyboardDidHideListener.remove();
  }

  async componentDidMount() {
    await Font.loadAsync({
      'FLFontTitle': require('../../assets/fonts/Typo_Round_Regular_Demo.otf'),
    });

    this.setState({ fontLoaded: true });

    //console.log(this.props.categories)
  }




  blurInputs(stateBar) {
    if (this.inputSearch !== null && this.inputSearch !== undefined) {
      //console.log("BLUR BLUR BLUR : "+ stateBar);
      //console.log("BLUR BLUR BLUR : "+ this.inputSearch);
    }
    //this.inputSearch.blur();
    //this.inputLocation.blur();
   // this.props.changeInputFocus(false);
  }

  render() {
    const { animation, changeInputFocus, renderTabBar } = this.props;

    let transformWrapper = animation.getTransformWrapper();
    const transformSearchBar = animation.getTransformSearchBar(this.blurInputs, animation.stateBar);
    let opacitySearchBar = animation.getOpacitySearchBar(this.state.showModalTitle);
    const opacityLocationInput = animation.getOpacityLocationInput();
    const arrowMinimizeStyle = animation.getArrowMinimizeStyle();
  
    let subCategories = this.state.selectedCategory.subCategory;

    //console.log("TRANSFORMSEARCHBAR : "+ JSON.stringify(transformSearchBar));
    return (
      <Animated.View style={[styles.wrapper, this.state.showModalTitle ? transformWrapper : transformSearchBar]}>
        <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showModalCategory}
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
                let verifX = x < DEVICE_WIDTH*0.0375  || x > DEVICE_WIDTH*0.9625 ? true : false;
                let departY =  animation.stateBar === animation.stateBarTypes.EXPANDED  ? sizeByDevice(165, 165-23, 120) -30-4: 
                             animation.stateBar === animation.stateBarTypes.NORMAL ? sizeByDevice(155, 155-23, 111)-4: sizeByDevice(86, 86-23, 42)-4;
                let verifY = y < departY  || y > departY + Math.min(DEVICE_HEIGHT*0.7, Object.keys(this.categories).length*40+5) ? true : false;
                if (verifX || verifY) {
                  this.setState({showModalCategory : false})
                }
              }}

            >
                  <View 
                    //directionalLockEnabled={true} 
                    //contentContainerStyle={{
                      style={{
                        backgroundColor: 'white',
                        borderWidth :1,
                        borderColor : headerTabColor,
                        //borderRadius:10,
                        width: DEVICE_WIDTH*0.925,
                        height: Math.min(DEVICE_HEIGHT*0.7, Object.keys(this.categories).length*40+5),
                        top:  animation.stateBar === animation.stateBarTypes.EXPANDED  ? sizeByDevice(165, 165-23, 120) -30-4: 
                                  animation.stateBar === animation.stateBarTypes.NORMAL ? sizeByDevice(155, 155-23, 111) - 30-4: sizeByDevice(86, 86-23, 42)-4,
                        left : DEVICE_WIDTH*0.075/2,
                        //marginTop:DEVICE_HEIGHT*0.15,                       
                        //borderRadius: DEVICE_HEIGHT*0.03,
                        //alignItems: 'absolute'
                    }}
                  >
                  <ScrollView>
                  {
                    this.categories.map((value, index) => {
                      return (
                        <TouchableOpacity key={index} onPress={() => {
                          //verifie si la categorie est activee
                          if (value.active) {
                              //console.log(this.categories.filter(({codeCategory}) => codeCategory === value.codeCategory)[0].subCategory[0]);
                              this.setState({
                                selectedCategory : value, 
                                selectedSubCategory : this.categories.filter(({codeCategory}) => codeCategory === value.codeCategory)[0].subCategory[0],
                                showModalCategory : false
                              }, () => {
    
                                this.props.filterUpdated(value, this.state.selectedSubCategory, this.searchText);
                              });
                          }
  
                        }}>
                        <View style={{
                                            height : 40, 
                                            width : DEVICE_WIDTH*0.925, 
                                            backgroundColor:'white', 
                                            justifyContent: 'center', 
                                            alignItems: 'center'
                                            }}>
                            <View style={{flex : 1, backgroundColor: this.state.selectedCategory === value ? selectElementTab :'white' , marginTop: 0, paddingLeft: 7, paddingRight: 7,flexDirection : 'row', width : DEVICE_WIDTH*0.925, borderColor : this.categories.active ? 'black' : 'lightgray'}}>
                              <View style={{flex:1, alignItems:'flex-start', justifyContent: 'center'}}>
                                  <Text style={{color: this.state.selectedCategory === value ? 'white' : value.active ? 'black' : 'lightgray' }}>{value.categoryName.toUpperCase()}</Text>
                              </View>
                              {/*<View style={{flex:0.2, alignItems: 'flex-end', justifyContent: 'center'}}>
                                   <Icon name="ios-arrow-forward"  style={{color : this.state.selectedCategory === value.id ? 'white' :this.subCategories[index].length !== 0 ? 'black' : 'lightgray' }}/>
                              </View>*/}
                            </View>
                        </View>
                        </TouchableOpacity>
                      );
                    })
                  }
                  </ScrollView>
                </View>
            </View>
        </Modal>
        <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showModalSubCategory}
            onRequestClose={() => {
              console.log('Modal sub categories has been closed');
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
                let verifX = x < DEVICE_WIDTH*0.0375 || x > DEVICE_WIDTH*0.9625 ? true : false;
                //let verifY = y < animation.topPartHeight + 45  || y > Math.min(DEVICE_HEIGHT*0.7, Object.keys(this.subCategoriesSelected).length*40+5) ? true : false;
                let departY = animation.stateBar === animation.stateBarTypes.EXPANDED  ? sizeByDevice(165, 165-23, 120) -30 -4: 
                              animation.stateBar === animation.stateBarTypes.NORMAL ? sizeByDevice(155, 155-23, 111) - 30 - 4: sizeByDevice(86, 86-23, 42) - 4;
                let verifY = y < departY  || y > departY + Math.min(DEVICE_HEIGHT*0.7, Object.keys(subCategories).length*40+5) ? true : false;
                if (verifX || verifY) {
                  this.setState({showModalSubCategory : false})
                }
              }}

            >
                  <View 
                    //directionalLockEnabled={true} 
                    //contentContainerStyle={{
                      style={{
                        backgroundColor: 'white',
                        borderWidth :1,
                        //borderRadius:10,
                        borderColor : headerTabColor,
                        width: DEVICE_WIDTH*0.925,
                        height: Math.min(DEVICE_HEIGHT*0.7, Object.keys(subCategories).length*40+5),
                        top: animation.stateBar === animation.stateBarTypes.EXPANDED  ? sizeByDevice(165, 165-23, 120) -30-4: 
                                        animation.stateBar === animation.stateBarTypes.NORMAL ? sizeByDevice(155, 155-23, 111) -30-4: sizeByDevice(86, 86-23, 42)-4 ,
                        left : DEVICE_WIDTH*0.075/2,
                        //marginTop:DEVICE_HEIGHT*0.15,                       
                        //borderRadius: DEVICE_HEIGHT*0.03,
                        //alignItems: 'absolute'
                    }}
                  >
                   <ScrollView>
                  {                      
                      subCategories.map((subValue, index) => {
                          //console.log(subValue.ticker +"  : "+ index+"   :  "+subValue.name+"   :   "+subValue.isTitle);
                          return (            
                            <TouchableOpacity key={index} onPress={() => {
                              //possibilité de cliquer s'il ne s'agit d'une section de sous-jacent
                              //if(!subValue.isTitle) {
                                this.setState({    
                                  selectedSubCategory : subValue,
                                  showModalSubCategory : false
                                }, () => {
                                  this.props.filterUpdated(this.state.selectedCategory, subValue, this.searchText);
                                });
                              //}
                            }}>
                              <View style={{
                                                  height : 40, 
                                                  width : DEVICE_WIDTH*0.925, 
                                                  backgroundColor: 'white', 
                                                  justifyContent: 'center', 
                                                  alignItems: 'center',
                                                  //borderBottomWidth: 1,
                                                  }}>
                                  <View style={{flex : 1, backgroundColor: this.state.selectedSubCategory === subValue ? selectElementTab :subValue.subCategoryHead ? 'gainsboro' : subValue.groupingHead ? 'lavender' : 'white' , marginTop: 0, paddingLeft: 7, paddingRight: 7,flexDirection : 'row', width : DEVICE_WIDTH*0.925,borderBottomWidth :subValue.subCategoryHead ? 1 : 1, borderBottomColor : 'gainsboro'}}>
                                    <View style={{flex:1, 
                                                  //alignItems: subValue.type === 'SubCategory' ? 'flex-start' : 'center', 
                                                  alignItems: 'flex-start', 
                                                  justifyContent: 'center'}}>
                                        <Text style={{
                                            color: this.state.selectedSubCategory === subValue ? 'white' : 'black',
                                            fontWeight: subValue.subCategoryHead ? 'bold' : '400',
                                            //fontSize : subValue.type === 'SubCategory' ? 18 : 16,
                                            }}>{subValue.subCategoryName}</Text>
                                    </View>

                                  </View>
                              </View>
                            </TouchableOpacity>
                          );
                     //   })
                    })
                  }
                 </ScrollView> 
                </View>
            </View>
        </Modal>
       <Animated.View style={opacitySearchBar}>
          <View style={styles.searchContainer}>
            <Animated.View style={[opacitySearchBar, {
                  display: 'flex',
                  backgroundColor: tabBackgroundColor,
                  //borderRadius: 3,
                  borderWidth:0,
                  
                  height: 45,
                  marginTop: 0,
                  width: DEVICE_WIDTH*1,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center'
                }]}> 
                  <View style={{flex: 1, height: 45, borderWidth: 0, width: DEVICE_WIDTH*0.925,flexDirection: 'row'}}>   
                    <View style={{flex:0.9, borderWidth: 0, height: 45,justifyContent: 'center', alignItems: 'flex-start'}}>
                      <TouchableOpacity onPress={() => {
                                  console.log("qsjhfjhdfjd");
                      }}>
                        <Text style={{paddingLeft : 5,fontFamily: this.state.fontLoaded ? 'FLFontTitle' : FLFontFamily, fontWeight:'200', fontSize : 30, color:'white'}}>F i n L i v e</Text>    
                      </TouchableOpacity>
                    </View>   

                    <View style={{ flex:0.1, height: 45, borderWidth: 0,justifyContent: 'center', alignItems: 'center'}}> 
                      <TouchableOpacity onPress={() => {
                          this.props.manageVisibilityTabBar(true);
                           this.setState ({ showModalTitle : !this.state.showModalTitle });
                           if (parseInt(JSON.stringify(animation.scrollY)) === 0) {
                              //console.log("ON EST EN HAUT");
                              this.props.changeMarginSearch(40);
                            } else {
                              this.props.changeMarginSearch(9999);
                            }
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
                                Animated.timing(
                                  this.state.categoryHeight,
                                  {
                                    toValue: 0,
                                    duration : 1000,
                                    easing: Easing.elastic(),
                                    speed : 1
                                  }
                                )  
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
                    </View>
                  </View>
                  <Animated.View style={{flexDirection:'row', top: 0, width: DEVICE_WIDTH, backgroundColor: 'white',left: this.state.positionLeft, height: 45}}>
                      <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
                          <TouchableOpacity onPress={() => {
                                       //this.setState ({ showModalTitle : !this.state.showModalTitle });
                                       //console.log("SCROLL Y : "+ JSON.stringify(animation.scrollY));

                                       this.props.changeMarginSearch(0);
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
                                            Animated.timing(
                                              this.state.categoryHeight,
                                              {
                                                toValue: 45,
                                                duration : 1000,
                                                easing: Easing.elastic(),
                                                speed : 1
                                              }
                                            )  
                                        ]).start(() => {
                                              //force le render avec un changement de state dont on se fiche 
                                              this.setState ({ showModalTitle : !this.state.showModalTitle });
                                              this.props.manageVisibilityTabBar(false);
                                        });
                                        if (this.inputSearch !== null && this.inputSearch !== undefined) {
                                          this.inputSearch.blur();
                                        }
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
                                this.props.manageVisibilityTabBar(false);
                                this.props.filterUpdated(this.state.selectedCategory, this.state.selectedSubCategory, this.searchText);
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
          </View>
        </Animated.View>
        {
          //renderTabBar()
        }
        <Animated.View style={ { flexDirection:'row' , borderBottomWidth: 4, borderBottomColor : backgdColor,alignSelf: 'center', height: this.state.categoryHeight, width: DEVICE_WIDTH, borderWidth: 0, borderColor: 'black'}}>     
                      <View style={{flex: 0.0375, backgroundColor: tabBackgroundColor}}>
                      </View>
                      <View style={{ borderWidth:0, flex:0.4625, backgroundColor: this.state.showModalCategory ? headerTabColor : tabBackgroundColor}}>
                        { this.state.showModalTitle ?<TouchableOpacity style={{flex: 1}} onPress={() => this.setState({showModalCategory : true})}>  
                            <View style={{  flexDirection: 'row',flex:1, backgroundColor: this.state.showModalCategory ? headerTabColor : tabBackgroundColor}}>
                                <View style={{flexWrap: 'wrap',flex:0.7, alignItems: 'flex-start', justifyContent : 'space-evenly', borderWidth:0}}>
                              
                                  <Text style={{paddingLeft: 5,flexWrap: 'wrap',fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 12, color: generalFontColor}}>
                                      {this.state.selectedCategory.categoryName.toUpperCase()}
                                  </Text>
                                  
                                </View>
                                <View style={{flex:0.3, justifyContent : 'center', alignItems: 'center'}}>
                                  
                                  <Icon name={this.state.showModalCategory ? "ios-arrow-up" :"ios-arrow-down"}  style={{color : this.state.showModalCategory ? tabBackgroundColor : 'white'}}/>
                                
                                </View> 
                            </View>
                          </TouchableOpacity> : null }
                        </View>
                        <View style={{ flex:0.4625, backgroundColor: this.state.showModalSubCategory ? headerTabColor : tabBackgroundColor}}>
                        { this.state.showModalTitle ? <TouchableOpacity style={{flex: 1}} onPress={() => this.setState({showModalSubCategory : true})}>
                            <View style={{ flexDirection: 'row',flex:1,  backgroundColor: this.state.showModalSubCategory ? headerTabColor : tabBackgroundColor}}>
                                <View style={{flexWrap: 'wrap',paddingLeft: 3, flex:0.7, alignItems: 'flex-start', justifyContent : 'space-evenly', borderWidth:0}}>  
                                
                                  <Text style={{flexWrap: 'wrap',fontFamily: FLFontFamily, fontWeight: '400', fontSize: 12, color: generalFontColor}}>
                                    {this.state.selectedSubCategory.subCategoryName.toUpperCase()}
                                  </Text>
                                
                                </View>
                                <View style={{flex:0.3, justifyContent : 'center', alignItems: 'center'}}>
                                  
                                    <Icon name={this.state.showModalSubCategory ? "ios-arrow-up" :"ios-arrow-down"}   style={{color : this.state.showModalSubCategory ? tabBackgroundColor : 'white'}}/>
                                  
                                </View>
                            </View>
                          </TouchableOpacity> : null }
                        </View>
                        <View style={{flex: 0.0375, backgroundColor: tabBackgroundColor}}>
                        </View>
                      </Animated.View> 
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#fff',
    borderWidth: 0,
    //paddingBottom : -50
  },
  searchContainer: {
    //zIndex: 99,
    backgroundColor: tabBackgroundColor,
    width: '100%',
    //overflow: 'hidden',
    paddingBottom: 0, //10,
    ...sizeByDevice({
      paddingTop: 2, //12
    }, {
      paddingTop: 2, //12
    },
    {
      paddingTop: 1, //37
    }),
  },
  arrowMinimizeContainer: {
    position: 'relative',
    top: -3
  },
  arrowMinimizeIcon: {
    marginLeft: 12,
  },
  searchInput: {
    display: 'flex',
    backgroundColor: '#fff',
    borderRadius: 3,
    height: 45,
    marginTop: 3,
    width: DEVICE_WIDTH*0.925,
    marginRight : 0,
    marginLeft : Platform.OS === 'ios' ? 0 : 0,
    alignSelf: 'center'
   //marginLeft: DEVICE_WIDTH*0.0375,
   // marginRight:  DEVICE_WIDTH*0.0375,
  },
  locationInput: {
    marginTop: 10,
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