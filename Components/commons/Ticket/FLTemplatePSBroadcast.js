import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Modal, Alert, Dimensions} from 'react-native';
import { NavigationActions } from 'react-navigation';
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";


import RobotBlink from "../../../assets/svg/robotBlink.svg";
import banniere from '../../../assets/yourTeam.png';
import YourTeam_SVG from "../../../assets/svg/yourTeam.svg";

import {  globalStyle, setFont, setColor } from '../../../Styles/globalStyle'


import Numeral from 'numeral'
import 'numeral/locales/fr'

import { withUser } from '../../../Session/withAuthentication';
import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

//import * as Progress from 'react-native-progress';
import ProgressBar from 'react-native-progress/Bar';
import Moment from 'moment';
import localization from 'moment/locale/fr'

import * as TEMPLATE_TYPE from '../../../constants/template'

import { FLPDIDetail } from '../../Pricer/description/FLPDIDetail';
import { FLPhoenixBarrierDetail } from '../../Pricer/description/FLPhoenixBarrierDetail';
import { FLFreqDetail } from '../../Pricer/description/FLFreqDetail';
import { FLUFDetail } from '../../Pricer/description/FLUFDetail';
import { FLAirbagDetail} from '../../Pricer/description/FLAirbagDetail';

import { ifIphoneX, ifAndroid, sizeByDevice, currencyFormatDE, isAndroid , getConstant } from '../../../Utils';


class FLTemplatePSBroadcast extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      isEditable : typeof this.props.isEditable !== 'undefined' ? this.props.isEditable : false,

      toto : true,
    }

    //ensemble des modal dropdown
    this._dropdown = {};

    //console.log(this.props.object);

    //type de tycket
    this.type = this.props.hasOwnProperty('templateType')  ? this.props.templateType : TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE;

    //largeur de la cartouche sur l'ecran
    this.screenWidth = this.props.hasOwnProperty('screenWidth') ? this.props.screenWidth*getConstant('width') : 0.9 * getConstant('width');

          
    //gestion des classes autocall et ticket broadcast
    this.broadcast = this.props.ticket;
    this.autocall = this.broadcast.getProduct();

  
  }



_renderHeaderFullTemplate() {
  
  return (

          <View style={{flexDirection : 'row'}}>
                <View style={{
                              flex : 0.6, 
                              flexDirection : 'column', 
                              paddingLeft : 20,  
                              backgroundColor: setColor(''), 
                              borderTopLeftRadius: 10, 
                              //borderRadius: 14,
                              borderBottomWidth :  0,


                              }}
                >                                                    
                  <View style={{flex : 0.6, flexDirection: 'column', justifyContent: 'center' }}>
                  <View style={{flexDirection: 'row', borderWidth: 0}}>
                    <View style={{ borderWidth: 0}}>
           
                          <Text style={setFont('400', 18, 'white')}>
                              {this.autocall.getProductName()} 
                          </Text>
          
                        </View>

                    </View>
                    <View style={{flexDirection: 'row'}}>
                            <Text style={setFont('400', 18,  'white')}>
                                {this.autocall.getFullUnderlyingName(this.props.categories)} <Text style={setFont('400', 18, 'white')}>{''}</Text>
                            </Text>
                    </View>
                  </View>

                </View>
                <View style={{flex : 0.4, flexDirection : 'column', borderWidth: 0,  borderTopRightRadius: 10}}>
                  <View style={{flex : 0.5, backgroundColor: 'white',justifyContent: 'center', alignItems: 'center', paddingRigth : 5, borderWidth: 0, marginTop:0, borderWidth: 0, borderColor: 'white', borderTopRightRadius :10}}>
                    <Text style={setFont('400', 24, 'green')} numberOfLines={1}>
                        { Numeral(this.autocall.getCoupon()).format('0.00%')}
                        <Text style={setFont('200', 12)}> { 'p.a.'}</Text>   
                    </Text>  
                  </View> 
                  <TouchableOpacity style={{flex : 0.5, paddingTop: 5, paddingBottom: 5, backgroundColor:  setColor('subscribeBlue'), justifyContent: 'center', alignItems: 'center',  borderWidth: 0, }}
                                                   onPress={() => {
                                                  }}
                  >
                    <Text style={setFont('400', 14, 'white')}>
                   VOIR >
                    </Text>   
                  </TouchableOpacity>
                </View>

      </View>
  );
}




_renderAutocallShortTemplate() {

  

  return (

     <View style={{flex : 0.7, flexDirection : 'column', padding: 10, borderWidth: 0, backgroundColor: 'white'}}>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"gavel"}  size={15} style={{color: setColor('lightBlue')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}>{ Numeral(this.autocall.getAutocallLevel()).format('0%')} </Text>
                </View>
            </View>
            <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"alarm-multiple"}  size={18} style={{color: setColor('lightBlue')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}>{this.autocall.getFrequencyPhoenixTitle().toLowerCase()} </Text>
                </View>
            </View>
        </View>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={this.autocall.getBarrierPhoenix() === 1 ? "airbag" : "shield-half-full"}  size={15} style={{color: setColor('lightBlue')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}>{this.autocall.getBarrierPhoenix()  === 1  ? this.autocall.getAirbagTitle() : Numeral(this.autocall.getBarrierPhoenix()  - 1).format('0%')}</Text>
                </View>
            </View>
            { this.autocall.isMemory() ? 
                  <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5}}>
                      <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                        <MaterialCommunityIconsIcon name={"memory"}  size={15} style={{color: setColor('lightBlue')}}/>
                      </View>
                      <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                          <Text style={setFont('300', 12, setColor(''), 'Light')}>{(this.autocall.isMemory() ? 'mémoire': 'non mémoire')} </Text>
                      </View>
                  </View>
              : null
            }
        </View>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"shield"}  size={15} style={{color: setColor('lightBlue')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}>{Numeral(this.autocall.getBarrierPDI() - 1).format('0%')}</Text>
                </View>
            </View>
            <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"calendar"}  size={18} style={{color: setColor('lightBlue')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                    <Text style={setFont('300', 12, setColor(''), 'Light')}>{this.autocall.getMaturityName()} </Text>
                </View>
            </View>
        </View>
     </View>
  )
}




_renderFooterFullTemplate(isFavorite) {

  return (
    <View style={{flex : 0.10, flexDirection : 'row', borderTopWidth : 1, borderTopColor: 'lightgray', paddingTop : 5, backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]} 
                                  onPress={() => {
             
                                    
                                    this.props.setFavorite(this.broadcast.getObject())
                                    .then((fav) => {    
                                      console.log("=================================");
                                      console.log(fav);                             
                                      this.broadcast.setFavorite(fav);
                                      this.setState({ toto: !this.state.toto })
                                    })
                                    .catch((error) => console.log("Erreur de mise en favori : " + error));
                                  }}
                >
                  <MaterialCommunityIconsIcon name={!isFavorite ? "heart-outline" : "heart"} size={20} color={setColor('lightBlue')}/>
                </TouchableOpacity>

   
                <View style={[{flex : 0.2}, globalStyle.templateIcon]}>              

                </View>
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]}>
                 
                </TouchableOpacity>
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]} 
                                                onPress={() => {
        
                                                }}
                 >
                 
                   <Ionicons name="md-help" size={20} style={{color: setColor('lightBlue')}}/>
                </TouchableOpacity>   
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]} 
                                                onPress={() => {
        
                                                }}
                 >
                 
                  <FontAwesome name={"file-text-o"}  size={20} style={{color: setColor('lightBlue')}}/> 
                </TouchableOpacity>   

                
              </View>

  );
}



render () {
      
      //check if it is in favorites
      let isFavorite = false;
      isFavorite = this.broadcast.isFavorite(this.props.favorite);
      
    
      return (
            <View style={{flexDirection : 'column',
                          //flex: 1,
                          width: this.screenWidth, 
                          //marginLeft : 0.025*getConstant('width'),
                          shadowColor: 'rgb(75, 89, 101)',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.9,
                          borderWidth :  isAndroid() ? 0 : 1,
                          borderColor : 'white',
                          //borderTopLeftRadius: 15,
                          borderRadius: 10,
                          //overflow: "hidden",
                          backgroundColor: 'transparent',
                          borderWidth : 1,
                          //elevation: 3
                        }}
                  opacity={this.broadcast.hasBeenSeen() ? 0.7 : 1}
            >
              <View style={{position: 'absolute', top : -5, left : getConstant('width')/2 -30, zIndex: 20}}>
                  <YourTeam_SVG width={50} height={80} />
              </View>
              <View style={{zIndex : 1}}>
                {this._renderHeaderFullTemplate()}

                <View style={{flexDirection: 'column', backgroundColor: 'white'}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 0.6}}>
                            {this._renderAutocallShortTemplate()}
                            </View>
                            <View style={{flex: 0.4}}>
                                <Image
                                  style={{width : 150, height : 50}}
                                  source={{uri: this.props.userOrg.logoUrl}}
                                />
                                <Text style={setFont('300', 12, 'black', 'Regular')}>
                                  Plus que {Moment(this.broadcast.getEndDate()).diff(Moment(Date.now()), 'days')} jours
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingLeft : 0.025*getConstant('width')}}>
                            <View>
                                <Text style={setFont('300', 14, 'black', 'Regular')}>
                                  Objectif : {currencyFormatDE(this.broadcast.getBroadcastAmount())} {this.broadcast.getCurrency()}
                                </Text>
                            </View>
                            <View style={{flexDirection : 'row', marginTop: 0, justifyContent:'space-between'}}>
                                <View style={{padding: 5, justifyContent: 'center', alignItems: 'center'}}>
                                     <Ionicons name="ios-podium" size={20} style={{color: setColor('gray')}}/> 
                                </View>
                                <View style={{padding: 5, justifyContent: 'center', alignItems: 'flex-start'}}>
                                  <ProgressBar progress={0.3} width={(getConstant('width')/2)} color={setColor('')}/>
                               </View>
                               <View style={{padding: 5, justifyContent: 'center', alignItems: 'flex-start'}}>
                                  <Text style={setFont('300', 10)}>{Moment(this.broadcast.getEndDate()).format("ll")}</Text>
                               </View>
                            </View>
                            <View style={{padding: 5, justifyContent: 'center', alignItems: 'flex-start'}}>
                                  <Text style={setFont('400', 12, 'black', 'Bold')}>{this.broadcast.getMessage()}</Text>
                            </View>
                             
                            
                        </View>
                </View>
                
                {this._renderFooterFullTemplate(isFavorite)}
               </View>
            </View>
        );
    }
}



  const condition = authUser => !!authUser;

  const composedWithNav = compose(
    withAuthorization(condition),
     withNavigation,
     withUser
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(FLTemplatePSBroadcast);

//export default FLTemplateAutocall;