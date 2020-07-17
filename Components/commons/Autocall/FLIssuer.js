import React, { useState, useRef} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Feather from 'react-native-vector-icons/Feather';
import SwitchSelector from "react-native-switch-selector";


import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';

import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE } from '../../../Utils';

import { FLDatePicker } from '../FLDatePicker';

import Numeral from 'numeral'
import 'numeral/locales/fr'





export function FLIssuer ({ codeAuction, isEditable, issueDate, notionnal, endIssueDate, updateProduct }) {


        const dataAuction = [
                    {   key : 'PP',
                        label : 'Placement Privé'
                    },
                    {   key : 'APE',
                        label : "Appel public à l'épargne",
                    },
                ];
        const [typeAuction, setTypeAuction] = useState(() => {
            let auction = dataAuction.filter(({ key }) => key === codeAuction);
            return auction[0].label;
        });
        const [nominal, setNominal] = useState(notionnal);


        const dataAuctionLabels = dataAuction.map((value, index) => value.label)


        const refAuctionDropDown = useRef();
        const refNominal = useRef();

        return (
            <>
             
            <View style={{flexDirection : 'row'}}>
                <View style={{flex : 1}}>
                    <View style={{marginBottom : 5}}>
                                <Text style={setFont('200', 12, 'gray')}>Type de placement</Text>
                    </View>
                    <TouchableOpacity   style={{flex : 1, flexDirection : 'row', borderWidth : 0}}
                                        onPress={() => {
                                            isEditable ? refAuctionDropDown.current.show() : null;
                                        }}
                                        activeOpacity={isEditable ? 0.2 : 1}
                    >
                        <ModalDropdown      
                            //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                            //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : setColor('lightBlue'), 'Bold'), {textAlign: 'center'}]}
                            dropdownTextStyle={setFont('500', 16, setColor(''), 'Regular')}
                            dropdownTextHighlightStyle={setFont('500', 16, setColor(''), 'Bold')}
                            onSelect={(index, value) => {

                                let auction = dataAuction.filter(({ label }) => label === value);
                                setTypeAuction(value);
                                updateProduct('typeAuction', auction[0].key, value );
                            }}
                            adjustFrame={(f) => {
                                return {
                                //width: getConstant('width')/2,
                                height: Math.min(getConstant('height')/3, dataAuction.length * 35),
                                left : f.left,
                                right : f.right,
                                top: f.top,
                                borderWidth : 1,
                                borderColor : 'black',
                                borderRadius : 10
                                }
                            }}
                            renderRow={(rowData,index,isSelected) => {
                            return (
                                <TouchableHighlight underlayColor={setColor('')}>
                                <View style={{height : 35, alignItems : 'flex-start', justifyContent : 'center', paddingHorizontal : 5}}>
                                    <Text style={setFont('400', 16, setColor('darkBlue'), isSelected ? 'Bold' : 'Light')} numberOfLines={1} ellipsizeMode={'tail'}>
                                    {rowData}
                                    </Text>
                                </View>
                                </TouchableHighlight>
                            )
                            }}
                            defaultIndex={dataAuctionLabels.indexOf(typeAuction)}
                            //defaultIndex={typeAuction === 'PP' ? 1 : 0}
                            options={dataAuctionLabels}
                            //ref={component => this._dropdown['typeAuction'] = component}
                            ref={refAuctionDropDown}
                            disabled={!isEditable}
                        >
                            <Text style={[setFont('300', 16, setColor('')), {textAlign: 'left'}]}>
                                {typeAuction}
                            </Text>                
                        </ModalDropdown>
                        { isEditable 
                            ?
                                <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center', padding : 2}}>
                                    <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: setColor('subscribeBlue')}}/> 
                                </View>
                            : null
                        }
                        
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{flexDirection : 'row', marginTop : 25}}>
                <View style={{flex : 0.5}}>
                    <View style={{marginBottom : 5}}>
                        <Text style={setFont('200', 12, 'gray')}>Date d'émission</Text>
                    </View>
                    <FLDatePicker date={issueDate} onChange={() =>  console.log("en attente fin de dev pricer")} isEditable={isEditable} />
                </View>
               
                <View style={{flex : 0.5}}>
                    <View style={{marginBottom : 5}}>
                        <Text style={setFont('200', 12, 'gray')}>Date de remboursement</Text>
                    </View>
                    <FLDatePicker date={endIssueDate} onChange={() =>  console.log("en attente fin de dev pricer")} isEditable={isEditable} />
                </View>
            </View>
            
            <View style={{ marginTop : 25}}>
                <Text style={setFont('200', 12, 'gray')}>
                     Nominal
                </Text>
            </View>
            <KeyboardAvoidingView behavior={'padding'} style={{flexDirection : 'row', marginTop : 5}}>
                            <View style={{flex: isEditable ? 0.8 : null,  justifyContent: 'center'}}
                                        ref={refNominal}
                                        onLayout={({nativeEvent}) => {
                                        if (refNominal.current) {
                                            refNominal.current.measure((x, y, width, height, pageX, pageY) => {
                                                    //console.log(x, y, width, height, pageX, pageY);
                                            })
                                        }
                                        }}
                            >
                                <TextInput 
                                        style={{    
                                                display: 'flex',
                                                backgroundColor: 'white',
                                                height : 30,
                                                fontSize: 18,
                                                color: isEditable ?  setColor('lightBlue') : 'black',
                                                borderColor : isEditable ?  setColor('') : 'black',
                                                borderWidth: isEditable ? 1 : 0,
                                                borderRadius: 4,
                                                paddingRight: 5,
                                                //textAlign: this.state.nominal === 0 ? 'left' : 'right',
                                                textAlign: isEditable ? 'right' : 'left',
                                                textAlignVertical: 'center',
                                                }}
                                        placeholder={'EUR'}
                                        placeholderTextColor={'lightgray'}
                                        underlineColorAndroid={'#fff'}
                                        autoCorrect={false}
                                        keyboardType={'numeric'}
                                        returnKeyType={'done'}
                                        editable={isEditable}
                                        onBlur={() => {
                                        //console.log("STATE NOMINAL : " + this.state.nominal +  "-  AUTOCALL NOMINAL : " + this.autocall.getNominal());
                                        
                                            updateProduct('nominal', nominal, currencyFormatDE(Number(nominal),0) );
                                        }}
                                        onFocus={() =>  setNominal('')}
                                        //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                        value={nominal === 0 ? '' : currencyFormatDE(Number(nominal),0)}
                                        // ref={(inputNominal) => {
                                        // this.inputNominal = inputNominal;
                                        // }}
                                        onChangeText={e => {
                                            //console.log(Number(e));
                                            setNominal(e === '' ? 0 : Numeral(e).value());
                                        }}
                                />
                            </View>
                            <View style={{width : 0.2*getConstant('width'), borderWidth : 0, justifyContent : 'center', paddingLeft : 5}}>
                                <Text style={setFont('400', 18, isEditable ? 'gray' : 'black', 'Regular')}>
                                    {'EUR'}
                                </Text>
                            </View>

                </KeyboardAvoidingView>
            </>
        );

}




