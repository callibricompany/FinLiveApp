import React from 'react';
import { View, ScrollView, Button, Text, AsyncStorage, SafeAreaView, Animated, TouchableOpacity, StyleSheet, StatusBar, Keyboard, Image, Alert, Modal } from 'react-native';

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

import Accordion from 'react-native-collapsible/Accordion';
import ActionSheet from 'react-native-action-sheet';

import AlertAsync from 'react-native-alert-async';

import { withFirebase } from '../Database';
import { withUser } from '../Session/withAuthentication';
import { withAuthorization } from '../Session';
import { compose, hoistStatics } from 'recompose';
import { globalStyle, setColor, setFont } from '../Styles/globalStyle'

import { isIphoneX, getConstant, isAndroid } from '../Utils';
import { interpolateColorFromGradient } from '../Utils/color';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Asset } from "expo-asset";
import * as ImageManipulator from "expo-image-manipulator";


import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { updateUser, changeAvatar } from '../API/APIAWS';

import { CUser } from '../Classes/CUser';

class ProfileScreenDetail extends React.Component {


  constructor(props) {
    super(props)

    this.option = this.props.navigation.getParam('option', 'USER');
    this.user = this.props.user;

    this.state = { 
      //gestion de la photo de profil
      profileImage: this.user.getAvatar(),
      showModalCamera : false,
      typeCamera: Camera.Constants.Type.front,

      //gestion des sections
      activeSections: [0],

      toto : true,
    }

    //photo prise par camera
    this.lastPictureTaken = "";

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

    if (this.option === 'ISSUER') {
      this.title = "Emetteurs";
      this.SECTIONS = [            
        {
          title: 'Les demandes de cotations seront envoyées aux émetteurs suivants',
          code: 'ISSUERS',
        }, 
      ]
    }

  }

  static navigationOptions = ({ navigation }) => {
    return ({
      header : null,
    }
    );
}

 componentDidMount() {
  
  if (!isAndroid()) {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      StatusBar.setBarStyle('light-content' );
    });
  }

  Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
  Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);



}
  componentWillUnmount() {
    if (!isAndroid()) {
      this._navListener.remove();
    }

    Keyboard.removeListener('keyboardDidShow');
    Keyboard.removeListener('keyboardDidHide');
  }

  keyboardDidHide() {
    this.setState({
      keyboardHeight: 0,
      isKeyboardVisible: false
    });
  }

  keyboardDidShow(e) {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
      isKeyboardVisible: true
    });
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
              this.setState({ showModalCamera : true });
            }
          },

          
        ],
        { cancelable: true }
      );

    }
  };

 

  _updateProfilImage(result) {
    this.setState({ profileImage: result.uri , showModalCamera : false });
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
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  

  handleCameraType=()=>{
    const { typeCamera } = this.state

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
    }

  };

  _takePicture = async () => {
  
    if (this.camera) {

        try {
          let result = await  this.camera.takePictureAsync();
          console.log("apres prise   ");
            if (!result.cancelled) {

              // console.log("==================================================");
              // console.log(result);
              let height = result.height;
              let width = result.width;
              const manipResult = await ImageManipulator.manipulateAsync(
                 result.uri,
                [{ crop: {
                  originX: 0,
                  originY: (height- width) / 2 - 40 - getConstant('statusBar'),
                  width: width,
                  height: width
               } }],
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
              );
              
              //console.log(manipResult);
              this._updateProfilImage(manipResult);
            }
            // console.log("avant result ");
            // console.log(result);
        } catch (E) {
          console.log(E);
        }
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

          <Camera ref={ref => {this.camera = ref}} style={{flex:1}} type={this.state.typeCamera} useCamera2Api={true}/>
          <View style={{position : 'absolute', top : getConstant('height')/2 - getConstant('width')/2, left : 0, height : getConstant('width'), width : getConstant('width'),borderWidth : 10, borderColor : 'white', borderRadius : getConstant('width')/2}} />
          <View style={{ position : 'absolute', top : getConstant('height') -100, left : 0, flexDirection:"row",justifyContent:'space-around', height : 100, width : getConstant('width'), zIndex : 10, alignItems : 'flex-start'}}>
              <TouchableOpacity style={{ backgroundColor: 'transparent', }}
                                onPress={()=>{
                                    //this.setState({ showModalCamera : false }, () => this._pickImage());
                                    this._pickImage();
                                }}
              >
              <Ionicons name="ios-photos" style={{ color: "#fff", fontSize: 40}} />
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'transparent', }}
                              onPress={()=> {
                                this._takePicture();
                                this.setState({ showModalCamera : false });
                              }}
            >
              <FontAwesome name="camera" style={{ color: "#fff", fontSize: 40}} />
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: 'transparent', }}
                  onPress={()=>this.handleCameraType()}
            >
              <MaterialCommunityIcons name="camera-switch" style={{ color: "#fff", fontSize: 40}}/>
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
              <View style={{flexDirection : 'row', justifyContent: "space-between", alignItems: 'center', borderWidth : 0}}>
                <View opacity={1} style={{marginTop : 5, marginBottom : 5, marginLeft : 0, padding : 5, paddingLeft : 20, paddingRight : 20,  borderWidth : 1, borderColor : 'white', borderRadius : 20}}>
                    <Text style={setFont('400', 12, 'black', 'Regular')}>
                      {content.title.toUpperCase()}
                    </Text>
                </View>
                {/* <View style={{marginTop : 5, marginBottom : 5, marginRight : 15,  borderWidth : 1, borderColor : 'white',width : 30, hisght : 30,  borderRadius : 15, backgroundColor : interpolateColorFromGradient(gradientColorName, percentColor), justifyContent : 'center', alignItems : 'center'}}>
                    <View style={{marginTop : -10}}>
                        <Text style={setFont('400', 22, 'white', 'Bold')}>
                          ...
                        </Text>
                    </View>
                </View>    */}
  
              </View>
            );
    }
  };

  _renderContentUnderlying = (content, index, isActive, sections) => {
    //console.log("EST ACTIF : " + isActive);
    switch(content.code) {
      case 'ISSUERS' :
            return (
              <View style={{borderWidth : 0}}>
                {
                this.props.issuers.map((issuer, index) => {
                 
                      return (
                        <View style={{flexDirection : 'row', marginTop : index === 0 ? 10 : 5, marginBottom : 5, marginLeft : 20, marginRight : 10, borderWidth : 0, borderRadius : 10, borderColor : setColor('background'), backgroundColor : setColor('background'), padding : 5, justifyContent : 'space-between'}} key={index}>
                            <View style={{flexDirection : 'column', flex : 0.6, marginLeft : 10, borderWidth : 0}}>
                                <View style={{ height : 30, borderWidth : 0}}>
                                    <Image style={{flex : 1,  borderWidth : 0}} source={{uri : issuer.icon}} resizeMode={'contain'}/>
                                </View>
                                <View style={{ padding : 5, paddingTop : 2}}>
                                    <Text style={setFont('200', 10)}>
                                      {issuer.name}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity style={{padding : 2,flex : .4,  justifyContent : 'center', alignItems : 'flex-end', borderWidth : 0}}
                                              onPress={() => {
                                                  if (this.user.isIssuerRejected(issuer.id)) {
                                                    //on ajoute l'issuer
                                                    Alert.alert(
                                                      'Ajouter émetteur',
                                                      "Confirmez-vous l'ajout de " + issuer.name+ " ?",
                                                      [
                                                       // {text: 'Confirmer', onPress: () => this._signOutAsync()},
                                                       {text: 'Confirmer', onPress: () => {
                                                              this.user.removeIssuerAsRejected(issuer.id);
                                                              updateUser(this.props.firebase, this.user);
                                                              this.setState({ toto : !this.state.toto });
                                                          }      
                                                      },
                                                        {text: 'Annuler', onPress: () => 'non et non'},
                                                      ],
                                                      {
                                                        cancelable: true,
                                                        onDismiss: () => 'no',
                                                      },
                                                    );
                                                    
                                                  } else {
                                                    if((this.props.issuers.length - 1) === this.user.getIssuersRejectedCount()) {
                                                          Alert.alert(
                                                            'ALERTE',
                                                            "Vous n'aurez plus d'émetteur disponible et ne pourrez donc plus passer d'ordre et traiter ?",
                                                            [
                                                            // {text: 'Confirmer', onPress: () => this._signOutAsync()},
                                                            {text: 'Confirmer', onPress: () => {
                                                                  Alert.alert(
                                                                    'Retirer émetteur',
                                                                    "Confirmez-vous le retrait de " + issuer.name+ " ?",
                                                                    [
                                                                    // {text: 'Confirmer', onPress: () => this._signOutAsync()},
                                                                    {text: 'Confirmer', onPress: () => {
                                                                        this.user.setIssuerAsRejected(issuer.id);
                                                                        updateUser(this.props.firebase, this.user);
                                                                         this.setState({ toto : !this.state.toto });
                                                                      }
                                                                    },
                                                                      {text: 'Annuler', onPress: () => 'non et non'},
                                                                    ],
                                                                    {
                                                                      cancelable: true,
                                                                      onDismiss: () => 'no',
                                                                    },
                                                                  );
                                                            }},
                                                              {text: 'Annuler', onPress: () => 'non et non'},
                                                            ],
                                                            {
                                                              cancelable: true,
                                                              onDismiss: () => 'no',
                                                            },
                                                          );

                                                    }
       
                                                    
                                                  }

                                                  
                                              }}
                            >
                                <MaterialCommunityIcons name={this.user.isIssuerRejected(issuer.id) ? 'checkbox-blank-circle-outline' : 'check-circle-outline'} color={this.user.isIssuerRejected(issuer.id) ? 'gray' : 'green'} size={25}/>
                            </TouchableOpacity>
                        </View>
                      )

                    })
                }
              
              </View>
            );
            break;
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
            />

                </View>


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


export default hoistStatics(composedFB)(ProfileScreenDetail);

