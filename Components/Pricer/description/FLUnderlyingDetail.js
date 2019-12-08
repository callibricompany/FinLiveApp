import React from 'react';
import {StyleSheet, ScrollView, Text, View, Dimensions, TouchableOpacity, SafeAreaView, Platform} from 'react-native';
import { Icon, Picker, Left, Header, Button } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';


import { globalStyle, blueFLColor, selectElementTab, FLFontFamily, backgdColorPricerParameter, setFont, setColor } from '../../../Styles/globalStyle'



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;



export class FLUnderlyingDetail extends React.Component{


    constructor(props) {
        super(props);
        
        //on filtre pour ne garder que les sous-jacents financiers
        this.underlyings = this.props.underlyings;
        //console.log(this.underlyings);

        //retourne tous les types de sous-jacents disponibles
        let typeUnderlying = [...new Set(this.underlyings.map(x => x.codeSubCategory))];
        this.typeUnderlying = [];
        typeUnderlying.forEach((value) => {
            if (value !== "PS") {
                let obj = {};
                obj["value"] = value;
                obj["label"] = value.substring(2, value.length);
                this.typeUnderlying.push(obj);
            }
        });
       
        //construction de la liste des secteurs
        this.sectorList = [];
        let obj = {};
        obj["underlyingCode"] = "NONE";
        obj["subCategoryName"] = "Choississez un secteur";
        this.sectorList.push(obj);
        this.underlyings.filter(obj => obj.groupingHead == true).forEach((value) => this.sectorList.push(value));
        //console.log(this.sectorList);

        //gestion de la liste des sous-jacents selectionnes
        this.selectedUnderlyings = [];
        this.underlyingsCode = [];
        let possibleUnderlyings = [];

        //on initialise avec les sous-jacents deja selectionnes 
        console.log("INITIAL : "+ this.props.initialValue);
        this.props.initialValue.forEach((underlyingCode) => {
            this.selectedUnderlyings.push(this.underlyings.filter(obj => obj.underlyingCode == underlyingCode)[0]);
        })
        
        possibleUnderlyings = JSON.parse(JSON.stringify(this.selectedUnderlyings));
        possibleUnderlyings.map((obj) => {obj["active"]= true });
        this.selectedUnderlyings.forEach((underlying) => this.underlyingsCode.push(underlying.underlyingCode));


        this.state = { 
            currentType : this.selectedUnderlyings.length === 0 ? '' : this.selectedUnderlyings[0].codeSubCategory,
            currentSector : this.sectorList[0],
            possibleUnderlyings,
        }

       
    }

    componentDidMount () {
        this._updateUnderlyingList();
    }

    //gere la liste des sous-jacents affiches et des sous-jacents selectionnes
    _updateUnderlyingList=() => {
        //update de la liste des sous-jacents possible
        let possibleUnderlyings = [];
        possibleUnderlyings = this.underlyings.filter(obj => obj.codeSubCategory == this.state.currentType);
        possibleUnderlyings = possibleUnderlyings.filter(obj => obj.subCategoryHead == false);

        
        //console.log(possibleUnderlyings);
        //il s'agit des actions / on n'affiche pas les secteurs
        if (this.state.currentType === "PSACTIONS") {
            if (this.state.currentSector.underlyingCode === 'NONE') {
                //possibleUnderlyings = [];
                possibleUnderlyings = possibleUnderlyings.filter(obj => obj.groupingHead == false);
            } 
            else {
                possibleUnderlyings = possibleUnderlyings.filter(obj => obj.groupingHead == false);
                if (this.state.currentSector.underlyingCode !== 'NONE') {
                    possibleUnderlyings = possibleUnderlyings.filter(obj => obj.groupingName == this.state.currentSector.groupingName);
                }
            }
        }
        //boucle sur la liste des underlying initiaux afin de savoir s'ils sont deja selectionnes 
        possibleUnderlyings.map((obj) => {
                let foundIt = false;
                this.selectedUnderlyings.forEach((selectedUnderlying) => foundIt = selectedUnderlying.underlyingCode === obj.underlyingCode ? true : foundIt);
                obj["active"]= foundIt;
            }
        );

        this.setState({ possibleUnderlyings });
    }


    _displayUnderlyingList(underlying, i) {
 
	    return (
            <View  key={i} style={{marginTop : i === 0 ? 20 : 0, flexDirection: 'row', alignItems:'center', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor : 'gainsboro', borderTopWidth: i===0 ? 1 : 0, borderTopColor : 'gainsboro'}}>
                <View style={{flex : 0.7, alignItems : 'flex-start', justifyContent : 'center', borderWidth : 0}}>
                    <Text style={{ color: underlying.active ? 'black' : 'gainsboro', fontFamily : FLFontFamily, fontSize : 18 }}>{underlying.subCategoryName}</Text>
                </View>
                <TouchableOpacity  style={{flex : 0.3, justifyContent: 'center',alignItems: 'flex-end', borderWidth: 0,backgroundColor : 'white'}}
                    onPress={() => {
                        //on active un underlying
                        underlying.active = !underlying.active
                        if (underlying.active) {
                            this.selectedUnderlyings.indexOf(underlying) === -1 ? this.selectedUnderlyings.push(underlying):null;
                        } else {
                            this.selectedUnderlyings.splice(this.selectedUnderlyings.indexOf(underlying), 1);
                        }


                        let selectedUnderlyingArray  = [...new Set(this.selectedUnderlyings.map(x => x.underlyingCode))];
                        let selectedUnderlyingNameArray  = [...new Set(this.selectedUnderlyings.map(x => x.subCategoryName))];
                        if (selectedUnderlyingNameArray.length === 0){
                            selectedUnderlyingNameArray = 'Optimisé';
                        }
                        //console.log(selectedUnderlyingNameArray.toString());
                        this.props.updateValue("underlying", selectedUnderlyingArray ,selectedUnderlyingNameArray.toString().replace(/,/g,'\n'));
                    }}>
                    <FontAwesome name={underlying.active ? "toggle-on" :  "toggle-off"}  size={30} style={{color : selectElementTab}}/> 
                </TouchableOpacity>
            </View>
	    )
	}

    render() {

        let pickerDropDownButton = Platform.OS === 'ios' ?            
                                        <View style={{marginLeft : 5, flex : 0.1, height: 50, borderWidth : 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                                                <Icon name="arrow-dropdown-circle" style={{ color: blueFLColor, fontSize: 25 }} />   
                                        </View>
                                        : null;

        let picker = this.state.currentType === "PSACTIONS" ?
        <View  style={{ flexDirection: 'row',alignItems:'center', justifyContent: 'center', borderWidth: 0}}>
            <View style={{flex : 0.3, alignItems:'flex-start', justifyContent: 'center', height: 50, borderWidth : 0}}>
               <Text style={{ color: 'black', fontFamily : FLFontFamily, fontSize : 18 }}>Secteur : </Text>
            </View>
            <View style={{flex : Platform.OS === 'ios' ? 0.6 : 0.7, height: 50, borderWidth : 0}}>
                    <Picker
                        renderHeader={backAction =>
                           <SafeAreaView/>}
                        selectedValue={this.state.currentSector}
                        style={{height: 50,  borderWidth:0}}
                        //iosIcon={<Icon name="arrow-dropdown-circle" style={{ color: blueFLColor, fontSize: 25 }} />}
                        //mode={"dropdown"}
                        //prompt={"Choisissez votre sous-jacent"}
                        iosHeader="Secteur : "
                        textStyle={{ flexWrap: 'wrap', color: 'black', fontFamily : FLFontFamily, fontSize : 18 }}
                        itemStyle={{
                          backgroundColor: backgdColorPricerParameter,
                          marginLeft: 0,
                          paddingLeft: 10
                        }}
                        itemTextStyle={{ color: 'black', fontFamily : FLFontFamily, fontSize : 20 }}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({ currentSector : itemValue}, () => this._updateUnderlyingList());
                            }
                        }>

                        {this.sectorList.map((sector,i) => {
                            //console.log(sector);
                            return (
                            <Picker.Item key={i} label={sector.subCategoryName} value={sector} />
                            );
                        })}
                    </Picker>
            </View>
            {pickerDropDownButton}
 
        </View>
                                                      : null;
        return (
            <ScrollView style={{flex : 1, flexDirection : 'column', marginLeft: 0.05*DEVICE_WIDTH, marginRight: 0.05*DEVICE_WIDTH, borderWidth:0}}>
                <View  style={{marginTop : 20, flexDirection: 'row', alignItems:'center', borderWidth: 0}}>
                    <RadioForm formHorizontal={true} animation={true} >
                        {this.typeUnderlying.map((type, i) => {
                            //console.log(i+"/ "+type);
                            return (
                                <View style={{flex : 0.5, justifyContent: 'center', alignItems: 'center', borderWidth : 0}} key={i}>
                                    <RadioButton labelHorizontal={true}  >
                            
                                            <RadioButtonInput
                                                obj={type}
                                                index={i}
                                                isSelected={this.state.currentType === type.value}
                                                onPress={(itemValue) =>{
                                                    //console.log(i +"-ITEM VALUE : "+itemValue);
                                                    this.setState({ currentType : this.typeUnderlying[i].value}, () => this._updateUnderlyingList());
                                                }}
                                                borderWidth={1}
                                                buttonSize={12}
                                                buttonOuterSize={20}
                                                buttonStyle={{marginTop : 10}}
                                                //buttonWrapStyle={{marginLeft: 10}}
                                            />
                                            <RadioButtonLabel
                                                obj={type}
                                                index={i}
                                                labelHorizontal={true}
                                                onPress={() => console.log()}
                                                labelStyle={{fontSize: 16, fontFamily : FLFontFamily, color: 'black', marginTop: 10}}
                                                labelWrapStyle={{}}
                                                onPress={(itemValue) =>{
                                                    //console.log(i +"-ITEM VALUE : "+itemValue);
                                                    this.setState({ currentType : this.typeUnderlying[i].value}, () => this._updateUnderlyingList());
                                                }}
                                            />
                                    </RadioButton>
                                </View>
                            );
                        })}                  
                    </RadioForm> 
                </View>
                    {picker}
                    {this.state.possibleUnderlyings.map((underlying, i) =>  this._displayUnderlyingList(underlying, i))}
 
                    <View style={{marginTop : 20, borderTopWidth : 1}}>
                            <Text style={setFont('400', 14, 'black', 'Regular')}>
                            {'\n'}Influence
                            </Text>
                            <Text style={setFont('300', 12)}>
                                Le choix du sous-jacent est primordial et influe grandement le niveau de coupon. Les sous-jacents les plus volatiles permettent généralement d'obtenir de meilleurs coupons."
                            </Text>
                    </View>
                    <View style={{marginTop : 10, borderTopWidth : 0}}>
                            <Text style={setFont('400', 14, 'black', 'Regular')}>
                            Vérification
                            </Text>
                            <Text style={setFont('300', 12)}>
                            Complétez ce choix et votre argumentaire avec des analyses fondamentales que vous trouverez prochainement sur FinLive
                            </Text>
                    </View>
                    <View style={{marginTop : 10, borderTopWidth : 0}}>
                            <Text style={setFont('400', 14, 'black', 'Regular')}>
                            Risques
                            </Text>
                            <Text style={setFont('300', 12)}>
                            Choisir une action est plus risqué car la valeur est plus susceptible de subir des profits warnings
                            </Text>
                    </View>
                    <View style={{marginTop : 10, borderTopWidth : 0}}>
                            <Text style={setFont('400', 14, 'black', 'Regular')}>
                            Illustration
                            </Text>
        
                    </View>

                    


                <View style={{paddingTop :40}}>
                    <Text style={{fontSize : 12, fontWeight: '600', fontFamily : 'FLFontFamily'}}>
                        F i n L i v e
                    </Text>
                </View>
            </ScrollView>
        );
    }


}




