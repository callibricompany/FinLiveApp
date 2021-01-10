import React, { useState, useRef, useEffect} from 'react';
import {Animated, Text, View, StyleSheet, TouchableOpacity, TextInput, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


import { globalStyle, setFont, setColor} from '../../Styles/globalStyle';
import { getConstant, ifAndroid } from '../../Utils';


import Numeral from 'numeral';
import 'numeral/locales/fr';
import Moment from 'moment';


export default function FLHeaderSearch ({ position=-1, updateSearchText}) {

        const [positionLeft, setPositionLeft] = useState(new Animated.Value(getConstant('width')));
        const [searchText, setSearchText] = useState('');
        const refInputSearchText = useRef();
        
        //depends on button on the right of itself
        var offset = -37*position;

        useEffect(() => {
            updateSearchText(searchText);
        }, [searchText]);
        

        return (
            <View stryle={{borderWidth : 0, borderColor : 'red'}}>
                <TouchableOpacity   style={{ height: 45, justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => {

                                        Animated.parallel([
                                        Animated.timing(
                                            positionLeft,
                                                {
                                                toValue: -getConstant('width') + offset,
                                                duration : 1000,
                                                easing: Easing.elastic(),
                                                speed : 1,
                                                useNativeDriver: true,
                                                }
                                            ),
                                        ]).start(() => {});

                                        refInputSearchText.current.focus();
                                    }}
                >  
                    <MaterialIcons name='search' size={25} color={'white'} />
                </TouchableOpacity>

                <Animated.View style={{position : 'absolute', flexDirection:'row', top: 0, borderWidth : 0, width: 1.02*getConstant('width'), backgroundColor: 'white',transform: [{ translateX: positionLeft }], height: 45 }}>
                        <TouchableOpacity style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => {

                                Animated.parallel([
                                Animated.timing(
                                    positionLeft,
                                        {
                                        toValue: getConstant('width'),
                                        duration : 1000,
                                        easing: Easing.elastic(),
                                        speed : 1,
                                        useNativeDriver: true,
                                        }
                                ),
                                ]).start(() => {
                                    //force le render avec un changement de state dont on se fiche 

                                });

          
                                setSearchText('');
                            }}
                        >  
                            <MaterialIcons name='arrow-back' size={22} color='lightgray' style={{paddingLeft: 20}} />
                        </TouchableOpacity>
                        <View style={{flex: 0.9}}>
                            <TextInput 
                                style={styles.inputText}
                                placeholder={'Filtre ...'}
                                placeholderTextColor={'#999'}        
                                underlineColorAndroid={'#fff'}
                                autoCorrect={false}
                                value={searchText}
                                onSubmitEditing={() => {
                                   
                                }}
                                ref={refInputSearchText}
                                onChangeText={(text) => setSearchText(text)}
                            />
                        </View>

            </Animated.View>    
        </View>              
        );
}

const styles = StyleSheet.create({

    navbar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      backgroundColor: 'white',
      borderBottomColor: '#dedede',
      borderBottomWidth: 1,
      height: 45,
      justifyContent: 'center',
      //paddingTop: getConstant('statusBar),
    },
   
  
    inputText: {
      display: 'flex',
      ...ifAndroid({
        marginTop: 9
      }, {
        marginTop: 13
      }),
      marginLeft: 20,
      fontSize: 18,
      color: '#999',
    },
  });