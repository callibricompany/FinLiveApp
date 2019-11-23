import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';


import { globalStyle, blueFLColor, backgdColor, FLFontFamily, subscribeColor } from '../../../Styles/globalStyle'



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export class FLAuctionDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            currentChoice : this.props.initialValue,
        }

        this.auctionType = [];
        //remplissage type demande
        let obj = {};
        obj["value"] = "PP";
        obj["label"] = "Placement Privé";
        this.auctionType.push(obj);
        obj = {};
        obj["value"] = "APE";
        obj["label"] = "Appel public à l'épargne";
        this.auctionType.push(obj);
        //obj = {};
        //obj["value"] = "IP";
        //obj["label"] = "Indicatif";
        //this.auctionType.push(obj);
    }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*DEVICE_WIDTH, marginRight: 0.05*DEVICE_WIDTH, marginTop : 20, borderWidth:0}}>
                <View style={{alignItems:'center'}}>
             

                    
                    <RadioForm
                          formHorizontal={false}
                          animation={true}
                        >
                          {this.auctionType.map((type, i) => {


                          return (
                            <RadioButton labelHorizontal={true} key={i} >
              
                              <RadioButtonInput
                                obj={type}
                                index={i}
                                isSelected={this.state.currentChoice === type.value}
                                onPress={(itemValue) =>{
                                  //console.log(i +"-ITEM VALUE : "+itemValue);
                                  this.setState({ currentChoice : this.auctionType[i].value}, () => {
                                    this.props.updateValue("typeAuction", this.auctionType[i].value, this.auctionType[i].label);
                                  });
                                }}
                                borderWidth={1}
                                buttonSize={12}
                                buttonOuterSize={20}
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
                                  this.setState({ currentChoice : this.auctionType[i].value}, () => {
                                    this.props.updateValue("typeAuction", this.auctionType[i].value, this.auctionType[i].label);
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

