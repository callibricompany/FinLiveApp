import React from 'react'
import { StyleSheet, Text, View, Image, TouchableHighlight, Animated } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

class FLPanel extends React.Component{
    constructor(props){
        super(props);


        this.state = {
            title       : props.title,
            expanded    : true,
            animation   : new Animated.Value()
        };
        this.state.animation.setValue(20);

    }

    toggle(){
        let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
            expanded : !this.state.expanded
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    }

    _setMaxHeight(event){
        this.setState({
            maxHeight   : event.nativeEvent.layout.height
        });
    }

    _setMinHeight(event){
        this.setState({
            minHeight   : event.nativeEvent.layout.height
        });
    }

    render(){
        return (
            <Animated.View 
                style={{height : this.state.animation}}>
                <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <TouchableHighlight 
                        style={styles.button} 
                        onPress={this.toggle.bind(this)}
                        underlayColor="#f1f1f1">
                         <Ionicons name={this.state.expanded ? 'ios-arrow-up' : 'ios-arrow-down'} size={20} />
                    </TouchableHighlight>
                </View>
                
                <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
                    {this.props.children}
                </View>

            </Animated.View>
        );
    }
}


function titleFLPanel (animation) {
    //console.log(animation);
    if (isNaN(animation)) {
        return null;
    }
    return {
        height: animation
    }

}

var styles = StyleSheet.create({
    container   : {
        backgroundColor: '#fff',
        margin:10,
        //overflow:'hidden'
    },
    titleContainer : {
        flexDirection: 'row'
    },
    title       : {
        flex    : 1,
        padding : 10,
        color   :'#2a2f43',
        fontWeight:'bold'
    },
    button      : {

    },

    body        : {
        padding     : 10,
        paddingTop  : 0
    }
});

export default FLPanel;