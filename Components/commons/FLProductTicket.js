import React from 'react';
import { View, Text } from 'react-native';

import { globalStyle } from '../../Styles/globalStyle'

import Dimensions from 'Dimensions';
import Numeral from 'numeral'
import 'numeral/locales/fr'

import UNDERLYINGS from '../../Data/subCategories.json'
import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json'
import FREQUENCYLIST from '../../Data/frequencyList.json'
import PARAMETERSSTRUCTUREDPRODUCT from '../../Data/optionsPricingPS.json'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class FLProductTicket extends React.Component {
    
    render () {
        var item = this.props.item;
        let productName = STRUCTUREDPRODUCTS.filter(({id}) => id === item.product);
        let underlyingName = UNDERLYINGS.filter(({ticker}) => ticker === item.underlying);
        let freqAutocall = FREQUENCYLIST.filter(({ticker}) => ticker === item.freqAutocall);
        return (
            <View style={[globalStyle.rectangle, 
                {flex:1,
                flexDirection:'column',
                width: DEVICE_WIDTH*0.94, 
                height: 100,  
                marginRight: 0, 
                marginLeft:0,
                backgroundColor : 'white'}]}>
                <View style={{flex:0.75, borderWidth:0}}>
                <View style={{flex:1, flexDirection:'row'}}>
                    <View style={{flex:0.8}}>
                        <Text style={{fontSize:16, fontWeight:'bold'}}> {productName[0].name} - {underlyingName[0].name}</Text>
                        <Text style={{fontSize:14, marginTop:3}}> Seuil de rappel : {Numeral(item.levelAutocall).format('0 %')} / {freqAutocall[0].name}</Text>
                        <Text style={{fontSize:14, }}> Protection du capital : {Numeral(1-item.barrierPDI).format('0 %')}</Text>
                    </View>
                <View style={{flex:0.2,}}>
                    <View style={{flex:1, flexDirection:'column',  justifyContent:'center'}}>
                        <View style={{flex:0.3, backgroundColor : '#85B3D3', justifyContent:'center', alignItems:'center', marginTop:3, marginRight:3}}>
                            <Text style={{fontWeight:16, color:'white', fontWeight:'bold'}}>{item.maturity.substring(0,item.maturity.length-1)} an{item.maturity.substring(0,item.maturity.length-1)>1?'s':''}</Text>
                        </View>
                        <View style={{flex:0.7,  justifyContent:'center', alignItems:'center'}}>
                            <Text style={{fontSize:18, fontWeight:'bold'}}>{Numeral(item.coupon).format('0.00 %')}</Text>
                        </View>
                    </View>
                </View>
                </View>
                </View>
                <View style={{flex:0.25, borderWidth:0, borderTopWidth:0,borderTopColor:'lightgrey',borderTopStyle: 'dashed',}}>
                <View style={{flex:1, flexDirection:'row'}}>
                    <View style={{flex:0.2,backgroundColor : 'mistyrose', justifyContent:'center', alignItems:'center', marginTop:3, marginLeft:3, marginBottom:3 }}>
                    <Text>{item.currency}</Text>
                    </View>
                    <View style={{flex:0.2}}>
                    <Text></Text>
                    </View>
                    <View style={{flex:0.2}}>
                    <Text></Text>
                    </View>
                    <View style={{flex:0.2}}>
                    <Text></Text>
                    </View>
                    <View style={{flex:0.2}}>
                    <Text></Text>
                    </View>
                </View>
                </View>
                </View>
        );
    }
}

export default FLProductTicket;