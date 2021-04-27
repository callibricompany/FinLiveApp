import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
//import SwitchSelector from "react-native-switch-selector";
import FLSwitchSelector from '../../../Components/commons/FLSwitchSelector';



import { globalStyle, setColor, setFont } from '../../../Styles/globalStyle';
import { getConstant } from '../../../Utils';




export class FLFreqDetail2 extends React.Component{

    constructor(props) {
        super(props);

        this.state = { 
            currentChoiceFreq : this.props.initialValue,
        }
       
        
        this.freq = [];
        this.freq.push("1D");
        this.freq.push("1M");
        this.freq.push("2M");
        this.freq.push("3M");
        this.freq.push("6M");
        this.freq.push("1Y");

        console.log(this.freq.indexOf(this.state.currentChoiceFreq));
    }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), marginTop : 20, borderWidth:0}}>
                <View style={{alignItems:'center', }}>
                  <Text style={setFont('600', 16, 'black', 'Regular')}>RAPPELS</Text>
                </View>

  
                <View style={{alignItems:'center', backgroundColor: 'white', marginTop : 15, borderWidth : 1, borderColor : setColor(''), borderRadius : 10}}>       
                  <FLSwitchSelector
                                initial={ this.freq.indexOf(this.state.currentChoiceFreq) > 2 ? -1 : this.freq.indexOf(this.state.currentChoiceFreq)}
                                onPress={obj => {
                                    this.setState({ currentChoiceFreq : obj.value}, () => {
                                      this.props.updateValue("freq", obj.value, obj.label);
                                      this.secondSwitch.toggleItem(-1, false);
                                    });
                                }}
                                textColor={setColor('lightBlue')} 
                                textContainerStyle={{padding :  2}}
                           
                                height={50}
                                borderRadius={10}
                                //style={{borderRadius : 0, borderWidth : 0, borderColor : 'pink'}}
                                selectedTextContainerStyle={{borderRadius : 10, }}
                                selectedColor={'white'}
                                buttonColor={setColor('')} 
                                borderColor={'transparent'} 
                                borderWidth={0}
                                returnObject={true}
                                hasPadding={true}
                                ref={(ref) => this.firstSwitch = ref}
                                options={[
                                    { label: "Quotidiens", value: "1D", customIcon: null},   
                                    { label: "Mensuels", value: "1M", customIcon: null}, 
                                    { label: "Bimestriels", value: "2M", customIcon: null}, 

                                ]}
                        />    
                        <FLSwitchSelector
                                initial={ this.freq.indexOf(this.state.currentChoiceFreq) < 3 ? -1 : this.freq.indexOf(this.state.currentChoiceFreq) - 3}
                                onPress={obj => {
                                    this.setState({ currentChoiceFreq : obj.value}, () => {
                                      this.props.updateValue("freq", obj.value, obj.label);
                                      //console.log(this.freq.indexOf(this.state.currentChoiceFreq));
                                    });
                                    this.firstSwitch.toggleItem(-1, false);
                                }}
                                textColor={setColor('lightBlue')} 
                                textContainerStyle={{padding :  2}}
                           
                                height={50}
                                borderRadius={10}
                                //style={{borderRadius : 0, borderWidth : 0, borderColor : 'pink'}}
                                selectedTextContainerStyle={{borderRadius : 10,}}
                                selectedColor={'white'}
                                buttonColor={setColor('')} 
                                borderColor={'transparent'} 
                                borderWidth={0}
                                returnObject={true}
                                hasPadding={true}
                                ref={(ref) => this.secondSwitch = ref}
                                options={[
                                    { label: "Trimestriels", value: "3M", customIcon: null}, 
                                    { label: "Semestriels", value: "6M", customIcon: null}, 
                                    { label: "Annuels", value: "1Y", customIcon: null}, 
                                ]}
                        />        
                    {/* <RadioForm
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
                    </RadioForm>  */}
                </View>
    
               

              <View style={{marginTop : 20, borderTopWidth : 0, borderColor : 'lightgray'}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                      {'\n'}Influence
                    </Text>
                    <Text style={setFont('300', 12)}>
                    Une fréquence de rappel plus élevé augmente les chances de rappel et dimunue ainsi celle de risque sur son capital. Le coupon sera d'autant moins élevé.
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

