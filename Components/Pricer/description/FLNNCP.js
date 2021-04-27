import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import SwitchSelector from "react-native-switch-selector";

import Feather from 'react-native-vector-icons/Feather';

import { globalStyle, setColor, setFont } from '../../../Styles/globalStyle';
import { getConstant } from '../../../Utils';

import { TouchableOpacity } from 'react-native-gesture-handler';





export class FLNNCP extends React.Component{

    constructor(props) {
        super(props);

        this.state = { 
            
            currentChoiceNNCP : props.initialValue/12,
        }

    }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), marginTop : 20, borderWidth:0}}>
      
   
                <View style={{alignItems:'center', marginBottom : 20}}>
                  <Text style={setFont('600', 18, 'black', 'Regular')}>1er RAPPEL DANS : </Text>
                </View>
  
                <SwitchSelector
                                initial={this.state.currentChoiceNNCP - 1}
                                onPress={obj => {
                                  this.setState({ currentChoiceNNCP : obj.value }, () => {
                                    this.props.updateValue("nncp", this.state.currentChoiceNNCP*12, this.state.currentChoiceNNCP + ' an' + (this.state.currentChoiceNNCP > 1 ? 's' : ''));
                                  });
                               
                                }}
                                textColor={setColor('lightBlue')} 
                                textContainerStyle={{padding :  5}}
                                selectedTextContainerStyle={{borderWidth : 0, padding : 5}}
                                height={50}
                                borderRadius={10}
                                selectedColor={'white'}
                                buttonColor={setColor('')} 
                                borderColor={'lightgray'} 
                                returnObject={true}
                                hasPadding={true}
                                options={[
                                    { label: "1 an", value: "1", customIcon: null}, 
                                    { label: "2 ans", value: "2", customIcon: null}, 
                                    { label: "3 ans", value: "3", customIcon: null}, 
                                ]}
                        />  
                {/* <View style={{flexDirection: 'row', justifyContent: 'space-around',alignItems:'center',backgroundColor: 'white', flex : 1, marginTop : 30}}>  
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
                      <Text style={setFont('400', 16, 'black', 'Bold')}>{this.state.currentChoiceNNCP} an{this.state.currentChoiceNNCP > 1 ? 's' : null}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => {
                      let current = this.state.currentChoiceNNCP;
                      this.setState({ currentChoiceNNCP : current === 3 ? 3 : (current + 1)}, () => {
                        this.props.updateValue("nncp", this.state.currentChoiceNNCP*12, this.state.currentChoiceNNCP + ' an' + (this.state.currentChoiceNNCP > 1 ? 's' : null));
                      });
                    }}>
                      <Feather name='plus-circle' size={30} color={this.state.currentChoiceNNCP === 3 ? 'lightgray' :'black'}/>
                    </TouchableWithoutFeedback>                 
                </View> */}


              <View style={{marginTop : 20, borderTopWidth : 0}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                      {'\n'}Influence
                    </Text>
                    <Text style={setFont('300', 12)}>
                    Vous pouvez choisir de ne pas rappeler votre produit pendant une certaine période, cela permet d'améliorer votre coupon
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
                    Les risques de non rappel et de risque en capital augmentent si la 1ère date de rappel est éloignée
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

