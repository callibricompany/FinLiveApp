import React from 'react';
import { View, ScrollView, StatusBar, Image, FlatList, ActivityIndicator, TouchableOpacity, Text, Dimensions, Switch} from 'react-native'; 


import Ionicons from "react-native-vector-icons/Ionicons";

import { FLScrollView } from '../SearchBar/searchBarAnimation';

import { ifIphoneX, ifAndroid, sizeByDevice, isAndroid, isIphoneX, getConstant } from '../../Utils';

import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import * as Progress from 'react-native-progress';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import botImage from '../../assets/bot.png'

import Numeral from 'numeral'
import 'numeral/locales/fr'



import {  globalStyle, setFont, setColor } from '../../Styles/globalStyle';

import FLTemplateAutocall2 from '../commons/Autocall/FLTemplateAutocall2';


import * as TEMPLATE_TYPE from '../../constants/template'
import { CAutocall2 } from '../../Classes/Products/CAutocall2';








class FLResultPricer extends React.PureComponent {
  
    constructor(props) {
      super(props);

      //recupération des résultats
      
      this.bestProducts = [];
      let bestProducts =  this.props.navigation.getParam('bestProducts', '...');
      
      bestProducts.forEach((p) => {
        this.bestProducts.push(new CAutocall2(p));
      })
      this.optimizer = this.props.navigation.getParam('optimizer', 'CPN');
      // console.log(this.bestProducts);
      // console.log(this.optimizer);
      this.state = {
      
      };
    }

    static navigationOptions = {
      header: null
    }

    componentDidMount() {
      if (!isAndroid()) {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
          StatusBar.setBarStyle(Platform.OS === 'Android' ? 'light-content' : 'dark-content');
        });
      }
    }
    componentWillUnmount() {
      if (!isAndroid()) {
       this._navListener.remove();
      }
    }
 

    
    _renderPrice = (item , id) => {
      //console.log('id : ' +id);
      return (
            <View style={{marginTop: 20, alignItems: 'center', justifyContent:'center', borderWidth: 0, marginLeft : 0, paddingLeft : 0, paddingRight: 2}}>
              <FLTemplateAutocall2 autocall={item} templateType={TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE} isEditable={true} optimizer={this.optimizer}/>
            </View>
      );
    }

    render() {
      //console.log("RENDER TAB RESULTS");
      return (

        <View style={{width: getConstant('width'), height: getConstant('height'), backgroundColor : setColor('background')}}> 
            <View style={{height: 0+ (isAndroid() ? 45 :40+getConstant('statusBar')) , paddingLeft : 5, paddingRight: 10, backgroundColor: 'white', flexDirection : 'row', borderWidth: 0, backgroundColor: 'white', alignItems: 'center', borderBottomWidth : 1, borderBottomColor : 'lightgray'}}>
                  <TouchableOpacity style={{flex : 0.25,flexDirection : 'row',  marginTop : isAndroid() ? 0 : 30, justifyContent: 'flex-start', alignItems: 'center', borderWidth: 0}}
                                    onPress={() => this.props.navigation.goBack()}
                  >
                          <View style={{justifyContent: 'center', alignItems: 'flex-start', borderWidth: 0, paddingLeft : 10}}>
                              {/* <Ionicons name={'ios-arrow-back'}  size={25} style={{color: 'white'}}/> */}
                              <Ionicons name={'md-arrow-back'}  size={25} style={{color: setColor('')}}/>
                          </View>
                          {/* <View style={{justifyContent: 'center', alignItems: 'center', paddingLeft : 5, paddingRight : 5, borderWidth: 0}}>
                              <Text style={setFont('300', 16, setColor(''), 'Regular')}>Retour</Text>
                          </View> */}
                  </TouchableOpacity>

                  <View style={{flex: 0.5, justifyContent: 'center', alignItems: 'center', paddingLeft : 5, paddingRight: 5, marginTop : isAndroid() ? 0 : isIphoneX() ? 40 : 25}}>
                        <Text style={setFont('300', 18, setColor(''), 'Regular')}>{String('résultats').toUpperCase()}</Text>
                  </View>
            </View>

           
    

              
                  <FlatList
                    //style={{alignItems : 'center'}}
                    data={this.bestProducts}
                    //extraData={this.state.isGoodToShow}
                    //renderItem={this._renderRow}
                    keyExtractor={(item) => item.getUniqueId()}
                    //tabRoute={this.props.route.key}
                    //numColumns={3}
                    renderItem={({item, id}) => (
                      this._renderPrice(item, id)    
              
                    )}
                    horizontal={false}
                    ListFooterComponent={() => {
                      return (
                        <View style={{height : 150, marginTop: 100,  alignItems: 'center'}}>
                          <Text style={{fontFamily : 'FLFont'}}>F i n L i v e</Text>
                        </View>
                      );
                    }}
                  />
            
       
        </View>

      );
    }
  }


const composedWithNav = compose(
    //withAuthorization(condition),
     withNavigation,
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(FLResultPricer);

