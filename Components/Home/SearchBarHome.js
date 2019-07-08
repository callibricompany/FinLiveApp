import React, { Component } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Icon, Button } from 'native-base'
import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';
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
  Easing
} from 'react-native';

import {  globalSyle, 
          generalFontColor, 
          tabBackgroundColor,
          headerTabColor,
          selectElementTab,
          FLFontFamily
} from '../../Styles/globalStyle';


import CATEGORIES from '../../Data/categories.json'
import SUBCATEGORIES from '../../Data/subCategories.json'



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;



export default class SearchBarHome extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      //animation barre de recherche
      positionLeft: new Animated.Value(DEVICE_WIDTH),
      bgInputTextColor : new Animated.Value(0),


      showModalCategory: false,
      selectedCategory : 'PF',

      showModalSubCategory : false,
      selectedSubCategory : 'INDEX'
    }

    //determination des sous categories
    this.subCategories = [];
    CATEGORIES.forEach((value) => {
      let uc = SUBCATEGORIES.filter(({category}) => category === value.id);
      this.subCategories.push(uc);
    });

    //determination des sous categories titres possible selon la selection des categorires
    this.subCategoriesSelected = SUBCATEGORIES.filter(({category}) => category === this.state.selectedCategory);
    this.distinctSubCategoriesTitle = [...new Set(this.subCategoriesSelected.map(x => x.type))];



    //texte de la barre de filtre
    this.searchText = '';
    
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

    const transformWrapper = animation.getTransformWrapper();
    const transformSearchBar = animation.getTransformSearchBar(this.blurInputs, animation.stateBar);
    const opacitySearchBar = animation.getOpacitySearchBar();
    const opacityLocationInput = animation.getOpacityLocationInput();
    const arrowMinimizeStyle = animation.getArrowMinimizeStyle();
  
    //determination de la categorie a afficher
    let selectedCategorie = CATEGORIES.filter(({id}) => id === this.state.selectedCategory);
    //determination de la sous-categorie a afficher
    let selectedSubCategory = this.subCategoriesSelected.filter(({ticker}) => ticker === this.state.selectedSubCategory); 


    /*let colorInputText = this.state.bgInputTextColor.interpolate({
      inputRange: [0, 300],
      outputRange: ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)']
    });*/
    
    return (
      <Animated.View style={[styles.wrapper, transformWrapper]}>
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
                let departY =  animation.stateBar === animation.stateBarTypes.EXPANDED  ? sizeByDevice(165, 165-23, 122) : 
                             animation.stateBar === animation.stateBarTypes.NORMAL ? sizeByDevice(155, 155-23, 113) : sizeByDevice(86, 86-23, 44);
                let verifY = y < departY  || y > departY + Math.min(DEVICE_HEIGHT*0.7, Object.keys(CATEGORIES).length*40+5) ? true : false;
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
                        height: Math.min(DEVICE_HEIGHT*0.7, Object.keys(CATEGORIES).length*40+5),
                        top:  animation.stateBar === animation.stateBarTypes.EXPANDED  ? sizeByDevice(165, 165-23, 122) : 
                                  animation.stateBar === animation.stateBarTypes.NORMAL ? sizeByDevice(155, 155-23, 113) : sizeByDevice(86, 86-23, 44),
                        left : DEVICE_WIDTH*0.075/2,
                        //marginTop:DEVICE_HEIGHT*0.15,                       
                        //borderRadius: DEVICE_HEIGHT*0.03,
                        //alignItems: 'absolute'
                    }}
                  >
                  <ScrollView>
                  {
                    CATEGORIES.map((value, index) => {

                      return (
                        <TouchableOpacity key={value.id} onPress={() => {
                          if (this.subCategories[index].length !== 0) {
                            this.subCategoriesSelected = SUBCATEGORIES.filter(({category}) => category === value.id);
                            this.distinctSubCategoriesTitle = [...new Set(this.subCategoriesSelected.map(x => x.type))];
                            this.setState({
                                  selectedCategory : value.id, 
                                  selectedSubCategory : this.subCategoriesSelected[0].ticker,
                                  showModalCategory : false
                                }, () => {
                                  this.props.filterUpdated(this.state.selectedCategory, this.state.selectedSubCategory, this.searchText);
                                });
                            //this.setState({ showModalCategory : false});
                          }
                        }}>
                        <View style={{
                                            height : 40, 
                                            width : DEVICE_WIDTH*0.925, 
                                            backgroundColor:'white', 
                                            justifyContent: 'center', 
                                            alignItems: 'center'
                                            }}>
                            <View style={{flex : 1, backgroundColor: this.state.selectedCategory === value.id ? selectElementTab :'white' , marginTop: 0, paddingLeft: 7, paddingRight: 7,flexDirection : 'row', width : DEVICE_WIDTH*0.925,borderBottomWidth : 0, borderColor : this.subCategories[index].length !== 0 ? 'black' : 'lightgray'}}>
                              <View style={{flex:1, alignItems:'flex-start', justifyContent: 'center'}}>
                                  <Text style={{color:this.state.selectedCategory === value.id ? 'white' : this.subCategories[index].length !== 0 ? 'black' : 'lightgray' }}>{value.name.toUpperCase()}</Text>
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
                let departY = animation.stateBar === animation.stateBarTypes.EXPANDED  ? sizeByDevice(165, 165-23, 122) : 
                              animation.stateBar === animation.stateBarTypes.NORMAL ? sizeByDevice(155, 155-23, 113) : sizeByDevice(86, 86-23, 44) ;
                let verifY = y < departY  || y > departY + Math.min(DEVICE_HEIGHT*0.7, Object.keys(this.subCategoriesSelected).length*40+5) ? true : false;
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
                        height: Math.min(DEVICE_HEIGHT*0.7, Object.keys(this.subCategoriesSelected).length*40+5),
                        top: animation.stateBar === animation.stateBarTypes.EXPANDED  ? sizeByDevice(165, 165-23, 122) : 
                                        animation.stateBar === animation.stateBarTypes.NORMAL ? sizeByDevice(155, 155-23, 113) : sizeByDevice(86, 86-23, 44) ,
                        left : DEVICE_WIDTH*0.075/2,
                        //marginTop:DEVICE_HEIGHT*0.15,                       
                        //borderRadius: DEVICE_HEIGHT*0.03,
                        //alignItems: 'absolute'
                    }}
                  >
                   <ScrollView>
                  {                      
                      this.subCategoriesSelected.map((subValue, index) => {
                          //console.log(subValue.ticker +"  : "+ index+"   :  "+value);
                          return (            
                            <TouchableOpacity key={subValue.ticker} onPress={() => {
                              this.setState({
       
                                selectedSubCategory : subValue.ticker,
                                showModalSubCategory : false
                              }, () => {
                                this.props.filterUpdated(this.state.selectedCategory, this.state.selectedSubCategory, this.searchText);
                              });
                            }}>
                              <View style={{
                                                  height : 40, 
                                                  width : DEVICE_WIDTH*0.925, 
                                                  backgroundColor: 'white', 
                                                  justifyContent: 'center', 
                                                  alignItems: 'center',
                                                  //borderBottomWidth: 1,
                                                  }}>
                                  <View style={{flex : 1, backgroundColor: this.state.selectedSubCategory === subValue.ticker ? selectElementTab :subValue.type === 'SubCategory' ?'white' : 'white' , marginTop: 0, paddingLeft: 7, paddingRight: 7,flexDirection : 'row', width : DEVICE_WIDTH*0.925,borderBottomWidth :subValue.type === 'SubCategory' ? 1 : 1, borderBottomColor : 'gainsboro'}}>
                                    <View style={{flex:1, 
                                                  //alignItems: subValue.type === 'SubCategory' ? 'flex-start' : 'center', 
                                                  alignItems: 'flex-start', 
                                                  justifyContent: 'center'}}>
                                        <Text style={{
                                            color: this.state.selectedSubCategory === subValue.ticker ? 'white' : 'black',
                                            fontWeight: subValue.type === 'SubCategory' ? 'bold' : '400',
                                            //fontSize : subValue.type === 'SubCategory' ? 18 : 16,
                                            }}>{subValue.name}</Text>
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
                  backgroundColor: '#45688e',
                  //borderRadius: 3,
                  borderWidth:0,
                  
                  height: 45,
                  marginTop: 10,
                  width: DEVICE_WIDTH*0.925,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  //alignItems: 'center'
                }]}> 
                  <View style={{flex: 1, height: 45, borderWidth: 0, flexDirection: 'row'}}>   
                    <View style={{flex:0.9, borderWidth: 0, height: 45,justifyContent: 'center', alignItems: 'flex-start'}}>
                    <TouchableOpacity onPress={() => {
                                console.log("qsjhfjhdfjd");
                    }}>
                      <Text style={{paddingLeft : 20,fontFamily: FLFontFamily, fontWeight:'300', fontSize : 30, color:'white'}}>FinLive</Text>    
                      </TouchableOpacity>
                    </View>   

                    <View style={{ flex:0.1, height: 45, borderWidth: 0,justifyContent: 'center', alignItems: 'center'}}> 
                      <TouchableOpacity onPress={() => {
                          
                                Animated.timing(
                                  this.state.positionLeft,
                                    {
                                      toValue: 0,
                                      duration : 1000,
                                      easing: Easing.elastic(),
                                      speed : 1
                                    }
                                  ).start();
                                  /*Animated.timing(
                                    this.state.bgInputTextColor,
                                      {
                                        //toValue: rgba(69, 104, 142),
                                        toValue: 40,
                                        duration : 2000,
                                        //easing: Easing.elastic(),
                                        speed : 1
                                      }
                                    ).start();*/
                        }}>  
                          <MaterialIcons
                            name='search' 
                            size={25} 
                            color='white'
                          />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Animated.View style={{flexDirection:'row', top: 0, backgroundColor: 'white',left: this.state.positionLeft, height: 45}}>
                      <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
                          <TouchableOpacity onPress={() => {
                                console.log("qsjhfjhdfjd");
                                      Animated.timing(
                                        this.state.positionLeft,
                                          {
                                            toValue: DEVICE_WIDTH,
                                            duration : 1000,
                                            easing: Easing.elastic(),
                                            speed : 1
                                          }
                                        ).start();
                                        /*Animated.timing(
                                          this.state.bgInputTextColor,
                                            {
                                              //toValue: rgba(69, 104, 142),
                                              toValue: 40,
                                              duration : 2000,
                                              //easing: Easing.elastic(),
                                              speed : 1
                                            }
                                          ).start();*/
                              }}>  
                                <MaterialIcons
                                      name='search' 
                                      size={22} 
                                      color='lightgray'
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
                                
                                this.props.filterUpdated(this.state.selectedCategory, this.state.selectedSubCategory, this.searchText);
                              }}
                              ref={(inputSearch) => {
                                if (this.inputSearch !== null && this.inputSearch !== undefined) {
                                  this.inputSearch = inputSearch;
                                  inputSearch.blur();
                                }
                              }}
                              onChangeText={(text) => this.searchText = text}
                            />
                          </View>
                  </Animated.View>
        
                    {/*
                                     
                    
                    <TextInput 
                      style={styles.inputText}
                      placeholder={'Je recherche ...'}
                      placeholderTextColor={'#999'}        
                      underlineColorAndroid={'#fff'}
                      autoCorrect={false}
                      //editable={false}
                      onSubmitEditing={() => {
                        animation.expandBar();
                        this.props.filterUpdated(this.state.selectedCategory, this.state.selectedSubCategory, this.searchText);
                      }}
                      ref={(inputSearch) => {
                        if (this.inputSearch !== null && this.inputSearch !== undefined) {
                          this.inputSearch = inputSearch;
                          inputSearch.blur();
                        }
                      }}
                      onChangeText={(text) => this.searchText = text}
                    />*/}
                    
            </Animated.View>
          </View>
        </Animated.View>
        {
          //renderTabBar()
        }
                <View style={ { flexDirection:'row' , alignSelf: 'center', height: 45, width: DEVICE_WIDTH, borderWidth: 0, borderColor: 'black'}}>     
                      <View style={{flex: 0.0375, backgroundColor: tabBackgroundColor}}>
                      </View>
                      <View style={{ borderWidth:0, flex:0.4625, backgroundColor: this.state.showModalCategory ? headerTabColor : tabBackgroundColor}}>
                        <TouchableOpacity style={{flex: 1}} onPress={() => this.setState({showModalCategory : true})}>  
                            <View style={{  flexDirection: 'row',flex:1, backgroundColor: this.state.showModalCategory ? headerTabColor : tabBackgroundColor}}>
                                <View style={{flexWrap: 'wrap',flex:0.7, alignItems: 'flex-start', justifyContent : 'space-evenly', borderWidth:0}}>
                              
                                  <Text style={{paddingLeft: 5,flexWrap: 'wrap',fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 18, color: generalFontColor}}>
                                      {selectedCategorie[0].name}
                                  </Text>
                                  
                                </View>
                                <View style={{flex:0.3, justifyContent : 'center', alignItems: 'center'}}>
                                  
                                  <Icon name={this.state.showModalCategory ? "ios-arrow-up" :"ios-arrow-down"}  style={{color : tabBackgroundColor}}/>
                                
                                </View> 
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={{ flex:0.4625, backgroundColor: this.state.showModalSubCategory ? headerTabColor : tabBackgroundColor}}>
                          <TouchableOpacity style={{flex: 1}} onPress={() => this.setState({showModalSubCategory : true})}>
                            <View style={{ flexDirection: 'row',flex:1, backgroundColor: this.state.showModalSubCategory ? headerTabColor : tabBackgroundColor}}>
                                <View style={{flexWrap: 'wrap',paddingLeft: 3, flex:0.7, alignItems: 'flex-start', justifyContent : 'space-evenly', borderWidth:0}}>  
                                
                                  <Text style={{flexWrap: 'wrap',fontFamily: FLFontFamily, fontWeight: '400', fontSize: 18, color: generalFontColor}}>
                                    {selectedSubCategory[0].name}
                                  </Text>
                                
                                </View>
                                <View style={{flex:0.3, justifyContent : 'center', alignItems: 'center'}}>
                                  
                                    <Icon name={this.state.showModalSubCategory ? "ios-arrow-up" :"ios-arrow-down"}   style={{color : tabBackgroundColor}}/>
                                  
                                </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={{flex: 0.0375, backgroundColor: tabBackgroundColor}}>
                        </View>
                      </View> 
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
  },
  searchContainer: {
    //zIndex: 99,
    backgroundColor: tabBackgroundColor,
    width: '100%',
    //overflow: 'hidden',
    paddingBottom: 10,
    ...sizeByDevice({
      paddingTop: 12
    }, {
      paddingTop: 12
    },
    {
      paddingTop: 37
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