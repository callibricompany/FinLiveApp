import React, { useState, useEffect } from 'react';
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
import { fetchDataClient } from '../../API/APIAWS';

import FLHeaderSearch from '../commons/FLHeaderSearch';

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
                    justifyContent: 'space-between',
                    borderBottomColor: '#D3D3D3',
                    paddingLeft: 15,
                    borderBottomWidth: 1,
                    justifyContent: 'center',
                    height: 24
                }}>
                     {/* <Text style={styles.textItem2}>Group</Text>  */}
             
                </View>);
        } else {
            return (
                <View
                    //onPress={() => navigation.navigate('ClientDetail', clientData)}
                    style={{
                        flexDirection : 'row', 
                        alignItems: 'center',
                        paddingLeft: 15,
                        backgroundColor: '#FFFFFF',
                        borderBottomColor: '#D3D3D3',
                        borderBottomWidth: 1,
                        justifyContent: 'center',
                        height: 50, //50
                    }}
                    underlayColor={'#FFF'}
                >
                    <View style={{flex : 0.8, flexDirection : 'column', justifyContent : 'flex-start', alignItems : 'flex-start',}}>
                        <TouchableOpacity style={{justifyContent : 'flex-start', alignItems : 'flex-start', paddingTop : 5}}
                                            onPress={() => {
                                            closeRow(rowMap, data.item.key);
                                            navigation.navigate('ProfileClientDetail', { name: 'Modifier', isModify: true, data: data.item, firebase, isEditable : false });
                                        }}                       
                        >
                            <Text style={setFont('300', 14, 'black', 'Regular')}>{data.item.fullName}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{borderWidth : 0, justifyContent : 'flex-start', alignItems : 'flex-start', }}
                        
                                        onPress={() => {
                                            Linking.openURL(`mailto:${data.item.email}`);
                                        }}                
                        >
                            <Text style={setFont('300', 12, 'black', 'Light')}>{data.item.email}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ justifyContent : 'center', alignItems : 'center', borderRadius : 13,  borderWidth : 0, borderColor : 'green', padding : 11}}
                                      onPress={() => {
                                        Linking.openURL(`tel:${data.item.telephone}`);
                                      }}
                    >
                        <Ionicons name={'md-call'} size={20} color={'green'} />
                    </TouchableOpacity>
                </View>)
        }
    }

    const renderHiddenItem = (data, rowMap) => {
        if (data.item.isGroup === true) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'space-between',
                    borderBottomColor: '#D3D3D3',
                    paddingLeft: 15,
                    borderBottomWidth: 1,
                    justifyContent: 'center',
                    height: 50
                }}>
                    <Text style={setFont('300', 16, 'red', 'Bold')}>{data.item.fullName}</Text>
                </View>);
        } else {
            return (
                <View style={styles.rowBack}>
                    <TouchableOpacity
                        style={[styles.backLeftBtn, styles.backLeftBtnLeft]}
                        onPress={() => deleteRow(rowMap, data.item.key)}
                    >
                        <Text style={styles.backTextWhite}>Supprimer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnLeft]}
                        onPress={() => {
                            closeRow(rowMap, data.item.key);
                            navigation.navigate('ProfileClientDetail', { name: 'Modifier', isModify: true, data: data.item, firebase });
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
            <View style={{flexDirection : 'row', borderWidth : 0, alignItems: 'center', justifyContent : 'space-between', backgroundColor : setColor(''),  paddingRight : 15, paddingLeft : 15}}>
                              <TouchableOpacity style={{ flex : 0.2, flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', borderWidth : 0}}
                                                onPress={() => navigation.goBack()}
                              >
                                  
                                      <Ionicons name={'ios-arrow-round-back'} size={25} color={'white'}/>
                  
                              </TouchableOpacity>
                              <View style={{flex : 0.6, borderWidth: 0, alignItems : 'center', justifyContent : 'center'}}>
                                <Text style={setFont('400', 22, 'white', 'Regular')}>
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
                                                    navigation.navigate('ProfileClientDetail', { name: 'Modifier', isModify: false, data: emptyData, firebase, isEditable : true });
                                                }}
                              >
                                    <MaterialCommunityIcons name='plus' size={25}  style={{color : 'white'}}/>
                              </TouchableOpacity>
            </View>

            <SwipeListView
                data={groupList(filterListData(listData))}
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
        color: '#FFFFFF',
    },
    textItem2: {
        fontSize: 20,
        fontWeight: "bold",
    },
    textItem: {
        fontSize: 20,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#fff',
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