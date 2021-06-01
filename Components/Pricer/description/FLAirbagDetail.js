import React  from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";

import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant } from '../../../Utils';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import AirbagIllustration from '../../../charts/products/AirbagIllustration';



export class FLAirbagDetail extends React.Component{

    constructor(props) {
        super(props);

        this.state = { 
            currentChoiceAB : this.props.initialValue,


        }

        this.airbag = [];
        this.airbag.push("NA");
        this.airbag.push("SA");
        this.airbag.push("FA");

    }


    render() {
        return (
          <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), marginTop : 20, borderWidth:0}}>


          <View style={{ alignItems:'center', backgroundColor: 'white'}}>               
              <SwitchSelector
                                initial={this.airbag.indexOf(this.state.currentChoiceAB)}
                                onPress={obj => {
                                  this.props.updateValue("typeAirbag", obj.value, obj.label);
                                  this.setState({ currentChoiceAB : obj.value });
                                }}
                                textColor={setColor('lightBlue')} 
                                textContainerStyle={{padding :  5}}
                                selectedTextContainerStyle={{borderWidth : 0, padding : 5}}
                                height={60}
                                borderRadius={20}
                                selectedColor={'white'}
                                buttonColor={setColor('')} 
                                borderColor={'lightgray'} 
                                returnObject={true}
                                hasPadding={true}
                                options={[
                                    { label: "Pas d'effet airbag", value: "NA", customIcon: null}, 
                                    { label: "Effet semi-airbag", value: "SA", customIcon: null} ,
                                    { label: "Effet airbag", value: "FA", customIcon: null} ,
                                ]}
                        />   


            </View>
    
            <AirbagIllustration request={this.props.request} airbagChoice={this.state.currentChoiceAB} />

            {/* <View style={{marginTop : 20, borderTopWidth : 1}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                      {'\n'}Influence
                    </Text>
                    <Text style={setFont('300', 12)}>
                    L'effet airbag permet de récupérer l'ensemble des coupons si la barrière de perte en capital n'est pas activée. Cette protection a un coût : un coupon plus faible.
                    </Text>

              </View>
              <View style={{marginTop : 10, borderTopWidth : 0}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                    Vérification
                    </Text>
                    <Text style={setFont('300', 12)}>
                    Adaptez cette sécurité avec le profil de risque attendu.
                    </Text>
           
              </View>
              <View style={{marginTop : 10, borderTopWidth : 0}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                    Risques
                    </Text>
                    <Text style={setFont('300', 12)}>
                    L'effet airbag n'améliore pas la protection du capital.
                    </Text>
      
              </View>
              <View style={{marginTop : 10, borderTopWidth : 0}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                    Illustration
                    </Text>
   
              </View> */}

        </View>
   
        );
    }


}

