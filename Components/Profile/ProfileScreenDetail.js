import React from 'react';
import { View, ScrollView, Button, Text, AsyncStorage, SafeAreaView, Keyboard, TouchableOpacity, StyleSheet, StatusBar, Image, Alert, Modal, ClippingRectangle, TextInput, KeyboardAvoidingView } from 'react-native';

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

import Accordion from 'react-native-collapsible/Accordion';
import ActionSheet from 'react-native-action-sheet';

import AlertAsync from 'react-native-alert-async';

import { withFirebase } from '../../Database';
import { withUser } from '../../Session/withAuthentication';
import { withAuthorization } from '../../Session';
import { withNavigationFocus } from "react-navigation";
import { compose, hoistStatics } from 'recompose';
import { globalStyle, setColor, setFont } from '../../Styles/globalStyle'

import { isIphoneX, getConstant, isAndroid, sizeByDevice } from '../../Utils';
import { interpolateColorFromGradient } from '../../Utils/color';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Asset } from "expo-asset";
import * as ImageManipulator from "expo-image-manipulator";

import logo_white from '../../assets/LogoWithoutTex_white.png';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { updateUser, changeAvatar } from '../../API/APIAWS';

import { CUser } from '../../Classes/CUser';
import { CUsers } from '../../Classes/CUser';


class ProfileScreenDetail extends React.Component {

  camera = null;


  _focusListener = null;
  _blurListener = null;


  constructor(props) {
    super(props)

    
    this.user = this.props.user;
    //this.users = this.props.users;

    this.state = { 
      //gestion de la photo de profil
      profileImage: this.user.getAvatar(),
      showModalCamera : false,
      typeCamera: Camera.Constants.Type.front,
      isCameraReady : false,
      hasCameraPermission: false,
 
      //gestion du change de pwd et email
      showModalChangePwd : false,

      //gestion des sections
      activeSections: [0, 1],

      //search users
      isSearchingFriends : false,
      friendName : '',

      lastName : this.user.getLastName(),
      firstName : this.user.getFirstName(),
      phone : this.user.getPhone().length === 0 ? "" : parsePhoneNumberFromString(this.user.getPhone(),'FR').formatInternational(),
      company : this.user.getCompany(),
      currentPwd : '',
      newPwd : '',
      newPwdConfirm : '', 
      showCurrentPwd : false,
      showNewPwd : false,
      showNewPwdConfirm : false,


      toto : true,
    }



    this.title = "Modifier";
    this.SECTIONS = [            
 
      // {
      //   title: 'équipe',
      //   code: 'TEAM',
      // }, 
      {
        title: 'coordonnées',
        code: 'USERDATA',
      }, 
      // {
      //   title: 'déconnexion',
      //   code: 'DISCONNECT',
      // }
    ]

  }

static navigationOptions = ({ navigation }) => {
    return ({
      header : null,
    }
    );
}

async componentDidMount() {
  const camera = await Permissions.getAsync(Permissions.CAMERA);
  //console.log(camera);
  const hasCameraPermission = (camera.status === 'granted');
  this.setState({ hasCameraPermission });


  this._navListener = this.props.navigation.addListener('didFocus', () => {

    if (!isAndroid()) {
      StatusBar.setBarStyle('light-content' );
    }
  });
}



componentWillUnmount() {
    //console.log("Composant demonté");

  if (this._navListener) {
      //this._navListener();
      this._navListener = null;
      //this._navListener.remove();
  }
  Keyboard.removeListener('keyboardDidShow');
  Keyboard.removeListener('keyboardDidHide');

}



  ////////////////////////////
  //
  //      IMAGE DE PROFIL
  ////////////////////////////
  _pickImageOrTakePicture() {

  //   <ActionSheet
  //   ref={o => this.ActionSheet = o}
  //   title={'Which one do you like ?'}
  //   options={['Apple', 'Banana', 'cancel']}
  //   cancelButtonIndex={2}
  //   destructiveButtonIndex={1}
  //   onPress={(index) => { console.log(index); }}
  // />
    if (!isAndroid()) {
         ActionSheet.showActionSheetWithOptions({
          options:['Prendre une photo', 'Bibliothéque Photo', 'Annuler'] ,
          cancelButtonIndex: 2,
          //destructiveButtonIndex: 1,
          tintColor: 'blue'
        },
        (buttonIndex) => {
          if (buttonIndex === 1) { //bibliotheque photo
              this.getPermissionLibraryAsync();
              this._pickImage();
          } else if (buttonIndex === 0) { //camera 
            this.getPermissionCameraAsync();
            this.setState({ showModalCamera : true })
          }
        });
    } else {
      Alert.alert(
        '',
        '',
        [
          { text: 'Annuler', onPress: () => console.log('Photo annulé') },
          {
            text: 'Bibliothéque Photo',
            onPress: () => {
              this.getPermissionLibraryAsync();
              this._pickImage();
            },
            style: 'cancel'
          },
          {
            text: 'Prendre une photo',
            onPress: () => {
              this.getPermissionCameraAsync();
              //this.getSupportedRatio();
              this.setState({ showModalCamera : true });
            }
          },

          
        ],
        { cancelable: true }
      );

    }
  };

 

  _updateProfilImage(result) {
    this.setState({ profileImage: result.uri , showModalCamera : false , isCameraReady : false});
    this.user.setAvatar(result.uri);
    changeAvatar(this.props.firebase, result, this.user.getFreshdeskCode());
  }

  _pickImage = async () => {

      try {
          let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.cancelled) {
          this._updateProfilImage(result);
        }
  
        console.log(result);
      } catch (E) {
        console.log(E);
      }
  };

  getPermissionLibraryAsync = async () => {
    if (isAndroid()) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  setCameraReady = async () => {
    let DESIRED_RATIO = "4:3";
    console.log("set camera ratio : ");
    if (isAndroid()) {

        const ratios = await camera.getSupportedRatiosAsync();
        console.log(ratios);
        // See if the current device has your desired ratio, otherwise get the maximum supported one
        // Usually the last element of "ratios" is the maximum supported ratio
        const ratio = ratios.find((ratio) => ratio === DESIRED_RATIO) || ratios[ratios.length - 1];
        console.log(ratio);
        this.setState({ ratio });

    }
    this.setState({ isCameraReady : true });
    //this._takePicture();
  };

  

  handleCameraType=async()=>{
    const { typeCamera } = this.state;
    if (camera == null) {
      const camera = await Permissions.getAsync(Permissions.CAMERA);
    } 
    this.setState({typeCamera:
      typeCamera === Camera.Constants.Type.back
      ? Camera.Constants.Type.front
      : Camera.Constants.Type.back
    })
  }

  getPermissionCameraAsync = async () => {
    //demande pour camera
    const { status } = await Camera.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, accesss to camera is not allowed !');
    } else {
      console.log("status camera granted :" +status);
    }

  };

  _takePicture () {
  
    if (camera) {
          console.log("is camera ok    ");
          camera.takePictureAsync()
          .then((result) => {
             console.log("apres prise   ");
            if (!result.cancelled) {

              // console.log("==================================================");
              // console.log(result);
              let height = result.height;
              let width = result.width;
              ImageManipulator.manipulateAsync(
                 result.uri,
                [{ crop: {
                  originX: 0,
                  originY: (height- width) / 2 - 40 - getConstant('statusBar'),
                  width: width,
                  height: width
               } }],
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
              )
              .then((manipResult) =>  this._updateProfilImage(manipResult))
              .catch((err) => console.log(err));
              
              //console.log(manipResult);
             ;
            }
            // console.log("avant result ");
            // console.log(result);
          })
          .catch((error) => console.log(error));
  
    }
  };

  _renderModalCamera () {
    return (
      <Modal  animationType="slide" transparent={true} visible={this.state.showModalCamera}
              onRequestClose={() => {
              console.log('Modal has been closed');
            }}
      >


          <View style={{flexDirection : 'row', borderWidth : 0, alignItems: 'center', justifyContent : 'space-between', backgroundColor : setColor(''), padding : 5, paddingRight : 15, paddingLeft : 15, marginTop : isAndroid() ? 0 : getConstant('statusBar')}}>
                            <TouchableOpacity style={{ flex : 0.3, flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', borderWidth : 0}}
                                              onPress={() => this.setState({ showModalCamera : false })}
                            >
                                
                                    <Ionicons name={'md-close'} size={40} color={'white'}/>
                
                            </TouchableOpacity>
                            <View style={{flex : 0.4, borderWidth: 0, alignItems : 'center', justifyContent : 'center'}}>
                              <Text style={setFont('400', 22, 'white', 'Regular')}>
                                Souriez ...
                              </Text>
                            </View>
                            <View style={{ flex : 0.3, alignItems : 'flex-end', justifyContent : 'center', borderWidth : 0}}>
         
                            </View>
          </View>
            {(this.state.hasCameraPermission  && this.props.navigation.isFocused())
            ?
                    isAndroid() 
                    ? <Camera ref={ref => {camera = ref}} style={{flex:1}} type={this.state.typeCamera} ratio={this.state.ratio} onCameraReady={() => this.setCameraReady()}/>
                    : <Camera ref={ref => {camera = ref}} style={{flex:1}} type={this.state.typeCamera} useCamera2Api={false} onCameraReady={() => this.setCameraReady()}/>
            : <View><Text>Acces caméra refusé</Text></View>
            }
          
          <View style={{position : 'absolute', top : getConstant('height')/2 - getConstant('width')/2, left : 0, height : getConstant('width'), width : getConstant('width'),borderWidth : 10, borderColor : 'white', borderRadius : getConstant('width')/2}} />
          <View style={{ position : 'absolute', top : getConstant('height') -100, left : 0, flexDirection:"row",justifyContent:'space-around', height : 100, width : getConstant('width'), zIndex : 10, alignItems : 'flex-start'}}>
              <TouchableOpacity style={{ backgroundColor: 'transparent', }}
                                onPress={()=>{
                                    //this.setState({ showModalCamera : false }, () => this._pickImage());

                                    this._pickImage();
                                }}
                                activeOpacity={this.state.isCameraReady ? 0.3 : 1}
              >
              <Ionicons name="ios-photos" style={{ color : 'white', fontSize: 40}} />
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'transparent', }}
                              onPress={()=> {
                                this._takePicture();
                                //this._takePicture.bind(this)
                                //this.setState({ showModalCamera : false, isCameraReady : false });
                              }}
            >
              <FontAwesome name="camera" style={{ color: this.state.isCameraReady ? 'white' : 'black', fontSize: 40}} />
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'transparent', }}
                  onPress={()=>{
                    camera = null;
                    this.handleCameraType();
                  }}
            >
              <MaterialCommunityIcons name="camera-switch" style={{ color: 'white', fontSize: 40}}/>
            </TouchableOpacity>
          </View>

      </Modal>
    );
  }

  ////////////////////////////
  //
  //      CHGE PWD et EMAIL
  ////////////////////////////
  _renderModalChangePassword=()=> {

    return (

      <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.showModalChangePwd}
      >
      
          <View 
            style={{flex:1, backgroundColor:'transparent'}} 
            onStartShouldSetResponder={() => true}
            //onStartShouldSetResponderCapture={() => true}
            //onMoveShouldSetResponderCapture={() => true}
            //onMoveShouldSetResponder={() => true}
            onResponderRelease={(evt) =>{
              let x = evt.nativeEvent.pageX;
              let y = evt.nativeEvent.pageY;
              //si on a clické en dehors du module view cidessous on ferme le modal
              let verifX = x < getConstant('width')*0.1  || x > getConstant('width')*0.9 ? true : false;
              let verifY = y < getConstant('height')*0.275  || y > getConstant('height')*0.725 ? true : false;
              if (verifX || verifY) {
                this.setState({showModalChangePwd : false});
              }
            }}

          >
            
                <View 
                  //directionalLockEnabled={true} 
                  //contentContainerStyle={{
                    style={{
                      backgroundColor: 'white',
                      borderRadius : 10,
                      shadowColor: setColor('shadow'),
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      borderWidth : 1,
                      borderColor : isAndroid() ? 'lightgray' :  'white',
                      //borderRadius:10,
                      //width: this.state.leftPositionCategory,
                      width : getConstant('width')*0.8, 
                      height: getConstant('height')*0.45,
                      top:  getConstant('height')*0.2,
                      left : getConstant('width')*0.1,
                      //marginTop:getConstant('height')*0.15,                       
                      //borderRadius: getConstant('height')*0.03,
                      //alignItems: 'absolute'
                      padding : 10
                  }}
                >
                    <View style={{backgroundColor : setColor('subscribeBlue'), borderWidth : 1, borderRadius : 3, padding : 5, borderColor: setColor('subscribeBlue'), justifyContent : 'center', alignItems : 'center'}}>
                        <Text style={setFont('400', 18, 'white', 'Bold')}>Changement du mot de passe</Text> 
                    </View>
                    <View style={{padding : 5, justifyContent : 'center', alignItems : 'flex-start', marginTop : 20}}>
                        <Text style={setFont('400', 16, 'black', 'Regular')}>Mot de passe actuel :</Text> 
                    </View>
                    <View style={{flexDirection: 'row', borderWidth : 1, borderRadius : 3, padding : 5, borderColor: setColor('borderFL'), justifyContent : 'center', alignItems : 'flex-start'}}>
                            <TextInput
                                        style={[setFont('200', 16, 'black', 'Regular'), {flex : 1}]}
                                        placeholder={'Mot de passe actuel'}
                                        placeholderTextColor={'lightgray'}
                                        autoCorrect={false}
                                        //keyboardType={''}
                                        returnKeyType={'done'}
                                        editable={true}
                                        secureTextEntry={!this.state.showCurrentPwd}
                                        onBlur={async () => {

                                        }}
                                        textContentType={'password'}
                                        //onFocus={() =>  this.setState({ nominal : '' })}
                                        //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                        value={this.state.currentPwd}
                                        onChangeText={e => {
                                              this.setState({ currentPwd : e });
                                        }}
                                      />
                            <TouchableOpacity onPress={() => this.setState({ showCurrentPwd : !this.state.showCurrentPwd })}>
                                <MaterialCommunityIcons name={this.state.showCurrentPwd ? 'eye-outline' : 'eye-off'} size={20} />
                            </TouchableOpacity>
                    </View>


                    <View style={{padding : 5, justifyContent : 'center', alignItems : 'flex-start', marginTop : 20}}>
                        <Text style={setFont('400', 16, 'black', 'Regular')}>Nouveau mot de passe :</Text> 
                    </View>
                    <View style={{flexDirection: 'row', borderWidth : 1, borderRadius : 3, padding : 5, borderColor: setColor('borderFL'), justifyContent : 'center', alignItems : 'flex-start'}}>
                            <TextInput
                                        style={[setFont('200', 16, 'black', 'Regular'), {flex : 1}]}
                                        placeholder={'Nouveau mot de passe'}
                                        placeholderTextColor={'lightgray'}
                                        autoCorrect={false}
                                        //keyboardType={''}
                                        returnKeyType={'done'}
                                        editable={true}
                                        secureTextEntry={!this.state.showNewPwd}
                                        onBlur={async () => {

                                        }}
                                        textContentType={'password'}
                                        //onFocus={() =>  this.setState({ nominal : '' })}
                                        //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                        value={this.state.newPwd}
                                        onChangeText={e => {
                                              this.setState({ newPwd : e });
                                        }}
                                      />
                            <TouchableOpacity onPress={() => this.setState({ showNewPwd : !this.state.showNewPwd })}>
                                <MaterialCommunityIcons name={this.state.showNewPwd ? 'eye-outline' : 'eye-off'} size={20} />
                            </TouchableOpacity>
                    </View>


                    <View style={{padding : 5, justifyContent : 'center', alignItems : 'flex-start', marginTop : 20}}>
                        <Text style={setFont('400', 16, 'black', 'Regular')}>Confirmez votre nouveau mot de passe :</Text> 
                    </View>
                    <View style={{flexDirection: 'row', borderWidth : 1, borderRadius : 3, padding : 5, borderColor: setColor('borderFL'), justifyContent : 'center', alignItems : 'flex-start'}}>
                            <TextInput
                                        style={[setFont('200', 16, 'black', 'Regular'), {flex : 1}]}
                                        placeholder={'Confirmez votre nouveau mot de passe'}
                                        placeholderTextColor={'lightgray'}
                                        autoCorrect={false}
                                        //keyboardType={''}
                                        returnKeyType={'done'}
                                        editable={true}
                                        secureTextEntry={!this.state.showNewPwdConfirm}
                                        onBlur={async () => {

                                        }}
                                        textContentType={'password'}
                                        //onFocus={() =>  this.setState({ nominal : '' })}
                                        //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                        value={this.state.newPwdConfirm}
                                        onChangeText={e => {
                                              this.setState({ newPwdConfirm : e });
                                        }}
                                      />
                            <TouchableOpacity onPress={() => this.setState({ showNewPwdConfirm : !this.state.showNewPwdConfirm })}>
                                <MaterialCommunityIcons name={this.state.showNewPwdConfirm ? 'eye-outline' : 'eye-off'} size={20} />
                            </TouchableOpacity>
                    </View>
                    <View style={{borderWidth : 0, marginTop : 20, alignItems: 'center', justifyContent : 'center'}}>
                      <TouchableOpacity style ={{height: 70, width: 70, flexDirection: 'column',  borderWidth : 1, borderColor: setColor('subscribeBlue'), borderRadius: 35, padding : 10, backgroundColor: setColor('subscribeBlue')}}
                          onPress={() => {
                            //check if password ok
                            if (this.state.currentPwd.length <= 6 || this.state.newPwd.length <= 6 || this.state.newPwdConfirm.length <= 6 ) {
                              alert("Vos mots de passes sont trop courts");
                            }
                            else if (this.state.newPwd !== this.state.newPwdConfirm) {
                              alert("Vous navez rentrés 2 mots de passe différents");
                            }
                            else {
                              this.props.firebase.doChangePassword(this.state.currentPwd, this.state.newPwd)
                              .then((result) => {
                                
                                alert("Mot de passe changé avec succès");
                                this.setState({ showModalChangePwd : false });
                                
                              })
                              .catch((error) => {
                                alert("Erreur : impossible de changer  le mot de passe");
                                
                              });
                            }
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
                </View>
           
          </View>
          
        </Modal>

    );
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


  ////////////////////////////
  //
  //      ACCORDEON
  ////////////////////////////
  _renderHeaderUnderlying = (content, index, isActive, sections) => {
    let percentColor = Math.round(100*(index/this.SECTIONS.length));
    let gradientColorName = "Finlive";
    switch(content.code) {
      case 'DISCONNECT' :
          return (
            <View style={{flexDirection : 'row', justifyContent: "space-between", alignItems: 'center', borderWidth : 0, backgroundColor : setColor('background'), margin : -10, paddingTop : 15, paddingLeft : 10}}>
              <TouchableOpacity style={{marginTop : 5, marginBottom : 5, marginLeft : 15, padding : 8, paddingLeft : 20, paddingRight : 20,  borderWidth : 1, borderColor : 'white', borderRadius : 5, backgroundColor : interpolateColorFromGradient(gradientColorName, percentColor)}}
                                onPress={() => this._signOutAlert()}
              >
                  <Text style={setFont('400', 16, 'white', 'Regular')}>
                    fff{content.title.toUpperCase()}
                  </Text>
              </TouchableOpacity>
 

            </View>
          );
          break;
      default :
            // return (
            //   <View style={{
            //     borderBottomColor: setColor('borderFL'),
            //     paddingLeft: 15,
            //     borderBottomWidth: 1,
            //     //height: 145,
            //     marginTop : 0,
            //     borderWidth : 0,
            //     paddingTop : 15,
            //     paddingBottom : 4,
            //     flexDirection : 'row',
            //     backgroundColor : setColor('background')
            // }}>
            //     <View style={{padding : 5, backgroundColor : setColor('subscribeBlue'), borderWidth : 1, borderRadius : 10, borderColor: setColor('subscribeBlue'), justifyContent : 'center', alignItems : 'center'}}>
            //     <Text style={setFont('400', 18, 'white', 'Bold')}>{content.title.toUpperCase()}</Text> 
            //     </View>
            // </View>
   
            // );
    }
  };

   _renderContentUnderlying =  (content, index, isActive, sections) => {
    //console.log("EST ACTIF : " + isActive);
    console.log(this.user);
    switch(content.code) {
        case 'USERDATA' :
              return (
                <View style={{borderWidth : 0}}>

                          <View style={{flexDirection : 'row', padding : 5, justifyContent : 'space-between' , backgroundColor: 'white', borderBottomColor: setColor('borderFL'),borderBottomWidth: 1, borderTopColor: setColor('borderFL'),borderTopWidth: 1}}>
                              <View style={{flex : 0.4, marginLeft : 10, padding : 5}}>
  
                                      <Text style={setFont('200', 16)}>
                                        Nom
                                      </Text>
 
                   
                              </View>
                              <View style={{ flex : 0.6, borderWidth : 0, justifyContent : 'center'}}>
                                      <TextInput
                                        style={setFont('200', 14, 'black', 'Regular')}

                
   
                                        placeholder={'Nom'}
                                        placeholderTextColor={'lightgray'}
                                        underlineColorAndroid={'#fff'}
                                        autoCorrect={false}
                                        textContentType={'familyName'}
                                        //keyboardType={''}
                                        returnKeyType={'done'}
                                        editable={true}
                                        onBlur={async () => {
                                          if (this.state.lastName === '') {
                                            this.setState({ lastName : this.user.getLastName() });
                                          } 
                                          else {
                                              let lastNameBeforeUpdate = this.user.getLastName();
                                              try {
                                                this.user.setLastName(this.state.lastName );
                                                await updateUser(this.props.firebase, this.user);
                                                this.setState({ toto : !this.state.toto });
                                              }
                                              catch(error) {
                                                this.user.setLastName(lastNameBeforeUpdate);
                                                Alert('Echec changement de nom');
                                                console.log(error);
                                              }
                                      
                                          }
                                        }}
                                        //onFocus={() =>  this.setState({ nominal : '' })}
                                        //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                        value={this.state.lastName}
                                        onChangeText={e => {
                                              this.setState({ lastName : e });
                                        }}
                                      />
                            
                              </View>   
                          </View>
                          <View style={{flexDirection : 'row', padding : 5, justifyContent : 'space-between' , backgroundColor: 'white', borderBottomColor: setColor('borderFL'),borderBottomWidth: 1,}}>
                              <View style={{flex : 0.4, marginLeft : 10, padding : 5}}>
  
                                      <Text style={setFont('200', 16)}>
                                        Prénom
                                      </Text>
 
                   
                              </View>
                              <View style={{ flex : 0.6, borderWidth : 0, justifyContent : 'center'}}>
                              <TextInput
                                        style={setFont('200', 14, 'black', 'Regular')}

                
   
                                        placeholder={'Nom'}
                                        placeholderTextColor={'lightgray'}
                                        underlineColorAndroid={'#fff'}
                                        autoCorrect={false}
                                        //keyboardType={''}
                                        returnKeyType={'done'}
                                        editable={true}
                                        onBlur={async () => {
                                          if (this.state.firstName === '') {
                                            this.setState({ firstName : this.user.getFirstName() });
                                          } 
                                          else {
                                              let firstNameBeforeUpdate = this.user.getLastName();
                                              try {
                                                this.user.setFirstName(this.state.firstName );
                                                await updateUser(this.props.firebase, this.user);
                                                this.setState({ toto : !this.state.toto });
                                              }
                                              catch(error) {
                                                this.user.setFirstName(firstNameBeforeUpdate);
                                                Alert('Echec changement de nom');
                                                console.log(error);
                                              }
                                      
                                          }
                                        }}
                                        textContentType={'name'}
                                        //onFocus={() =>  this.setState({ nominal : '' })}
                                        //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                        value={this.state.firstName}
                                        onChangeText={e => {
                                              this.setState({ firstName : e });
                                        }}
                                      />
                              </View>   
                          </View>
                          <View style={{flexDirection : 'row', padding : 5, justifyContent : 'space-between' , backgroundColor: 'white', borderBottomColor: setColor('borderFL'),borderBottomWidth: 1,}}>
                              <View style={{flex : 0.4, marginLeft : 10, padding : 5}}>
  
                                      <Text style={setFont('200', 16)}>
                                        Email
                                      </Text>
 
                   
                              </View>
                              <View style={{ flex : 0.6, borderWidth : 0, justifyContent : 'center'}}>
                                      <Text style={setFont('200', 14, 'black', 'Regular')}>
                                        {this.user.getEmail()}
                                      </Text>
                              </View>   
                          </View>
                          <View style={{flexDirection : 'row', padding : 5, justifyContent : 'space-between' , backgroundColor: 'white', borderBottomColor: setColor('borderFL'),borderBottomWidth: 1,}}>
                              <View style={{flex : 0.4, marginLeft : 10, padding : 5}}>
  
                                      <Text style={setFont('200', 16)}>
                                        Téléphone
                                      </Text>
 
                   
                              </View>
                              <View style={{ flex : 0.6, borderWidth : 0, justifyContent : 'center'}}>
                                        <TextInput
                                            style={setFont('200', 14, 'black', 'Regular')}
                                            placeholder={'Téléphone'}
                                            placeholderTextColor={'lightgray'}
     
                                            value={this.state.phone}
                                            //mask={"+1 ([000]) [000] [00] [00]"}
                                            keyboardType='phone-pad'
                                            textContentType='telephoneNumber'
                                            editable={true}
                                            onBlur={async () => {
                                              if (this.state.phone === '') {
                                                this.setState({ phone : parsePhoneNumberFromString(this.user.getPhone(),'FR').formatInternational() });
                                              } 
                                              else {
                                                  let telBeforeUpdate = this.user.getPhone();
                                                  try {
                                                    this.user.setPhone(this.state.phone );
                                                    await updateUser(this.props.firebase, this.user);
                                                    this.setState({ toto : !this.state.toto });
                                                  }
                                                  catch(error) {
                                                    this.user.setPhone(telBeforeUpdate);
                                                    Alert('Echec changement de nom');
                                                    console.log(error);
                                                  }
                                          
                                              }
                                            }}
                                            autoCompleteType={'tel'}
                                            returnKeyType={'done'}
                                            onChangeText={e => {
                                              //console.log(e);
                                              if (e.length > 5) {
                                                e = parsePhoneNumberFromString(e,'FR').formatInternational()
                                              }
                                              this.setState({ phone : e });
                                            }}
                                        />
                         
                              </View>   
                          </View>
                          <View style={{flexDirection : 'row', padding : 5, justifyContent : 'space-between' , backgroundColor: 'white', borderBottomColor: setColor('borderFL'),borderBottomWidth: 1,}}>
                              <View style={{flex : 0.4, marginLeft : 10, padding : 5}}>
  
                                      <Text style={setFont('200', 16)}>
                                      Société
                                      </Text>
 
                   
                              </View>
                              <View style={{ flex : 0.6, borderWidth : 0, justifyContent : 'center'}}>
                                    <TextInput
                                              style={setFont('200', 14, 'black', 'Regular')}

                      
        
                                              placeholder={'Nom'}
                                              placeholderTextColor={'lightgray'}
                                              autoCorrect={false}
                                              //keyboardType={''}
                                              returnKeyType={'done'}
                                              textContentType={'organizationName'}
                                              editable={true}
                                              onBlur={async () => {
                                                if (this.state.company === '') {
                                                  this.setState({ company : this.user.getCompany() });
                                                } 
                                                else {
                                                    let companyBeforeUpdate = this.user.getCompany();
                                                    try {
                                                      this.user.setCompany(this.state.company );
                                                      await updateUser(this.props.firebase, this.user);
                                                      this.setState({ toto : !this.state.toto });
                                                    }
                                                    catch(error) {
                                                      this.user.setCompany(companyBeforeUpdate);
                                                      Alert('Echec changement de nom');
                                                      console.log(error);
                                                    }
                                            
                                                }
                                              }}
                                              //onFocus={() =>  this.setState({ nominal : '' })}
                                              //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                              value={this.state.company}
                                              onChangeText={e => {
                                                    this.setState({ company : e });
                                              }}
                                      />
                     
                              </View>   
                          </View>
                          {/* <View style={{flexDirection : 'row', padding : 5, justifyContent : 'space-between' , backgroundColor: 'white', borderBottomColor: setColor('borderFL'),borderBottomWidth: 1,}}>
                              <View style={{flex : 0.4, marginLeft : 10, padding : 5}}>
  
                                      <Text style={setFont('200', 16)}>
                                      Affiliation
                                      </Text>
 
                   
                              </View>
                              <View style={{ flex : 0.6, borderWidth : 0, justifyContent : 'center'}}>
                                      <Text style={setFont('200', 14, 'black', 'Regular')}>
                                      {this.user.getOrganization()}
                                      </Text>
                              </View>   
                          </View> */}
                          <View style={{flexDirection : 'row', padding : 5, justifyContent : 'space-between' , backgroundColor: 'white', borderBottomColor: setColor('borderFL'),borderBottomWidth: 1,}}>
                              <View style={{flex : 0.4, marginLeft : 10, padding : 5}}>
  
                                      <Text style={setFont('200', 16)}>
                                      Mot de passe
                                      </Text>
 
                   
                              </View>
                              <TouchableOpacity style={{ flex : 0.6, borderWidth : 0, justifyContent : 'center'}}
                                                onPress={() => this.setState({ showModalChangePwd : true })}
                              >
                                      <Text style={setFont('200', 14, 'black', 'Regular')}>
                                      *************
                                      </Text>
                              </TouchableOpacity>   
                          </View>

                </View>
              );
              break;
      }

  };
  


  render() {
    return (
      <SafeAreaView style={{flex : 1, backgroundColor: setColor('')}}>
      {this._renderModalCamera()}
      <View style={{height: getConstant('height')  , backgroundColor : 'white' }}> 
          <View style={{flexDirection : 'row', borderWidth : 0, alignItems: 'center', justifyContent : 'space-between', backgroundColor : setColor(''), padding : 5, paddingRight : 15, paddingLeft : 15, height : 45}}>
                            <TouchableOpacity style={{ flex : 0.3, flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', borderWidth : 0}}
                                              onPress={() => this.props.navigation.goBack()}
                            >
                                
                                    <Ionicons name={'ios-arrow-round-back'} size={25} color={'white'}/>
                
                            </TouchableOpacity>
                            <View style={{flex : 0.4, borderWidth: 0, alignItems : 'center', justifyContent : 'center'}}>
                              <Text style={setFont('400', 18, 'white', 'Regular')}>
                                {this.title}
                              </Text>
                            </View>
                            <View style={{ flex : 0.3, alignItems : 'flex-end', justifyContent : 'center', borderWidth : 0}}>
         
                            </View>
          </View>
        
          <View style={{borderWidth : 0, justifyContent : 'center', alignItems: 'center', marginBottom : 20, opacity : this.state.showModalChangePwd ? 0.1 : 1}}>

                <TouchableOpacity style={{height : 90, width : 90, borderWith : 0, borderColor : 'black', borderRadius : 45, backgroundColor : setColor(''),  marginTop : 20, marginBottom : 10, alignItems : 'center', justifyContent : 'center'}} 
                                            onPress={() => {
                                              this._pickImageOrTakePicture();
                                            }}
                          >
                            {this.state.profileImage == null 
                              ?
                                <Text style={setFont('400', 24, 'white', 'Regular')}>{this.user.getFirstName().charAt(0)}.{this.user.getLastName().charAt(0)}.</Text>
                                : 
                                <Image style={{width: 90, height: 90, borderWidth : 0, borderRadius : 45, borderColor : setColor('')}} source={{uri : this.state.profileImage}} />
                            }
                            
                            <View style={{position : 'absolute', top : 70, right : 0}}>
                                  <Feather name={'camera'} size={20} color={setColor('subscribeBlue')}/>
                              </View>
                </TouchableOpacity>
            
                <View>
                    <Text style={setFont('400', 18, 'black', 'Bold')}>{this.user.getName()}</Text>
                </View>

        </View>
      




         <ScrollView style={{flex : 1,  backgroundColor :  setColor('background'), opacity : this.state.showModalChangePwd ? 0.1 : 1}}>
         
                    <Accordion
                        sections={this.SECTIONS}
                        underlayColor={'transparent'}
                        activeSections={this.state.activeSections}
                        renderHeader={this._renderHeaderUnderlying}
                        //renderFooter={this._renderFooterUnderlying}
                        renderContent={this._renderContentUnderlying}
                        disabled={true}
                        expandMultiple={true}
                        onChange={(activeSections) => {
                            this.setState( { activeSections : activeSections })  
                        }}
                        sectionContainerStyle={{
                                                //width : 0.95*getConstant('width'),
                                                backgroundColor: 'white', 
                                                //justifyContent: 'center', 
                                                //alignItems: 'center', 
                                                //marginTop : 30,
                                                //borderWidth : 1,
                                                //borderColor : 'red', 
                                                //borderRadius : 10, 
                                                //shadowColor: 'rgb(75, 89, 101)', 
                                                //shadowOffset: { width: 0, height: 2 },
                                                //shadowOpacity: 0.3
                                              }}
                        touchableComponent={(props) => <TouchableOpacity {...props} />}
                    />
    
                <View style={{height : 200}} />
          </ScrollView>

      </View>
      {this._renderModalChangePassword()}
      </SafeAreaView>
    );
  }
}

const condition = authUser => authUser != null;

const composedFB = compose(
  withAuthorization(condition),
  withFirebase,
  withUser,
  withNavigationFocus
);  


export default hoistStatics(composedFB)(ProfileScreenDetail);

