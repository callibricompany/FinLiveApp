import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";

import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant } from '../../../Utils';

import Numeral from 'numeral'
import 'numeral/locales/fr'





export class FLAirbagDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            currentChoiceAB : this.props.initialValueAB,
            currentChoiceDS : this.props.initialValueDS,
            //currentChoiceII : this.props.initialValueII,

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
          <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), marginTop : 20, borderWidth:0}}>
          {/*<TouchableWithoutFeedback style={{marginTop: 35}}
                                    onPress={() => {
                                        this.setState({ currentChoiceII: !this.state.currentChoiceII }, () => {
                                          this.props.updateValue("isIncremental", this.state.currentChoiceII, this.state.currentChoiceII ? 'incrémental' : 'non incrémental');
                                        });
                                    }}
          >
            <View style={{flexDirection: 'row'}}>
              <View>
                <MaterialIcons name={this.state.currentChoiceII ? 'check-box' : 'check-box-outline-blank'} size={20} />
              </View>
              <View style={{paddingLeft: 10, justifyContent: 'center'}}>
                <Text style={[setFont('500', 18)]}>
                    {String('incrémental').toUpperCase()}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback> */}
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <View style={{flex : 0.45, alignItems:'center', alignItems: 'center', borderBottomWidth: 3, borderBottomColor: setColor(''), backgroundColor: 'white'}}>
              <Text style={[setFont('600', 14), {textAlign : 'center', textAlignVertical: 'center'}]}>AIRBAG</Text>
            </View>
            <View style={{flex : 0.1, alignItems:'center'}}>
              
            </View>
            <View style={{flex : 0.45, alignItems:'center', alignItems: 'center',borderBottomWidth: 3, borderBottomColor: setColor(''), backgroundColor: 'white'}}>
              <Text style={[setFont('600', 14), {textAlign : 'center', textAlignVertical: 'center'}]}>STEPDOWN</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex : 0.45, alignItems:'center', backgroundColor: 'white'}}>               
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
                        isSelected={this.state.currentChoiceAB === type.value}
                        onPress={(itemValue) =>{
                          //console.log(i +"-ITEM VALUE : "+itemValue);
                          this.setState({ currentChoiceAB : this.airbag[i].value}, () => {
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
                        labelStyle={[setFont('300', 14), {marginTop: 10}]}
                        labelWrapStyle={{}}
                        onPress={(itemValue) =>{
                          //console.log(i +"-ITEM VALUE : "+itemValue);
                          this.setState({ currentChoiceAB : this.airbag[i].value}, () => {
                            this.props.updateValue("airbagLevel", this.airbag[i].value, this.airbag[i].label);
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
                  let current = this.state.currentChoiceDS;
                  this.setState({ currentChoiceDS : current === 0 ? 0 : (current - 1)}, () => {
                    this.props.updateValue("degressiveStep", this.state.currentChoiceDS, this.state.currentChoiceDS === 0 ? '' : ('Stepdown : ' + Numeral(this.state.currentChoiceDS/100).format('0%') + ' / an'));
                  });
                }}>
                  <Feather name='minus-circle' size={30} color={this.state.currentChoiceDS === 0 ? 'lightgray' :'black'}/>
                </TouchableWithoutFeedback>
                <View>
                  <Text>{Numeral(this.state.currentChoiceDS/100).format('0%')} / an</Text>
                </View>
                <TouchableWithoutFeedback onPress={() => {
                  let current = this.state.currentChoiceDS;
                  this.setState({ currentChoiceDS : current === 5 ? 5 : (current + 1)}, () => {
                    this.props.updateValue("degressiveStep", this.state.currentChoiceDS, 'Stepdown : ' + Numeral(this.state.currentChoiceDS/100).format('0%') + ' / an');
                  });
                }}>
                  <Feather name='plus-circle' size={30} color={this.state.currentChoiceDS === 5 ? 'lightgray' :'black'}/>
                </TouchableWithoutFeedback>                 
            </View>
          </View>

          <View style={{marginTop : 20, borderTopWidth : 1}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                      {'\n'}Influence
                    </Text>
                    <Text style={setFont('300', 12)}>
                    L'effet airbag permet de récupérer l'ensemble des coupons si la barrière de perte en capital n'est pas activée. Cette protection a un coût : un coupon plus faible.
                    </Text>
                    <Text style={setFont('300', 12)}>
                    Baisser le seuil de rappel à chaque période augment les chances de rappel du produit. Le coupon payé sera donc moindre. En contrepartie la prise de risque sur le capital sera aussi plus faible.
                    </Text>
              </View>
              <View style={{marginTop : 10, borderTopWidth : 0}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                    Vérification
                    </Text>
                    <Text style={setFont('300', 12)}>
                    Adaptez cette sécurité avec le profil de risque attendu.
                    </Text>
                    <Text style={setFont('300', 12)}>
                    Adaptez cette dégressivité avec le profil de risque attendu.
                    </Text>
              </View>
              <View style={{marginTop : 10, borderTopWidth : 0}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                    Risques
                    </Text>
                    <Text style={setFont('300', 12)}>
                    L'effet airbag n'améliore pas la protection du capital.
                    </Text>
                    <Text style={setFont('300', 12)}>
                    Un produit dont le seuil de rappel reste à 100% a moins de chance d'être rappelé. 
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

