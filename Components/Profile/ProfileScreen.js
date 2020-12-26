import React from 'react';
import { View, ScrollView, Button, Text, AsyncStorage, SafeAreaView, Animated, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import Accordion from 'react-native-collapsible/Accordion';
import SwitchSelector from "react-native-switch-selector";

import AlertAsync from 'react-native-alert-async';

import { withFirebase } from '../../Database';
import { withUser } from '../../Session/withAuthentication';
import { withAuthorization } from '../../Session';
import { compose, hoistStatics } from 'recompose';
import { globalStyle, setColor, setFont } from '../../Styles/globalStyle'

import { isIphoneX, getConstant, isAndroid } from '../../Utils';
import { interpolateColorFromGradient } from '../../Utils/color';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import FLModalDropdown from '../commons/FLModalDropdown';

import { CUser } from '../../Classes/CUser';
import { Row } from 'native-base';

class ProfileScreen extends React.Component {


  constructor(props) {
    super(props)

    this.user = this.props.user;

    this.state = { 
      

      //gestion des sections
      activeSections: [0, 1],

      toto : true,
    }


  }

  static navigationOptions = ({ navigation }) => {
    return ({
      header : null,
    }
    );
}

 async componentDidMount() {
  if (!isAndroid()) {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content' );
    });
  }


}
  componentWillUnmount() {
    if (!isAndroid()) {
      this._navListener.remove();
    }

  }





  ////////////////////////////
  //
  //      DECONNEXION
  ////////////////////////////
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  };

  async _deconnexionDB () {
    await AsyncStorage.clear();
    console.log("Debut deconnxion ...");
    this.props.firebase.doSignOut()
    .then(() => {
      console.log("Déconnexion firebase : ok");
      return true;
    })
    .catch((error) => {
            console.log("Erreur de deconnxion firebase : " + error);
            Alert.alert('EREEUR DE DECONNEXION DB',  ''+ error);
            return false;
    });
  }

  _signOutAlert = async () => {
    const choice = await AlertAsync(
      'Se déconnecter',
      'Confirmez-vous votre déconnexion ?',
      [
       // {text: 'Confirmer', onPress: () => this._signOutAsync()},
       {text: 'Confirmer', onPress: () => this._deconnexionDB()},
        {text: 'Annuler', onPress: () => 'non et non'},
      ],
      {
        cancelable: true,
        onDismiss: () => 'no',
      },
    );

  
    if (choice === 'yes') {
      //await this._signOutAsync();
    }
  };




  render() {
    var dataOptions = ['amend', 'disconnect'];
    return (
      <SafeAreaView style={{flex : 1, backgroundColor: setColor('')}}>
      <View style={{height: getConstant('height')  , backgroundColor : setColor('background'), }}> 

          <View style={{flexDirection : 'row', borderWidth : 0, alignItems : 'center', justifyContent: 'space-around', backgroundColor : setColor(''), padding : 5, }}>
                            <View style={{ flex: 0.2}}/>
                            <TouchableOpacity style={{flex : 0.6, alignItems : 'center', justifyContent: 'center'}}
                                              onPress={() => {
                                                this.props.navigation.navigate('ProfileScreenDetail');
                                              }}
                            >
                              <Text style={setFont('400', 28, 'white', 'Regular')}>
                                Profil
                              </Text>
                            </TouchableOpacity>
                            <View style={{flex: 0.2, flexDirection : 'row', justifyContent: 'flex-end', alignItems: 'flex-end', borderWidth: 0, marginRight: 0.05*getConstant('width')}}>
                                    <FLModalDropdown
                                    //pickerStyle={{width: 160, height: 160, backgroundColor: 'red'}}
                                    //textStyle={[setFont('500', 16, (this.request.isUpdated('barrierPhoenix')) ? setColor('subscribeBlue') : this.stdLightColor, 'Bold'), {textAlign: 'center'}]}
                                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                                    dropdownTextHighlightStyle={setFont('500', 16, this.stdColor, 'Bold')}
                                    onDropdownWillShow={() => this.setState({ showModalDropdown : true })}
                                    onDropdownWillHide={() => this.setState({ showModalDropdown : false })}

                                    adjustFrame={(f) => {
                                      return {
                                        width: getConstant('width')/2,
                                        height: Math.min(getConstant('height')/3, dataOptions.length * 40),
                                        left : f.left,
                                        right : f.right,
                                        top: f.top,
                                        borderWidth : 1,
                                        borderColor : 'gray',
                                        borderRadius : 3
                                      }
                                    }}
                                    renderRow={(option, index, isSelected) => {
                                      switch(option) {
                                        case 'amend' :
                                              return (
                                                    <TouchableOpacity style={{height: 40 , paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}
                                                                        onPress={() => {
                                                                          this._dropdownMenuOption.hide();
                                                                          this.props.navigation.navigate('ProfileScreenDetail');
                                                                        }}
                                                      >

                                                          <Text style={setFont('500', 14, 'black', 'Regular')}>Modifier</Text>
                                                      </TouchableOpacity>
                                              );
                                  
                                        case 'disconnect' :
                                              return (
                                                    <TouchableOpacity style={{height: 40 , paddingLeft : 4, paddingRight : 4, justifyContent: 'center', alignItems: 'flex-start'}}
                                                                        onPress={() => {
                                                                          //this._dropdownMenuOption.hide();
                                                                          this._signOutAlert();
                                                                        }}
                                                      >

                                                          <Text style={setFont('500', 14, 'black', 'Regular')}>Déconnexion</Text>
                                                      </TouchableOpacity>
                                              );
                                        default : 
                                                return (
                                                 <View />
                                              );
                                      }
          
                                    }}
                                    //defaultIndex={dataOptions.indexOf(this.autocallResult.getProductTypeName())}
                                    options={dataOptions}
                                    ref={component => this._dropdownMenuOption = component}
                                    disabled={false}
                                >
                                    <View style={{ borderWidth : 0, width : 0.1*getConstant('width'),  height: 40, justifyContent: 'center', alignItems: 'center'}}>
                                      <MaterialCommunityIcons name={'dots-vertical'} size={30} style={{color: 'white'}}/>
                                    </View>
                                </FLModalDropdown>
                   
                  </View>
          </View>


          <TouchableOpacity style={{flexDirection : 'row',  alignItems : 'center', justifyContent : 'space-between'}}
                            onPress={() => {
                              this.props.navigation.navigate('ProfileScreenDetail');
                            }}
          >
              <View style={{flex : 0.3, borderWidth : 0, alignItems : 'center'}}>
                    <View style={{height : 70, width : 70, borderWith : 0, borderColor : 'white', borderRadius : 35, backgroundColor : setColor(''),  marginTop : 10, marginBottom : 10, alignItems : 'center', justifyContent : 'center'}}  >
                      {this.user.getAvatar() == null 
                        ?
                          <Text style={setFont('400', 24, 'white', 'Regular')}>{this.user.getFirstName().charAt(0)}.{this.user.getLastName().charAt(0)}.</Text>
                          : 
                          <Image style={{width: 70, height: 70, borderWidth : 0, borderRadius : 35, borderColor : 'white'}} source={{uri : this.user.getAvatar() }} />
                      }

                    </View>
              </View>
              <View style={{flex : 0.7, borderWidth : 0, marginRight : 15, alignContent : 'flex-start', justifyContent : 'flex-start' }}>
                  <View style={{borderWidth : 0, marginTop : 5, alignItems : 'flex-start', justifyContent : 'flex-start'}}>
                        <Text style={setFont('500', 22, 'black', 'Regular')}>
                          {this.user.getName()}
                        </Text>
                        {
                        this.user.isSupervisor()
                          ?
                              <Text style={setFont('500', 12, 'gray')}>
                                Superviseur
                              </Text>
                          : null
                        }
                  </View>
                  <View style={{flex : 1, flexDirection : 'row', borderWidth : 0}} >
                          <View style={{flex : 0.7, alignItems : 'flex-start', justifyContent : 'flex-start'}}>
                                <Text style={setFont('500', 18, 'black', 'Regular')}>
                                  {this.user.getCompany()}
                              </Text>
                          </View>
                          <View style={{flex : 0.3, borderWidth : 0, marginTop : -20, justifyContent : 'center'}}>
                             <Image style={{ borderWidth : 0, height : 35}} source={{uri : this.props.userOrg.logoUrl}} resizeMode={'contain'} />
                          </View>
                  </View>
                  
              </View>


          </TouchableOpacity>
  
          <ScrollView style={{flex : 1}}>
 
                <View style={{flexDirection : 'row', marginTop : 30, marginLeft : getConstant('width')*0.025, marginRight : getConstant('width')*0.025, height : getConstant('width')*0.95/3 -10}}>
                      <View style={{borderWidth : 1, borderColor : 'white', borderRadius : 10, backgroundColor : 'white', width : getConstant('width')*0.95/3 -10, justifyContent : 'space-between'}}>
                          <View style={{paddingLeft : 5, paddingRight : 5, paddingTop : 5,}}>
                              <Text style={setFont('200', 18, 'gray')}>
                                Placements Privés
                              </Text>
                          </View>
                          <View style={{paddingLeft : 5, paddingRight : 5, paddingBottom : 5, borderWidth :0}}>
                              <Text style={setFont('200', 22, setColor('granny'), 'Regular')}>
                                8
                              </Text>
                              <Text style={setFont('200', 14, 'gray', 'Regular')}>
                                2 300 400 €
                              </Text>
                          </View>

                      </View>
                      <View style={{borderWidth : 1, borderColor : 'white', borderRadius : 10, backgroundColor : 'white', width : getConstant('width')*0.95/3 -10, marginLeft : 10, justifyContent : 'space-between'}}>
                        <View style={{padding : 5}}>
                              <Text style={setFont('200', 18, 'gray')}>
                                A.P.E.
                              </Text>
                          </View>
                          <View style={{padding : 5, borderWidth :0}}>
                              <Text style={setFont('200', 22, 'red', 'Regular')}>
                                2
                              </Text>
                              <Text style={setFont('200', 14, 'gray', 'Regular')}>
                                900 000 €
                              </Text>
                          </View>
                      </View>
                      <View style={{borderWidth : 1, borderColor : 'white', borderRadius : 10, backgroundColor : 'white', width : getConstant('width')*0.95/3 -10, marginLeft : 10, justifyContent : 'space-between'}}>
                          <View style={{padding : 5}}>
                              <Text style={setFont('200', 18, 'gray')}>
                                Pricings
                              </Text>
                          </View>
                          <View style={{padding : 5, borderWidth :0}}>
                              <Text style={setFont('200', 22, 'black', 'Regular')}>
                                542
                              </Text>
                              <Text style={setFont('200', 14, 'gray', 'Regular')}>
                                
                              </Text>
                          </View>

                      </View>
                </View>

                <View style={{flexDirection : 'row', marginTop : 10, marginLeft : getConstant('width')*0.025, marginRight : getConstant('width')*0.025, height : getConstant('width')*0.95/3 -10}}>
                      <TouchableOpacity style={{borderWidth : 1, borderColor : 'white', borderRadius : 10, backgroundColor : 'white', width : getConstant('width')*0.95/3 -10, justifyContent : 'space-between'}}
                                        onPress={() => {
                                          this.props.navigation.navigate('ProfileScreenDetail',{option :  'ISSUER'});
                                        }}
                      >
                          <View style={{paddingLeft : 5, paddingRight : 5, paddingTop : 5,}}>
                              <Text style={setFont('200', 18, 'gray')}>
                                Emetteurs Autorisés
                              </Text>
                          </View>
                          <View style={{paddingLeft : 5, paddingRight : 5, paddingBottom : 5, borderWidth :0}}>
                              <Text style={setFont('200', 22, 'black', 'Regular')}>
                                {this.props.issuers.length - this.user.getIssuersRejectedCount()}
                              </Text>
  
                          </View>

                      </TouchableOpacity>

                      <TouchableOpacity style={{borderWidth : 1, borderColor : 'white', borderRadius : 10, backgroundColor : 'white', width : getConstant('width')*0.95/3 -10, marginLeft : 10, justifyContent : 'space-between'}}
                                                              onPress={() => {
                                                                this.props.navigation.navigate('ProfileScreenDetail',{option :  'FRIEND'});
                                                              }}
                      >
                        <View style={{padding : 5}}>
                              {/* <Text style={setFont('200', 18, 'gray')}>
                                Mes contacts
                              </Text> */}
                              <FontAwesome5 name={'users'} size={35} color={'gray'} />
                          </View>
                          <View style={{padding : 5, borderWidth :0}}>
                              <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
                                  <View style={{}}>
                                      <Text style={setFont('200', 14, setColor(''), 'Regular')}>
                                        {this.props.userOrg.name}
                                      </Text>
                                  </View>
                                  <View style={{}}>
                                      <Text style={setFont('200', 14, setColor(''), 'Regular')}>
                                        {this.props.users.getUsersFromMyOrg().length}
                                      </Text>
                                  </View>                                
                              </View>
                              <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
                                  <View style={{}}>
                                      <Text style={setFont('200', 12, 'gray', 'Regular')}>
                                        Amis
                                      </Text>
                                  </View>
                                  <View style={{}}>
                                      <Text style={setFont('200', 12, 'gray', 'Regular')}>
                                          {this.props.users.getUsersFriends(this.user).length}
                                      </Text>
                                  </View>                                
                              </View>
                          </View>
                      </TouchableOpacity>
                </View>      


                {/* <TouchableOpacity style={{alignSelf : 'center', marginTop : 65, marginBottom : 5,width : getConstant('width')/2, padding : 5, alignItems : 'center',  borderWidth : 1, borderColor : 'white', borderRadius : 20, backgroundColor :setColor('red')}}
                                  onPress={() => this._signOutAlert()}
                >
                    <Text style={setFont('400', 12, 'white', 'Regular')}>
                      DECONNEXION
                    </Text>
                </TouchableOpacity> */}

          </ScrollView>

      </View>
      </SafeAreaView>
    );
  }
}

const condition = authUser => authUser != null;

const composedFB = compose(
  withAuthorization(condition),
  withFirebase,
  withUser,
  
);  


export default hoistStatics(composedFB)(ProfileScreen);

{/* <Text>{this.props.authUser.firstName} {this.props.authUser.name}</Text>
<Text>{this.props.authUser.email}jjhj</Text>
<Text>{this.props.authUser.codeTS}</Text>
<Text>{this.props.authUser.roles}</Text>
{this.props.authUser.roles ? this.props.authUser.roles.map((role)=> <Text key={role}>{role}</Text>) : <Text></Text>}     */}