import React, { useState, useEffect } from 'react';
import {StyleSheet, ScrollView, Text, View, Dimensions, TouchableOpacity, SafeAreaView, Platform} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SwitchSelector from "react-native-switch-selector";
import Numeral from 'numeral';

import { globalStyle, setFont, setColor } from '../../../Styles/globalStyle';
import { getConstant } from '../../../Utils';




export default function FLUnderlyingDetail({initialValue, getAllUndelyings, updateValue}) {

  
    const [currentUDLs, setCurrentUDLs] = useState(initialValue);
    const [selectedCategory, setSelectedCategory] = useState("PSINDICES");
    const [underlyings, setUnderlyings] = useState([]);

    const[labelIndices, setLabelIndices] = useState("INDICES");
    const[labelActions, setLabelActions] = useState("ACTIONS");

    const [sectors, setSectors] = useState([]);

    useEffect(() => {
        async function fetchData() {
            let udls = await getAllUndelyings("INTERPOLATED_PS");
            let s = [...new Set(udls.map(x => x.sector))];
            setSectors(s.sort());
            
            setUnderlyings(udls);
        }
        
        fetchData();
        
        return () => {
            setUnderlyings([]);
          };
    }, []);

    useEffect(() => {
        let countIndices = 0;
        let countActions = 0;
        underlyings.forEach((udl) => {
            if (udl.hasOwnProperty("category") && udl.hasOwnProperty("ticker")) {
                if (currentUDLs.includes(udl['ticker'])) {
                    if (udl['category'] === "PSACTIONS") {
                        countActions = countActions + 1;
                    }
                    if (udl['category'] === "PSINDICES") {
                        countIndices = countIndices + 1;
                    }
                }
            }
        });
        if (countActions > 0) {
            setLabelActions("ACTIONS (" + countActions + ")");
        } else {
            setLabelActions("ACTIONS");
        }
    
        if (countIndices > 0) {
            setLabelIndices("INDICES (" + countIndices + ")");
        } else {
            setLabelIndices("INDICES");
        }

        return () => {
            setLabelIndices("INDICES");
            setLabelActions("ACTIONS");
          };
    }, [currentUDLs, underlyings]);
  




    
    return (
        
        <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), borderWidth:0}}>
            <View  style={{marginTop : 20, flexDirection: 'row', alignItems:'center', borderWidth: 0}}>

                <SwitchSelector
                                initial={0}
                                onPress={obj => {
                                    //this.update(obj.value);
                                    setSelectedCategory(obj.value);
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
                                    { label: labelIndices, value: "PSINDICES", customIcon: null}, 
                                    { label: labelActions, value: "PSACTIONS", customIcon: null} ,
                                ]}
                        />
                </View>

                <View style={{borderWidth : 0, marginTop : 10}}>
                    {
                        sectors.map((s) => {
                            let udlByCategorie = underlyings.filter(({ category }) => category === selectedCategory);
                            let udlBySector = udlByCategorie.filter(({ sector }) => sector === s);
                            let udlsRender = udlBySector.map((item, index) => {
                                let perf = Number(item['perf1y'])/100;
                                let isSelected = currentUDLs.includes(item['ticker']);
                                return(
                                    <View key={item['ticker']}
                                        style={{
                                        flexDirection : 'row', 
                                        //alignItems: 'center',
                                        backgroundColor: 'white',
                                        borderBottomColor: setColor('borderFL'),
                                        borderBottomWidth: 1,
                                        borderTopColor: setColor('borderFL'),
                                        borderTopWidth : index === 0 ? 1 : 0,
                                        //justifyContent: 'center',
                                        paddingVertical : 10
                                        //height: 60, //50
                                    }}>
                                        <View style={{flex : 0.5, justifyContent : 'center', alignItems : 'flex-start', paddingLeft : 20}}>
                                            <Text style={setFont('300', 16, 'black', 'Bold')} numberOfLines={1}>
                                                {item['name'].toUpperCase()}
                                            </Text>
                                            <Text style={setFont('300', 12, 'black', 'Light')} numberOfLines={1}>
                                                {item.hasOwnProperty('isin')
                                                ? item['isin'].toUpperCase()
                                                : null
                                                }
                                            </Text>
                                        </View>
                                        <View style={{flex : 0.3, justifyContent : 'center', alignItems : 'flex-start', paddingLeft : 20}}>
                                            <Text style={setFont('300', 13, 'black', 'Regular')}>
                                                {item.hasOwnProperty('closeprice')
                                                ? item['closeprice'].toUpperCase()
                                                : null
                                                }
                                            </Text>
                                            {item.hasOwnProperty('perf1y')
                                            ?  
                                                <View style={{backgroundColor : perf >= 0 ? setColor('subscribeticket') : setColor('red'), paddingHorizontal : 3, paddingVertical : 1, borderWidth : 1, borderColor : setColor('subscribeticket'), borderRadius : 4}}>
                                                    <Text style={setFont('300', 13, 'white', 'Light')}>
                                                        {Numeral(perf).format('0.00%')}
                                                    </Text>
                                                </View>
                                            : null
                                            }
                                        </View>
                                        <TouchableOpacity style={{flex : 0.2, justifyContent : 'center', alignItems : 'flex-end', paddingLeft : 20}}
                                                        onPress={() => {
                                                            let udls = [...currentUDLs];
                                                            if (isSelected) {
                                                                const indexUdl = udls.indexOf(item['ticker']);
                                                                if (index > -1) {
                                                                    udls.splice(indexUdl, 1);
                                                                }
                                                            } else {
                                                                udls.push(item['ticker']);
                                                            }
                                         
                                                            setCurrentUDLs(udls);
                                                            updateValue("underlying", udls ,udls.toString().replace(/,/g,'\n'));
                                                        }}
                                        >
                                            <MaterialCommunityIcons name={isSelected ?  'checkbox-marked-circle' : 'check'} size={isSelected ? 25 : 20} color={isSelected ? setColor('') : 'lightgray'}/>
                                        </TouchableOpacity>
                                    </View>
                                );
                            });
                            if (udlBySector.length > 0) {
                                return (
                                    
                                    <View key={s} style={{ borderWidth : 0, justifyContent : 'center', padding : 5}}>
                                        <View style={{
                                            borderBottomColor: setColor('borderFL'),
                                            paddingLeft: 0,
                                            borderBottomWidth: 0,
                                            //height: 145,
                                            marginTop : 0,
                                            borderWidth : 0,
                                            //paddingTop : 15,
                                            paddingBottom : 4,
                                        
                                        }}>
                                            <View style={{padding : 5, borderWidth : 0, borderRadius : 10, borderColor: setColor('subscribeBlue'), justifyContent : 'center', alignItems : 'flex-start'}}>
                                                <Text style={setFont('400', 18, setColor(''), 'Bold')}>{s.toUpperCase()}</Text> 
                                            </View>
                                        </View>
                                        {udlsRender}
    
                                    </View>
        
                                );
                            } else {
                                return (
                                    <View key={s} />
                                );
                            }
                        })
                    }
                </View>

                <View style={{marginTop : 20, borderTopWidth : 0}}>
                        <Text style={setFont('400', 14, 'black', 'Regular')}>
                        {'\n'}Influence
                        </Text>
                        <Text style={setFont('300', 12)}>
                            Le choix du sous-jacent est primordial et influe grandement le niveau de coupon. Les sous-jacents les plus volatiles permettent généralement d'obtenir de meilleurs coupons."
                        </Text>
                </View>
                <View style={{marginTop : 10, borderTopWidth : 0}}>
                        <Text style={setFont('400', 14, 'black', 'Regular')}>
                        Vérification
                        </Text>
                        <Text style={setFont('300', 12)}>
                        Complétez ce choix et votre argumentaire avec des analyses fondamentales que vous trouverez prochainement sur FinLive
                        </Text>
                </View>
                <View style={{marginTop : 10, borderTopWidth : 0}}>
                        <Text style={setFont('400', 14, 'black', 'Regular')}>
                        Risques
                        </Text>
                        <Text style={setFont('300', 12)}>
                        Choisir une action est plus risqué car la valeur est plus susceptible de subir des profits warnings
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




   





