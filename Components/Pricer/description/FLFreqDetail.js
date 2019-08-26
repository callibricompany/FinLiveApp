import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';


import { globalStyle, tabBackgroundColor, backgdColor, FLFontFamily, subscribeColor } from '../../../Styles/globalStyle'



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export class FLFreqDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            currentChoice : this.props.initialValue,
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
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*DEVICE_WIDTH, marginRight: 0.05*DEVICE_WIDTH, marginTop : 20, borderWidth:0}}>
                <View style={{alignItems:'center'}}>
             

                    
                    <RadioForm
                          formHorizontal={false}
                          animation={true}
                        >
                          {this.freq.map((type, i) => {


                          return (
                            <RadioButton labelHorizontal={true} key={i} >
              
                              <RadioButtonInput
                                obj={type}
                                index={i}
                                isSelected={this.state.currentChoice === type.value}
                                onPress={(itemValue) =>{
                                  //console.log(i +"-ITEM VALUE : "+itemValue);
                                  this.setState({ currentChoice : this.freq[i].value}, () => {
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
                                onPress={() => console.log()}
                                labelStyle={{fontSize: 16, fontFamily : FLFontFamily, color: 'black', marginTop: 10}}
                                labelWrapStyle={{}}
                                onPress={(itemValue) =>{
                                  //console.log(i +"-ITEM VALUE : "+itemValue);
                                  this.setState({ currentChoice : this.freq[i].value}, () => {
                                    this.props.updateValue("freq", this.freq[i].value, this.freq[i].label);
                                  });
                                }}
                              />
                              </RadioButton>
                            );
                          })}                  
                    </RadioForm> 
                </View>
            </View>
        );
    }


}

