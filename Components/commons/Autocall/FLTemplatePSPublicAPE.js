import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Modal, Dimensions, Linking } from 'react-native';
import { NavigationActions } from 'react-navigation';
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";


import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import RobotBlink from "../../../assets/svg/robotBlink.svg";
import banniere from '../../../assets/yourTeam.png';
import YourTeam_SVG from "../../../assets/svg/yourTeam.svg";

import { globalStyle, setFont, setColor } from '../../../Styles/globalStyle'

import FLModalDropdown from '../FLModalDropdown';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import { withUser } from '../../../Session/withAuthentication';
import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import * as WebBrowser from 'expo-web-browser';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import * as TEMPLATE_TYPE from '../../../constants/template'

import { ifIphoneX, ifAndroid, sizeByDevice, currencyFormatDE, isAndroid , getConstant } from '../../../Utils';


import { CAutocallSRP } from '../../../Classes/Products/CAutocallSRP';
import { CPSRequest } from '../../../Classes/Products/CPSRequest';




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
    this.screenWidth = 0.9 * getConstant('width');


    this.autocall = this.props.product;    

    // console.log("Title : " + this.autocall.getFrequencyAutocallTitle());
    // console.log("getUnderlying : " + this.autocall.getUnderlying());
  
  }

_renderHeaderFullTemplate2() {
  let isCouponNull = true;
  if (this.autocall.getCoupon() != null && Number(this.autocall.getCoupon()) !== 0) {
    isCouponNull = false;
  }
 
  return (
          <View style={{flex : 0.35, flexDirection : 'row', justifyContent  : 'space-between'}}>
                <View style={{ flexDirection : 'column', flex : 1, justifyContent: 'center' , paddingLeft : 15,   backgroundColor: 'white', borderTopLeftRadius : 10, borderTopRightRadius : 10}} >                                                    
 
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems : 'center', paddingTop : 5}}>
          
                        <Text style={setFont('400', 16,  setColor('darkBlue'), 'Bold')} numberOfLines={1}>
                        {this.autocall.getShortName()} 
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', paddingTop : 0, borderWidth: 0, justifyContent: 'flex-start', alignItems : 'center'}}>
                   
                            <Text style={setFont('400',  12, setColor('darkBlue'), 'Regular')} numberOfLines={1}>
                            {this.autocall.getFullUnderlyingName()} 
                            </Text>
             
           
                    </View>
                  </View>
                  {!isCouponNull
                    ?
                      <View style={{ padding : 3, borderWidth: 3, borderTopRightRadius: 10, backgroundColor : 'white', alignItems: 'flex-end', justifyContent : 'flex-start', borderColor: 'white'}}>
                  
                            <Text style={setFont('400', 18,  setColor('FLGreen'), 'Bold')} numberOfLines={1}>
                                { Numeral(this.autocall.getCoupon() == null ? 0 : this.autocall.getCoupon()).format('0.00%')}
                                
                                <Text style={setFont('300', 12, setColor('FLGreen') )}> {' p.a.'}</Text>  </Text>
                      </View>
                    : null
                  }
          </View>
  
  );
}

_renderHeaderMediumTemplate() {
  
  return (

                <View style={{flexDirection : 'row',paddingLeft : 20,  backgroundColor: 'white', borderTopLeftRadius: 10,  borderTopRightRadius: 10,borderBottomWidth :  0}}>                                                    
                        <View style={{flex : 0.6, flexDirection: 'column', justifyContent: 'center' }}>
                                <Text style={setFont('400', 16, setColor(''), 'Regular')}>
                                    {this.autocall.getShortName()} 
                                </Text>
                                <Text style={setFont('300', 14, setColor(''))}>
                                    {this.autocall.getFullUnderlyingName()} 
                                </Text>
                        </View>
                        <View style={{flex : 0.4, flexDirection : 'column', borderWidth: 0,  borderTopRightRadius: 10, borderTopRightRadius: 10}}>
                                 <View style={{flex : 0.5, backgroundColor: 'white',justifyContent: 'center', alignItems: 'center', paddingRigth : 5, borderWidth: 0, marginTop:0, borderWidth: 0, borderColor: 'white', borderTopRightRadius :10}}>
                                      <Text style={setFont('400', 24, 'green')} numberOfLines={1}>
                                          { Numeral(this.autocall.getCoupon() == null ? 0 : this.autocall.getCoupon()).format('0.00%')}
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
                  <Text style={setFont('300', 12, setColor(''), 'Light')}>{this.autocall.getFrequencyAutocallTitle().toLowerCase()} </Text>
                </View>
            </View>
        </View>
        <View style={{flexDirection: 'row'}}>
           {/* <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={this.autocall.getBarrierPhoenix() === 1 ? "airbag" : "shield-half-full"}  size={15} style={{color: setColor('lightBlue')}}/> 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}>{this.autocall.getBarrierPhoenix()  === 1  ? this.autocall.getAirbagTitle() : Numeral(this.autocall.getBarrierPhoenix()  - 1).format('0%')}</Text>
                </View>
            </View>
            this.autocall.isMemory() ? 
                  <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5}}>
                      <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                        <MaterialCommunityIconsIcon name={"memory"}  size={15} style={{color: setColor('lightBlue')}}/>
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
                    <Text style={setFont('300', 12, setColor(''), 'Light')}>{Moment(this.autocall.getEndIssueDate()).format("DD-MMM-YY")} </Text>
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
                  <MaterialCommunityIconsIcon name={"shield"}  size={18} style={{color: setColor('lightBlue')}}/> 
                </View>
                <View style={{flex: 1, justifyContent: 'center',  alignItems: 'stretch', padding: 2 }}>
                  <Text style={[setFont('500', 16, setColor('lightBlue'), 'Bold'), {textAlign: 'center'}]}>
                    {Numeral(this.autocall.getBarrierPDI()).format('0%')}
                  </Text>
                </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 0, paddingTop: 10}}>
              <View style={{ width :25, borderWidth: 0,  alignItems: 'center', justifyContent: 'center',}}>
                <MaterialCommunityIconsIcon name={"ticket-percent"}  size={18} style={{color: setColor('lightBlue')}}/> 
              </View>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={[setFont('200', 11,  setColor(''),'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                  {Numeral(this.autocall.getCoupon()*this.autocall.getFrequencyAutocallNumber()/12).format('0.00%')} 
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
                  <MaterialCommunityIconsIcon name={"gavel"}  size={18} style={{color: setColor('lightBlue')}}/> 
                </View>
                <View style={{flex: 1, justifyContent: 'center',  alignItems: 'stretch', padding: 2 }}>
                  <Text style={[setFont('500', 16, setColor('lightBlue'), 'Bold'), {textAlign: 'center'}]}>
                      {Numeral(this.autocall.getAutocallLevel()).format('0%')}
                  </Text>
                </View>
          </View>


          <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 }}>
                <View style={{ borderWidth: 0, alignItems: 'center', justifyContent: 'center',}}>
                  <MaterialCommunityIconsIcon name={"alarm-multiple"}  size={18} style={{color: setColor('lightBlue')}}/> 
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
                  <MaterialCommunityIconsIcon name={"calendar"}  size={18} style={{color: setColor('lightBlue')}}/> 
                </View>
                <View style={{flex: 1, justifyContent: 'center',  alignItems: 'stretch', padding: 2 }}>
                  <Text style={[setFont('500', 16, setColor('lightBlue'), 'Bold'), {textAlign: 'center'}]}>
                    {Moment(this.autocall.getEndIssueDate()).fromNow().substring(5)}
                  </Text>
                </View>
          </View>


          <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 }}>
                
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 2 }}>
                        <Text style={[setFont('200', 11, setColor(''),'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
                          {Moment(this.autocall.getEndIssueDate()).format('ll')}
                        </Text>

                </View>
          </View>
        </View>   
   </View>
  )
}


_renderFooterFullTemplate(isFavorite) {
  var dataUF = [this.autocall.getUF()  !== 0 ? Numeral(this.autocall.getUF()).format('0.00%') : "Inconnue"];
  return (
    <View style={{flex : 0.1, flexDirection : 'row', borderTopWidth : 1, borderTopColor: 'lightgray', backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]} 
                                  onPress={() => {
                                    this.autocall.setFavorite(!this.autocall.isFavorite());
                                    this.setState({ isFavorite : this.autocall.isFavorite() });                   
                                    this.props.setFavorite(this.autocall.getProductJSON())
                                    .then((autocall) => {          
                                      //this.autocall = new CAutocall2(autocall);
                                      //this.setState({ toto : !this.state.toto });
                                    })
                                    .catch((error) => {
                                      this.autocall.setFavorite(!this.autocall.isFavorite());       
                                      this.setState({ isFavorite : this.autocall.isFavorite() });                
                                      console.log("Erreur de mise en favori : " + error);
                                    }); 
                                  }}
                >
                  <MaterialCommunityIconsIcon name={!isFavorite ? "heart-outline" : "heart"} size={20} color={setColor('light')}/>
                </TouchableOpacity>

                <View style={[{flex : 0.2}, globalStyle.templateIcon]}>              
                  <FLModalDropdown
                    ref={'UF'}
                    dropdownTextStyle={setFont('500', 16, 'gray', 'Regular')}
                    dropdownTextHighlightStyle={setFont('500', 16, setColor(''), 'Bold')}
                      onSelect={(index, value) => {
              

                      }}
                      adjustFrame={(f) => {
                        return {
                          width: getConstant('width')/3,
                          height: 40,
                          left : f.left,
                          //right : f.right,
                          top: f.top + (f.height  - 40),
                        }
                      }}
                      onDropdownWillShow={() => {
                        // let idx = dataUF.indexOf(Numeral(this.request.getValue('UF')).format('0.00%'));
                        // this.refs['UF'].select(idx);
                        //this.refs['UF'].scrollTo({animated: true}, 100);
                      }}
                      defaultIndex={0}
                      //defaultValue={Numeral(this.request.getValue('UF') - 1).format('0%')}
                      //defaultValue={''}

                      options={dataUF}
                    >
                      <MaterialCommunityIcons name={"margin"} size={20} style={{color: setColor('light')}}/>
                    </FLModalDropdown>
                </View>

                <TouchableOpacity style={[{flex : 0.2}, globalStyle.templateIcon]} 
                                                onPress={() => {
                                                  //this.props.navigation.navigate('FLSRPPdfReader', {urLPDF: this.autocall.getURIDescription()});
                                                  //Linking.openURL(this.autocall.getURIDescription()).catch((err) => console.error('An error occurred', err));
                                                  WebBrowser.openBrowserAsync(this.autocall.getURIDescription(), { enableBarCollapsing: true, showTitle: false });
                                                }}
                 >
                 
                  <FontAwesome name={"file-text-o"}  size={20} style={{color: setColor('lightBlue')}}/> 
                </TouchableOpacity>   

                <View style={[{flex : 0.2}, globalStyle.templateIcon]} />

                <TouchableOpacity style={[{flex : 0.2, backgroundColor : setColor(''), borderBottomRightRadius: 10,}, globalStyle.templateIcon]}
                                  onPress={() => {
                                    //this.props.navigation.navigate('FLSRPDetail', {
                                      this.props.navigation.navigate('FLAutocallDetail' , {
                                      autocall: this.autocall,
                                      //ticketType: TICKET_TYPE.PSCREATION
                                    })
                                }}
                >
                  {/* <MaterialCommunityIcons name="fast-forward" size={25} color={'white'}/> */}
                  <View style={{flexDirection: 'row'}}>
                      <View style={{borderWidth : 0}}>
                        <Text style={setFont('300', 16, 'white', 'Regular')}>Voir</Text>
                      </View>
                      <View style={{borderWidth : 0, justifyContent : 'center', alignItems: 'center', paddingLeft : 4}}>
                        <Ionicons name="md-arrow-forward" size={18} style={{color : 'white'}}/>
                      </View>
                  
                  </View>
                  
                </TouchableOpacity>
                
              </View>

  );
}

_renderMediumTemplate() {
  return (
          <View style={{flexDirection : 'column', 
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
      
                          //marginLeft : 0.025*getConstant('width'),
                          shadowColor: 'rgb(75, 89, 101)',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.9,
                          borderWidth :  1, //isAndroid() ? 0 : 1,
                          borderColor : isAndroid() ? 'lightgray' :  'white',
                          //borderTopLeftRadius: 15,
                          borderRadius: 10,
                          //overflow: "hidden",
                          backgroundColor: 'white',
                  
                          //elevation: 3
                        }}
            >
                {/*<View style={{position: 'absolute', top : -5, left : getConstant('width')/2 -30, zIndex: 99}}>
                    <YourTeam_SVG width={50} height={80} />
                </View>*/}

                {this._renderHeaderFullTemplate2()}

                <View style={{flexDirection: 'column', backgroundColor: 'white'}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 0.6}}>
                            {this._renderAutocallShortTemplate()}
                            </View>
                            <View style={{flex: 0.4, padding: 5, justifyContent : 'center'}}>
                                
                                {Moment(this.autocall.getIssueDate()).diff(Moment(Date.now()), 'days') === 0 ?
                                    <View style={{marginTop : 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', borderRadius: 3}}>
                                        <Text style={setFont('300', 12, 'white', 'Regular')}>
                                          Dernier jour
                                        </Text>
                                    </View>
                                  :
                                  <View style={{paddingTop : 10, justifyContent: 'center', alignItems: 'center'}}>
                                      <Text style={setFont('500', 12, 'black', 'Bold')}>
                                        Plus que {Moment(this.autocall.getIssueDate()).diff(Moment(Date.now()), 'days')} jour{Moment(this.autocall.getIssueDate()).diff(Moment(Date.now()), 'days') !== 1 ? 's' : ''}
                                      </Text>
                                  </View>   
                                }                            

                            </View>
                        </View>


                        <View style={{flexDirection : 'row', marginLeft : 10, marginRight : 10, marginTop : 0}}>
                            <View style={{flex : 0.5}}>
                                <Text style={setFont('200', 10, 'gray')}>Emetteur :</Text>
                                        <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center', height : 19}}>
                                              <View style={{justifyContent : 'center', alignItems : 'center'}}>  
                                                  <MaterialCommunityIcons name={'margin'} size={15} color={setColor('')}/>
                                              </View>
                                              <View style={{justifyContent : 'center', alignItems : 'flex-start',  paddingLeft : 3}}>  
                                                  <Text style={setFont('200', 12, setColor(''), 'Bold')}> {this.autocall.getIssuer()}</Text>
                                              </View>
                                        </View>
                            </View>    
                            
                            <View style={{flex : 0.5}}>
                                <Text style={setFont('200', 10, 'gray')}>Distributeur : </Text>
                                        <View style={{flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'center', height : 19}}>
                                              <View style={{justifyContent : 'center', alignItems : 'center'}}>  
                                                  <FontAwesome5 name={'donate'} size={15} color={setColor('')}/>
                                              </View>
                                              <View style={{justifyContent : 'center', alignItems : 'flex-start', paddingLeft : 3}}>  
                                                  <Text style={setFont('200', 12, setColor(''), 'Bold')}> {this.autocall.getDistributor()}</Text>
                                              </View>
                                        </View>
                            </View>   
                        </View>





                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft : 10, marginRight : 10, marginTop : 10}}>
                            <View>
                                <Text style={setFont('300', 10, 'black')} numberOfLines={5}>
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