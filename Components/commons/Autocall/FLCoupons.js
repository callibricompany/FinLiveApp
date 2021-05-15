import React, { useState, useRef} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";


import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE } from '../../../Utils';


import Numeral from 'numeral';
import 'numeral/locales/fr';

import Moment from 'moment';
import { PropTypes } from 'victory-native';





export function FLCoupons ({phoenixDatas, isMemory, updateProduct}) {

    let alreadyBreaked = false;

    var minDateConstatsArray = [...new Set(phoenixDatas.map(x => x.date))];
    var minDateConstat = new Date(Math.min.apply(Math, minDateConstatsArray));
    var today = new Date(Date.now());
    var flewToApply = minDateConstat < today ? 0.25 : 0.333

    return (
      <View style={{marginRight : 10, borderWidth : 0}}>
        <View style={{flex: 1, justifyContent: 'flex-start', borderWidth: 0, marginTop : 5, marginBottom: 5}}>
                  <Text style={setFont('400', 12, 'black','Regular')}>
                  Si à une date ci-dessous, le niveau du sous-jacent est supérieur ou égal à la barrière de coupon alors le coupon est payé.
  
                  </Text>


        </View>

        <View style={{flexDirection: 'row', marginTop : 5}}>
              <View style={{flex: flewToApply, padding : 5}}>
                 <Text style={[setFont('400', 12, 'black','Bold'), {textAlign: 'center'}]}>Date de constatation</Text>
              </View>
              <View style={{flex: flewToApply, padding : 5}}>
                <Text style={[setFont('400', 12, 'black','Bold'), {textAlign: 'center'}]}>
                  Barrière de coupon
                </Text>
              </View>
              {
                    minDateConstat < today 
                    ?
                    <View style={{flex: flewToApply, padding : 5}}>
                        <Text style={[setFont('400', 12, 'black','Bold'), {textAlign: 'center'}]}>
                        Perf
                        </Text>
                    </View>
                    : null
                }
              <View style={{flex: flewToApply, padding : 5}}>
                <Text style={[setFont('400', 12, 'black','Bold'), {textAlign: 'center'}]}>
                   Coupon
                </Text>
              </View>
        </View>


        {
            
            phoenixDatas.map((obj, i) => {
                if (phoenixDatas.length > 10 && i > 5 && i < (phoenixDatas.length - 3)) {
                  if (alreadyBreaked) { 
                    return null;
                  }
                  alreadyBreaked = true;
                  return (
                    <View style={{flexDirection: 'row'}} key={i}>
                        <View style={{flex: flewToApply}}>
                          <Text style={[setFont('400', 12, 'black','Regular'), {textAlign: 'center'}]}>
                              ...
                          </Text>
                        </View>
                        <View style={{flex: flewToApply}}>
                          <Text style={[setFont('400', 12, 'black','Regular'), {textAlign: 'center'}]}>
                              ...
                          </Text>
                        </View>
                        { minDateConstat < today 
                              ?
                              <View style={{flex: flewToApply}}>
                              <Text style={[setFont('400', 12, 'black','Regular'), {alignSelf: 'center'}]}>
                                  ...
                              </Text>
                              </View>
                          : null
                          }
                        <View style={{flex: flewToApply}}>
                          <Text style={[setFont('400', 12, 'black','Regular'), {textAlign: 'center'}]}>
                              ...
                          </Text>
                        </View>
                      </View>
                  )
                }
                return (
                  <View style={{flexDirection: 'row'}} key={i}>
                      <View style={{flex: flewToApply}}>
                        <Text style={[setFont('400', 12, 'black','Regular'), {textAlign: 'center'}]}>
                             {Moment(obj["date"]).format('DD/MM/YYYY')}
                        </Text>
                      </View>
                      <View style={{flex: flewToApply}}>
                        <Text style={[setFont('400', 12, 'black','Regular'), {textAlign: 'center'}]}>
                            {Numeral(obj['level']).format('0%')}
                        </Text>
                      </View>
                      { minDateConstat < today 
                        ?
                                <View style={{flex: flewToApply, backgroundColor : obj['perf'] > obj['level']? 'green' : 'transparent'}}>
                                <Text style={[setFont('400', 12, obj['perf'] > obj['level'] ? 'white' : 'black','Regular'), {alignSelf: 'center'}]}>
                                    {Numeral(obj['perf']).format('0.00%')}
                                </Text>
                            </View>
                        : null
                        }
                      <View style={{flex:flewToApply}}>
                        <Text style={[setFont('400', 12, 'black','Regular'), {textAlign: 'center'}]}>
                            {Numeral(obj['coupon']).format('0.00%')}
                        </Text>
                      </View>
                  </View>
                )
            })
        }

        <View style={{flexDirection : 'row', marginTop : 20}}>
          <TouchableOpacity style={{flex : 0.2}}
                            onPress={() => {
                              updateProduct('isMemory', !isMemory,"mémoire");
                            }}
          >
            <MaterialCommunityIcons name={'memory'} size={30} color={isMemory ? setColor('') : 'lightgray'}/>

          </TouchableOpacity>
          <View style={{flex : 0.8}}>
            <Text style={setFont('400', 12, isMemory ? 'black' : 'gray','Regular')}>
                  {isMemory 
                  ? String("Les coupons bénéficient de l'effet mémoire; à la date validant le paiement d'un coupon, les coupons précédents non payés seront quand même payés.")
                  : String("Ce produit ne bénéficie pas de l'effet mémoire")
                  }
            </Text>
          </View>
        </View>
     </View>
    );

}




