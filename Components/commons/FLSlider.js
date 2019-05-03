import React, {Component} from 'react';
import {StyleSheet,Text,View, Dimensions} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
//import { CustomMarker } from './CustomMarker';
import { FLItemSlider } from './FLItemSlider';

export class FLSlider extends Component{

    constructor(props) {
        super(props);
        this.state = { 
          multiSliderValue: [this.props.initialMin, this.props.initialMax],
          first: this.props.initialMin,
          second: this.props.initialMax,
        }
    }
    //<View style={[styles.column,{marginLeft:this.props.LRpadding,marginRight:this.props.LRpadding}]}>
    render() {
        return (
            <View style={{paddingTop:10, paddingBottom: 20}}>
                <View style={styles.column}>
                    {this.renderScale()}
                </View>
                <View style={styles.container}>
            
                    <MultiSlider
                        containerStyle={{
                            height: 50,
                        }}
                        trackStyle={{
                            height: 5,
                            backgroundColor: 'red',
                        }}
                        markerStyle={{height : 20,width:20}}
                        selectedStyle={{
                            backgroundColor: '#85B3D3',
                        }}
                        unselectedStyle={{
                            backgroundColor: 'silver',
                        }}
                        values={ this.props.single ?
                            [this.state.multiSliderValue[1]] : 
                         [      this.state.multiSliderValue[0],this.state.multiSliderValue[1]]}
                        //sliderLength={Dimensions.get('window').width-this.props.LRpadding*2}
                        sliderLength={this.props.sliderLength}
                        onValuesChange={this.multiSliderValuesChange}
                        min={this.props.min}
                        max={this.props.max}
                        step={this.props.step}
                        allowOverlap={true}
                        //customMarker={CustomMarker}
                        //snapped={false}
                    />
                </View>
            </View>
        );
    }

    multiSliderValuesChange = values => {
       if(this.props.single ){
        this.setState({
            second : values[0],
            multiSliderValue: [0,values[0]]
        })  
       }else{
        this.setState({
            multiSliderValue: values,
            first : values[0],
            second : values[1],
        }) 
       }
        this.props.callback(values)
    }

    renderScale=()=> {
        const items = [];
        for (let i=this.props.min; i <= this.props.max; i=i+this.props.spreadScale) {
            items.push(
                <FLItemSlider 
                    value = {i}
                    key = {i}
                    first = {this.state.first}
                    second = {this.state.second}
                    isPercent = {this.props.isPercent}
                />
            );
        }
        return items;
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    column:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'space-between',
        bottom:-20,
    },
    active:{
        textAlign: 'center',
        fontSize:20,
        color:'#5e5e5e',
    },
    inactive:{
        textAlign: 'center',
        fontWeight:'normal',
        color:'#bdc3c7',
    },
    line:{
        textAlign: 'center',
    }
});