import React from 'react'
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, StyleSheet, Platform, Switch, Alert, KeyboardAvoidingView} from 'react-native'
import { Icon, Button, Input} from 'native-base'
import Moment from 'moment';
import localization from 'moment/locale/fr'

import { globalStyle } from '../../Styles/globalStyle'
import { FontAwesome } from '@expo/vector-icons';

import { ssCreateStructuredProduct } from '../../API/APIAWS';

import { blueFLColor, FLFontFamily, generalFontColor, subscribeColor } from '../../Styles/globalStyle';



import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import StepIndicator from 'react-native-step-indicator';

import { ifIphoneX, ifAndroid, sizeByDevice, currencyFormatDE} from '../../Utils';
import Dimensions from 'Dimensions';


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;





class AdminUser extends React.Component {
    
    constructor(props) {
      super(props);
  
      this.user = this.props.navigation.getParam('user', '...');

      const { state, setParams, navigate } = this.props.navigation;
      this.params = state.params || {};

      //console.log(this.user);
      
      this.state = {
          toto : true,

      }

    }



    static navigationOptions = ({ navigation }) => {
    //static navigationOptions = {
      let user = navigation.getParam('user', '...');

 
      const { params } = navigation.state;
      return {
      header: (
        <SafeAreaView style={globalStyle.header_safeviewarea}>
          {/*<View style={[globalStyle.header_left_view, {flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}]} >*/}
          <View style={globalStyle.header_left_view} >
              <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => navigation.goBack()}>
                <Icon name='ios-arrow-round-back' size={40} style={[globalStyle.header_icon, {paddingLeft : 10}]} />
              </TouchableOpacity>
              {/*<TouchableOpacity onPress={() => alert("Prochainement clone de l'opé")}>
                <FontAwesome name="clone" size={25} style={globalStyle.header_icon}/> 
                </TouchableOpacity>*/}
          </View>
          <View style={globalStyle.header_center_view} >
            <Text style={globalStyle.header_center_text_medium}>{user.firstName} {user.lastName}</Text>
          </View>
          <View style={globalStyle.header_right_view} >
            
          <Text style={globalStyle.header_right_view}>{user.company}</Text>
          </View>
        </SafeAreaView>
      )
      }
    }

   
 

    
    render() {

      return(
        <View style={{flex:1 , flexDirection: 'column', marginTop : 5, backgroundColor: this.user.validated ? globalStyle.bgColor : 'lavenderblush', width: DEVICE_WIDTH, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flexDirection : 'row', marginTop: 15}}>
                <View style={{flex: 0.45, justifyContent: 'center', paddingLeft:15}}>
                  <Text style={{fontSize : 16}}>
                    Profil validé :
                  </Text>
                </View>
                <View style={{flex: 0.55,  borderLeftWidth: 0}}>
                    <Switch value={this.user.validated} 
                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                            onChange={() => {
                              this.props.firebase.updateTable("users", this.user.id, "validated", !this.user.validated)
                              .then(() => {
                                
                                this.user.validated = !this.user.validated;
                                this.params.updateUser(this.user.id,"validated",this.user.validated);
                                this.setState({ toto : !this.state.toto });
                              })
                              .catch((error) => alert(error));
                            }}/>
                </View>
            </View>

          <ScrollView style={{flexDirection: 'column',borderWidth: 0, width: DEVICE_WIDTH*0.95}}>
             
            <View style={{flexDirection:'column', borderWidth: 1, marginTop: 10}}>   
              <View style={{backgroundColor: blueFLColor, borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 5}}>
                <Text style={{color: 'white'}}>COORDONEES</Text>
              </View>
              <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                <View style={{flex: 0.35}}>
                  <Text style={styles.textProperty}>
                    Nom
                  </Text>
                </View>
                <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                  <Text style={styles.textProperty}>
                  {this.user.lastName}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                <View style={{flex: 0.35}}>
                  <Text style={styles.textProperty}>
                  Prénom
                  </Text>
                </View>
                <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                  <Text style={styles.textProperty}>
                  {this.user.firstName}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                <View style={{flex: 0.35}}>
                  <Text style={styles.textProperty}>
                  E-mail
                  </Text>
                </View>
                <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                  <Text style={styles.textProperty}>
                  {this.user.email}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                <View style={{flex: 0.35}}>
                  <Text style={styles.textProperty}>
                  Téléphone
                  </Text>
                </View>
                <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                  <Text style={styles.textProperty}>
                  {this.user.phone}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                <View style={{flex: 0.35}}>
                  <Text style={styles.textProperty}>
                  Société
                  </Text>
                </View>
                <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                  <Text style={styles.textProperty}>
                  {this.user.company}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                <View style={{flex: 0.35}}>
                  <Text style={styles.textProperty}>
                  Organisme de rattachement
                  </Text>
                </View>
                <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                  <Text style={styles.textProperty}>
                  {this.user.organization}
                  </Text>
                </View>
              </View>
              <View style={{backgroundColor: blueFLColor, borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 5}}>
                <Text style={{color: 'white'}}>RÔLES</Text>
              </View>
              <View style={{flexDirection : 'column', borderBottomWidth: 1}}>
                <View style={{flex: 0.33, flexDirection: 'row'}}>
                  <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10}}>
                    <Text style={styles.textProperty}>
                      Indépendant
                    </Text>
                  </View>
                  <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'center'}}>
                    <Switch value={this.user.independant} 
                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                            onChange={() => {
                              this.props.firebase.updateTable("users", this.user.id, "independant", !this.user.independant)
                              .then(() => {
                                
                                this.user.independant = !this.user.independant;
                                this.params.updateUser(this.user.id,"independant",this.user.independant);
                                this.setState({ toto : !this.state.toto });
                              })
                              .catch((error) => alert(error));
                            }}/>
                  </View>
                </View>
                <View style={{flex: 0.33, flexDirection: 'row'}}>
                  <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10}}>
                    <Text style={styles.textProperty}>
                      Superviseur
                    </Text>
                  </View>
                  <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'center'}}>
                    <Switch value={this.user.supervisor} 
                            style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                            onChange={() => {
                              this.props.firebase.updateTable("users", this.user.id, "supervisor", !this.user.supervisor)
                              .then(() => {
                                
                                this.user.supervisor = !this.user.supervisor;
                                this.params.updateUser(this.user.id,"supervisor",this.user.supervisor);
                                this.setState({ toto : !this.state.toto });
                              })
                              .catch((error) => alert(error));
                            }}/>
                  </View>
                </View>

              </View>
              <View style={{backgroundColor: blueFLColor, borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 5}}>
                <Text style={{color: 'white'}}>IDENTICATION</Text>
              </View>
              <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                <View style={{flex: 0.35}}>
                  <Text style={styles.textProperty}>
                    FS
                  </Text>
                </View>
                <View style={{flex: 0.65,  borderLeftWidth: 1, justifyContent: 'center'}}>
                  <Text style={[styles.textProperty, {fontSize :12}]}>
                  {this.user.id}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                <View style={{flex: 0.35}}>
                  <Text style={styles.textProperty}>
                    FD
                  </Text>
                </View>
                <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                  <Text style={styles.textProperty}>
                  {this.user.codeTS}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      );
      }
}

const styles = StyleSheet.create({
  textProperty: {
    fontSize: 16, 
    fontWeight: '300', 
    fontFamily : 'FLFontFamily', 
    textAlign: 'left',
    paddingLeft : 5
  },

});

const condition = authUser => !!authUser;
const composedStructuredProductDetail = compose(
 withAuthorization(condition),
  withNavigation,
  withUser
);

//export default HomeScreen;
export default hoistStatics(composedStructuredProductDetail)(AdminUser);

