import React from "react";
import { Image, ScrollView, Text, View, Animated, StyleSheet, KeyboardAvoidingView, Dimensions, TouchableOpacity, TextInput, StatusBar, Modal, Keyboard, FlatList, ClippingRectangle } from "react-native";

import { NavigationActions } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import FLTemplateAutocall from "./FLTemplateAutocall";
import { setFont, setColor , globalStyle  } from '../../../Styles/globalStyle';

import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual, getConstant } from '../../../Utils';
import { interpolateColorFromGradient } from '../../../Utils/color';

import FLAnimatedSVG from '../FLAnimatedSVG';
import StepIndicator from 'react-native-step-indicator';
import Accordion from 'react-native-collapsible/Accordion';


import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import { CAutocall } from '../../../Classes/Products/CAutocall';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';


import { parsePhoneNumberFromString } from 'libphonenumber-js';

import Numeral from 'numeral'
import 'numeral/locales/fr'
import Moment from 'moment';
import localization from 'moment/locale/fr'




class FLAutocallDetailBroadcastFriends extends React.Component {
   
  constructor(props) {
    super(props);   

    //recuperation de l'autocall
    this.autocall =  this.props.navigation.getParam('autocall', '...');

    //user lists
    this.user = this.props.user;
    this.users = this.props.users;

    this.state = { 
        //friends to share product
        friends : this.props.navigation.getParam('friends', []),
        isAllFriendFriend : false,
        isAllOrgFriend : false,
        friendName : '',

        //gestion de l'accordeon
        activeSections: [],

        //gestion du clavier
        keyboardHeight: 0,
        isKeyboardVisible: false,
  

        toto : true,

    };

    //this.viewabilityConfig = { itemVisiblePercentThreshold: 40 }

    this.props.navigation.setParams({ hideBottomTabBar : true });


    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);



  }




  static navigationOptions = ({ navigation }) => {
    return ({
      headerShown : false

    }
    );
 }

  async componentDidMount() {
    if (!isAndroid()) {
      this._navListener = this.props.navigation.addListener('didFocus', () => {
        StatusBar.setBarStyle('light-content');
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


  _renderUsers(usersList) {
    return (
      <View>
        {usersList.map((u, index) => {
          let isFriend = this.state.friends.indexOf(u.getId()) !== -1;
          return (
            <View style={{flexDirection : 'row', width : '95%', marginTop : index === 0 ? 10 : 2, marginBottom : 2, borderWidth : 0, borderRadius : 10, borderColor : setColor('background'), backgroundColor : setColor('background'), padding : 1, justifyContent : 'space-between'}} key={index}>
                <View style={{height : 40, width : 40, borderWith : 0, borderColor : 'white', borderRadius : 20, backgroundColor : setColor(''), marginLeft : 10,  marginTop :5, marginBottom : 5, alignItems : 'center', justifyContent : 'center'}}  >
                {u.getAvatar() == null 
                  ?
                    <Text style={setFont('400', 16, 'white', 'Regular')}>{u.getFirstName().charAt(0)}.{u.getLastName().charAt(0)}.</Text>
                    : 
                    <Image style={{width: 40, height: 40, borderWidth : 0, borderRadius : 20, borderColor : 'white'}} source={{uri : u.getAvatar() }} />
                }
                </View>
                <View style={{flex : 1, borderWidth : 0, marginLeft : 10, marginTop : 3, marginRight : 5}}>
                  <View>
                    <Text style={setFont('300', 14, 'black', 'Regular')}>
                      {u.getName()} {this.user.getOrganization() !== u.getOrganization() ? <Text style={setFont('200', 12)}> ({u.getCompany()})</Text>  : null}
                    </Text>
                  </View>
                  <View>
                    <Text style={setFont('200', 12, 'gray')}>
                      {u.getEmail()}
                    </Text>
                  </View>
                  <View>
                    <Text style={setFont('200', 10, 'gray')}>
                      {u.getPhone != null && u.getPhone() !== '' ? parsePhoneNumberFromString(u.getPhone(),'FR').formatInternational() : null}
                    </Text>
                  </View>
                </View>

                      <TouchableOpacity style={{paddingRight : 15,  justifyContent : 'center', alignItems : 'flex-end', borderWidth : 0}}
                                        onPress={() => {
                                            let friends = this.state.friends;
                                            if (isFriend) { //on le retire du tableau
                                                let index = friends.indexOf(u.getId());
                                                if (index !== -1) {
                                                  friends.splice(index, 1);
                                                }
                                            } else { // on ajoute
                                              friends.push(u.getId());
                                            }
                                            this.setState({ friends });
                                        }}
                      >
                          {/* <FontAwesome5 name={isFriend ? 'user-minus' : 'user-plus'} color={isFriend ? 'red' : 'green'} size={20}/> */}
                          <MaterialCommunityIcons name={isFriend ? 'checkbox-marked-outline' : 'checkbox-blank-outline'} color={isFriend  ? 'green' : 'black'} size={20}/>
                      </TouchableOpacity>

            </View>
          )

        })
      }
      </View>
  );

  }


  _renderSearchingFriends() {
    let usersList = [];
    if (this.state.friendName.length > 2) {
      usersList = this.users.getUsersFromName(this.state.friendName);
    }
    return this._renderUsers(usersList);
  }

  render() {

    let usersOrg = this.users.getUsersFromMyOrg();
    let userFriends = this.users.getUsersFriends(this.user);

    return (
      <View  style={{ flex: 1, backgroundColor: setColor('background'), opacity: this.state.showModalDescription ? 0.3 : (this.state.isLoadingCreationTicket || this.state.isLoadingUpdatePrice) ? 0.2 : 1}} >
         
   
            <View style={{ flexDirection : 'row', marginTop : getConstant('statusBar')-(isIphoneX() ? 45 : isAndroid() ? 30 : 20) ,height: 45 + getConstant('statusBar'), width : getConstant('width'), paddingLeft : 10, backgroundColor: setColor(''), paddingTop : isAndroid() ? 10 : isIphoneX() ? 40 : 20, alignItems : 'center'}}  >
                            <TouchableOpacity style={{ flex: 0.2, flexDirection : 'row', borderWidth: 0, padding : 5}}
                                                onPress={() => {
                                                  this.props.navigation.state.params.setFriends(this.state.friends);
                                                  this.props.navigation.goBack();
                                                }}
                            >
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <Ionicons name={'md-arrow-back'}  size={25} style={{color: 'white'}}/>
                                    </View>
                  
                            </TouchableOpacity>
                            <View style={{flex: 0.6, alignItems: 'center', justifyContent: 'center'}} >
                              <Text style={setFont('200', 16, 'white', 'Regular')}>
                                Choix des amis : 
                              </Text>
                              <Text style={setFont('300', 18, 'white', 'Regular')}>
                                {String('placement privé').toUpperCase()} 
                              </Text>
                            </View>
                            <View style={{flex: 0.2, flexDirection : 'row', justifyContent: 'flex-end', alignItems: 'center', borderWidth: 0, marginRight: 0.05*getConstant('width')}}>

                      <View style={{ borderWidth : 0, width : 0.1*getConstant('width'),  height: 40, justifyContent: 'center', alignItems: 'center'}}>
                      
                      </View>
         
                   
                </View>
            </View>


            <View style={{  width : getConstant('width'), justifyContent : 'center', alignItems : 'center', marginTop : 10}}>
                  <Accordion
                      sections={[            
                        {
                          title: '...',
                          code: 'DETAIL',
                        }
                      ]}
                      underlayColor={'transparent'}
                      activeSections={this.state.activeSections}
                      renderHeader={({}) => {
                        return (
                          <View style={{flexDirection : 'row', width : getConstant('width')*0.95, height : 40,  alignItems : 'center', justifyContent : 'space-between', paddingHorizontal : 10}}  >
                            <View style={{borderWidth : 0 }}  >
                                <Text style={setFont('300', 18, 'black', 'Regular')}>
                                    {this.state.friends.length === 0 ? String("Ajoutez des amis") : this.state.friends.length + " personne" + (this.state.friends.length !== 1 ? 's' : '') + " ajoutée" + (this.state.friends.length !== 1 ? 's' : '')}
                                </Text>                           
                            </View>
                            <View style={{  alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 0}}>
                                <MaterialCommunityIcons name={'eye-outline'} size={25}/>
                            </View>  
                          </View>
                        )
                      }}
                      //renderFooter={this._renderFooterUnderlying}
                      renderContent={({}) => {
                        return(
                          <View style={{width : getConstant('width')*0.95, justifyContent : 'center', alignItems: 'center'}}>
                              {this._renderUsers(this.users.getUserListFromUid(this.state.friends))}
                          </View>
                        )
                      }}
                      expandMultiple={false}
                      onChange={(activeSections) => {
                          this.setState( { activeSections : activeSections })  
                      }}
                      sectionContainerStyle={{
                                              width : getConstant('width')*0.95,
                                              backgroundColor: 'white', 
                                              justifyContent: 'center', 
                                              alignItems: 'center', 
                                              borderWidth : 1,
                                              borderColor : 'white', 
                                              borderRadius : 10,
                                            }}
                      touchableComponent={(props) => <TouchableOpacity {...props} />}
                  />
                </View>




            <ScrollView style={{}}>
                  <View style={{flex : 1, borderWith : 0, borderColor : 'white', borderRadius : 10, backgroundColor : 'white', marginRight : 0.025*getConstant('width'), marginLeft : 0.025*getConstant('width'),  marginTop :15, marginBottom : 5, alignItems : 'flex-start', justifyContent : 'center', paddingHorizontal : 10}} >
                          <View style={{borderWidth : 0, width : getConstant('width')*0.95, marginTop : 15}}>
                                <View style={{flexDirection : 'row', marginBottom : 10}}>
                                      <Text style={setFont('300', 18, 'black', 'Light')}>
                                          {String("Recherche d'amis").toUpperCase()}
                                      </Text>       
                                </View>
                                <View style={{width : '95%'}}>
                                            <TextInput 
                                                    style={{    
                                                            display: 'flex',
                                                            backgroundColor: 'white',
                                                            height : 30,
                                                            //fontSize: 18,
                                                            color: setColor('lightBlue'),
                                                            borderColor : setColor(''),
                                                            borderWidth: 1,
                                                            borderRadius: 10,
                                                            paddingHorizontal: 5,
                                                            //textAlign: this.state.nominal === 0 ? 'left' : 'right',
                                                            textAlign: 'left' ,
                                                            textAlignVertical: 'center',
                                                    }}
                                                    onChangeText={text => this.setState({ friendName : text })}
                                                    value={this.state.friendName}
                                                    placeholder={'Recherchez des connaissances ...'}
                                                    returnKeyType={'search'}
                                                    clearButtonMode={'while-editing'}
                                                    ref={(inputFriends) => {this.inputFriends = inputFriends}}
                                            />
                                </View>
                                {this._renderSearchingFriends()}
                                <View style={{flexDirection : 'row', marginTop : 15, borderWidth : 0, width : '95%', justifyContent : 'space-between', alignItems: 'center'}}>
                                    <View>
                                          <Text style={setFont('300', 14, 'black', 'Light')}>
                                              AMIS
                                          </Text>
                                    </View>    
                                    <TouchableOpacity style={{paddingRight : 15,  justifyContent : 'center', alignItems : 'flex-end', borderWidth : 0}}
                                                                    onPress={() => {
                                                                        let friends = this.state.friends;
                                                                        //on ajoute ou on retire tous les amis 
                                                                        if (!this.state.isAllFriendFriend) {
                                                                            userFriends.forEach((u) => {
                                                                                if (friends.indexOf(u.getId()) === -1) {
                                                                                  friends.push(u.getId());
                                                                                }
                                                                            })
                                                                            this.setState({ friends });
                                                                        } else {
                                                                            let newwFriends = []; 
                                                                            usersOrg.forEach((u) => {
                                                                                if (friends.indexOf(u.getId()) !== -1 && !this.user.isFriend(u.getId())) {
                                                                                  newwFriends.push(u.getId());
                                                                                }
                                                                            }) 
                                                                            this.setState({ friends : newwFriends });                                                                      
                                                                        }
                                                                        
                                                                        this.setState({ isAllFriendFriend : !this.state.isAllFriendFriend });
                                                                    }}
                                                  >
                                                      <MaterialCommunityIcons name={this.state.isAllFriendFriend ? 'checkbox-marked-outline' : 'checkbox-blank-outline'} color={this.state.isAllFriendFriend   ? 'green' : 'gray'} size={20}/>
                                    </TouchableOpacity>   
                                </View>
                                {
                                  userFriends.map((u, index) => {
                                      let isFriend = this.state.friends.indexOf(u.getId()) !== -1;
                                      return (
                                        <View style={{flexDirection : 'row', width : '95%', marginTop : index === 0 ? 10 : 2, marginBottom : 2, borderWidth : 0, borderRadius : 10, borderColor : setColor('background'), backgroundColor : setColor('background'), padding : 1, justifyContent : 'space-between'}} key={index}>
                                            <View style={{height : 40, width : 40, borderWith : 0, borderColor : 'white', borderRadius : 20, backgroundColor : setColor(''), marginLeft : 10,  marginTop :5, marginBottom : 5, alignItems : 'center', justifyContent : 'center'}}  >
                                            {u.getAvatar() == null 
                                              ?
                                                <Text style={setFont('400', 16, 'white', 'Regular')}>{u.getFirstName().charAt(0)}.{u.getLastName().charAt(0)}.</Text>
                                                : 
                                                <Image style={{width: 40, height: 40, borderWidth : 0, borderRadius : 20, borderColor : 'white'}} source={{uri : u.getAvatar() }} />
                                            }
                                            </View>
                                            <View style={{flex : 1, borderWidth : 0, marginLeft : 10, marginTop : 3, marginRight : 5}}>
                                              <View>
                                                <Text style={setFont('300', 14, 'black', 'Regular')}>
                                                  {u.getName()} {this.user.getOrganization() !== u.getOrganization() ? <Text style={setFont('200', 12)}> ({u.getCompany()})</Text>  : null}
                                                </Text>
                                              </View>
                                              <View>
                                                <Text style={setFont('200', 12, 'gray')}>
                                                  {u.getEmail()}
                                                </Text>
                                              </View>
                                              <View>
                                                <Text style={setFont('200', 10, 'gray')}>
                                                  {u.getPhone != null && u.getPhone() !== '' ? parsePhoneNumberFromString(u.getPhone(),'FR').formatInternational() : null}
                                                </Text>
                                              </View>
                                            </View>
                          
                                                  <TouchableOpacity style={{paddingRight : 15,  justifyContent : 'center', alignItems : 'flex-end', borderWidth : 0}}
                                                                    onPress={() => {
                                                                        let friends = this.state.friends;
                                                                        if (isFriend) { //on le retire du tableau
                                                                            let index = friends.indexOf(u.getId());
                                                                            if (index !== -1) {
                                                                              friends.splice(index, 1);
                                                                            }
                                                                        } else { // on ajoute
                                                                          friends.push(u.getId());
                                                                        }
                                                                        this.setState({ friends });
                                                                    }}
                                                  >
                                                      {/* <FontAwesome5 name={isFriend ? 'user-minus' : 'user-plus'} color={isFriend ? 'red' : 'green'} size={20}/> */}
                                                      <MaterialCommunityIcons name={isFriend ? 'checkbox-marked-outline' : 'checkbox-blank-outline'} color={isFriend  ? 'green' : 'black'} size={20}/>
                                                  </TouchableOpacity>

                                        </View>
                                      )

                                    })
                                }


                                <View style={{flexDirection : 'row', marginTop : 15, borderWidth : 0, width : '95%', justifyContent : 'space-between', alignItems: 'center'}}>
                                    <View>
                                          <Text style={setFont('300', 14, 'black', 'Light')}>
                                              {this.user.getOrganization()}
                                          </Text>
                                    </View>    
                                    <TouchableOpacity style={{paddingRight : 15,  justifyContent : 'center', alignItems : 'flex-end', borderWidth : 0}}
                                                                    onPress={() => {
                                                                        let friends = this.state.friends;
                                                                        //on ajoute ou on retire tous les amis 
                                                                        if (!this.state.isAllOrgFriend) {
                                                                          usersOrg.forEach((u) => {
                                                                                if (friends.indexOf(u.getId()) === -1) {
                                                                                  friends.push(u.getId());
                                                                                }
                                                                            })
                                                                            this.setState({ friends });
                                                                        } else {
                                                                            let newwFriends = []; 
                                                                             userFriends.forEach((u) => {
                                                                                if (friends.indexOf(u.getId()) !== -1 && !this.user.isFriend(u.getId())) {
                                                                                  newwFriends.push(u.getId());
                                                                                }
                                                                            }) 
                                                                            this.setState({ friends : newwFriends });                                                                      
                                                                        }
                                                                        
                                                                        this.setState({ isAllOrgFriend : !this.state.isAllOrgFriend });
                                                                    }}
                                                  >
                                                      <MaterialCommunityIcons name={this.state.isAllOrgFriend ? 'checkbox-marked-outline' : 'checkbox-blank-outline'} color={this.state.isAllFriendFriend   ? 'green' : 'gray'} size={20}/>
                                    </TouchableOpacity>   
                                </View>
                                {
                                  usersOrg.map((u, index) => {
                                      let isFriend = this.state.friends.indexOf(u.getId()) !== -1;
                                      return (
                                        <View style={{flexDirection : 'row', width : '95%', marginTop : index === 0 ? 10 : 2, marginBottom : 2, borderWidth : 0, borderRadius : 10, borderColor : setColor('background'), backgroundColor : setColor('background'), padding : 1, justifyContent : 'space-between'}} key={index}>
                                            <View style={{height : 40, width : 40, borderWith : 0, borderColor : 'white', borderRadius : 20, backgroundColor : setColor(''), marginLeft : 10,  marginTop :5, marginBottom : 5, alignItems : 'center', justifyContent : 'center'}}  >
                                            {u.getAvatar() == null 
                                              ?
                                                <Text style={setFont('400', 16, 'white', 'Regular')}>{u.getFirstName().charAt(0)}.{u.getLastName().charAt(0)}.</Text>
                                                : 
                                                <Image style={{width: 40, height: 40, borderWidth : 0, borderRadius : 20, borderColor : 'white'}} source={{uri : u.getAvatar() }} />
                                            }
                                            </View>
                                            <View style={{flex : 1, borderWidth : 0, marginLeft : 10, marginTop : 3, marginRight : 5}}>
                                              <View>
                                                <Text style={setFont('300', 14, 'black', 'Regular')}>
                                                  {u.getName()} {this.user.getOrganization() !== u.getOrganization() ? <Text style={setFont('200', 12)}> ({u.getCompany()})</Text>  : null}
                                                </Text>
                                              </View>
                                              <View>
                                                <Text style={setFont('200', 12, 'gray')}>
                                                  {u.getEmail()}
                                                </Text>
                                              </View>
                                              <View>
                                                <Text style={setFont('200', 10, 'gray')}>
                                                  {u.getPhone != null && u.getPhone() !== '' ? parsePhoneNumberFromString(u.getPhone(),'FR').formatInternational() : null}
                                                </Text>
                                              </View>
                                            </View>
                          
                                                  <TouchableOpacity style={{paddingRight : 15,  justifyContent : 'center', alignItems : 'flex-end', borderWidth : 0}}
                                                                    onPress={() => {
                                                                      let friends = this.state.friends;
                                                                      if (isFriend) { //on le retire du tableau
                                                                          let index = friends.indexOf(u.getId());
                                                                          if (index !== -1) {
                                                                            friends.splice(index, 1);
                                                                          }
                                                                      } else { // on ajoute
                                                                        friends.push(u.getId());
                                                                      }
                                                                      this.setState({ friends });
                                                                    }}
                                                  >
                                                      <MaterialCommunityIcons name={isFriend ? 'checkbox-marked-outline' : 'checkbox-blank-outline'} color={isFriend  ? 'green' : 'black'} size={20}/>
                                                  </TouchableOpacity>

                                        </View>
                                      )

                                    })
                                }
                            </View>



                            

                    </View>  
                    <View style={{height : 150}} />
            </ScrollView>
            


      </View>
    );
  }

}


const condition = authUser => !!authUser;
const composedStructuredProductDetail = compose(
 withAuthorization(condition),
  withNavigation,
  withUser
);

//export default HomeScreen;
export default hoistStatics(composedStructuredProductDetail)(FLAutocallDetailBroadcastFriends);