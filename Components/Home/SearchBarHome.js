import React, { Component } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Icon, Button } from 'native-base'
import { ifIphoneX, ifAndroid } from '../../Utils';
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
  SectionList
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
                let verifX = x < DEVICE_WIDTH*0.025  || x > DEVICE_WIDTH*0.975/2 ? true : false;
                let verifY = y < animation.topPartHeight + 45  || y > Math.min(DEVICE_HEIGHT*0.7, Object.keys(CATEGORIES).length*40+5) ? true : false;
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
                        width: DEVICE_WIDTH*0.95/2,
                        height: Math.min(DEVICE_HEIGHT*0.7, Object.keys(CATEGORIES).length*40+5),
                        top: animation.topPartHeight + 45,
                        left : DEVICE_WIDTH*0.025,
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
                                            width : DEVICE_WIDTH*0.95, 
                                            backgroundColor:'white', 
                                            justifyContent: 'center', 
                                            alignItems: 'center'
                                            }}>
                            <View style={{flex : 1, backgroundColor: this.state.selectedCategory === value.id ? selectElementTab :'white' , marginTop: 2, paddingLeft: 7, paddingRight: 7,flexDirection : 'row', width : DEVICE_WIDTH*0.95,borderBottomWidth : 1, borderColor : this.subCategories[index].length !== 0 ? 'black' : 'lightgray'}}>
                              <View style={{flex:0.8, alignItems:'flex-start', justifyContent: 'center'}}>
                                  <Text style={{color:this.state.selectedCategory === value.id ? 'white' : this.subCategories[index].length !== 0 ? 'black' : 'lightgray' }}>{value.name.toUpperCase()}</Text>
                              </View>
                              <View style={{flex:0.2, alignItems: 'flex-end', justifyContent: 'center'}}>
                                   <Icon name="ios-arrow-forward"  style={{color : this.state.selectedCategory === value.id ? 'white' :this.subCategories[index].length !== 0 ? 'black' : 'lightgray' }}/>
                              </View>
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
                let verifX = x < DEVICE_WIDTH*0.5 || x > DEVICE_WIDTH*0.975 ? true : false;
                let verifY = y < animation.topPartHeight + 45  || y > Math.min(DEVICE_HEIGHT*0.7, Object.keys(this.subCategoriesSelected).length*40+5) ? true : false;
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
                        width: DEVICE_WIDTH*0.95/2,
                        height: Math.min(DEVICE_HEIGHT*0.7, Object.keys(this.subCategoriesSelected).length*40+5),
                        top: animation.topPartHeight + 45,
                        left : DEVICE_WIDTH*0.5,
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
                                                  width : DEVICE_WIDTH*0.95/2, 
                                                  backgroundColor: 'white', 
                                                  justifyContent: 'center', 
                                                  alignItems: 'center'
                                                  }}>
                                  <View style={{flex : 1, backgroundColor: this.state.selectedSubCategory === subValue.ticker ? selectElementTab :subValue.type === 'SubCategory' ?'lightgray' : 'white' , marginTop: 2, paddingLeft: 7, paddingRight: 7,flexDirection : 'row', width : DEVICE_WIDTH*0.95/2,borderBottomWidth :subValue.type === 'SubCategory' ? 1 : 0, borderColor :  'black' }}>
                                    <View style={{flex:1, 
                                                  //alignItems: subValue.type === 'SubCategory' ? 'flex-start' : 'center', 
                                                  alignItems: 'center', 
                                                  justifyContent: 'center'}}>
                                        <Text style={{
                                            color: this.state.selectedSubCategory === subValue.ticker ? 'white' : 'black',
                                            fontWeight: subValue.type === 'SubCategory' ? 'bold' : '400',
                                            fontSize : subValue.type === 'SubCategory' ? 18 : 16,
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
            {/*<Animated.View style={[
              styles.arrowMinimizeContainer, 
              arrowMinimizeStyle
            ]}>
              <TouchableOpacity onPress={() => {
                animation.minimizeBar();
                this.blurInputs();
              }}>
                <MaterialIcons
                  name='keyboard-arrow-up' 
                  size={36} 
                  style={styles.arrowMinimizeIcon} 
                  color='#fff'
                />
              </TouchableOpacity>
            </Animated.View>*/}
            
            <Animated.View style={[transformSearchBar]}>
               <View style={[styles.searchInput,  { borderWidth:0,borderColor:'red', flexDirection:'row' }]}>     
               <View style={{ paddingLeft:3, borderWidth:0, flex:0.5, backgroundColor: this.state.showModalCategory ? headerTabColor : tabBackgroundColor}}>
                 <TouchableOpacity style={{flex: 1}} onPress={() => this.setState({showModalCategory : true})}>  
                  <View style={{  flexDirection: 'row',flex:1, backgroundColor: this.state.showModalCategory ? headerTabColor : tabBackgroundColor}}>
                      <View style={{flexWrap: 'wrap',flex:0.7, alignItems: 'flex-start', justifyContent : 'space-evenly', borderWidth:0}}>
                     
                        <Text style={{flexWrap: 'wrap',fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 18, color: generalFontColor}}>
                            {selectedCategorie[0].name}
                        </Text>
                        
                      </View>
                      <View style={{flex:0.3, justifyContent : 'center', alignItems: 'center'}}>
                        
                         <Icon name={this.state.showModalCategory ? "ios-arrow-up" :"ios-arrow-down"}  style={{color : generalFontColor}}/>
                       
                      </View> 
                  </View>
                  </TouchableOpacity>
                  </View>
                  <View style={{ paddingLeft:3, flex:0.5, backgroundColor: this.state.showModalSubCategory ? headerTabColor : tabBackgroundColor}}>
                  <TouchableOpacity style={{flex: 1}} onPress={() => this.setState({showModalSubCategory : true})}>
                  <View style={{ flexDirection: 'row',flex:1, backgroundColor: this.state.showModalSubCategory ? headerTabColor : tabBackgroundColor}}>
                      <View style={{flexWrap: 'wrap',flex:0.7, alignItems: 'flex-start', justifyContent : 'space-evenly', borderWidth:0}}>  
                      
                        <Text style={{flexWrap: 'wrap',fontFamily: FLFontFamily, fontWeight: '400', fontSize: 18, color: generalFontColor}}>
                          {selectedSubCategory[0].name}
                        </Text>
                      
                      </View>
                      <View style={{flex:0.3, justifyContent : 'center', alignItems: 'center'}}>
                        
                          <Icon name={this.state.showModalSubCategory ? "ios-arrow-up" :"ios-arrow-down"}   style={{color : generalFontColor}}/>
                        
                      </View>
                  </View>
                  </TouchableOpacity>
                  </View>
              </View>
            </Animated.View>
            <Animated.View style={[
                styles.searchInput, 
                styles.locationInput, 
                //opacityLocationInput
                opacitySearchBar
              ]}>               
                <MaterialIcons
                  name='search' 
                  size={22} 
                  style={styles.searchIcon} 
                  color='#bbb'
                />
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
                />
         
 
            </Animated.View>
          </View>
        </Animated.View>
        {renderTabBar()}
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
    zIndex: 99,
    backgroundColor: tabBackgroundColor,
    width: '100%',
    overflow: 'hidden',
    paddingBottom: 10,
    ...ifIphoneX({
      paddingTop: 12
    }, {
      paddingTop: 28
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
    marginLeft: 10,
    marginRight: 10,
  },
  locationInput: {
    marginTop: 10,
  },
  searchIcon: {
    position: 'absolute',
    left: 13,
    top: 12,
  },
  inputText: {
    display: 'flex',
    ...ifAndroid({
      marginTop: 9
    }, {
      marginTop: 13
    }),
    marginLeft: 43,
    fontSize: 15,
    color: '#999',
  },
});