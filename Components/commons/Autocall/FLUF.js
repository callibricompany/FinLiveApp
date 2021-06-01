import React, { useState, useEffect} from 'react';
import {StyleSheet, Text, View, Picker, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";
import FLModalDropdown from '../FLModalDropdown';

import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE, isEqual } from '../../../Utils';

//import Slider from 'react-native-slider';
import Slider from '@react-native-community/slider';


import Numeral from 'numeral'
import 'numeral/locales/fr'


export function FLUF (props) {

        const [charities, setCharities] = useState(props.charities);
        const [totalUF, setTotalUF] = useState(props.UF + props.UFAssoc);
        const [UF, setUF] = useState(() => props.hasOwnProperty('UF') ? props.UF : 0);
        const [UFAssoc, setUFAssoc] = useState(() => props.hasOwnProperty('UFAssoc') ? props.UFAssoc : 0);
        const [selectedCharity, setSelectedCharity] = useState(() => {
            if (props.hasOwnProperty("selectedCharity") && props.selectedCharity !== ""){
                charities.forEach((charity) => {
                    var charitySelected = "";
                    if (charity.id === props.selectedCharity) {
                        charitySelected = charity;
                    }
                    return charitySelected;
                })
            } else {
                return "";
            }
        });

        const [splitValue, setSplitValue] = useState(() => {
           //return Math.round(100*UF/(UF+UFAssoc))
           return UF;
        });
        const [isLocked, setIsLocked] = useState(() => props.hasOwnProperty('locked') ? props.locked : false);
        const [ showSlider, setShowSlider ] = useState(() => props.hasOwnProperty('showSlider') ? props.showSlider : true);


        useEffect(() => {
            //console.log("USE effect props ..");
            if (!isEqual(props.charities, charities)) {
                setCharities(props.charities);

                if (props.hasOwnProperty("selectedCharity") && props.selectedCharity !== ""){
                    charities.forEach((charity) => {
                        var charitySelected = "";
                        if (charity.id === props.selectedCharity) {
                            charitySelected = charity;
                        }
                        setSelectedCharity(charitySelected);
                    })
                } else {
                    setSelectedCharity("");
                }
            }
            
            setIsLocked(props.hasOwnProperty('locked') ? props.locked : false);
            setShowSlider(props.hasOwnProperty('showSlider') ? props.showSlider : true);
          }, [props]);

        useEffect(() => {
            if (selectedCharity === "") {
                setUF(totalUF);
                setUFAssoc(0);
            }
        
        }, []);
        
        
     
        return (
            <>
            {showSlider
            ?
            <View>
                <View style={{flexDirection : 'row'}}>

                        <Text style={setFont('400', 14, 'black', 'Regular')}>Pourcentage : {Numeral(UF + UFAssoc).format('0.00%')}</Text>

                </View>
                <View style={{flex : 1, marginTop : 10, marginRight : 20}}>

                    <Slider
    
                        
                        minimumTrackTintColor={isLocked ? 'gray' : setColor('')}
                        thumbTintColor = {setColor('')}
                        maximumValue={0.1}
                        minimumValue={0}
                        value={totalUF}
                        step={0.001}
                        onValueChange={(v) => {
                            setUF(v*UF/totalUF);
                            setUFAssoc(v*UFAssoc/totalUF);
                            setTotalUF(v);
                            
                            setSplitValue(v);
                        }}
                        onSlidingComplete={(v) => {
                            //setUF(v,0);
                            //setUFAssoc(totalUF-v);
                            //setSplitValue(v);
                            props.updateProduct('UF', UF, currencyFormatDE(UF), true);
                            props.updateProduct('UFAssoc', UFAssoc, currencyFormatDE(UFAssoc), true);
                        }}
                        disabled={isLocked}
                    />

                </View>
            </View>
            : null
            }

            <View style={{flexDirection : 'row', marginTop : 20}}>
                <View style={{flex : 0.5, }}>
                    <View style={{borderWidth: 0, height : 20}}>
                        <Text style={setFont('200', 12, 'gray')}>{props.company}</Text>
                    </View>
                    <View style={{justifyContent : 'flex-start', alignItems : 'flex-start'}}>
                        <Text style={setFont('400', 14, 'black', 'Regular')}>{currencyFormatDE(props.nominal*UF)} {props.currency} <Text style={setFont('400', 12, 'gray', 'Regular')}> ({Numeral(UF < 0 ? 0 : UF).format('0.00%')})</Text></Text>
                    </View>
                </View>
               
                <View style={{flex : 0.5,}}>
                    <View style={{ borderWidth: 0, height : 20}}>
                        <FLModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, 'black', 'Bold')}
                                    onSelect={(index, value) => {
           
                                        setSelectedCharity(value);
                                        props.updateProduct('UFAssocCode', value.id, value.data.name, false);
                                    }}
                                    // onDropdownWillShow={() => this.setState({ showModalDropdown : true })}
                                    // onDropdownWillHide={() => this.setState({ showModalDropdown : false })}
                                    adjustFrame={(f) => {
                                        return {
                                            width: getConstant('width')/1.5,
                                            height: Math.min(getConstant('height')/3, charities.length * 40),
                                            left : f.left,
                                            right : f.right,
                                            top: f.top,
                                            borderWidth : 1,
                                            borderColor : 'black',
                                            borderRadius : 5
                                        }
                                    }}
                                    renderRow={(option, index, isSelected) => {
                                                    return (
                                                    <View style={{paddingLeft : 4, paddingRight : 4, height: 40, justifyContent: 'center', alignItems: 'flex-start', borderWidth : 0, }}>
                                                        <Text style={setFont('500', 14, 'black', 'Regular')}>{option.data.name}</Text>
                                                    </View>
                                                );
                                    }}
                                    //defaultIndex={dataOptions.indexOf(this.autocallResult.getProductTypeName())}
                                    options={charities}
                                    //ref={component => this._dropdown['options'] = component}
                                    disabled={isLocked}
                            >
                                <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'flex-start'}}>
                                {!isLocked || selectedCharity !== ""
                                ?
                                    <View>
                                        <Text style={setFont('200', 12, 'gray')}>{selectedCharity === "" ? "Selectionnez une association ..." : selectedCharity.data.name}</Text>
                                    </View>
                                    : null
                                }
                                    {!isLocked
                                    ?
                                        <View>
                                            <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: 'gray'}}/>
                                        </View>
                                    : null
                                    }
                                </View>
                             
                        </FLModalDropdown>
                    </View>
                    {selectedCharity !== ""
                    ?
                        <View style={{justifyContent : 'flex-start', alignItems : 'flex-start'}}>
                            <Text style={setFont('400', 14, 'black', 'Regular')}>{currencyFormatDE(props.nominal*UFAssoc)} {props.currency}<Text style={setFont('400', 12, 'gray', 'Regular')}>  ({Numeral(UFAssoc< 0 ? 0 : UFAssoc).format('0.00%')})</Text></Text>
                        </View>
                    : null
                    }
                    
                    
                       
                </View>
            </View>
            {showSlider && selectedCharity !== ""
            ?
                <View style={{flex : 1, marginTop : 20, marginRight : 20}}>

                        <Slider
                            //style={{height : 20, borderWidth : 3, borderColor : setColor(''), borderRadius : 5}}
                            thumbTintColor={setColor('')}
                            //thumbImage={thumb}
                            //minimumTrackTintColor={isLocked ? 'gray' : setColor('')}
                            minimumTrackTintColor={setColor('')}
                            maximumTrackTintColor={setColor('')}
                            //maximumTrackTintColor={isLocked ? 'gray' : setColor('')}

                            maximumValue={totalUF}
                            minimumValue={0}
                            value={UF}
                            step={0.001}
                            onValueChange={(v) => {
                                setUF(v);
                                setUFAssoc(totalUF-v);
                                //setSplitValue(v);
                            }}
                            onSlidingComplete={(v) => {
                                setUF(Math.max(v,0));
                                setUFAssoc(Math.max(totalUF-v, 0));
                                //setSplitValue(v);
                                props.updateProduct('UF', UF, currencyFormatDE(UF), false);
                                props.updateProduct('UFAssoc', UFAssoc, currencyFormatDE(UFAssoc), false);
                            }}
                            disabled={isLocked}
                        />

                </View>
            : null
            }
            
          </>
        );

}




