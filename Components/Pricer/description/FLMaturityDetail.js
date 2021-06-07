import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';

import RangeSlider from 'rn-range-slider';
import { FLSlider2 } from '../../../Components/commons/FLSlider2';
import { FLItemSlider } from '../../../Components/commons/FLItemSlider';
import { globalStyle, setFont, setColor } from '../../../Styles/globalStyle'
import { getConstant } from '../../../Utils';





export class FLMaturityDetail extends React.Component{

    constructor(props) {
        super(props);

        this.state = { 
            maturities : this.props.initialValue,
            //toto : true,
        }

        //console.log("MATS 0 : "+this.state.maturities);
    }



    UNSAFE_componentWillReceiveProps(props) {
      //this.setState({ toto : !this.state.toto });
    }

    _getMaturityTitle=() => {

      let title = "";
      let ans = " ans";

      if (this.state.maturities[1] <= 1) {
        ans = " an";
      }
      if (this.state.maturities[0] < this.state.maturities[1]) {
        title=title.concat(this.state.maturities[0] + " à " + this.state.maturities[1] + ans);
      } else {
        title=title.concat(this.state.maturities[1] + ans);
      }
      return title;

	}
	
    renderScale=()=> {
        const items = [];
        for (let i=1; i <= 10; i=i+1) {
            items.push(
                <FLItemSlider 
                    value = {i}
                    key = {i}
                    first = {this.state.maturities[0]}
                    second = {this.state.maturities[1]}
                    isPercent = {false}
                />
            );
        }
        return items;
    }

    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), borderWidth:0}}>
        
                <View style={{alignItems:'flex-start', justifyContents: 'center', borderWidth: 0, marginTop : 20, marginBottom : 20}}>
                  <Text style={setFont('400', 16)}>Maturité (années): </Text> 
                </View>
  
				<View style={{flexDirection:'row', justifyContent: 'space-between', borderWidth : 0, marginLeft : 0.015*getConstant('width'), width : 0.95*getConstant('width')}}>
                    {this.renderScale()}
                </View>
				<View style={{marginBottom : 30}}>
					<RangeSlider
						style={{width : getConstant('width')*0.875, marginLeft : getConstant('width')*0.015}}
						min={1}
            max={10}
            low={this.state.maturities[0]}
            high={this.state.maturities[1]}
						step={1}
						floatingLabel={false}
						allowLabelOverflow={true}
						renderThumb={() => {
							var  THUMB_RADIUS = 16;
							return (
								<View style={{width: 8,
									height: THUMB_RADIUS * 2,
									borderRadius: THUMB_RADIUS,
									borderWidth: 1,
									borderColor: setColor(''),
									backgroundColor: '#ffffff',}}
								/>
							);
						}}
						renderRail={() => {
							return (
								<View style={{
									flex : 1,
									height: 4,
									borderRadius: 2,
									backgroundColor: 'lightgray',
								}}
								/>
							);
						}}
						renderRailSelected={() => {
							return (
								<View style={{ 
									height: 4,
									backgroundColor: setColor(''),
									borderRadius: 2,
									}}
								/>
							);
						}}
						// renderLabel={({ text, ...restProps }) => {
						// 	return (
						// 		<View style={{
									
						// 			alignItems: 'center',
						// 			padding: 8,
						// 			width : 40,
						// 			height : 40,
						// 			backgroundColor: '#4499ff',
						// 			borderRadius: 4,
						// 			}} {...restProps}
						// 		>
						// 			<Text style={setFont('200', 6, 'red', 'Regular')}>{text}</Text>
						// 	  	</View>
						// 	);
						// }}
						renderNotch={(props) => {
							return (
								<View style={{ 
									width: 8,
									height: 8,
									borderLeftColor: 'transparent',
									borderRightColor: 'transparent',
									borderTopColor: setColor('subscribeBlue'),
									borderLeftWidth: 4,
									borderRightWidth: 4,
									borderTopWidth: 8,
									}}  {...props}
								/>
							);
						}}
						onValueChanged={(value1, value2, fromUser) => {
                //console.log("ON EST DANS LE CALLBACK MAX : " + value1 + " -  " + value2 + "    : " +fromUser );
                if (fromUser) {
                  this.setState({ maturities : [value1, value2] }, () => {
                    this.props.updateValue("maturity", this.state.maturities, this._getMaturityTitle());
                    
                  });
                }
            }}
					/>
				</View>
                <View style={{marginTop : 20, borderTopWidth : 1}}>
                      <Text style={setFont('400', 14, 'black', 'Regular')}>
                        {'\n'}Influence
                      </Text>
                      <Text style={setFont('300', 12)}>
                      Généralement, plus vous optez pour un produit avec une échéance lointaine, plus votre coupon sera élevé.
                      </Text>
                </View>
                <View style={{marginTop : 10, borderTopWidth : 0}}>
                      <Text style={setFont('400', 14, 'black', 'Regular')}>
                      Vérification
                      </Text>
                      <Text style={setFont('300', 12)}>
                      Vérifiez auparavant si l'encapsulage juridique du produit sera compatible à la maturité choisie (par exemple dans une Assurance Vie, la maturité du produit devra être de 8 ans)
                      </Text>
                </View>
                <View style={{marginTop : 10, borderTopWidth : 0}}>
                      <Text style={setFont('400', 14, 'black', 'Regular')}>
                      Risques
                      </Text>
                      <Text style={setFont('300', 12)}>
                      La maturité augmentant, le risque de subir les aléas de marché augmentent aussi et le risque de perte en capital également.
                      </Text>
                </View>
                <View style={{marginTop : 10, borderTopWidth : 0}}>
                      <Text style={setFont('400', 14, 'black', 'Regular')}>
                      Illustration
                      </Text>
    
                </View>
            </View>
        );
    }


}

