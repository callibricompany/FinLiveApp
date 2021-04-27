import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Keyboard, View, Text, TextInput, SafeAreaView, Image, KeyboardAvoidingView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

import useFormValidation from "./useFormValidation";
import validateForm from "./validateForm";

import { manageClientData } from '../../API/APIAWS';
import { setColor, setFont } from '../../Styles/globalStyle';
import { getConstant } from '../../Utils/';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

import logo_white from '../../assets/LogoWithoutTex_white.png';


const ProfileClientDetail = ({ navigation }) => {

    let isModify = navigation.getParam('isModify');
    let { id, ...item } = navigation.getParam('data', null);
    const firebase = navigation.getParam('firebase');

  
    var INITIAL_STATE = item;
    if (!isModify)  {
        INITIAL_STATE = {
            surname: "",
            name: "",
            email: "",
            telephone: "",
            custodian_account: "",
            uid: item.uid
        };
    }

    const {
        handleSubmit,
        handleBlur,
        handleChange,
        values,
        errors,
        isSubmitting
    } = useFormValidation(INITIAL_STATE, validateForm, submitForm);

    // const [modify, setModify] = useState(isModify);
    const [serverError, setServerError] = useState(null);
    //const [isEditable, setIsEditable ] = useState(navigation.getParam('isEditable', true));
    const [isUpdatable, setIsUpdatable] = useState(false)

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    
        // cleanup function
        return () => {
          Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
          Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
      }, []);
    
      const _keyboardDidShow = () => {
        navigation.setParams({ hideBottomTabBar : true });
        console.log("Keyboard Shown");
      };
    
      const _keyboardDidHide = () => {
        navigation.setParams({ hideBottomTabBar : false });
        console.log("Keyboard Hidden");
      };

    async function submitForm() {
        try {
            // console.log(INITIAL_STATE)
            // console.log(isModify);
            // console.log(values.uid)
            // console.log(values);
            values.fullName = values.surname + " " + values.name;
            if (isModify) {
                await manageClientData(firebase, values, 'update');
                navigation.state.params.updateClient(values);
                navigation.goBack();
            } else {
                await manageClientData(firebase, values, 'create');
                navigation.state.params.updateClient(values);
                navigation.goBack();
            }
            //navigation.navigate('Clients', { userId: item.userId, refresh: true, message: 'Changements pris en compte' });
        } catch (err) {
            console.error("Communication Error", err);
            setServerError(err.message);
        }
    }

    return (
        <SafeAreaView style={{flex : 1, backgroundColor: setColor('')}}>
        <View style={{height: getConstant('height')  , backgroundColor : setColor('background'), }}> 
            <TouchableOpacity style={{flexDirection : 'row',height : 45,  borderWidth : 0, alignItems: 'center', justifyContent : 'space-between', backgroundColor : setColor(''),  paddingRight : 15, paddingLeft : 15, height : 45}}
                                                onPress={() => navigation.goBack()}
                              >
                              <View style={{ flex : 0.2, flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', borderWidth : 0}}>
                                  
                                      <Ionicons name={'ios-arrow-round-back'} size={25} color={'white'}/>
                  
                              </View>
                              <View style={{flex : 0.6, borderWidth: 0, alignItems : 'center', justifyContent : 'center'}}>
                                <Text style={setFont('400', 18, 'white', 'Regular')}>
                                 {(values.name == null || values.name === '' )? 'Nouveau client' : values.name} {values.surname}
                                </Text>
                              </View>
                              <View style={{ flex : 0.2}} />
            </TouchableOpacity>
   
                <View style={{flex : 1,}}>
                <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>  
                    {/* <Text style={styles.textItem}>id: {id}</Text>
                    <Text style={styles.textItem}>uid: {item.uid}</Text> */}
                    <View style={{borderWidth : 0, justifyContent : 'center', alignItems: 'center', marginBottom : 20}}>

                            <TouchableOpacity style={{height : 90, width : 90, borderWith : 0, borderColor : 'black', borderRadius : 45, backgroundColor : setColor(''),  marginTop : 20, marginBottom : 10, alignItems : 'center', justifyContent : 'center'}} 
                                                        onPress={() => {
                                                        //this._pickImageOrTakePicture();
                                                        }}
                                    >
                                        {/*this.state.profileImage == null 
                                        ?
                                            <Text style={setFont('400', 24, 'white', 'Regular')}>{this.user.getFirstName().charAt(0)}.{this.user.getLastName().charAt(0)}.</Text>
                                            : 
                                            <Image style={{width: 90, height: 90, borderWidth : 0, borderRadius : 45, borderColor : setColor('')}} source={{uri : this.state.profileImage}} />
                                        */}
                                        <Text style={setFont('400', 24, 'white', 'Regular')}>{values.name.charAt(0)}.{values.surname.charAt(0)}.</Text>
                                        <View style={{position : 'absolute', top : 70, right : 0}}>
                                            <Feather name={'camera'} size={20} color={setColor('subscribeBlue')}/>
                                        </View>
                            </TouchableOpacity>

                            <View>
                                <Text style={setFont('400', 18, 'black', 'Bold')}>{values.name} {values.surname}</Text>
                            </View>

                    </View>
                     <View style={{flexDirection : 'row', padding : 5, justifyContent : 'space-between' , backgroundColor: 'white', borderBottomColor: setColor('borderFL'),borderBottomWidth: 1, borderTopColor: setColor('borderFL'),borderTopWidth: 1}}>
                              <View style={{flex : 0.4, marginLeft : 10, padding : 5}}>
  
                                      <Text style={setFont('200', 18)}>
                                        Nom
                                      </Text>
 
                   
                              </View>
                              <View style={{ flex : 0.6, borderWidth : 0, justifyContent : 'center'}}>
                                      <TextInput
                                        style={setFont('200', 16, 'black', 'Regular')}
                                        placeholder={'Nom'}
                                        placeholderTextColor={'lightgray'}
                                        autoCorrect={false}
                                        autoCompleteType={'name'}
                                        textContentType={'familyName'}
                                        returnKeyType={'done'}
                                        editable={true}
                                        onBlur={async () => {
                    
                                        }}
                                        //onFocus={() =>  this.setState({ nominal : '' })}
                                        //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                        value={values.surname}
                                        onChangeText={(val) => {
                                            if (val !== values.surname) {
                                                setIsUpdatable(true);
                                            }
                                            handleChange(val,'surname');
                                        }}
                                      />
                            
                              </View>   
                    </View>
                    <View style={{flexDirection : 'row', padding : 5, justifyContent : 'space-between' , backgroundColor: 'white', borderBottomColor: setColor('borderFL'),borderBottomWidth: 1, borderTopColor: setColor('borderFL')}}>
                              <View style={{flex : 0.4, marginLeft : 10, padding : 5}}>
  
                                      <Text style={setFont('200', 18)}>
                                        Prénom
                                      </Text>
 
                   
                              </View>
                              <View style={{ flex : 0.6, borderWidth : 0, justifyContent : 'center'}}>
                                      <TextInput
                                        style={setFont('200', 16, 'black', 'Regular')}
                                        placeholder={'Prénom'}
                                        placeholderTextColor={'lightgray'}
                                        autoCorrect={false}
                                        autoCompleteType={'name'}
                                        textContentType={'name'}
                                        returnKeyType={'done'}
                                        editable={true}
                                        onBlur={async () => {
                    
                                        }}
                                        //onFocus={() =>  this.setState({ nominal : '' })}
                                        //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                        value={values.name}
                                        onChangeText={(val) => {
                                            if (val !== values.name) {
                                                setIsUpdatable(true);
                                            }
                                            handleChange(val,'name');
                                        }}
                                      />
                            
                              </View>   
                    </View>
                    <View style={{flexDirection : 'row', padding : 5, justifyContent : 'space-between' , backgroundColor: 'white', borderBottomColor: setColor('borderFL'),borderBottomWidth: 1, borderTopColor: setColor('borderFL')}}>
                              <View style={{flex : 0.4, marginLeft : 10, padding : 5}}>
  
                                      <Text style={setFont('200', 18)}>
                                        Email
                                      </Text>
 
                   
                              </View>
                              <View style={{ flex : 0.6, borderWidth : 0, justifyContent : 'center'}}>
                                      <TextInput
                                        style={setFont('200', 16, 'black', 'Regular')}
                                        placeholder={'Email'}
                                        placeholderTextColor={'lightgray'}
                                        autoCorrect={false}
                                        autoCompleteType={'email'}
                                        textContentType={'emailAddress'}
                                        //keyboardType={''}
                                        returnKeyType={'done'}
                                        keyboardType={'email-address'}
                                        editable={true}
                                        onBlur={async () => {
                    
                                        }}
                                        //onFocus={() =>  this.setState({ nominal : '' })}
                                        //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                        value={values.email}
                                        onChangeText={(val) => {
                                            if (val !== values.email) {
                                                setIsUpdatable(true);
                                            }
                                            handleChange(val,'email');
                                        }}
                                      />
                            
                              </View>   
                    </View>

                    <View style={{flexDirection : 'row', padding : 5, justifyContent : 'space-between' , backgroundColor: 'white', borderBottomColor: setColor('borderFL'),borderBottomWidth: 1, borderTopColor: setColor('borderFL')}}>
                              <View style={{flex : 0.4, marginLeft : 10, padding : 5}}>
  
                                      <Text style={setFont('200', 18)}>
                                      Téléphone
                                      </Text>
 
                   
                              </View>
                              <View style={{ flex : 0.6, borderWidth : 0, justifyContent : 'center'}}>
                                      <TextInput
                                        style={setFont('200', 16, 'black', 'Regular')}
                                        placeholder={'Téléphone'}
                                        placeholderTextColor={'lightgray'}
                                        autoCorrect={false}
                                        autoCompleteType={'tel'}
                                        textContentType={'telephoneNumber'}
                                        returnKeyType={'done'}
                                        keyboardType={'phone-pad'}
                                        editable={true}
                                        onBlur={async () => {
                    
                                        }}
                                        //onFocus={() =>  this.setState({ nominal : '' })}
                                        //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                        value={values.telephone}
                                        onChangeText={(val) => {
                                            if (val.length > 5) {
                                                val = parsePhoneNumberFromString(val,'FR').formatInternational()
                                            }
                                            if (val !== values.telephone) {
                                                setIsUpdatable(true);
                                            }
                                            handleChange(val,'telephone');
                                        }}
                                      />
                            
                              </View>   
                    </View>
    
                    <View style={{flexDirection : 'row', padding : 5, justifyContent : 'space-between' , backgroundColor: 'white', borderBottomColor: setColor('borderFL'),borderBottomWidth: 1, borderTopColor: setColor('borderFL')}}>
                              <View style={{flex : 0.4, marginLeft : 10, padding : 5}}>
  
                                      <Text style={setFont('200', 18)}>
                                      Dépositaire
                                      </Text>
 
                   
                              </View>
                              <View style={{ flex : 0.6, borderWidth : 0, justifyContent : 'center'}}>
                                      <TextInput
                                        style={setFont('200', 16, 'black', 'Regular')}
                                        placeholder={'Dépositaire'}
                                        placeholderTextColor={'lightgray'}
                                        autoCorrect={false}
                                      
                                        returnKeyType={'done'}
                                        editable={true}
                                        onBlur={async () => {
                    
                                        }}
                                        //onFocus={() =>  this.setState({ nominal : '' })}
                                        //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                        value={values.custodian_account}
                                        onChangeText={(val) => {
                                            if (val !== values.custodian_account) {
                                                setIsUpdatable(true);
                                            }
                                            handleChange(val,'custodian_account');
                                        }}
                                      />
                            
                              </View>   
                    </View>

                    <View style={{borderWidth : 0, marginTop : 20, alignItems: 'center', justifyContent : 'center', opacity : isUpdatable ? 1 : 0.2}}>
                      <TouchableOpacity style ={{height: 70, width: 70, flexDirection: 'column',  borderWidth : 1, borderColor: setColor('subscribeBlue'), borderRadius: 35, padding : 10, backgroundColor: setColor('subscribeBlue')}}
                          onPress={() => {
                            handleSubmit();
                            
                          }}  
                      >
                          <View style={{marginTop: -5, alignItems: 'center', justifyContent: 'center'}}>
                              <Image style={{width: 40, height: 40}} source={logo_white} />
                          </View>
                          <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                              <Text style={setFont('400', 10, 'white', 'Regular')}>{String('modifier').toUpperCase()}</Text>
                          </View>
                    </TouchableOpacity>
                  </View>

                </KeyboardAvoidingView>
                </View>
          
        </View>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({


    buttonRight: {
        fontSize: 20,
        backgroundColor: setColor('subscribeBlue'),
        color: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20
    }
});

export default ProfileClientDetail;