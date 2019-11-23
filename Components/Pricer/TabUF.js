import React from 'react';
import { View, ScrollView, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, Text, Platform, TextInput} from 'react-native'; 
import { Thumbnail, Label, Item, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";

import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { FLScrollView } from '../SearchBar/searchBarAnimation';

import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';

import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import * as Progress from 'react-native-progress';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import { FLSlider2 } from '../../Components/commons/FLSlider2'

import Feather from 'react-native-vector-icons/Feather';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import Dimensions from 'Dimensions';

import {  setFont, 
  generalFontColor, 
  blueFLColor,
  headerTabColor,
  selectElementTab,
  subscribeColor,
  FLFontFamily,
  FLFontFamilyBold
} from '../../Styles/globalStyle';








const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


const minusIcon = (isMinusDisabled, touchableDisabledColor, touchableColor) => {
  return <Feather name='minus' size={20} color={isMinusDisabled ? touchableDisabledColor : touchableColor} />
};

const plusIcon = (isPlusDisabled, touchableDisabledColor, touchableColor) => {
  return <Feather name='plus' size={20} color={isPlusDisabled ? touchableDisabledColor : touchableColor} />
};

class TabUF extends React.PureComponent {
  
    constructor(props) {
      super(props);

      this.state = {
        UF : this.props.product.UF.value,
        UFAssoc : this.props.product.UFAssoc.value,
        nimporte : true,
      };

    }


    componentWillReceiveProps(props) {
      this.setState({ nimporte : !this.state.nimporte});
    }


    render() {

      return (
          <ScrollView 
          contentContainerStyle={{justifyContent: 'flex-start',borderWidth:0, alignItems: 'center', marginTop: Platform.OS === 'ios' ? 35 : 35 }}
                tabRoute={this.props.route.key}
          >
              <View style={{marginTop :-200}}>
                    <TextInput
                          style={[setFont('600', 50), {height: 0 }]}
                          ref={(input) => { this.UFTextInput = input; }}
                          keyboardType={'numeric'}
                          returnKeyType={'done'}
                          clearButtonMode={'while-editing'}
                          onFocus={() => this.setState({ UF: 0})}
                          onChangeText={(e) => {
                                this.setState({ UF :  e === '' ? 0 : Numeral(e).value()/100}, () => {
                                  this.props.needToRefresh();
                                  this.props.updateUF(this.state.UF, this.state.UFAssoc);
                                });              
                          }}
                          //value={this.state.UF === 0 ? '' : ''+Number(this.state.UF*100)}
                          //value={this.state.UF === 0 ? '' : ''+Number.parseFloat(this.state.UF*100).toFixed(2)}
                        />
                        <TextInput
                          style={setFont('600', 36)}
                          ref={(input) => { this.UFAssocTextInput = input; }}
                          keyboardType={'numeric'}
                          returnKeyType={'done'}
                          clearButtonMode={'while-editing'}
                          onFocus={() => this.setState({ UFAssoc: 0})}
                          onChangeText={(e) => {
                            //console.log("NUMERAL : " + Numeral(e).value());
                                this.setState({ UFAssoc :  e === '' ? 0 : Numeral(e).value()/100}, () => {
                                  this.props.needToRefresh();
                                  this.props.updateUF(this.state.UF, this.state.UFAssoc);
                                });              
                          }}
                          //value={this.state.UF === 0 ? '' : ''+Number(this.state.UF*100)}
                          //value={this.state.UFAssoc === 0 ? '' : ''+Numeral(this.state.UFAssoc).format('0.00%')}
                        />

              </View>

              <View style={{flexDirection: 'column', width : DEVICE_WIDTH*0.7, marginTop: 200, borderWidth: 0}}>
                <View>
                      <Text style={[setFont('400', 18), {marginBottom : 20}]}>
                          Votre commission 
                      </Text>
                </View>
                <TouchableOpacity style={{marginTop: 10, flexDirection: 'row', backgroundColor: 'white',  justifyContent: 'center', alignItems: 'flex-start'}}
                                  onPress={() => {
                                    this.UFTextInput.focus(); 
                                  }}>              
                   <Text style={setFont('bold', 50)}>{ Numeral(this.state.UF).format('0.00 %')}</Text>
                </TouchableOpacity> 
              </View>
              <View style={{flexDirection: 'column', width : DEVICE_WIDTH*0.7, marginTop: 100, borderWidth: 0}}>
                <View>
                      <Text style={[setFont('400', 14), {marginBottom : 20}]}>
                          Pour votre association 
                      </Text>
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: 'white',  justifyContent: 'center', alignItems: 'flex-start'}}
                                  onPress={() => {
                                    this.UFAssocTextInput.focus(); 
                                  }}>              
                   
                   <Text style={setFont('bold', 36)}>{ Numeral(this.state.UFAssoc).format('0.00 %')}</Text>
                </TouchableOpacity> 
              </View>
          </ScrollView>

      );
    }
  }


const composedWithNav = compose(
    //withAuthorization(condition),
     withNavigation,
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(TabUF);

/*



                      <FLSlider2
                          min={0}
                          max={6}
                          step={0.05}
                          //value={this.state.product['UF'].value*100}
                          value={this.state.UF*100}
                          isPercent={true}
                          spreadScale={1}
                          //activated={!this.state.product["UF"].isActivated}
                          sliderLength={DEVICE_WIDTH*0.925}
                          callback={(value) => {
                            //console.log("CALLBACK : "+value);
                            this.setState({ UF : value.toFixed(2)/100 }, () => {
                              this.props.needToRefresh();
                              this.props.updateUF(this.state.UF, this.state.UFAssoc);
                              //this.calculateBestProducts()
                              //.then(() => this.setState({isLoadingBestProduct:false, isRecalculationNeeded : true}) )
                              //.catch((error) => {
                              //    this.setState({isLoadingBestProduct:false});
                              //    console.log("ERREUR CALCULATE BEST PRODUCTS : "+error);
                              //});
                            });
                            
                          }}
                          single={true}
                        />


                          <FLSlider2
                          min={0}
                          max={2}
                          step={0.05}
                          //value={this.state.product['UF'].value*100}
                          value={this.state.UFAssoc*100}
                          isPercent={true}
                          spreadScale={0.5}
                          //activated={!this.state.product["UF"].isActivated}
                          sliderLength={DEVICE_WIDTH*0.925}
                          callback={(value) => {
 
                            this.setState({ UFAssoc : value.toFixed(2)/100 }, () => {
                              this.props.updateUF(this.state.UF, this.state.UFAssoc);
                              //this.calculateBestProducts()
                              //.then(() => this.setState({isLoadingBestProduct:false, isRecalculationNeeded : true}) )
                              //.catch((error) => {
                              //    this.setState({isLoadingBestProduct:false});
                              //    console.log("ERREUR CALCULATE BEST PRODUCTS : "+error);
                              //});
                            });
                            
                          }}
                          single={true}
                        />

*/