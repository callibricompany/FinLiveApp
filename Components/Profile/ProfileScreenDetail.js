import React from 'react';
import { View, ScrollView, Button, Text, AsyncStorage, SafeAreaView, Animated, TouchableOpacity, StyleSheet, StatusBar, Image, Alert, Modal, ClippingRectangle, TextInput, KeyboardAvoidingView } from 'react-native';

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


import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { updateUser, changeAvatar } from '../../API/APIAWS';

import { CUser } from '../../Classes/CUser';
import { CUsers } from '../../Classes/CUser';


class ProfileScreenDetail extends React.Component {

  camera = null;


  _focusListener = null;
  _blurListener = null;


  constructor(props) {
    super(props)

    this.option = this.props.navigation.getParam('option', 'USER');
    this.user = this.props.user;
    this.users = this.props.users;

    this.state = { 
      //gestion de la photo de profil
      profileImage: this.user.getAvatar(),
      showModalCamera : false,
      typeCamera: Camera.Constants.Type.front,
      isCameraReady : false,
      hasCameraPermission: false,
 

      //gestion des sections
      activeSections: [0, 1],

      //search users
      isSearchingFriends : false,
      friendName : '',

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
      {
        title: 'déconnexion',
        code: 'DISCONNECT',
      }
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
              <TouchableOpacity style={{marginTop : 5, marginBottom : 5, marginLeft : 15, padding : 5, paddingLeft : 20, paddingRight : 20,  borderWidth : 1, borderColor : 'white', borderRadius : 20, backgroundColor : interpolateColorFromGradient(gradientColorName, percentColor)}}
                                onPress={() => this._signOutAlert()}
              >
                  <Text style={setFont('400', 12, 'white', 'Regular')}>
                    {content.title.toUpperCase()}
                  </Text>
              </TouchableOpacity>
 

            </View>
          );
          break;
      default :
            return (
              <View style={{justifyContent: "space-between", alignItems: 'flex-start', marginTop : 5, marginBottom : 5, marginLeft : 0, padding : 5, paddingLeft : 20, paddingRight : 20,  borderWidth : 1, borderColor : 'white', borderRadius : 20}}>
                    <Text style={setFont('400', 12, 'black', 'Regular')}>
                      {content.title.toUpperCase()}
                    </Text>
              </View>
            );
    }
  };

  _renderContentUnderlying = (content, index, isActive, sections) => {
    //console.log("EST ACTIF : " + isActive);
    switch(content.code) {
        case 'USERDATA' :
              return (
                <View style={{borderWidth : 0}}>

                          <View style={{flexDirection : 'row', marginTop : index === 0 ? 10 : 5, marginBottom : 5, marginLeft : 20, marginRight : 10, borderWidth : 0, borderRadius : 10, borderColor : setColor('background'), backgroundColor : setColor('background'), padding : 5, justifyContent : 'space-between'}}>
                              <View style={{flexDirection : 'column', flex : 0.6, marginLeft : 10, borderWidth : 0}}>
                                  <View style={{ borderWidth : 0}}>
                                      <Text style={setFont('200', 12)}>
                                        Téléphone
                                      </Text>
                                  </View>
                   
                              </View>
                              <View style={{ borderWidth : 0}}>
                                      <Text style={setFont('200', 12, 'black', 'Regular')}>
                                        {parsePhoneNumberFromString(this.user.getPhone(),'FR').formatInternational()}
                                      </Text>
                              </View>   
                          </View>
                          <View style={{flexDirection : 'row', marginTop : index === 0 ? 10 : 5, marginBottom : 5, marginLeft : 20, marginRight : 10, borderWidth : 0, borderRadius : 10, borderColor : setColor('background'), backgroundColor : setColor('background'), padding : 5, justifyContent : 'space-between'}}>
                              <View style={{flexDirection : 'column', flex : 0.6, marginLeft : 10, borderWidth : 0}}>
                                  <View style={{ borderWidth : 0}}>
                                      <Text style={setFont('200', 12)}>
                                        Email
                                      </Text>
                                  </View>
                  
                              </View>
                              <View style={{ borderWidth : 0}}>
                                      <Text style={setFont('200', 12, 'black', 'Regular')}>
                                        {this.user.getEmail()}
                                      </Text>
                              </View>   
                          </View>
                          <View style={{flexDirection : 'row', marginTop : index === 0 ? 10 : 5, marginBottom : 5, marginLeft : 20, marginRight : 10, borderWidth : 0, borderRadius : 10, borderColor : setColor('background'), backgroundColor : setColor('background'), padding : 5, justifyContent : 'space-between'}}>
                              <View style={{flexDirection : 'column', flex : 0.6, marginLeft : 10, borderWidth : 0}}>
                                  <View style={{ borderWidth : 0}}>
                                      <Text style={setFont('200', 12)}>
                                        Société
                                      </Text>
                                  </View>
                  
                              </View>
                              <View style={{ borderWidth : 0}}>
                                      <Text style={setFont('200', 12, 'black', 'Regular')}>
                                        {this.user.getCompany()}
                                      </Text>
                              </View>   
                          </View>
                          <View style={{flexDirection : 'row', marginTop : index === 0 ? 10 : 5, marginBottom : 5, marginLeft : 20, marginRight : 10, borderWidth : 0, borderRadius : 10, borderColor : setColor('background'), backgroundColor : setColor('background'), padding : 5, justifyContent : 'space-between'}}>
                              <View style={{flexDirection : 'column', flex : 0.6, marginLeft : 10, borderWidth : 0}}>
                                  <View style={{ borderWidth : 0}}>
                                      <Text style={setFont('200', 12)}>
                                        Société de rattachement
                                      </Text>
                                  </View>
                  
                              </View>
                              <View style={{ borderWidth : 0}}>
                                      <Text style={setFont('200', 12, 'black', 'Regular')}>
                                        {this.user.getOrganization()}
                                      </Text>
                              </View>   
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
      <View style={{height: getConstant('height')  , backgroundColor : setColor('background'), }}> 
          <View style={{flexDirection : 'row', borderWidth : 0, alignItems: 'center', justifyContent : 'space-between', backgroundColor : setColor(''), padding : 5, paddingRight : 15, paddingLeft : 15}}>
                            <TouchableOpacity style={{ flex : 0.3, flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', borderWidth : 0}}
                                              onPress={() => this.props.navigation.goBack()}
                            >
                                
                                    <Ionicons name={'ios-arrow-round-back'} size={25} color={'white'}/>
                
                            </TouchableOpacity>
                            <View style={{flex : 0.4, borderWidth: 0, alignItems : 'center', justifyContent : 'center'}}>
                              <Text style={setFont('400', 22, 'white', 'Regular')}>
                                {this.title}
                              </Text>
                            </View>
                            <View style={{ flex : 0.3, alignItems : 'flex-end', justifyContent : 'center', borderWidth : 0}}>
         
                            </View>
          </View>
          { this.option ==='USER'
            ?
              <View style={{borderWidth : 0, justifyContent : 'center', alignItems: 'center'}}>
  
                    <TouchableOpacity style={{height : 90, width : 90, borderWith : 0, borderColor : 'white', borderRadius : 45, backgroundColor : setColor(''),  marginTop : 20, marginBottom : 10, alignItems : 'center', justifyContent : 'center'}} 
                                                onPress={() => {
                                                  this._pickImageOrTakePicture();
                                                }}
                              >
                                {this.state.profileImage == null 
                                  ?
                                    <Text style={setFont('400', 24, 'white', 'Regular')}>{this.user.getFirstName().charAt(0)}.{this.user.getLastName().charAt(0)}.</Text>
                                    : 
                                    <Image style={{width: 90, height: 90, borderWidth : 0, borderRadius : 45, borderColor : 'white'}} source={{uri : this.state.profileImage}} />
                                }
                                
                                <View style={{position : 'absolute', top : 70, right : 0}}>
                                      <Feather name={'camera'} size={20} color={setColor('subscribeBlue')}/>
                                 </View>
                    </TouchableOpacity>
                
                    <View>
                        <Text>{this.user.getName()}</Text>
                    </View>

            </View>
            : null
          }




         <ScrollView style={{flex : 1}}>
            <View style={{marginBottom : 20,  marginTop : 15, marginLeft : getConstant('width')*0.025 }}>
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
                                                width : 0.95*getConstant('width'),
                                                backgroundColor: 'white', 
                                                //justifyContent: 'center', 
                                                //alignItems: 'center', 
                                                marginTop : 10,
                                                borderWidth : 1,
                                                borderColor : 'white', 
                                                borderRadius : 10, 
                                                shadowColor: 'rgb(75, 89, 101)', 
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.3
                                              }}
                        touchableComponent={(props) => <TouchableOpacity {...props} />}
                    />
                </View>
                <View style={{height : 200}} />
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
  withNavigationFocus
);  


export default hoistStatics(composedFB)(ProfileScreenDetail);

