import React from 'react'
import { StyleSheet,Text,View,Image,TouchableHighlight,Animated} from 'react-native'; //Step 1
import { Icon } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { globalStyle } from '../../Styles/globalStyle'

import SwipeGesture from '../../Gesture/SwipeGesture'




class FLPanel extends React.Component{
    constructor(props){
        super(props);

        this.isExpandable = true;
        if (typeof this.props.isExpandable != 'undefined'){
            this.isExpandable = this.props.isExpandable;
           // this.setState({expanded : true})
        }
        
        let expanded = false;
        if (typeof this.props.expanded != 'undefined'){
            expanded = this.props.expanded;
        }
        if (!this.isExpandable){
            expanded = true;
        }      

        this.state = {       
            title       : this.props.title,
            title2      : typeof this.props.title2 != 'undefined' ? this.props.title2 :'',
            expanded    : expanded,
            animation   : this.isExpandable ? new Animated.Value() : this.props.hauteur,
            activated   : this.props.activated
        };
        
        this.isExpandable = true;
        if (typeof this.props.isExpandable != 'undefined'){
            this.isExpandable = this.props.isExpandable;
           // this.setState({expanded : true})
        }

        

        this.fontSizeTitle = 20;
        if (typeof this.props.fontSizeTitle != 'undefined'){
            this.fontSizeTitle = this.props.fontSizeTitle;
        }

        this.marginRight = 0;
        if (typeof this.props.marginRight != 'undefined'){
            this.marginRight = this.props.marginRight;
        }

        this.marginLeft = 0;
        if (typeof this.props.marginLeft != 'undefined'){
            this.marginLeft = this.props.marginLeft;
        }

        this.marginTop = 0;
        if (typeof this.props.marginTop != 'undefined'){
            this.marginTop = this.props.marginTop;
        }

        this.customRight = false;
        if (typeof this.props.customRight != 'undefined'){
            this.customRight = this.props.customRight;
        }

        this.customLeft = false;
        if (typeof this.props.customLeft != 'undefined'){
            this.customLeft = this.props.customLeft;
        }

        this.showPin = false;
        if (typeof this.props.showPin != 'undefined'){
            this.showPin = this.props.showPin;
        }
        this.isDesactivable = true;
        if (typeof this.props.isDesactivable != 'undefined'){
            this.isDesactivable = this.props.isDesactivable;
        }
        this.borderColor = "#85B3D3";
        if (typeof this.props.borderColor != 'undefined'){
            this.borderColor = this.props.borderColor;
        }      
        
    }

    componentWillReceiveProps(props) {

        //console.log("COMPONENT WILL RECEIVE PROPS TITLE : " + props.title + "    -    "+props.activated);
        this.setState({
            title : props.title,
            activated : props.activated
        }
        );
    }
    componentWillMount(){
        if (!this.state.expanded) {
            this.state.animation.setValue(33);  
        }
    }

    onSwipePerformed = (action) => {
        //console.log("ACTION : "+ action);
        //console.log("IS ACTIVATED : " + this.state.activated);
        if (action === 'tap' && this.isDesactivable === true) {          
            this.setState({
               // activated : !this.state.activated
            }, () => {
                //console.log(this.state.activated +"    -     " +this.props.idComponent);
                //this.props.updateActivatedDesactivated(this.state.activated, this.props.idComponent);
            });
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

    _toggleRightOrLeft(){
        this.props.customLeftRight();
    }


    _setMaxHeight(event){
        //console.log("SETMAXHEIGHT : "+ event.nativeEvent.layout.height)
        let hMax =  event.nativeEvent.layout.height;
        if (typeof this.props.hauteur !== 'undefined'){
            //console.log("HAUTEUR : " + this.props.hauteur + "    -    "+hMax) ;
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

        let iconPin = "pin-off-outline";
        if(this.state.activated){
             iconPin = "pin";     
        }

        let printRight = this.state.activated && this.isExpandable ? 
                        <View style={{flex:0.1}}>
                            <TouchableHighlight 
                                style={style.buttonFLPanel} 
                                onPress={this.toggle.bind(this)}
                                underlayColor="#f1f1f1">
                                <Icon name={icon} style={{color : "#707070"}}/>
                            </TouchableHighlight> 
                        </View>
                        :
                        this.customRight ? 
                                <View style={{flex:0.1}}>
                                    <TouchableHighlight 
                                        style={style.buttonFLPanel} 
                                        onPress={this._toggleRightOrLeft.bind(this)}
                                        underlayColor="#f1f1f1">
                                        <Icon name="md-arrow-dropright-circle"  style={{color : "#85B3D3"}}/>
                                    </TouchableHighlight> 
                                </View>       
                            :
                            <View style={{borderWidth:0, width:0, height: this.props.title !== '' ? 30 : 0}}></View>
        
        let printLeft = this.customLeft ?
                        <View style={{flex:0.1, marginLeft: 5}}>
                            <TouchableHighlight 
                                style={style.buttonFLPanel} 
                                onPress={this._toggleRightOrLeft.bind(this)}
                                underlayColor="#f1f1f1">
                                <Icon name="md-arrow-dropleft-circle"  style={{color : "#85B3D3"}}/>
                            </TouchableHighlight> 
                        </View>   
                        :
                        this.showPin ?
                            <View style={{flex:0.1, marginLeft: 2, justifyContent:'center', }}>
                                <TouchableHighlight 
                                    style={style.buttonFLPanel} 
                                    onPress={this._toggleRightOrLeft.bind(this)}
                                    underlayColor="#f1f1f1">
                                    <MaterialCommunityIcons name={iconPin}  size={16} style={{color : "#85B3D3"}}/>
                                </TouchableHighlight> 
                            </View>                     
                            :
                            <View style={{borderWidth:0, width:0, height: this.props.title !== '' ? 30 : 0}}></View>
     
        return ( 
            <Animated.View style={[containerFLPanel(this.state.activated, this.marginRight, this.marginLeft, this.marginTop, this.borderColor), {height: this.state.animation}]} >
                <View style={[titleContainerFLPanel(this.state.activated, this.state.expanded, this.isExpandable, this.borderColor)]} onLayout={this._setMinHeight.bind(this)}>
                        {printLeft}
                        <SwipeGesture style={swipeGestureFLPanel(this.isExpandable, this.props.title)} onSwipePerformed={this.onSwipePerformed.bind(this)}>
                            <Text style={titleFLPanel(this.fontSizeTitle)}>{this.state.title}</Text>
                            {this.state.title2.length !== 0 ? <Text style={titleFLPanel(12)}>{this.state.title2}</Text> :null}
                        </SwipeGesture>
                        {printRight}
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

function containerFLPanel (activated, marginRight, marginLeft, marginTop, borderColor) {
    let bgColor = "#DDE0E2" //F9FAFC
    let borderWidth = 0
    let borderColorTemp = "#DDE0E2"
    
    if (activated) {
        bgColor=globalStyle.bgColor ;
        borderWidth=1;
        borderColorTemp =  borderColor;
    }

    return {
        backgroundColor: bgColor,
        //alignItems: 'center',
        marginTop: marginTop,
        marginRight: marginRight,
        marginLeft: marginLeft,
        borderRadius: 2,
        overflow:'hidden',
        borderWidth: borderWidth,
        borderColor: borderColorTemp,

    }
}


function swipeGestureFLPanel(expandable, title) {
    return {
        height: title !== '' ? 30 : 0, 
        justifyContent : 'center',
        //alignItems:'center',
        marginTop: title !== '' ? 3 : 0,
        flex: expandable ? 0.9 : 1,

    }
}

function titleContainerFLPanel(activated, expanded, expandable, borderColor) {
    let borderBottomWidth = 0;
    let borderBottomColor = "#DDE0E2"
    if (activated && expanded) {
        borderBottomWidth=1;
        borderBottomColor = borderColor;
    }

    return {
        borderBottomColor: borderBottomColor,
        borderBottomWidth: borderBottomWidth,
        flexDirection: expandable ? 'row' : 'row',

    }
}

function titleFLPanel (fontSize) {
    return {
        flex    : 1,
        paddingLeft : 10,
        paddingRight : 10,
        //fontWeight : fontSize === 14 ?'bold' : 'normal',
        textAlign: 'center',
        fontSize: fontSize
    }
}

const style = StyleSheet.create({

    buttonFLPanel      : {
        justifyContent:'center',
        alignItems: 'center'
      

    },
    buttonImageFLPanel : {
        width   : 30,
        height  : 25
    },
    bodyFLPanel        : {
        //flex:1,
        paddingLeft   : 10,
        paddingTop  : 10,
        paddingRight: 10,
        paddingBottom : 30
    },
}
)







export default FLPanel;

