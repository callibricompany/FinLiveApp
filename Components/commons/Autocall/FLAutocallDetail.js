import React from 'react';
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, StyleSheet, Platform, extInput, Modal, KeyboardAvoidingView, Keyboard, ActivityIndicator} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

import Moment from 'moment';
import localization from 'moment/locale/fr'


import { FontAwesome } from '@expo/vector-icons';

import { ssCreateStructuredProduct } from '../../../API/APIAWS';

import { setFont, setColor } from '../../../Styles/globalStyle';


import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import Numeral from 'numeral'
import 'numeral/locales/fr'


import { ifIphoneX, ifAndroid, sizeByDevice, currencyFormatDE, isEqual} from '../../../Utils';
import Dimensions from 'Dimensions';

import * as TICKET_TYPE from '../../../constants/ticket'
import STRUCTUREDPRODUCTS from '../../../Data/structuredProducts.json';
import FREQUENCYLIST from '../../../Data/frequencyList.json'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

import { CAutocall } from '../../../Classes/Products/CAutocall';




class FLAutocallDetail extends React.Component {
    
    constructor(props) {
      super(props);
  

      this.item= this.props.item;
      this.autocall = new CAutocall(this.item.data);

      this.state = {

        nominal : 0,


        //affchage du modal description avant traiter
        showModalDescription : false,

      }
      
    }

   
    //coupons si Phoenix
    _getCouponPhoenixBloc() {
      let coupons = <View><View style={{backgroundColor: blueFLColor, borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 5}}>
        <Text style={{color: 'white'}}>COUPONS</Text>

      </View>
      <View style={{flexDirection : 'row', borderBottomWidth: 1, padding: 3}}>
        <Text style={{fontSize: 12, textAlign: 'justify'}}>
            {!this.isPhoenix ? 'Si à une date ci-dessous, le niveau du sous-jacent est supérieur ou égal au niveau de rappel alors le coupon de rappel est payé et le produit s\'arrête.' 
                              : 'Si à une date ci-dessous, le niveau du sous-jacent est supérieur ou égal au niveau de rappel le produit s\'arrête.'}
        </Text>
      </View>
      <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
        <View style={{flex: 0.33, backgroundColor: 'aliceblue'}}>
          <Text style={[styles.textProperty, {textAlign: 'center', textAlignVertical: 'center'}]}>
            DATE
          </Text>

        </View>
        <View style={{flex: 0.33,  borderLeftWidth: 1, backgroundColor: 'aliceblue'}}>
          <Text style={[styles.textProperty, {textAlign: 'center', textAlignVertical: 'center'}]}>
          NIVEAU
          </Text>
        </View>
        <View style={{flex: 0.33,  borderLeftWidth: 1, backgroundColor: 'aliceblue'}}>
        <Text style={[styles.textProperty, {textAlign: 'center', textAlignVertical: 'center'}]}>
          COUPON
          </Text>
        </View>
      </View>
      </View>
      
  
       return (
         <View>{coupons}
         {    this.phoenixDatas.map((obj, i) => {
            //console.log(i +"  :  "+obj);
            
           
              return (<View key={i} style={{flexDirection : 'row', borderBottomWidth: i === this.phoenixDatas.length - 1 ? 2 : 1}}>
                <View style={{flex: 0.33}}>
                  <Text style={[styles.textProperty, {textAlign: 'center'}]}>
                    {obj["date"].locale('fr',localization).format('ll')}
                  </Text>

                </View>
                <View style={{flex: 0.33,  borderLeftWidth: 1}}>
                  <Text style={[styles.textProperty, {textAlign: 'center'}]}>
                  {Numeral(obj['level']).format('0%')}
                  </Text>
                </View>
                <View style={{flex: 0.33,  borderLeftWidth: 1}}>
                  <Text style={[styles.textProperty, {textAlign: 'center'}]}>
                    {Numeral(obj['coupon']).format('0.00%')}
                  </Text>
                </View>
            </View>)
          
          //coupons = coupons + ech;
          })}
         </View>
       );
    }

    render() {
      

      return(
            <SafeAreaView> 
              <View style={{height: 100, backgroundColor : setColor('turquoise'), paddingTop : 10, paddingLeft : 10, borderWidth : 0}}>
                  <TouchableOpacity style={{flexDirection : 'row', borderWidth: 0, padding : 5}}
                                    onPress={() => this.props.navigation.goBack()}
                  >
                      <View style={{justifyContent: 'center', alignItems: 'center'}}>
                           <Ionicons name={'ios-arrow-back'}  size={25} style={{color: 'white'}}/>
                      </View>
                      <View style={{justifyContent: 'center', alignItems: 'flex-start', paddingLeft : 5}}>
                           <Text style={setFont('300', 18, 'white', 'Regular')}>Retour</Text>
                      </View>
                  </TouchableOpacity>
              </View>
              <View style={{
                            marginTop : -50,
                            height: 100, 
                            width: 0.9*DEVICE_WIDTH, 
                            marginLeft : 0.05*DEVICE_WIDTH,
                            shadowColor: 'rgb(75, 89, 101)',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.9,
                            borderWidth :  1,
                            borderColor : 'white',
                            //borderTopLeftRadius: 15,
                            borderRadius: 10,
                            //overflow: "hidden",
                          }}
              >
                     <Text>jsddhfsjdhf</Text>
              </View>


            </SafeAreaView>


      );
    }
}



const condition = authUser => !!authUser;
const composedStructuredProductDetail = compose(
 withAuthorization(condition),
  withNavigation,
  withUser
);

//export default HomeScreen;
export default hoistStatics(composedStructuredProductDetail)(FLAutocallDetail);


