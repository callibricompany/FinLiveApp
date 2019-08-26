import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';
import { Icon } from 'native-base';
import Carousel from 'react-native-snap-carousel';

import STRUCTUREDPRODUCTS from '../../../Data/structuredProducts.json';

import { globalStyle, tabBackgroundColor, backgdColor, FLFontFamily, subscribeColor } from '../../../Styles/globalStyle'



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export class FLProductDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            currentProductIndex : STRUCTUREDPRODUCTS.findIndex(obj => obj.id == this.props.initialValue),
            toto: true,
        }
        
    }

   componentDidMount () {

        //on va sur la valeur du carousel par defaut
        this.refs['carousel'].snapToItem(this.state.currentProductIndex);
        
        this.setState({ toto : !this.state.toto });
   }
    _displayProductList = ({ item }) => {
	    return (
                <View style={{flex:1, justifyContent : 'center', alignItems: 'center', borderWidth:0}}>
	              <Text style={{fontSize:20, textAlign: 'center'}}>{item.name}</Text>
	           </View>
	    )
	}

    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*DEVICE_WIDTH, marginRight: 0.05*DEVICE_WIDTH, borderWidth:0}}>
                <View style={{alignItems:'center'}}>

                    <Icon name="md-arrow-dropdown"  style={{marginTop: 15, color : "#85B3D3"}}/>
                    <Carousel
                        ref={'carousel'}
                        data={STRUCTUREDPRODUCTS}
                        renderItem={this._displayProductList.bind(this)}
                        sliderWidth={DEVICE_WIDTH*0.925}
                        itemWidth={DEVICE_WIDTH/3}
                        //itemHeight={400}
                        //sliderHeight={400}
                        //slideStyle={{backgroundColor: 'pink', height : 100, borderWidth: 2}}
                        //containerCustomStyle={{ backgroundColor : 'green'}}
                        //contentContainerCustomStyle={{ backgroundColor : 'red'}}
                        firstItem={this.state.currentProductIndex}
                        onSnapToItem={(currentProductIndex) => {
                            this.setState({ currentProductIndex }, () => this.props.updateValue("type", STRUCTUREDPRODUCTS[this.state.currentProductIndex].id,STRUCTUREDPRODUCTS[this.state.currentProductIndex].name))
                        }}
                    />
                    <Icon name="md-arrow-dropup"  style={{color : "#85B3D3"}}/>
                </View>
                <View style={{paddingTop :40}}>
                    <Text style={{fontSize : 18}}>
                        {STRUCTUREDPRODUCTS[this.state.currentProductIndex].comments}
                    </Text>
                </View>
            </View>
        );
    }


}
