import React from 'react';
import { View, ScrollView, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, Text, Platform, Switch} from 'react-native'; 
import { Thumbnail, Toast, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";

import { MaterialIcons, Ionicons } from '@expo/vector-icons';

import { FLScrollView } from '../SearchBar/searchBarAnimation';

import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';

import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import * as Progress from 'react-native-progress';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import { FLSlider2 } from '../../Components/commons/FLSlider2'

import Numeral from 'numeral'
import 'numeral/locales/fr'

import Dimensions from 'Dimensions';

import {  globalSyle, 
  generalFontColor, 
  tabBackgroundColor,
  headerTabColor,
  selectElementTab,
  subscribeColor,
  FLFontFamily,
  FLFontFamilyBold
} from '../../Styles/globalStyle';






const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


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


              <View style={{marginTop: 30, borderWidth: 0}}>
                      <Text style={{fontFamily: FLFontFamily, fontWeight: '400', fontSize: 18, color: 'black', marginBottom : 20}}>
                          Votre commission : { Numeral(this.state.UF).format('0.00 %')}
                      </Text>
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
                      <Text style={{fontFamily: FLFontFamily, fontWeight: '400', fontSize: 16, color: 'black', marginTop : 60, marginBottom : 20}}>
                          Pour votre association : { Numeral(this.state.UFAssoc).format('0.00 %')}
                      </Text>
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
              </View>
              <View style={{height: 150}}>
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

