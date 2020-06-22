import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, Platform, Modal} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';



import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';

import DateTimePicker from '@react-native-community/datetimepicker';

import { globalStyle, setFont, setColor} from '../../Styles/globalStyle'
import { getConstant, isAndroid } from '../../Utils';

import Moment from 'moment';

export function FLDatePicker (props) {


        const [date, setDate] = useState(props.date);
        const [isEditable, setIsEditable] = useState(() => props.hasOwnProperty('isEditable') ? props.isEditable : true);

        let maxDate = props.hasOwnProperty('maximumDate') ? props.maximumDate :  Moment(Date.now()).add(15, 'years').toDate();

        const modalComponentDate = useRef(null);

        return (
                <TouchableOpacity   style={{flex : 1, flexDirection : 'row', borderWidth : 0}}
                                    onPress={() => {
                                        if (isEditable) {
                                            modalComponentDate.current.show();
                                        }
                                    }}
                                    activeOpacity={isEditable ? 0.2 : 1}
                >
                    <ModalDropdown
                            onDropdownWillHide={() => props.onChange(date)}
                            renderRow={(rowData,index,isSelected) => {
                                return (
                                    // <View style={{height : 300, width : getConstant('width')*0.8, backgroundColor: 'pink'}} />
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={date}
                                        mode={'date'}
                                        is24Hour={true}
                                        display={"calendar"}
                                        locale={'fr'}
                                        //maximumDate={Date.now()}
                                        //minimumDate={maxDate}
                                        onChange={(event, selectedDate) => {
                                            const currentDate = selectedDate || date;
                                            setDate(currentDate);
                                        }}
                                    />
                                )
                            }}
                            adjustFrame={(f) => {
                         
                                return {
                                    width: isAndroid() ? 0 : getConstant('width')*1,
                                    // height: 300,
                                    left : getConstant('width')*0,
                                    //right : getConstant('width')*0.1,
                                    top: f.top,
                                    borderWidth : 1,
                                    borderColor : 'black',
                                    borderRadius : 10
                                }
                     
                            }}
                            //defaultIndex={this.autocallResult.getMaturityInMonths()/12-1}
                            ref={modalComponentDate}
                            options={['']}
                            disabled={!isEditable}
                        >
                            <Text style={[setFont('300', 16, setColor(''), 'Regular'), {textAlign: 'left'}]}>
                            {Moment(date).format('ll')}
                            </Text>                
                        </ModalDropdown>
                        { isEditable 
                            ?
                                <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center', padding : 2}}>
                                    <MaterialCommunityIcons name={"menu-down-outline"}  size={16} style={{color: setColor('darkBlue')}}/> 
                                </View>
                            : null
                        }
                </TouchableOpacity>
        );

}




