import React, {Component} from 'react';
import {StyleSheet,Text,View, Dimensions, TouchableWithoutFeedback} from 'react-native';

import Slider from "react-native-slider";
//import { CustomMarker } from './CustomMarker';
import { FLItemSlider } from './FLItemSlider';


import { setColor } from '../../Styles/globalStyle';

export class FLSlider2 extends Component{

    constructor(props) {
        super(props);

        this.state = { 
          value : this.props.value,
          first: this.props.initialMin,
          second: this.props.initialMax,

          toto : true,

        }

        
         this.nbScales = 1+ (this.props.max - this.props.min)/this.props.spreadScale;
         this.scaleWidth = 10+ this.props.sliderLength*(this.nbScales -1)/this.nbScales;
        
    }


    UNSAFE_componentWillReceiveProps(props) {
        //console.log("ON EST DANS LE CALLBACK DU SLIDER : "+props.value);
        if (typeof props.value !== 'undefined'){
            this.setState({value : props.value, toto : !this.state.toto });
        }

    }   

    
    render() {
        //console.log("RENDER SLIDER");
        return (
            <View style={{flexDirection: 'column',borderWidth:0,justifyContent:'center',alignItems:'flex-start',width:this.props.sliderLength}}>
                <View style={styles.column}>
                    {this.renderScale()}
                </View>
                <View style={[styles.container, {width : this.scaleWidth}]}>
                        <View onTouchStart={(e) => {
                            let x = e.nativeEvent.locationX;
                            let percent = x / this.scaleWidth;
                            let value = percent * (this.props.max - this.props.min) +this.props.min;
                            //console.log("Percent : " + percent);
                            value = Math.trunc(value/this.props.step) * this.props.step;
                            this.props.callback(value);
                        }}>
                            <Slider
                                disabled={false}
                                minimumValue={this.props.min}
                                maximumValue={this.props.max}
                                step={this.props.step}
                                value={this.state.value}
                                maximumTrackTintColor={setColor('')}
                                minimumTrackTintColor={'lightgray'}
                                thumbTintColor={setColor('')}
                                onSlidingComplete={(value) => {
                                    //console.log("CHANGE : "+value);
                                    //this.setState({value : val});
                                    this.props.callback(value);
                                }}
                                /*onValueChange={(value) => {
                                    console.log("VALUE CHANGE : "+value);
                                    //this.setState({value : val});
                                    this.props.callback(value);
                                }}*/

                            />
                        </View>
                </View>
            </View>
        );
    }


    renderScale=()=> {
        const items = [];
        for (let i=this.props.min; i <= this.props.max; i=i+this.props.spreadScale) {
            items.push(
                <FLItemSlider 
                    value = {i}
                    key = {i}
                    first = {this.props.min}
                    second = {this.state.value}
                    isPercent = {this.props.isPercent}
                />
            );
        }
        return items;
    }
}

const styles = StyleSheet.create({
    container: {
        //flex : 0.5,
        justifyContent: 'flex-start',
        //alignItems: 'center',
        //borderWidth: 1,
        height: 20,
        
    },
    column:{
        //flex: 0.5,
        flexDirection:'row',
        //alignItems:'center',
        justifyContent: 'flex-start',
        bottom:-5,
        //borderWidth: 1,
        //height:30
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