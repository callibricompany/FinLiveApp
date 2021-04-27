import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

export default function Airbag({ airbag, airbag_func, disable }) {

    return (
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', paddingTop: 10, paddingBottom: 15 }}>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', backgroundColor: (airbag == 0 ? 'midnightblue' : '#FFF'), borderWidth: 1,
                borderColor: '#C8C8C8', borderBottomLeftRadius: 10, padding: 5, borderTopLeftRadius: 10,}} 
                onPress={() => airbag_func(0)} disabled={disable}>
                <Text style={{ fontSize: 12, color: (airbag == 0 ? '#FFF' : '#C8C8C8') }}>SANS AIRBAG</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', backgroundColor: (airbag == 0.5 ? 'midnightblue' : '#FFF'), borderTopWidth: 1,
                borderColor: '#C8C8C8', borderBottomWidth: 1, padding: 5,}}
                onPress={() => airbag_func(0.5)} disabled={disable}>
                <Text style={{ fontSize: 12, color: (airbag == 0.5 ? '#FFF' : '#C8C8C8') }}>SEMI AIRBAG</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', backgroundColor: (airbag == 1 ? 'midnightblue' : '#FFF'), borderWidth: 1,
                borderBottomRightRadius: 10, borderColor: '#C8C8C8', padding: 5, borderTopRightRadius: 10,}}
                onPress={() => airbag_func(1)} disabled={disable}>
                <Text style={{ fontSize: 12, color: (airbag == 1 ? '#FFF' : '#C8C8C8') }}>AIRBAG</Text>
            </TouchableOpacity>
        </View>
    )

}