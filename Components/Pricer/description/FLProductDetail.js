import React, {Component} from 'react';
import {FlatList, Text, View, TouchableWithoutFeedback} from 'react-native';
import SwitchSelector from "react-native-switch-selector";

import { globalStyle, setFont, setColor } from '../../../Styles/globalStyle';
import { getConstant } from '../../../Utils';
import { CAutocall2 } from "../../../Classes/Products/CAutocall2";
import Fontisto from 'react-native-vector-icons/Fontisto';

import TermSheetAutocall from '../../../charts/products/TermSheetAutocall';
import TermSheetAutocallAirbag from '../../../charts/products/TermSheetAutocallAirbag';
import TermSheetPhoenixMem from '../../../charts/products/TermSheetPhoenixMem';
import TermSheetPhoenix from '../../../charts/products/TermSheetPhoenix';
import DegressivityBarrier from '../../../charts/products/DegressivityBarrier';

export class FLProductDetail extends React.Component{

    constructor(props) {
        super(props);

        this.state = { 
            currentChoice : this.props.initialValue
        }

    }

   
    renderTS(){
        switch(this.state.currentChoice) {
            case 'AUTOCALL_INCREMENTAL' :
                //return <TermSheetAutocall request={this.props.request}/> 
                //if (this.props.request.getValue('degressiveStep')  === 0) {
                    return <TermSheetAutocallAirbag request={this.props.request}/> 
                //} else {
                //    return <DegressivityBarrier request={this.props.request}/> 
                //}
            case 'PHOENIX_MEMORY' :
                return <TermSheetPhoenixMem request={this.props.request}/> 
            case 'PHOENIX' :
                return <TermSheetPhoenix request={this.props.request}/> 
            default :
                return (
                    <View><Text>Prochainement {CAutocall2.getNameFromCode(this.state.currentChoice)}</Text></View>
                )
        }
    }

    // onViewableItemsChanged = ({ viewableItems, changed }) => {
    //     if (viewableItems.length == 3) {
    //         this.update(viewableItems[1].item)
    //     } else if (viewableItems.length == 2) {
    //         if (changed[0].isViewable === false) {
    //             if (changed[0].index < viewableItems[0].index) {
    //                 this.update(viewableItems[1].item)
    //             } else {
    //                 this.update(viewableItems[0].item)
    //             }
    //         }
    //     }
    //     //console.log("Visible items are", viewableItems);
    //     //console.log("Changed in this iteration", changed);
    //   }

      update(currentChoice) {
          this.props.updateValue('type', currentChoice, CAutocall2.getNameFromCode(currentChoice));
          switch (currentChoice)  {
            case 'AUTOCALL_INCREMENTAL' :   //autocall
                this.props.updateValue('barrierPhoenix', 1, "100%");
                this.props.updateValue('autocallLevel', 1, 'rappel à 100%');
                //this._updateValue('isIncremental', true, "incremental");
                this.props.updateValue('isMemory', true, "Effet mémoire");
                this.props.activateParameter('typeAirbag', true);
                this.props.activateParameter('degressiveStep', true);
                this.props.activateParameter('barrierPhoenix', false);
                break;
            case 'PHOENIX' : //phoenix
                //this._updateValue('nncp', 12, '1 an');
                this.props.updateValue('isMemory', false, "non mémoire");
                this.props.updateValue('autocallLevel', 1, 'rappel à 100%');
                this.props.updateValue('degressiveStep', 0, 'sans stepdown');
                this.props.updateValue('typeAirbag', 'NA', 'Non airbag');
                this.props.updateValue('barrierPhoenix', 0.9, "Protégé jusqu'à -10%");
                this.props.activateParameter('typeAirbag', false);
                this.props.activateParameter('degressiveStep', false);
                this.props.activateParameter('barrierPhoenix', true);
                break;
             case 'PHOENIX_MEMORY' : //phoenix mémoire
                this.props.updateValue('isMemory', true, "non mémoire");
                this.props.updateValue('autocallLevel', 1, 'rappel à 100%');
                this.props.updateValue('degressiveStep', 0, 'sans stepdown');
                this.props.updateValue('typeAirbag', 'NA', 'Non airbag');
                this.props.updateValue('barrierPhoenix', 0.9, "Protégé jusqu'à -10%");
                this.props.activateParameter('typeAirbag', false);
                this.props.activateParameter('degressiveStep', false);
                this.props.activateParameter('barrierPhoenix', true);
                break;
             case 'REVERSE': //reverse
                this.props.updateValue('isMemory', false, "non mémoire");
                this.props.updateValue('autocallLevel', 99.99, 'pas de rappel');
                this.props.updateValue('degressiveStep', 0, 'sans stepdown');
                this.props.updateValue('typeAirbag', 'NA', 'Non airbag');
                this.props.updateValue('freq', '1M', "1 mois");
                this.props.activateParameter('barrierPhoenix', false);
                this.props.activateParameter('typeAirbag', false);
                this.props.activateParameter('degressiveStep', false);
                this.props.activateParameter('barrierPhoenix', false);
   
                break;
          }
          this.setState({currentChoice});
      }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column',  marginLeft: 0.05*getConstant('width'), marginRight: 0.05*getConstant('width'), borderWidth:0}}>
                <View style={{width  : getConstant('width')*0.9, height : 100, borderWidth : 0, marginBottom : 20}}>
                    {/* <View style={{borderWidth : 0, alignItems : 'center', justifyContent : 'center'}}>
                        <Fontisto name={'caret-down'} size={30} />
                    </View> */}
                    <View style={{marginTop : 15}}>
                        <SwitchSelector
                                initial={CAutocall2.AUTOCALL_TYPE.indexOf(this.state.currentChoice)}
                                onPress={obj => {
                                    this.update(obj.value);
                                }}
                                textColor={setColor('lightBlue')} 
                                textContainerStyle={{padding :  5}}
                                selectedTextContainerStyle={{borderWidth : 0, padding : 5}}
                                height={60}
                                borderRadius={20}
                                selectedColor={'white'}
                                buttonColor={setColor('')} 
                                borderColor={'lightgray'} 
                                returnObject={true}
                                hasPadding={true}
                                options={[
                                    { label: "Autocall Incrémental", value: "AUTOCALL_INCREMENTAL", customIcon: null}, 
                                    { label: "Phoenix", value: "PHOENIX", customIcon: null} ,
                                    { label: "Phoenix mémoire", value: "PHOENIX_MEMORY", customIcon: null} ,
                                    { label: "Réverse convertible", value: "REVERSE", customIcon: null} ,
                                ]}
                        />
                    </View>
                    {/* <FlatList
                            ref={(ref) => this.productref = ref}
                            initialScrollIndex={CAutocall2.AUTOCALL_TYPE.indexOf(this.state.currentChoice)}
                            onScrollToIndexFailed={(error) => {
                                //this.productref.scrollToOffset({ offset: error.averageItemLength * error.index, animated: true });
                                setTimeout(() => {
                            
                                    this.productref.scrollToIndex({ index: CAutocall2.AUTOCALL_TYPE.indexOf(this.state.currentChoice), animated: true, viewPosition : 0.5 });
                            
                                }, 100);
                            }}
                            data={CAutocall2.AUTOCALL_TYPE}
                            renderItem={({ item, index }) => {
                                    let isSelected = item === this.state.currentChoice;

                                    return (
                                        <View style={{width : getConstant('width') *0.6, borderWidth : 0, justifyContent : 'center', alignItems : 'center', marginLeft : index === 0 ? getConstant('width')*0.15 : 10, marginRight : index === (CAutocall2.AUTOCALL_TYPE.length - 1) ? getConstant('width')*0.15 : 0}}>
                                            <Text style={setFont('400', 24, isSelected ? 'black' : 'gray','Regular')}>
                                                {CAutocall2.getNameFromCode(item)}
                                            </Text>
                                        </View>
                                    )
                            }}
                    
                            horizontal={true}
                            onViewableItemsChanged={this.onViewableItemsChanged }
                            keyExtractor={item => item}
                            showsHorizontalScrollIndicator={false}
                    /> */}
                    {/* <View style={{borderWidth : 0, alignItems : 'center', justifyContent : 'center'}}>
                            <Fontisto name={'caret-up'} size={30} />
                    </View> */}
                </View>
                {this.renderTS()}
               
            </View>
        );
    }


}


