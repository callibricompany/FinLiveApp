import React,{Component} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { setColor } from '../../Styles/globalStyle';

export class FLItemSlider extends React.Component {   
    render() {
        return (
            <View style={{flex: 1, borderWidth:0, alignItems: 'flex-start', justifyContent:'flex-start'}}>
                <Text style={ [ this.checkActive() ? styles.active : styles.inactive]}>{this.props.value}{this.props.isPercent ? ' %' :''}</Text>
                <Text style={[ this.checkActive() ? styles.line_active : styles.line_inactive]}> { this.checkActive() ? '|' : '|'}</Text>
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
        color:setColor(''),
    },
    inactive:{
        //flex:1,
        fontSize:12,
        textAlign: 'center',
        fontWeight:'normal',

        bottom : 0,
        textAlignVertical : 'center',
        color:'lightgray',
    },
    line_active:{
        fontSize:9,
        textAlign: 'center',
        color:setColor(''),
    },
    line_inactive:{
        fontSize:9,
        textAlign: 'center',
        color: 'lightgray',
    }
});