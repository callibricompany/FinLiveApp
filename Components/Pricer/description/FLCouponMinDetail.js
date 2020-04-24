import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';

import Ruler from 'react-native-animated-ruler';
import { FLSlider2 } from '../../commons/FLSlider2';

import { setFont, blueFLColor, backgdColor, FLFontFamily, subscribeColor } from '../../../Styles/globalStyle'

import Numeral from 'numeral'
import 'numeral/locales/fr'


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export class FLCouponMinDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            couponMin : this.props.initialValueCouponMin,
           
        }

        
    }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*DEVICE_WIDTH, marginRight: 0.05*DEVICE_WIDTH, borderWidth:0}}
                    pointerEvents={'auto'}

            >
                
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 10}}>
                  <Text style={setFont('300', 18, 'black', 'Regular')}>Fixez le coupon annualisé minimum que vous recherchez : </Text> 
                </View>

                <View style={{alignItems:'center', justifyContents: 'center', marginTop: 20}}>  

                <Ruler
                    style={{ borderRadius: 10, elevation: 3 }}
                    width={350}
                    height={170}
                    vertical={false}
                    onChangeValue={(value) => {
                        //console.log("MATS : "+ value);
                        this.setState({ couponMin : (value)/1000 }, () => {
                          this.props.updateValue("coupon", this.state.couponMin, Numeral(this.state.couponMin).format('0.00%'));
                          
                       });
                    }}
                    minimum={0}
                    maximum={200}
                    segmentWidth={2}
                    segmentSpacing={20}
                    indicatorColor='#FF0000'
                    indicatorWidth={100}
                    indicatorHeight={40}
                    indicatorBottom={20}
                    step={10}
                    stepColor='#333333'
                    stepHeight={40}
                    normalColor='#999999'
                    normalHeight={20}
                    backgroundColor='#FFFFFF'
                    numberFontFamily='System'
                    numberSize={40}
                    numberColor='#000000'
                    unit=''
                    unitBottom={5}
                    unitFontFamily='System'
                    unitColor='#888888'
                    unitSize={0}
                    defaultValue={0.0}
                    //vertical={true}
                />

                </View>
      
            </View>
        );
    }


}


{/* <FLSlider2
min={0}
max={20}
step={0.5}
//value={this.state.product['UF'].value*100}
value={(this.state.couponMin)*100}
isPercent={true}
spreadScale={2}
//activated={!this.state.product["UF"].isActivated}
sliderLength={DEVICE_WIDTH*0.9}
callback={(value) => {
    //console.log("MATS : "+ value);
    this.setState({ couponMin : (value)/100 }, () => {
      this.props.updateValue("coupon", this.state.couponMin, Numeral(this.state.couponMin).format('0.00%'));
      
  });
}}
single={true}
/> */}
