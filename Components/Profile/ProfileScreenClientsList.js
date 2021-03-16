import React, { useState, useEffect, useCallback } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Linking,
    View,
    SafeAreaView
} from 'react-native';

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { setColor, setFont } from '../../Styles/globalStyle';
import { getConstant } from '../../Utils/';
import { fetchDataClient, manageClientData } from '../../API/APIAWS';

import FLHeaderSearch from '../commons/FLHeaderSearch';
import { FontAwesome } from '@expo/vector-icons';

function fieldSorter(fields) {

    return function (a, b) {
        return fields
            .map(function (o) {
                var dir = 1;
                if (o[0] === '-') {
                    dir = -1;
                    o = o.substring(1);
                }
                if (a[o] > b[o]) return dir;
                if (a[o] < b[o]) return -(dir);
                return 0;
            })
            .reduce(function firstNonZeroValue(p, n) {
                return p ? p : n;
            }, 0);
    };
}

function firstCharacter( word ) {
    return word.substring(0, 1).toUpperCase()
}

function groupList(data) {

    let dataGroup = [];

    data = data.sort(fieldSorter(['fullName']));

    for (let i = 0; i < data.length; i++) {
        let element = data[i]
        if ( i === 0 ) {
            dataGroup.push( { 
                isGroup : true,
                fullName : firstCharacter(element.fullName),
                key : `${i}` });
            dataGroup.push( element );
        } else {
            if ( firstCharacter( data[i-1].fullName ) === firstCharacter( element.fullName ) ) {
                dataGroup.push( element );
            } else {
                dataGroup.push( { 
                    isGroup : true,
                    fullName : firstCharacter(element.fullName),
                    key : `${i}` });
                dataGroup.push( element );
            }
        }
    }

    return dataGroup;
    
}

export default function ProfileScreenClientsList({ navigation }) {

    const firebase = navigation.getParam('firebase');

    const [search, setSearch] = useState('')
    const [listData, setListData] = useState([]);
    //const [refresh, setRefresh] = useState(route.params.refresh);
    const [refresh, setRefresh] = useState(true);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    useEffect(() => {
        if (refresh === true) {
        async function fetchData() {
            try {
                let dataClient = await fetchDataClient(firebase);
                dataClient.forEach(el => {
                    {
                        el.isGroup = false;
                        el.fullName = `${el.surname} ${el.name}`;
                        el.key = el.id;
                    }
                });
                setListData(dataClient);
            } catch (error) {
                console.log(error);
            }
        }
        setRefresh(false);
        fetchData();
        }
    }, [ refresh ]);


    const updateClient = (data) => {

        let found = false;
        var list = listData;
        list.forEach((client) => {
            if (client.key === data.key) {
                found = true;
                Object.keys(data).forEach((key) => client[key] = data[key]);
            }
        })
        if (!found) {
            list.push(data);
        }
  
        setListData(list);
        forceUpdate();
    }
    const filterListData = (arrayList) => {
        if (search != '') {
            var res = arrayList.filter(el => {
                return el.fullName.toLowerCase().search(search.toLowerCase()) != - 1
            })
            return res;
        }
        return arrayList;
    }

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setListData(newData);
    };

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    const renderItem = (data, rowMap) => {
        var clientData = data.item;

        // var { item, otherItem } = data;
        if (data.item.isGroup === true) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    borderBottomColor: setColor('borderFL'),
                    paddingLeft: 15,
                    borderBottomWidth: 1,
                    height: 45,
                    marginTop : 0,
                    borderWidth : 0,
                    paddingTop : 15,
                    paddingBottom : 4
                }}>
                    <View style={{height : 25, width : 25, backgroundColor : setColor('subscribeBlue'), borderWidth : 1, borderRadius : 13, borderColor: setColor('subscribeBlue'), justifyContent : 'center', alignItems : 'center'}}>
                     <Text style={setFont('400', 18, 'white', 'Bold')}>{data.item.fullName}</Text> 
                     </View>
                </View>);
        } else {
            return (
                <View
                    //onPress={() => navigation.navigate('ClientDetail', clientData)}
                    style={{
                        flexDirection : 'row', 
                        //alignItems: 'center',
                        backgroundColor: 'white',
                        borderBottomColor: setColor('borderFL'),
                        borderBottomWidth: 1,
                        //justifyContent: 'center',
                        height: 60, //50
                    }}
                    //underlayColor={'red'}
                >
  
                        <TouchableOpacity style={{flex : 0.8, justifyContent : 'center', alignItems : 'flex-start', paddingLeft : 20}}
                                            onPress={() => {
                                            closeRow(rowMap, data.item.key);
                                            navigation.navigate('ProfileClientDetail', { updateClient , isModify: true, data: data.item, firebase, isEditable : false });
                                            // this.props.navigation.state.params.updateValue("coupon", this.state.couponMin, Numeral(this.state.couponMin).format('0.00%'));
                                            // this.props.navigation.goBack();
                                        }}                       
                        >
                            <Text style={setFont('300', 18, 'black', 'Regular')}>{data.item.fullName}</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={{flex : 1, borderWidth : 0, justifyContent : 'flex-start', alignItems : 'flex-start', }}
                        
                                        onPress={() => {
                                            Linking.openURL(`mailto:${data.item.email}`);
                                        }}                
                        >
                            <Text style={setFont('300', 12, 'black', 'Light')}>{data.item.email}</Text>
                        </TouchableOpacity> */}
            
                    <TouchableOpacity style={{ flex : 0.2, justifyContent : 'center', alignItems : 'center', borderRadius : 13,  borderWidth : 0, borderColor : 'green', padding : 11}}
                                      onPress={() => {
                                        Linking.openURL(`tel:${data.item.telephone}`);
                                      }}
                    >
                        <Ionicons name={'md-call'} size={20} color={'green'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent : 'center', alignItems : 'center', marginLeft : 0, marginRight : 15}}
                                      onPress={() => {
                                        //Linking.openURL(`tel:${data.item.telephone}`);
                                      }}
                    >
                        <FontAwesome name={'arrows-h'} size={20} color={'lightgray'} />
                    </TouchableOpacity>
                </View>)
        }
    }

    const renderHiddenItem = (data, rowMap) => {
        if (data.item.isGroup === false) {
        //     return (
        //         <View style={{
        //             flex: 1,
        //             justifyContent: 'space-between',
        //             borderBottomColor: setColor('borderFL'),
        //             paddingLeft: 15,
        //             borderBottomWidth: 1,
        //             justifyContent: 'center',
        //             height: 195,
        //             marginTop : 5
        //         }}>
        //             <Text style={setFont('300', 30, 'black', 'Bold')}>{data.item.fullName}</Text>
        //         </View>);
        // } else {
            return (
                <View style={styles.rowBack}>
                    <TouchableOpacity
                        style={[styles.backLeftBtn, styles.backLeftBtnLeft]}
                        onPress={() => {
                            manageClientData(firebase, data.item, 'delete')
                            deleteRow(rowMap, data.item.key);
                        }}

                    >
                        <Text style={styles.backTextWhite}>Supprimer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnLeft]}
                        onPress={() => {
                            closeRow(rowMap, data.item.key);
                            navigation.navigate('ProfileClientDetail', { updateClient,  name: 'Modifier', isModify: true, data: data.item, firebase });
                        }}
                    >
                        <Text style={styles.backTextWhite}>Modifier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnRight]}
                        onPress={() => deleteRow(rowMap, data.item.key)}
                    >
                        <Text style={styles.backTextWhite}>Appeler</Text>
                    </TouchableOpacity>
                </View>)
        }
    }

    return (

        <SafeAreaView style={{flex : 1, backgroundColor: setColor('')}}>
        <View style={{height: getConstant('height')  , backgroundColor : setColor('background'), }}> 
            <View style={{flexDirection : 'row', borderWidth : 0, alignItems: 'center', justifyContent : 'space-between', backgroundColor : setColor(''),  paddingRight : 15, paddingLeft : 15, height : 45}}>
                              <TouchableOpacity style={{ flex : 0.2, flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', borderWidth : 0}}
                                                onPress={() => {
                                                    navigation.goBack();
                                                }}
                              >
                                  
                                      <Ionicons name={'ios-arrow-round-back'} size={25} color={'white'}/>
                  
                              </TouchableOpacity>
                              <View style={{flex : 0.6, borderWidth: 0, alignItems : 'center', justifyContent : 'center'}}>
                                <Text style={setFont('400', 18, 'white', 'Regular')}>
                                 Mes clients
                                </Text>
                              </View>
                              <View style={{ flex : 0.1, alignItems : 'flex-end', justifyContent : 'center', borderWidth : 0}}>
                                    <FLHeaderSearch position={-2} updateSearchText={setSearch} />
                              </View>
                              <TouchableOpacity style={{ flex : 0.1, alignItems : 'flex-end', justifyContent : 'center', borderWidth : 0}}
                                                onPress={() => {
                                                    let emptyData = {};
                                                    emptyData['id'] = null;
                                                    emptyData['item'] = null;
                                                    navigation.navigate('ProfileClientDetail', { updateClient, name: 'Modifier', isModify: false, data: emptyData, firebase, isEditable : true });
                                                }}
                              >
                                    <MaterialCommunityIcons name='plus' size={25}  style={{color : 'white'}}/>
                              </TouchableOpacity>
            </View>

            <SwipeListView
                data={groupList(filterListData(listData))}
                extraData={listData}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={100}
                rightOpenValue={-180}
                previewRowKey={'0'}
                previewOpenValue={0}  // -40
                previewOpenDelay={0} // 3000
                onRowDidOpen={onRowDidOpen}
                ListFooterComponent={<View style={{height: 170}}/>}
            />
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    backTextWhite: {
        color: 'white',
    },
    textItem: {
        fontSize: 20,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backLeftBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 100,
    },
    backLeftBtnLeft: {
        backgroundColor: 'rgb(165,49,42)',
        left: 0,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 90,
    },
    backRightBtnLeft: {
        backgroundColor: 'rgb(34,97,165)',
        right: 90,
    },
    backRightBtnRight: {
        backgroundColor: '#019875',
        right: 0,
    },

});