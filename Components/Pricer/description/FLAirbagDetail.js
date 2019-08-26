import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';


import { globalStyle, tabBackgroundColor, backgdColor, FLFontFamily, subscribeColor } from '../../../Styles/globalStyle'



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export class FLAirbagDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            currentChoice : this.props.initialValue,

        }

        this.airbag = [];
        //remplissage type demande
        let obj = {};
        obj["value"] = "NA";
        obj["label"] = "Pas d'effet airbag";
        this.airbag.push(obj);
        obj = {};
        obj["value"] = "SA";
        obj["label"] = "Effet semi-airbag";
        this.airbag.push(obj);
        obj = {};
        obj["value"] = "FA";
        obj["label"] = "Effet airbag";
        this.airbag.push(obj);

    }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*DEVICE_WIDTH, marginRight: 0.05*DEVICE_WIDTH, marginTop : 20, borderWidth:0}}>
                <View style={{alignItems:'center'}}>
             

                    
                    <RadioForm
                          formHorizontal={false}
                          animation={true}
                        >
                          {this.airbag.map((type, i) => {


                          return (
                            <RadioButton labelHorizontal={true} key={i} >
              
                              <RadioButtonInput
                                obj={type}
                                index={i}
                                isSelected={this.state.currentChoice === type.value}
                                onPress={(itemValue) =>{
                                  //console.log(i +"-ITEM VALUE : "+itemValue);
                                  this.setState({ currentChoice : this.airbag[i].value}, () => {
                                    this.props.updateValue("airbagLevel", this.airbag[i].value, this.airbag[i].label);
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

