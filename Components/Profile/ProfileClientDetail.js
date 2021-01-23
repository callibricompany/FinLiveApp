import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, Text, TextInput, SafeAreaView, Linking } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import useFormValidation from "./useFormValidation";
import validateForm from "./validateForm";

import { manageClientData } from '../../API/APIAWS';
import { setColor, setFont } from '../../Styles/globalStyle';
import { getConstant } from '../../Utils/';

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
    const [isEditable, setIsEditable ] = useState(navigation.getParam('isEditable', true));

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
            <View style={{flexDirection : 'row',height : 45,  borderWidth : 0, alignItems: 'center', justifyContent : 'space-between', backgroundColor : setColor(''),  paddingRight : 15, paddingLeft : 15}}>
                              <TouchableOpacity style={{ flex : 0.2, flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', borderWidth : 0}}
                                                onPress={() => navigation.goBack()}
                              >
                                  
                                      <Ionicons name={'ios-arrow-round-back'} size={25} color={'white'}/>
                  
                              </TouchableOpacity>
                              <View style={{flex : 0.6, borderWidth: 0, alignItems : 'center', justifyContent : 'center'}}>
                                <Text style={setFont('400', 20, 'white', 'Regular')}>
                                 {(values.name == null || values.name === '' )? 'Nouveau client' : values.name} {values.surname}
                                </Text>
                              </View>
                              <View style={{ flex : 0.2}} />
            </View>
            {isEditable
            ?
                <View style={styles.container}>
                    {/* <Text style={styles.textItem}>id: {id}</Text>
                    <Text style={styles.textItem}>uid: {item.uid}</Text> */}
                    <Text style={styles.textItem}>Nom</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(val) => handleChange(val,'surname')}
                        value={values.surname}
                        editable={isEditable}
                    />
                    <Text style={styles.textItem}>Prénom</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(val) => handleChange(val,'name')}
                        value={values.name}
                    />
                    <Text style={styles.textItem}>email</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(val) => handleChange(val,'email')}
                        value={values.email}
                        autoCapitalize={'none'}
                    />
                    <Text style={styles.textItem}>Téléphone</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(val) => handleChange(val,'telephone')}
                        value={values.telephone}
                    />
                    <Text style={styles.textItem}>Dépositaire</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(val) => handleChange(val,'custodian_account')}
                        value={values.custodian_account}
                    />
                    <View style={styles.fixToText}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonLeft}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            handleSubmit();
                            }} disabled={isSubmitting} >
                            <Text style={styles.buttonRight}>Enregistrer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            :
            <View style={styles.container}>
                <Text style={styles.textItem}>Nom : {item.surname}</Text>
                <Text style={styles.textItem}>Prénom : {item.name}</Text>
                <Text style={styles.textItem}>email : {item.email}</Text>
                <Text style={styles.textItem}>Téléphone : {item.telephone}</Text>
                <Text style={styles.textItem}>Dépositaire : {item.custodian_account}</Text>
                <View style={styles.fixToText}>
                    <TouchableWithoutFeedback onPress={() => Linking.openURL(`tel:${item.telephone}`)}>
                        <Text style={styles.buttonLeft}>Appeler</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => setIsEditable(true)}>
                        <Text style={styles.buttonRight}>Modifier</Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
            }
        </View>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    title: {
        textAlign: 'center',
        marginVertical: 20,
    },
    fixToText: {
        paddingTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    textItem: {
        fontSize: 15,
        paddingTop: 10,
        paddingLeft: 15,
    },
    buttonLeft: {
        fontSize: 20,
        backgroundColor: '#CCC',
        color: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    buttonRight: {
        fontSize: 20,
        backgroundColor: 'rgb(34,97,165)',
        color: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        padding: 8,
        margin: 10,
    }
});

export default ProfileClientDetail;