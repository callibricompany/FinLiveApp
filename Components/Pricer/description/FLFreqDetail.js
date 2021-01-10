import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import Feather from 'react-native-vector-icons/Feather';

import { globalStyle, setColor, setFont } from '../../../Styles/globalStyle';
import { getConstant } from '../../../Utils';

import { TouchableOpacity } from 'react-native-gesture-handler';








export class FLFreqDetail extends React.Component{

    constructor(props) {
        super(props);

        this.state = { 
            currentChoiceFreq : this.props.initialValueFreq,
            currentChoiceNNCP : this.props.initialValueNNCP/12,
        }
        
        this.freq = [];
        //remplissage type demande
        let obj = {};
        obj["value"] = "1M";
        obj["label"] = "1 mois";
        this.freq.push(obj);
        obj = {};
        obj["value"] = "3M";
        obj["label"] = "3 mois";
        this.freq.push(obj);
        obj = {};
        obj["value"] = "6M";
        obj["label"] = "6 mois";
        this.freq.push(obj);
        obj = {};
        obj["value"] = "1Y";
        obj["label"] = "1 an";
        this.freq.push(obj);
    }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), marginTop : 20, borderWidth:0}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex : 0.45, alignItems:'center', borderBottomWidth: 3, borderBottomColor: setColor(''), backgroundColor: 'white'}}>
                  <Text style={setFont('600', 14)}>RAPPELS TOUS LES : </Text>
                </View>
                <View style={{flex : 0.1, alignItems:'center'}}>
                  
                </View>
                <View style={{flex : 0.45, alignItems:'center', borderBottomWidth: 3, borderBottomColor: setColor(''), backgroundColor: 'white'}}>
                  <Text style={setFont('600', 14)}>1er RAPPEL DANS : </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex : 0.45, alignItems:'center', backgroundColor: 'white'}}>               
                    <RadioForm
                          formHorizontal={false}
                          animation={true}
                        >
                          {this.freq.map((type, i) => {

                          //console.log(this.state.currentChoiceFreq + " : "+ type.value);
                          return (
                            <RadioButton labelHorizontal={true} key={i} >
              
                              <RadioButtonInput
                                obj={type}
                                index={i}
                                isSelected={this.state.currentChoiceFreq === type.value}
                                onPress={(itemValue) =>{
                                  //console.log(i +"-ITEM VALUE : "+itemValue);
                                  this.setState({ currentChoiceFreq : this.freq[i].value}, () => {
                                    this.props.updateValue("freq", this.freq[i].value, this.freq[i].label);
                                  });
                                }}

                                buttonSize={12}
                                buttonOuterSize={20}
                                borderWidth={1}
                                buttonStyle={{marginTop : 10}}
                                //buttonWrapStyle={{marginLeft: 10}}
                              />
                              <RadioButtonLabel
                                obj={type}
                                index={i}
                                labelHorizontal={true}
                                labelStyle={[setFont('400', 16), { marginTop: 10}]}
                                labelWrapStyle={{}}
                                onPress={(itemValue) =>{
                                  //console.log(i +"-ITEM VALUE : "+itemValue);
                                  this.setState({ currentChoiceFreq : this.freq[i].value}, () => {
                                    this.props.updateValue("freq", this.freq[i].value, this.freq[i].label);
                                  });
                                }}
                              />
                              </RadioButton>
                            );
                          })}                  
                    </RadioForm> 
                </View>
                <View style={{flex : 0.1, alignItems:'center'}}>
                  
                </View>
                <View style={{flex : 0.45, flexDirection: 'row', justifyContent: 'space-around',alignItems:'center',backgroundColor: 'white'}}>  
                    <TouchableWithoutFeedback onPress={() => {
                      //console.log("Appuis moins");
                      let current = this.state.currentChoiceNNCP;
                      this.setState({ currentChoiceNNCP : current === 1 ? 1 : (current - 1)}, () => {
                        this.props.updateValue("nncp", this.state.currentChoiceNNCP*12, this.state.currentChoiceNNCP + ' an' + (this.state.currentChoiceNNCP > 1 ? 's' : null));
                      });
                    }}>
                      <Feather name='minus-circle' size={30} color={this.state.currentChoiceNNCP === 1 ? 'lightgray' :'black'}/>
                    </TouchableWithoutFeedback>
                    <View>
                      <Text>{this.state.currentChoiceNNCP} an{this.state.currentChoiceNNCP > 1 ? 's' : null}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => {
                      let current = this.state.currentChoiceNNCP;
                      this.setState({ currentChoiceNNCP : current === 3 ? 3 : (current + 1)}, () => {
                        this.props.updateValue("nncp", this.state.currentChoiceNNCP*12, this.state.currentChoiceNNCP + ' an' + (this.state.currentChoiceNNCP > 1 ? 's' : null));
                      });
                    }}>
                      <Feather name='plus-circle' size={30} color={this.state.currentChoiceNNCP === 3 ? 'lightgray' :'black'}/>
                    </TouchableWithoutFeedback>                 
                </View>
              </View>

              <View style={{marginTop : 20, borderTopWidth : 1}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                      {'\n'}Influence
                    </Text>
                    <Text style={setFont('300', 12)}>
                    Une fréquence de rappel plus élevé augmente les chances de rappel et dimunue ainsi celle de risque surson capital. Le coupon sera d'autant moins élevé. Vous pouvez également choisir de ne pas rappeler votre produit pendant une certaine période, cela permet d'améliorer votre coupon
                    </Text>
              </View>
              <View style={{marginTop : 10, borderTopWidth : 0}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                    Vérification
                    </Text>
                    <Text style={setFont('300', 12)}>
                    Vérifiez les durées minimales du produit, elles doivent être compatibles avec son enveloppe juridique.
                    </Text>
              </View>
              <View style={{marginTop : 10, borderTopWidth : 0}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                    Risques
                    </Text>
                    <Text style={setFont('300', 12)}>
                    Les risques de non rappel et de risque en capital augmentent si la fréquence du produit est faible.
                    </Text>
              </View>
              <View style={{marginTop : 10, borderTopWidth : 0}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                    Illustration
                    </Text>
   
              </View>

            </View>
        );
    }


}

