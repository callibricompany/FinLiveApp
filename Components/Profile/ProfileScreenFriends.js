import React from 'react';
import { View, ScrollView, Linking, Text, Keyboard, SafeAreaView, Animated, TouchableOpacity, StyleSheet, StatusBar, Image, Alert, Modal, ClippingRectangle, TextInput, KeyboardAvoidingView } from 'react-native';

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


class ProfileScreenFriends extends React.Component {

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

    
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);

    this.setFriendSections();
}

//affichage dynamique des sections pour la partie contact
setFriendSections() {
  this.title = "Contacts";
  if (!this.state.isSearchingFriends) {
      this.SECTIONS = [   
        {
          title: 'Amis',
          code: 'USERS_FRIENDS_OF_MINE',
        },          
        {
          title: this.props.userOrg.name,
          code: 'USERS_OF_MY_ORG',
        }, 

      ];
  } else {
    this.SECTIONS = [            
      {
        title: "Recherche d'amis",
        code: 'USERS_FRIENDS_OF_MINE',
      }, 
    ];
  }
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

keyboardDidHide() {
  this.props.navigation.setParams({ hideBottomTabBar : false });
}

keyboardDidShow(e) {
  this.props.navigation.setParams({ hideBottomTabBar : true });
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
  //this.keyboardDidHide.remove()
  //this.keyboardDidShow.remove()
}





  ////////////////////////////
  //
  //      ACCORDEON
  ////////////////////////////
  _renderHeaderUnderlying = (content, index, isActive, sections) => {
    let percentColor = Math.round(100*(index/this.SECTIONS.length));
    let gradientColorName = "Finlive";
    switch(content.code) {
      case 'USERS_FRIENDS_OF_MINE' :
        if (!this.state.isSearchingFriends) {
          return (
            // <View style={{flexDirection : 'row', justifyContent: "space-between", alignItems: 'center', borderWidth : 0,}}>
            //   <View opacity={1} style={{marginTop : 5, marginBottom : 5, marginLeft : 0, padding : 5, paddingLeft : 20, paddingRight : 20,  borderWidth : 1, borderColor : 'white', borderRadius : 20}}>
            //       <Text style={setFont('400', 12, 'black', 'Regular')}>
            //       {content.title.toUpperCase()}
            //       </Text>
            //   </View>
            // </View>
          <View style={{
              borderBottomColor: setColor('borderFL'),
              paddingLeft: 15,
              borderBottomWidth: 1,
              //height: 145,
              marginTop : 0,
              borderWidth : 0,
              paddingTop : 15,
              paddingBottom : 4,
              flexDirection : 'row'
          }}>
              <View style={{padding : 5, backgroundColor : setColor('subscribeBlue'), borderWidth : 1, borderRadius : 10, borderColor: setColor('subscribeBlue'), justifyContent : 'center', alignItems : 'center'}}>
              <Text style={setFont('400', 18, 'white', 'Bold')}>{content.title.toUpperCase()}</Text> 
              </View>
          </View>
          );   
        }
        break;   
      default :
            return (
              <View style={{
                borderBottomColor: setColor('borderFL'),
                paddingLeft: 15,
                borderBottomWidth: 1,
                //height: 145,
                marginTop : 0,
                borderWidth : 0,
                paddingTop : 15,
                paddingBottom : 4,
                flexDirection : 'row'
            }}>
                <View style={{padding : 5, backgroundColor : setColor('subscribeBlue'), borderWidth : 1, borderRadius : 10, borderColor: setColor('subscribeBlue'), justifyContent : 'center', alignItems : 'center'}}>
                 <Text style={setFont('400', 18, 'white', 'Bold')}>{content.title.toUpperCase()}</Text> 
                 </View>
            </View>

            );
    }
  };

  _renderContentUnderlying = (content, index, isActive, sections) => {
    //console.log("EST ACTIF : " + isActive);
    switch(content.code) {

        case 'USERS_FRIENDS_OF_MINE':
        case 'USERS_OF_MY_ORG' :
          
          let usersList = [];
          if (content.code === 'USERS_OF_MY_ORG') {
            usersList = this.users.getUsersFromMyOrg();
           } else {
             if (this.state.isSearchingFriends && this.state.friendName.length > 2) {
                usersList = this.users.getUsersFromName(this.state.friendName);
             } else {
                usersList = this.users.getUsersFriends(this.user);
             }
           }
          
          return (
            
            <View style={{borderWidth : 0}}>

              {content.code === 'USERS_FRIENDS_OF_MINE' && this.state.isSearchingFriends
              ?
                  <View style={{flex : 1, marginBottom : 10, backgroundColor : 'white', marginTop : 20}}>
                        <TextInput  style={{borderWidth : 1, height : 40, width : getConstant('width')*0.95-20,marginRight : 10,  marginLeft : 10, borderColor : 'gray', borderRadius : 10, paddingLeft : 10}} 
                                    onChangeText={text => this.setState({ friendName : text })}
                                    value={this.state.friendName}
                                    placeholder={'Recherchez des connaissances ...'}
                                    returnKeyType={'search'}
                                    clearButtonMode={'while-editing'}
                                    ref={(inputFriends) => {this.inputFriends = inputFriends}}
                        />
                  </View>
              : null
              }

            
              {
                usersList.map((u, index) => {
                    let isFriend = this.user.isFriend(u.getId());
                    return (
                      <View 
                            //style={{flexDirection : 'row', marginTop : index === 0 ? 10 : 2, marginBottom : 2, marginLeft : 10, marginRight : 10, borderWidth : 0, borderRadius : 10, borderColor : setColor('background'), backgroundColor : setColor('background'), padding : 1, justifyContent : 'space-between'}} 
                            style={{
                                flexDirection : 'row', 
                                alignItems: 'center',
                                backgroundColor: 'white',
                                borderBottomColor: setColor('borderFL'),
                                borderBottomWidth: 1,
                                //justifyContent: 'center',
                                height: 80, //50
                            }}
                            key={index}
                      >
                          <View style={{height : 50, width : 50, borderWith : 0, borderColor : 'white', borderRadius : 25, backgroundColor : setColor(''), marginLeft : 15,  marginTop :5, marginBottom : 5, alignItems : 'center', justifyContent : 'center'}}  >
                          {u.getAvatar() == null 
                            ?
                              <Text style={setFont('400', 16, 'white', 'Regular')}>{u.getFirstName().charAt(0)}.{u.getLastName().charAt(0)}.</Text>
                              : 
                              <Image style={{width: 50, height: 50, borderWidth : 0, borderRadius : 25, borderColor : 'white'}} source={{uri : u.getAvatar() }} />
                          }
                          </View>
                          <View style={{flex : 1, borderWidth : 0, marginLeft : 20, marginTop : 3, marginRight : 5}}>
                            <View>
                              <Text style={setFont('300', 18, 'black', 'Regular')}>
                                {u.getName()} {content.code !== 'USERS_OF_MY_ORG' && this.user.getOrganization() !== u.getOrganization() ? <Text style={setFont('200', 12)}> ({u.getCompany()})</Text>  : null}
                              </Text>
                            </View>
                            <View>
                              <Text style={setFont('200', 14, 'gray')}>
                                {u.getEmail()}
                              </Text>
                            </View>
                            <TouchableOpacity    onPress={() => {
                                        if (u.getPhone != null && u.getPhone() !== '') {
                                          Linking.openURL(`tel:${parsePhoneNumberFromString(u.getPhone(),'FR').formatInternational() }`);
                                        }
                                      }}>
                              <Text style={setFont('200', 12, 'gray')}>
                                {u.getPhone != null && u.getPhone() !== '' ? parsePhoneNumberFromString(u.getPhone(),'FR').formatInternational() : null}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          { ((content.code === 'USERS_OF_MY_ORG'  && !isFriend) || (content.code === 'USERS_FRIENDS_OF_MINE'))
                            ?
                                <TouchableOpacity style={{flex : 0.2, padding : 2,  justifyContent : 'center', alignItems : 'flex-start', borderWidth : 0}}
                                                  onPress={() => {
                                                      isFriend ? this.user.removeFriend(u.getId()) : this.user.addFriend(u.getId());
                                                      updateUser(this.props.firebase, this.user);
                                                      this.setState({ toto : !this.state.toto });
                                                  }}
                                >
                                    <FontAwesome5 name={isFriend ? 'user-minus' : 'user-plus'} color={isFriend ? 'red' : 'green'} size={20}/>
                                </TouchableOpacity>
                            : null
                          }
                      </View>
                    )

                  })
              }
            
            </View>
         
          );
          break;
      }

  };
  


  render() {
    return (
      <SafeAreaView style={{flex : 1, backgroundColor: setColor('')}}>

          {/* <TouchableOpacity style={{zIndex : 10, position :'absolute', top : getConstant('height') -sizeByDevice(220, 160, 170), right: 20,  justifyContent : 'center', alignItems : 'center', borderWidth : 1, borderColor: setColor(''), borderRadius : 25, width : 50, height : 50, backgroundColor: setColor('')}}
                                  onPress={() => {
                                    this.setState({ isSearchingFriends : !this.state.isSearchingFriends }, () => {
                                      this.setFriendSections();
                                      this.setState({ toto : !this.state.toto });
                                    });
                                  }}
                >
                    <FontAwesome5 name={this.state.isSearchingFriends ? 'user-minus' : 'user-plus'} color={'white'} size={20} style={{paddingLeft : 5}}/>
          </TouchableOpacity>  */}

      <View style={{height: getConstant('height')  , backgroundColor : setColor('background'), }}> 
          <View style={{flexDirection : 'row', borderWidth : 0, alignItems: 'center', justifyContent : 'space-between', backgroundColor : setColor(''), padding : 5, paddingRight : 15, paddingLeft : 15, height : 45}}>
                            <TouchableOpacity style={{ flex : 0.2, flexDirection : 'row', alignItems : 'center', justifyContent : 'flex-start', borderWidth : 0}}
                                              onPress={() => {
                                                  if (this.state.isSearchingFriends) {
                                                    this.setState({isSearchingFriends : false });
                                                  } else {
                                                    this.props.navigation.goBack();
                                                  }
                                                }}
                            >
                                
                                    <Ionicons name={'ios-arrow-round-back'} size={25} color={'white'}/>
                
                            </TouchableOpacity>
                            <View style={{flex : 0.6, borderWidth: 0, alignItems : 'center', justifyContent : 'center'}}>
                              <Text style={setFont('400', 18, 'white', 'Regular')}>
                                {this.state.isSearchingFriends 
                                  ? "Recherche d'amis"
                                  :  this.title
                                }
                              </Text>
                            </View>
                            <TouchableOpacity style={{ flex : 0.2, alignItems : 'flex-end', justifyContent : 'center', borderWidth : 0}}
                                                onPress={() => {
                                                  this.setState({ isSearchingFriends : !this.state.isSearchingFriends }, () => {
                                                    this.setFriendSections();
                                                    this.setState({ toto : !this.state.toto });
                                                  });
                                             }}
                              >
                                    <MaterialCommunityIcons name='plus' size={25}  style={{color : 'white'}}/>
                              </TouchableOpacity>
          </View>


         <ScrollView style={{flex : 1}}>
  
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
    
                        touchableComponent={(props) => <TouchableOpacity {...props} />}
                    />

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


export default hoistStatics(composedFB)(ProfileScreenFriends);

