import React, {Component} from 'react';
import {StyleSheet,Text,View, Dimensions} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
//import { CustomMarker } from './CustomMarker';
import { FLItemSlider } from './FLItemSlider';



export class FLSlider extends Component{

    constructor(props) {
        super(props);
        let isActivated = true;
        if (typeof this.props.activated != 'undefined'){
            isActivated = this.props.activated;
        }
        this.state = { 
          multiSliderValue: [this.props.initialMin, this.props.initialMax],
          first: this.props.initialMin,
          second: this.props.initialMax,
          activated : isActivated,
        }

       
         this.nbScales = (this.props.max - this.props.min)/this.props.spreadScale;
         this.scaleWidth = this.props.sliderLength/this.nbScales;

    }
    
    UNSAFE_componentWillReceiveProps(props) {
        //console.log("RECEIVE PROPS : " + props.activated)
        let isActivated = true;
        if (typeof this.props.activated != 'undefined'){
            isActivated = this.props.activated;
        }
        this.setState({
            activated : isActivated
        }
        );
    }
    
    render() {

        return (
            <View style={{borderWidth:0, justifyContent:'center',alignItems:'center',paddingTop:0, paddingBottom: 0,width:this.props.sliderLength}}>
                <View style={[styles.column, {borderWidth:0}]}>
                    {this.renderScale()}
                </View>
                <View style={[styles.container, {borderWidth:0}]}>
            
                    <MultiSlider
                        containerStyle={{
                            height: 20,
                        }}
                        trackStyle={{
                            height: 3,
                            backgroundColor: 'red',
                        }}
                        markerStyle={{height : 14,width:14}}
                        selectedStyle={{
                            backgroundColor: this.state.activated ? '#85B3D3' : 'darkgray',
                        }}
                        unselectedStyle={{
                            backgroundColor: 'silver',
                        }}
                        values={ this.props.single ?
                            [this.state.multiSliderValue[1]] : 
                         [      this.state.multiSliderValue[0],this.state.multiSliderValue[1]]}
                    
                        sliderLength={this.props.sliderLength -  this.scaleWidth +6}
                        //onValuesChange={this.multiSliderValuesChange}
                        onValuesChangeFinish={this.multiSliderValuesChange}
                        //onValuesChangeStart={this.multiSliderValuesChange}
                        onValuesChangeStart={console.log("totototototoototot")}
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
        //alignItems:'center',
        justifyContent: 'flex-start',
        bottom:-5,
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