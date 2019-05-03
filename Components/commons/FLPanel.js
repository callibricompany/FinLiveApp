import React from 'react'
import { StyleSheet,Text,View,Image,TouchableHighlight,Animated} from 'react-native'; //Step 1
import { Icon } from 'native-base'
import { globalStyle } from '../../Styles/globalStyle'

import SwipeGesture from '../../Gesture/SwipeGesture'


class FLPanel extends React.Component{
    constructor(props){
        super(props);

        this.state = {       
            title       : this.props.title,
            expanded    : false,
            animation   : new Animated.Value(),
            activated   : this.props.activated
        };
        console.log(this.props.hauteur);
    }

    componentWillReceiveProps(props) {

        //console.log("COMPONENT WILL RECEIVE PROPS : " + props.title);
        this.setState({title : props.title});

    }
    componentWillMount(){
        if (!this.state.expanded) {
       //     this.setState({
       //         maxHeight   : 25,
       //         minHeight   : 25,
       //     });
            this.state.animation.setValue(33);  
        }
    }

    onSwipePerformed = (action) => {
        console.log("ACTION : "+ action);
        if (action === 'tap') {
            this.setState({activated : !this.state.activated})
        }
      }
    
    toggle(){
        let initialValue    = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
        finalValue      = this.state.expanded ? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

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
        //console.log("SETMAXHEIGHT : "+ event.nativeEvent.layout.height)
        let hMax =  event.nativeEvent.layout.height + 40;
        if (typeof this.props.hauteur != 'undefined'){
            hMax = hMax + this.props.hauteur;
        }
        this.setState({
            maxHeight   : hMax
        });
    }
    
    _setMinHeight(event){
        //console.log("SETMINHEIGHT : "+ event.nativeEvent.layout.height)
        this.setState({
            minHeight   : event.nativeEvent.layout.height
        });
    }

    render(){
        let icon = "ios-arrow-down";
        if(this.state.expanded){
            icon = "ios-arrow-up";
        }

        let printExpandArrow = this.state.activated ? 
                            <TouchableHighlight 
                            style={style.buttonFLPanel} 
                            onPress={this.toggle.bind(this)}
                            underlayColor="#f1f1f1">
                        <Icon name={icon}  style={{color : "#707070"}}/>
                        </TouchableHighlight> 
                        :
                       <TouchableHighlight 
                            style={style.buttonFLPanel} 
                            //onPress={this.toggle.bind(this)}
                            underlayColor="#f1f1f1">
                        <Icon name={icon}  style={{color : "#DDE0E2"}}/>
                        </TouchableHighlight>
     
        return ( 
            <Animated.View style={[containerFLPanel(this.state.activated), {height: this.state.animation}]} >
                <View style={[titleContainerFLPanel(this.state.activated, this.state.expanded)]} onLayout={this._setMinHeight.bind(this)}>
                        <SwipeGesture style={{justifyContent : 'center',alignItems:'center', flex:0.9, marginTop: 3}} onSwipePerformed={this.onSwipePerformed.bind(this)}>
                            <Text style={style.titleFLPanel}>{this.state.title}</Text>
                        </SwipeGesture>
                        <View style={{flex:0.1}}>
                            {printExpandArrow}
                        </View>
                </View>
                
                <View style={style.bodyFLPanel}  pointerEvents={this.state.activated ? 'auto' : 'none'} onLayout={this._setMaxHeight.bind(this)}>
                    {this.props.children}
                </View>

            </Animated.View>
        );
    }
}





///////////////////////////////
//        FLPanel STYLES
///////////////////////////////

function containerFLPanel (activated) {
    let bgColor = "#DDE0E2"
    let borderWidth = 0
    let borderColor = "#DDE0E2"
    
    if (activated) {
        bgColor='white';
        borderWidth=1;
        borderColor = '#85B3D3';
    }

    return {
        backgroundColor: bgColor,
        //alignItems: 'center',
        marginTop:20,
        borderRadius: 15,
        overflow:'hidden',
        borderWidth: borderWidth,
        borderColor: borderColor,

    }
}

function titleContainerFLPanel(activated, expanded) {
    let borderBottomWidth = 0;
    let borderBottomColor = "#DDE0E2"
    if (activated && expanded) {
        borderBottomWidth=1;
        borderBottomColor = '#85B3D3';
    }

    return {
        borderBottomColor: borderBottomColor,
        borderBottomWidth: borderBottomWidth,
        flexDirection: 'row',

    }
}

const style = StyleSheet.create({
    titleFLPanel       : {
        flex    : 1,
        paddingLeft : 10,
        paddingRight : 10,
        color   :'#2a2f43',
        fontWeight:'bold',
        fontSize: 20

    },
    buttonFLPanel      : {

    },
    buttonImageFLPanel : {
        width   : 30,
        height  : 25
    },
    bodyFLPanel        : {
        flex:1,
        paddingLeft   : 10,
        paddingTop  : 10,
        paddingRight: 10,
        paddingBottom : 30
    },
}
)







export default FLPanel;

