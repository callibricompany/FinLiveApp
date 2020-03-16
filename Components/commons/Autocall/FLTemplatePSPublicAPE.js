import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Modal, Dimensions, Linking } from 'react-native';
import { NavigationActions } from 'react-navigation';
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

import AnimatedProgressWheel from 'react-native-progress-wheel';

import * as Progress from 'react-native-progress';


import RobotBlink from "../../../assets/svg/robotBlink.svg";
import banniere from '../../../assets/yourTeam.png';
import YourTeam_SVG from "../../../assets/svg/yourTeam.svg";

import {  
    generalFontColor, 
    blueFLColor,
    headerTabColor,
    selectElementTab,
    progressBarColor,
    subscribeColor,
    FLFontFamily,
    FLFontFamilyBold,
    apeColor,
    backgdColorPricerParameter,
    globalStyle,
    backgdColor,
    setFont,
    setColor
 } from '../../../Styles/globalStyle'


import Numeral from 'numeral'
import 'numeral/locales/fr'

import { withUser } from '../../../Session/withAuthentication';
import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';


import Moment from 'moment';
import localization from 'moment/locale/fr'

import * as TEMPLATE_TYPE from '../../../constants/template'

import { searchProducts } from '../../../API/APIAWS';

import { FLPDIDetail } from '../../Pricer/description/FLPDIDetail';
import { FLPhoenixBarrierDetail } from '../../Pricer/description/FLPhoenixBarrierDetail';
import { FLFreqDetail } from '../../Pricer/description/FLFreqDetail';
import { FLUFDetail } from '../../Pricer/description/FLUFDetail';
import { FLAirbagDetail} from '../../Pricer/description/FLAirbagDetail';

import { ifIphoneX, ifAndroid, sizeByDevice, currencyFormatDE, isAndroid } from '../../../Utils';
import { interpolateBestProducts } from '../../../Utils/interpolatePrices';

import { CAutocallSRP } from '../../../Classes/Products/CAutocallSRP';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';
import { CBroadcastTicket } from '../../../Classes/Tickets/CBroadcastTicket';





const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class FLTemplatePSPublicAPE extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      isEditable : typeof this.props.isEditable !== 'undefined' ? this.props.isEditable : false,

      toto : true,
    }

    //ensemble des modal dropdown
    this._dropdown = {};

    

    //type de tycket
    this.type = this.props.hasOwnProperty('templateType')  ? this.props.templateType : TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE;

    //largeur de la cartouche sur l'ecran
    this.screenWidth = 0.9 * DEVICE_WIDTH;

    this.autocall = new CAutocallSRP(this.props.object);    

    //console.log(this.autocall.getProductName());
  
  }



 









_renderHeaderFullTemplate() {
  
  return (
    <View>
          <View style={{flexDirection : 'row'}}>
                <View style={{
                              flex : 0.6, 
                              flexDirection : 'column', 
                              paddingLeft : 20,  
                              backgroundColor: blueFLColor, 
                              borderTopLeftRadius: 10, 
                              //borderRadius: 14,
                              borderBottomWidth :  0,

                              }}
                >                                                    
                  <View style={{flex : 0.6, flexDirection: 'column', justifyContent: 'center' }}>
                  <View style={{flexDirection: 'row', borderWidth: 0}}>
                    <View style={{ borderWidth: 0}}>
           
                          <Text style={setFont('400', 14, 'white', 'Regular')}>
                              {this.autocall.getProductTile()} 
                          </Text>
          
                        </View>

                    </View>
                    <View style={{flexDirection: 'row'}}>
                            <Text style={setFont('400', 12,  'white')} numberOfLines={1}>
                                {this.autocall.getUnderlying()} <Text style={setFont('400', 18, 'white')}>{''}</Text>
                            </Text>
                    </View>
                  </View>

                </View>
                <View style={{flex : 0.4, flexDirection : 'column', borderWidth: 0,  borderTopRightRadius: 10}}>
                  <View style={{flex : 0.5, backgroundColor: 'white',justifyContent: 'center', alignItems: 'center', paddingRigth : 5, borderWidth: 0, marginTop:0, borderWidth: 0, borderColor: 'white', borderTopRightRadius :10}}>
                    <Text style={setFont('400', 24, 'green')} numberOfLines={1}>
                        { Numeral(this.autocall.getCouponTitle()).format('0.00%')}
                        <Text style={setFont('200', 12)}> { 'p.a.'}</Text>   
                    </Text>  
                  </View> 
                  <TouchableOpacity style={{flex : 0.5, paddingTop: 5, paddingBottom: 5, backgroundColor:  subscribeColor, justifyContent: 'center', alignItems: 'center',  borderWidth: 0, }}
                                    onPress={() => {
                                          this.props.navigation.navigate('FLSRPDetail', {
                                            autocall: this.autocall,
                                            //ticketType: TICKET_TYPE.PSCREATION
                                          })
                                        }}
                  >
                    <Text style={setFont('400', 14, 'white')}>
                   VOIR >
                    </Text>   
                  </TouchableOpacity>
                </View>

              </View>

      </View>
  );
}

_renderHeaderMediumTemplate() {
  
  return (

                <View style={{flexDirection : 'row',paddingLeft : 20,  backgroundColor: 'white', borderTopLeftRadius: 10,  borderTopRightRadius: 10,borderBottomWidth :  0}}>                                                    
                        <View style={{flex : 0.6, flexDirection: 'column', justifyContent: 'center' }}>
                                <Text style={setFont('400', 16, setColor(''), 'Regular')}>
                                    {this.autocall.getProductTile()} 
                                </Text>
                                <Text style={setFont('300', 14, setColor(''))}>
                                    {this.autocall.getFullUnderlyingName()} 
                                </Text>
                        </View>
                        <View style={{flex : 0.4, flexDirection : 'column', borderWidth: 0,  borderTopRightRadius: 10, borderTopRightRadius: 10}}>
                                 <View style={{flex : 0.5, backgroundColor: 'white',justifyContent: 'center', alignItems: 'center', paddingRigth : 5, borderWidth: 0, marginTop:0, borderWidth: 0, borderColor: 'white', borderTopRightRadius :10}}>
                                      <Text style={setFont('400', 24, 'green')} numberOfLines={1}>
                                          { Numeral(this.autocall.getCouponTitle()).format('0.00%')}
                                          <Text style={setFont('200', 12)}> { 'p.a.'}</Text>   
                                      </Text>  
                                 </View> 
                                  <View style={{flex : 0.5, paddingTop: 5, paddingBottom: 5, backgroundColor:  'white', justifyContent: 'center', alignItems: 'center',  borderWidth: 0, }}>
                                    <Text style={setFont('400', 11)}>
                                          {this.autocall.getUF()}
                                    </Text>   
                                  </View>
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
                  <MaterialCommunityIconsIcon name={"gavel"}  size={15} style={{color: setColor('light')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}>{ Numeral(this.autocall.getAutocallLevel()).format('0%')} </Text>
                </View>
            </View>
            <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"alarm-multiple"}  size={18} style={{color: setColor('light')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}>{this.autocall.getFrequencyAutocallTitle().toLowerCase()} </Text>
                </View>
            </View>
        </View>
        <View style={{flexDirection: 'row'}}>
           {/* <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={this.autocall.getBarrierPhoenix() === 1 ? "airbag" : "shield-half-full"}  size={15} style={{color: setColor('light')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}>{this.autocall.getBarrierPhoenix()  === 1  ? this.autocall.getAirbagTitle() : Numeral(this.autocall.getBarrierPhoenix()  - 1).format('0%')}</Text>
                </View>
            </View>
            this.autocall.isMemory() ? 
                  <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5}}>
                      <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                        <MaterialCommunityIconsIcon name={"memory"}  size={15} style={{color: setColor('light')}}/>
                      </View>
                      <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                          <Text style={setFont('300', 12, setColor(''), 'Light')}>{(this.autocall.isMemory() ? 'mémoire': 'non mémoire')} </Text>
                      </View>
                  </View>
              : null*/
            }
        </View>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"shield"}  size={15} style={{color: setColor('light')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}>{Numeral(this.autocall.getBarrierPDI() - 1).format('0%')}</Text>
                </View>
            </View>
            <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"calendar"}  size={18} style={{color: setColor('light')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                    <Text style={setFont('300', 12, setColor(''), 'Light')}>{Moment(this.autocall.getMaturityDate()).format("DD-MMM-YY")} </Text>
                </View>
            </View>
        </View>
     </View>
  )
}

_renderAutocallMediumTemplate() {


  return (
   <View style={{flexDirection : 'row', backgroundColor: 'white', paddingTop:5 }}>
        <View style={{flex : 0.33, flexDirection : 'column', padding: 5, alignItems: 'flex-start'}}>
          <View style={{ justifyContent: 'flex-start', alignItems: 'center', padding: 2,}}>
            <Text style={[setFont('300', 10, setColor(''), 'Light', 'top'), {textAlign: 'center'}]} numberOfLines={2}>
                {String('protection \ncapital').toUpperCase()}
            </Text>         
          </View>
          <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
                <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"shield"}  size={18} style={{color: setColor('light')}}/> 
                </View>
                <View style={{flex: 1, justifyContent: 'center',  alignItems: 'stretch', padding: 2 }}>
                  <Text style={[setFont('500', 16, setColor('light'), 'Bold'), {textAlign: 'center'}]}>
                    {Numeral(this.autocall.getBarrierPDI()).format('0%')}
                  </Text>
                </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 0, paddingTop: 10}}>
              <View style={{ width :25, borderWidth: 0,  alignItems: 'center', justifyContent: 'center',}}>
                <MaterialCommunityIconsIcon name={"ticket-percent"}  size={18} style={{color: setColor('light')}}/> 
              </View>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={[setFont('200', 11,  setColor(''),'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                  {Numeral(this.autocall.getCouponTitle()*this.autocall.getFrequencyAutocallNumber()/12).format('0.00%')} 
                  <Text style={setFont('200', 11, setColor(''),'Regular')}>{' '+ this.autocall.getFrequencyAutocallTitle().toLowerCase()} </Text>
                </Text>
              </View>
          </View>
        </View>   


        <View style={{flex : 0.33, flexDirection : 'column', padding: 5, alignItems: 'flex-start'}}>
          <View style={{ justifyContent: 'flex-start', alignItems: 'center', padding: 2,}}>
            <Text style={[setFont('300', 10, setColor(''), 'Light', 'top'), {textAlign: 'center'}]} numberOfLines={2}>
                {String('rappels \ndu prduit').toUpperCase()}
            </Text>         
          </View>
          <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
                <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"gavel"}  size={18} style={{color: setColor('light')}}/> 
                </View>
                <View style={{flex: 1, justifyContent: 'center',  alignItems: 'stretch', padding: 2 }}>
                  <Text style={[setFont('500', 16, setColor('light'), 'Bold'), {textAlign: 'center'}]}>
                      {Numeral(this.autocall.getAutocallLevel()).format('0%')}
                  </Text>
                </View>
          </View>


          <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 }}>
                <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"alarm-multiple"}  size={18} style={{color: setColor('light')}}/> 
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 2 }}>
                        <Text style={[setFont('200', 11, setColor(''),'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                          {this.autocall.getFrequencyAutocallTitle()}
                        </Text>

                </View>
          </View>
        </View>   
        <View style={{flex : 0.33, flexDirection : 'column', padding: 5, alignItems: 'flex-start'}}>
        <View style={{ justifyContent: 'flex-start', alignItems: 'center', padding: 2,}}>
            <Text style={[setFont('300', 10, setColor(''), 'Light', 'top'), {textAlign: 'center'}]} numberOfLines={2}>
                {String('maturité \ndu prduit').toUpperCase()}
            </Text>         
          </View>
          <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
                <View style={{ borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"calendar"}  size={18} style={{color: setColor('light')}}/> 
                </View>
                <View style={{flex: 1, justifyContent: 'center',  alignItems: 'stretch', padding: 2 }}>
                  <Text style={[setFont('500', 16, setColor('light'), 'Bold'), {textAlign: 'center'}]}>
                    {Moment(this.autocall.getMaturityDate()).fromNow().substring(5)}
                  </Text>
                </View>
          </View>


          <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 }}>
                
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 2 }}>
                        <Text style={[setFont('200', 11, setColor(''),'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                          {Moment(this.autocall.getMaturityDate()).format('ll')}
                        </Text>

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
             
                                    
                                    this.props.setFavorite(this.autocall.getObject())
                                    .then((fav) => {    
                                      console.log("=================================");
                                      console.log(fav);                             
                                      this.autocall.setFavorite(fav);
                                      this.setState({ toto: !this.state.toto })
                                    })
                                    .catch((error) => console.log("Erreur de mise en favori : " + error));
                                  }}
                >
                  <MaterialCommunityIconsIcon name={!isFavorite ? "heart-outline" : "heart"} size={20} color={setColor('light')}/>
                </TouchableOpacity>

   
                <View style={[{flex : 0.2}, globalStyle.templateIcon]}>              

                </View>
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]}>
                 
                </TouchableOpacity>
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]} 
                                                onPress={() => {
        
                                                }}
                 >
                 
                   <Ionicons name="md-help" size={20} style={{color: setColor('light')}}/>
                </TouchableOpacity>   
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]} 
                                                onPress={() => {
                                                  //this.props.navigation.navigate('FLSRPPdfReader', {urLPDF: this.autocall.getURIDescription()});
                                                  Linking.openURL(this.autocall.getURIDescription()).catch((err) => console.error('An error occurred', err));
                                                }}
                 >
                 
                  <FontAwesome name={"file-text-o"}  size={20} style={{color: setColor('light')}}/> 
                </TouchableOpacity>   

                
              </View>

  );
}

_renderMediumTemplate() {
  return (
          <View style={{flexDirection : 'column', 
                                width: this.screenWidth, 
                                //marginLeft : 0.025*DEVICE_WIDTH,
                                shadowColor: 'rgb(75, 89, 101)',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.9,
                                borderWidth :  isAndroid() ? 0 : 1,
                                borderColor : 'white',
                                //borderTopLeftRadius: 15,
                                borderRadius: 10,
                                //overflow: "hidden",
                                backgroundColor: 'gray',
                                //elevation: 3
                              }}
          >
                  {this._renderHeaderMediumTemplate()}
                  {this._renderAutocallMediumTemplate()}
                  <View style={{ padding: 5, backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}} />
          </View>

  );
}

render () {
 
      //check if it is in favorites
      let isFavorite = false;
      isFavorite = this.autocall.isFavorite(this.props.favorite);
      
      if (this.type === TEMPLATE_TYPE.AUTOCALL_MEDIUM_TEMPLATE) {
        return this._renderMediumTemplate();
      }
    
      return (
            <View style={{flexDirection : 'column', 
                          width: this.screenWidth, 
                          //marginLeft : 0.025*DEVICE_WIDTH,
                          shadowColor: 'rgb(75, 89, 101)',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.9,
                          borderWidth :  isAndroid() ? 0 : 1,
                          borderColor : 'white',
                          //borderTopLeftRadius: 15,
                          borderRadius: 10,
                          //overflow: "hidden",
                          backgroundColor: 'gray',
                          //elevation: 3
                        }}
            >
                {/*<View style={{position: 'absolute', top : -5, left : DEVICE_WIDTH/2 -30, zIndex: 99}}>
                    <YourTeam_SVG width={50} height={80} />
                </View>*/}

                {this._renderHeaderFullTemplate()}

                <View style={{flexDirection: 'column', backgroundColor: 'white'}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 0.6}}>
                            {this._renderAutocallShortTemplate()}
                            </View>
                            <View style={{flex: 0.4, padding: 5}}>
                                <View>
                                    <Text style={setFont('300', 12, 'black', 'Bold')}>
                                      Emetteur : 
                                    </Text>
                                    <Text style={setFont('300', 12, 'black', 'Regular')}>
                                      {this.autocall.getIssuer()}
                                    </Text>
                                </View>
                                <View style={{paddingTop : 3}}>
                                    <Text style={setFont('300', 12, 'black', 'Bold')}>
                                      Distributeur : 
                                    </Text>
                                    <Text style={setFont('300', 12, 'black', 'Regular')}>
                                      {this.autocall.getDistributor()}
                                    </Text>
                                </View>
                                {Moment(this.autocall.getStartDate()).diff(Moment(Date.now()), 'days') === 0 ?
                                    <View style={{marginTop : 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', borderRadius: 3}}>
                                        <Text style={setFont('300', 12, 'white', 'Regular')}>
                                          Dernier jour
                                        </Text>
                                    </View>
                                  :
                                  <View style={{paddingTop : 10, justifyContent: 'center', alignItems: 'center'}}>
                                      <Text style={setFont('500', 12, 'black', 'Bold')}>
                                        Plus que {Moment(this.autocall.getStartDate()).diff(Moment(Date.now()), 'days')} jour{Moment(this.autocall.getStartDate()).diff(Moment(Date.now()), 'days') !== 1 ? 's' : ''}
                                      </Text>
                                  </View>   
                                }                            

                            </View>
                        </View>
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', paddingLeft : 0.05*DEVICE_WIDTH}}>
                            <View>
                                <Text style={setFont('300', 12, 'black', 'Regular')} numberOfLines={5}>
                                  {this.autocall.getDescription(2)}
                                </Text>
                            </View>
                            <View style={{flexDirection : 'row', marginTop: 0, justifyContent:'space-between'}}>
                                <View style={{padding: 0, justifyContent: 'center', alignItems: 'center'}}>
                                     
                                </View>
                                <View style={{padding: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                                
                               </View>
                               <View style={{padding: 5, justifyContent: 'center', alignItems: 'flex-start'}}>
                                  
                               </View>
                            </View>
                            <View style={{padding: 0, justifyContent: 'center', alignItems: 'flex-start'}}>
                                 
                            </View>

                             
                            
                        </View>
                </View>
                
                {this._renderFooterFullTemplate(isFavorite)}
               
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
export default hoistStatics(composedWithNav)(FLTemplatePSPublicAPE);

//export default FLTemplateAutocall;