import React,{Component} from 'react';
import { StyleSheet, View, Text } from 'react-native';

export class FLItemSlider extends Component {   
    render() {
        return (
            <View style={{flex: 1, borderWidth:0, alignItems: 'stretch', justifyContent:'flex-start'}}>
                <Text style={ [ this.checkActive() ? styles.active : styles.inactive]}>{this.props.value}{this.props.isPercent ? ' %' :''}</Text>
                <Text style={styles.line}> { this.checkActive() ? '|' : ''}</Text>
            </View>
        );
    }

    checkActive =()=>{
        if(this.props.value >= this.props.first && this.props.value <= this.props.second)
            return true 
        else
            return false 
    }
}

const styles = StyleSheet.create({
    active:{
        textAlign: 'center',
        fontSize:12,
        bottom:0,
        color:'#5e5e5e',
    },
    inactive:{
        //flex:1,
        fontSize:12,
        textAlign: 'center',
        fontWeight:'normal',

        bottom : 0,
        textAlignVertical : 'center',
        color:'#bdc3c7',
    },
    line:{
        fontSize:9,
        textAlign: 'center',
    }
});