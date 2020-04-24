import React from 'react';
import { View, ScrollView, StatusBar, Image, FlatList, ActivityIndicator, TouchableOpacity, Text, Dimensions, Switch} from 'react-native'; 


import Ionicons from "react-native-vector-icons/Ionicons";

import { FLScrollView } from '../SearchBar/searchBarAnimation';

import { ifIphoneX, ifAndroid, sizeByDevice, isAndroid, isIphoneX} from '../../Utils';

import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import * as Progress from 'react-native-progress';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import botImage from '../../assets/bot.png'

import Numeral from 'numeral'
import 'numeral/locales/fr'



import {  globalStyle, 
  setFont,
  setColor,
  generalFontColor, 
  blueFLColor,
  headerTabColor,
  selectElementTab,
  subscribeColor,
  FLFontFamily,
  FLFontFamilyBold
} from '../../Styles/globalStyle';

import FLTemplateAutocall from '../commons/Autocall/FLTemplateAutocall';



import * as TEMPLATE_TYPE from '../../constants/template'




const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT =  isAndroid() ? StatusBar.currentHeight : isIphoneX() ? 44 : 20;

class FLResultPricer extends React.PureComponent {
  
    constructor(props) {
      super(props);

      //recupération des résultats
      
      this.bestProducts =  this.props.navigation.getParam('bestProducts', '...');
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
              <FLTemplateAutocall object={item} templateType={TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE} isEditable={true} source={'Pricer'} optimizer={this.optimizer}/>
            </View>
      );
    }

    render() {
      //console.log("RENDER TAB RESULTS");
      return (

        <View style={[globalStyle.bgColor, {width: DEVICE_WIDTH, height: DEVICE_HEIGHT}]}> 
            <View style={{height: 30 + (isAndroid() ? 0 : STATUSBAR_HEIGHT) , paddingLeft : 10, paddingRight: 10, backgroundColor: 'white', paddingTop: STATUSBAR_HEIGHT+ (isAndroid() ? -15 : 0), flexDirection : 'row', borderWidth: 0, backgroundColor: 'white'}}>
                  <TouchableOpacity style={{flex : 0.25,flexDirection : 'row',  justifyContent: 'flex-start', alignItems: 'center', borderWidth: 0}}
                                    onPress={() => this.props.navigation.goBack()}
                  >
                          <View style={{justifyContent: 'center', alignItems: 'center', borderWidth: 0}}>
                              <Ionicons name={'ios-arrow-back'}  size={25} style={{color: setColor('')}}/>
                          </View>
                          <View style={{justifyContent: 'center', alignItems: 'center', paddingLeft : 5, paddingRight : 5, borderWidth: 0}}>
                              <Text style={setFont('300', 16, setColor(''), 'Regular')}>Retour</Text>
                          </View>
                  </TouchableOpacity>

                  <View style={{flex: 0.5, justifyContent: 'center', alignItems: 'center', paddingLeft : 5, paddingRight: 5}}>
                        <Text style={setFont('300', 16, setColor(''), 'Regular')}>{String('résultats').toUpperCase()}</Text>
                  </View>
            </View>

           
    

              
                  <FlatList
                    //style={{alignItems : 'center'}}
                    data={this.bestProducts}
                    //extraData={this.state.isGoodToShow}
                    //renderItem={this._renderRow}
                    keyExtractor={(item) => item.code.toString()}
                    //tabRoute={this.props.route.key}
                    //numColumns={3}
                    renderItem={({item, id}) => (
                      this._renderPrice(item, id)    
              
                    )}
                    horizontal={false}
                    ListFooterComponent={() => {
                      return (
                        <View style={{height : 150, marginTop: 100,  alignItems: 'center'}}>
                          <Text style={{fontFamily : 'FLFontTitle'}}>F i n L i v e</Text>
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

