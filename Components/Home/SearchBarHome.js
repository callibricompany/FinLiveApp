import React, { Component } from 'react';

import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcons  from "react-native-vector-icons/Ionicons";

import { ifIphoneX, ifAndroid, sizeByDevice , getConstant } from '../../Utils';


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
  Keyboard,
  Image
} from 'react-native';

import {  globalSyle, setFont, setColor } from '../../Styles/globalStyle';






export default class SearchBarHome extends Component {

  constructor(props) {
    super(props);


    //recuperation du nom de l'organisation
    this.orgName = this.props.userOrg.hasOwnProperty('name') ? this.props.userOrg.name : '[ORG]';

    //rajout des favoris et de l'organisation 
    this.categories = JSON.parse(JSON.stringify(this.props.categories));
    let obj = {};
    obj["active"] = true;
    obj["categoryName"] = "Favoris";
    obj["codeCategory"] = "PSFAVORITES";
    obj["subCategory"] = this.props.categories.filter(({codeCategory}) => codeCategory === 'PS')[0].subCategory;
    this.categories.push(obj);
    obj = {};
    obj["active"] = true;
    obj["categoryName"] = this.orgName;
    obj["codeCategory"] = "PSORG";
    obj["subCategory"] = this.props.categories.filter(({codeCategory}) => codeCategory === 'PS')[0].subCategory;
    this.categories.push(obj);   

    //on ajoute egalement une sous categorie TOUS a PS
    let objSousCat = {};
    objSousCat["subCategoryHead"] = true;
    objSousCat["subCategoryName"] = "Filtre ...";
    objSousCat["codeSubCategory"] = "PS";
    
    //on selectionne les produits structures par defaut 
    let selectedCategory = this.categories.filter(({codeCategory}) => codeCategory === 'PS')[0];  

    //on ajoute la categorie TOUS au début des sous-categories
    selectedCategory.subCategory.unshift(objSousCat);
    (this.categories.filter(({codeCategory}) => codeCategory === 'PSFAVORITES')[0]).subCategory.unshift(objSousCat);
    


    this.state = {


      //hide or show category and sub-category if searchtext is showed
      //categoryHeight : new Animated.Value(45),
      categoryHeight : new Animated.Value(0),
      //paddingCategoryHeight : new Animated.Value(50),
      showModalTitle : true,
      
      //animation barre de recherche
      positionLeft: new Animated.Value(getConstant('width')),
      bgInputTextColor : new Animated.Value(0),

      //relatifs au modal de filtre
      leftPositionCategory : new Animated.Value(0),
      showModalCategory: false,
      selectedCategory : selectedCategory,

      showModalSubCategory : false,
      selectedSubCategory : selectedCategory.subCategory[0],
    }

    //texte de la barre de filtre
    this.searchText = '';
    
    //console.log(this.categories);
  }



  UNSAFE_componentWillMount() {
    //fait pour palier au bug android d'apparition des tabbar quand les claviers apparaissent
    //this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => console.log("CLAVIER DEACTIVE"));
    //this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => console.log("CLAVIER ACTIVE"));
  }

  componentWillUnmount() {
      //this.keyboardDidShowListener.remove();
      //this.keyboardDidHideListener.remove();
  }

  /*async componentDidMount() {
    await Font.loadAsync({
      'FLFont': require('../../assets/fonts/Typo_Round_Regular_Demo.otf'),
    });

    this.setState({ fontLoaded: true });

    //console.log(this.props.categories)
  }*/





  render() {
    const { animation, changeInputFocus, renderTabBar } = this.props;

    let transformWrapper = animation.getTransformWrapper();
    const transformSearchBar = animation.getTransformSearchBar();
    let opacitySearchBar = animation.getOpacitySearchBar(this.state.showModalTitle);
    const opacityLocationInput = animation.getOpacityLocationInput();
    const arrowMinimizeStyle = animation.getArrowMinimizeStyle();
  
    let subCategories = this.state.selectedCategory.subCategory;

    //console.log("TRANSFORMSEARCHBAR : "+ this.state.showModalTitle);
    return (
      <Animated.View style={[styles.wrapper, this.state.showModalTitle ? transformWrapper : transformSearchBar]}>
        <Modal
            animationType="none"
            transparent={true}
            visible={this.state.showModalCategory}
            onRequestClose={() => {
              console.log('Modal has been closed');
            }}
            onShow={() => {
              console.log("showsjhdjshd");
              Animated.timing(
                    this.state.leftPositionCategory,
                      {
                        toValue: getConstant('width')*0.5,
                        duration : 1000,
                        easing: Easing.elastic(),
                        speed : 1
                      }
              ).start();
            }}
        >
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
                let verifX = x < getConstant('width')*0.0  || x > getConstant('width')*0.5 ? true : false;
                let departY =  animation.stateBar === animation.stateBarTypes.EXPANDED  ? sizeByDevice(165, 165-23, 80) -30-4: 
                             animation.stateBar === animation.stateBarTypes.NORMAL ? sizeByDevice(155, 155-23, 70)-4: sizeByDevice(86, 86-23, 1)-4;
                let verifY = y < departY  || y > departY + Math.min(getConstant('height')*0.7, Object.keys(this.categories).length*40+5) ? true : false;
                if (verifX || verifY) {
                  Animated.spring(
                    this.state.leftPositionCategory,
                      {
                        toValue: 0,
                        duration : 500,
                        //easing: Easing.elastic(),
                        speed : 1
                      }
                   ).start();
                   this.setState({showModalCategory : false});
                }
              }}

            >
                  <Animated.View 
                    //directionalLockEnabled={true} 
                    //contentContainerStyle={{
                      style={{
                        backgroundColor: 'white',
                        borderWidth :1,
                        borderColor : setColor('darkBlue'),
                        //borderRadius:10,
                        width: this.state.leftPositionCategory,
                        height: Math.min(getConstant('height')*0.7, Object.keys(this.categories).length*40+5),
                        top:  animation.stateBar === animation.stateBarTypes.EXPANDED  ? sizeByDevice(125, 125-23, 80) -30-4: 
                                  animation.stateBar === animation.stateBarTypes.NORMAL ? sizeByDevice(115, 115-23, 70) - 30-4 : sizeByDevice(86, 86-23, 1)-4,
                        left : getConstant('width')*0,
                        //marginTop:getConstant('height')*0.15,                       
                        //borderRadius: getConstant('height')*0.03,
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
                              let filter = value.codeCategory;
                  
                              if (value.codeCategory === "PSFAVORITES"){
                                
                                filter = "PS";
                             
                              }
                              if (this.orgName === value.codeCategory){
                                filter = "PS";
                               
                              }
                              this.setState({
                                selectedCategory : value, 
                                selectedSubCategory : this.categories.filter(({codeCategory}) => codeCategory === filter)[0].subCategory[0],
                                showModalCategory : false
                              }, () => {
    
                                this.props.filterUpdated(value, this.state.selectedSubCategory, this.searchText);
                              });
                          }
  
                        }}>
                        <View style={{
                                            height : 40, 
                                            width : getConstant('width')*0.925, 
                                            backgroundColor:'white', 
                                            justifyContent: 'center', 
                                            alignItems: 'center'
                                            }}>
                            <View style={{flex : 1, backgroundColor: this.state.selectedCategory === value ? setColor('darkBlue') :'white' , marginTop: 0, paddingLeft: 7, paddingRight: 7,flexDirection : 'row', width : getConstant('width')*0.925, borderColor : this.categories.active ? 'black' : 'lightgray'}}>
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
                </Animated.View>
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
                let verifX = x < getConstant('width')*0.0375 || x > getConstant('width')*0.9625 ? true : false;
                //let verifY = y < animation.topPartHeight + 45  || y > Math.min(getConstant('height')*0.7, Object.keys(this.subCategoriesSelected).length*40+5) ? true : false;
                let departY = animation.stateBar === animation.stateBarTypes.EXPANDED  ? sizeByDevice(165, 165-23, 120) -30 -4: 
                              animation.stateBar === animation.stateBarTypes.NORMAL ? sizeByDevice(155, 155-23, 111) - 30 - 4: sizeByDevice(86, 86-23, 42) - 4;
                let verifY = y < departY  || y > departY + Math.min(getConstant('height')*0.7, Object.keys(subCategories).length*40+5) ? true : false;
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
                        borderColor : setColor('darkBlue'),
                        width: getConstant('width')*0.925,
                        height: Math.min(getConstant('height')*0.7, Object.keys(subCategories).length*40+5),
                        top: animation.stateBar === animation.stateBarTypes.EXPANDED  ? sizeByDevice(165, 165-23, 120) -30-4: 
                                        animation.stateBar === animation.stateBarTypes.NORMAL ? sizeByDevice(155, 155-23, 111) -30-4: sizeByDevice(86, 86-23, 42)-4 ,
                        left : getConstant('width')*0.075/2,
                        //marginTop:getConstant('height')*0.15,                       
                        //borderRadius: getConstant('height')*0.03,
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
                                                  width : getConstant('width')*0.925, 
                                                  backgroundColor: 'white', 
                                                  justifyContent: 'center', 
                                                  alignItems: 'center',
                                                  //borderBottomWidth: 1,
                                                  }}>
                                  <View style={{flex : 1, backgroundColor: this.state.selectedSubCategory === subValue ? setColor('darkBlue') :subValue.subCategoryHead ? subValue.codeSubCategory === "PS" ? 'darkgray' : 'gainsboro' : subValue.groupingHead ? 'lavender' : 'white' , marginTop: 0, paddingLeft: 7, paddingRight: 7,flexDirection : 'row', width : getConstant('width')*0.925,borderBottomWidth :subValue.subCategoryHead ? 1 : 1, borderBottomColor : 'gainsboro'}}>
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
                  backgroundColor: 'white',
                  //borderRadius: 3,
                  borderWidth:0,
                  //borderBottomWidth: 1,
                  //borderBottomColor: setColor(''),
                  height: 45,
                  marginTop: 0,
                  width: getConstant('width')*1,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center'
                }]}> 
                  <View style={{flex: 1, height: 45, borderWidth: 0, width: getConstant('width')*0.975,flexDirection: 'row'}}>   
                    <TouchableOpacity style={{flex:0.1, borderWidth: 0, height: 45,justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 3}}
                                      onPress={() => {
                                        this.setState({showModalCategory : true});
                                      }}
                    >
                        <IonIcons name={'ios-menu'}  size={25} style={{color: setColor('')}}/> 
                    </TouchableOpacity>
                    <View style={{flex:0.8, borderWidth: 0, height: 45,justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{paddingLeft : 5,fontFamily: 'FLFont' , fontWeight:'200', fontSize : 24, color: setColor('')}}>F i n L i v e</Text>    
                    </View>   

                    <TouchableOpacity style={{ flex:0.1, height: 45, borderWidth: 0,justifyContent: 'center', alignItems: 'center'}}
                         onPress={() => {
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
                          <IonIcons
                            name='ios-search' 
                            size={25} 
                            color={setColor('')}
                          />
                      </TouchableOpacity>
                    
                  </View>
                  <Animated.View style={{flexDirection:'row', top: 0, width: getConstant('width'), backgroundColor: 'white',left: this.state.positionLeft, height: 45}}>
                      <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
                          <TouchableOpacity onPress={() => {
                                       //this.setState ({ showModalTitle : !this.state.showModalTitle });
                                       //console.log("SCROLL Y : "+ JSON.stringify(animation.scrollY));
                                       
                                       this.props.changeMarginSearch(0);
                                        Animated.parallel([
                                          Animated.timing(
                                              this.state.positionLeft,
                                                {
                                                  toValue: getConstant('width'),
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
                                            ) */ 
                                        ]).start(() => {
                                              //force le render avec un changement de state dont on se fiche 
                                              this.setState ({ showModalTitle : !this.state.showModalTitle });
                                              this.props.manageVisibilityTabBar(false);
                                        });

                                        if (this.inputSearch !== null && this.inputSearch !== undefined) {
                                          this.inputSearch.blur();
                                        }
                                        this.searchText = '';
                                        this.props.filterUpdated(this.state.selectedCategory, this.state.selectedSubCategory, '');
                              }}>  
                                <IonIcons
                                      name='md-arrow-back' 
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
        {/*<Animated.View style={ { flexDirection:'row' , borderBottomWidth: 4, borderBottomColor : setColor('background'),alignSelf: 'center', height: this.state.categoryHeight, width: getConstant('width'), borderWidth: 0, borderColor: 'black'}}>     
                      <View style={{flex: 0.0375, backgroundColor: 'white'}}>
                      </View>
                      <View style={{ borderWidth:0, flex:0.4625, backgroundColor: this.state.showModalCategory ? setColor('darkBlue') : 'white'}}>
                        { this.state.showModalTitle ?<TouchableOpacity style={{flex: 1}} onPress={() => this.setState({showModalCategory : true})}>  
                            <View style={{  flexDirection: 'row',flex:1, backgroundColor: this.state.showModalCategory ? setColor('darkBlue') : 'white'}}>
                                <View style={{flexWrap: 'wrap',flex:0.7, alignItems: 'flex-start', justifyContent : 'space-evenly', borderWidth:0}}>
                              
                                  <Text style={{paddingLeft: 5,flexWrap: 'wrap',ffontWeight: '400', fontSize: 12, color: setColor('darkBlue')}}>
                                      {this.state.selectedCategory.categoryName.toUpperCase()}
                                  </Text>
                                  
                                </View>
                                <View style={{flex:0.3, justifyContent : 'center', alignItems: 'center'}}>
                                  
                                  <Icon name={this.state.showModalCategory ? "ios-arrow-up" :"ios-arrow-down"}  style={{color : this.state.showModalCategory ? 'white' : setColor('darkBlue')}}/>
                                
                                </View> 
                            </View>
                          </TouchableOpacity> : null }
                        </View>
                        <View style={{ flex:0.4625, backgroundColor: this.state.showModalSubCategory ? setColor('darkBlue') : 'white'}}>
                        { this.state.showModalTitle ? <TouchableOpacity style={{flex: 1}} onPress={() => this.setState({showModalSubCategory : true})}>
                            <View style={{ flexDirection: 'row',flex:1,  backgroundColor: this.state.showModalSubCategory ? setColor('darkBlue') : 'white'}}>
                                <View style={{flexWrap: 'wrap',paddingLeft: 3, flex:0.7, alignItems: 'flex-start', justifyContent : 'space-evenly', borderWidth:0}}>  
                                
                                  <Text style={{flexWrap: 'wrap', fontWeight: '400', fontSize: 12, color: setColor('darkBlue')}}>
                                    {this.state.selectedSubCategory.subCategoryName.toUpperCase()}
                                  </Text>
                                
                                </View>
                                <View style={{flex:0.3, justifyContent : 'center', alignItems: 'center'}}>
                                  
                                    <Icon name={this.state.showModalSubCategory ? "ios-arrow-up" :"ios-arrow-down"}   style={{color : this.state.showModalSubCategory ? 'white' : setColor('darkBlue')}}/>
                                  
                                </View>
                            </View>
                          </TouchableOpacity> : null }
                        </View>
                        <View style={{flex: 0.0375, backgroundColor: 'white'}}>
                        </View>
                      </Animated.View> 
      */}
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
    backgroundColor: 'white',
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
    width: getConstant('width')*0.925,
    marginRight : 0,
    marginLeft : Platform.OS === 'ios' ? 0 : 0,
    alignSelf: 'center'
   //marginLeft: getConstant('width')*0.0375,
   // marginRight:  getConstant('width')*0.0375,
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