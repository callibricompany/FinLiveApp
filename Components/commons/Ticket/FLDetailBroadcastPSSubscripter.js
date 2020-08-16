import React, { useState, useRef, useEffect} from 'react';
import { ScrollView, Text, View, Image, TouchableWithoutFeedback, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Ionicons from "react-native-vector-icons/Ionicons";

import { useNavigation, useNavigationParam } from 'react-navigation-hooks'

import Moment from 'moment';

import { Dropdown } from 'react-native-material-dropdown';
import ModalDropdown from 'react-native-modal-dropdown';

import * as Progress from 'react-native-progress';

import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle'
import { getConstant, currencyFormatDE } from '../../../Utils';

import { updateSouscriptionTicket } from '../../../API/APIAWS';

import { FLDatePicker } from '../FLDatePicker';
import FLTemplateAutocall from '../Autocall/FLTemplateAutocall';
import { FLUF } from "../Autocall/FLUF";

import * as TEMPLATE_TYPE from '../../../constants/template';

import Numeral from 'numeral'
import 'numeral/locales/fr'
import { CUser } from '../../../Classes/CUser';
import { PropTypes } from 'victory-native';



export function FLDetailBroadcastPSSubscripter ({ ticket, user, requester, requesterOrg, subscripters, handleIndexChange, firebase, reloadTicket}) {

        const { navigate } = useNavigation();

        const [isLoading, setIsLoading] = useState(false);
        const [ isLocked, setIsLocked ] = useState(true);

        const [nominal, setNominal] = useState(ticket.getSouscriptionAmount());
        const refNominal = useRef();

        const [ UF, setUF ] = useState(ticket.getSouscriptionUF());
        const [ UFAssoc, setUFAssoc ] = useState(ticket.getSouscriptionUFAssoc());
        const [amount, setAmount ] = useState(() => {
            return (subscripters === null || subscripters === 'undefined' || !subscripters.hasOwnProperty('subscription')) ? 0 : subscripters.subscription.reduce((a, b) => a + b, 0);
         });


        useEffect(() => {
            //retreive broadcast amount 
            //console.log(subscripters);
            setAmount((subscripters === null || subscripters === 'undefined' || !subscripters.hasOwnProperty('subscription')) ? 0 : subscripters.subscription.reduce((a, b) => a + b, 0));
          }, [subscripters]);

        return (
            <ScrollView style={{marginTop : 20, borderWidth : 0, opacity : isLoading ? 0.3 : 1}}>
                    <View style={{flexDirection : 'row',marginRight : '2.5%', marginLeft : '2.5%'}}>
                        <View style={{flex : 0.5}}>
                                <Text style={setFont('300', 18, 'black', 'Regular')}>
                                    Objectif : {currencyFormatDE(ticket.getBroadcastAmount())} {ticket.getCurrency()}
                                </Text>
                                {     ticket.getFrDueBy() < Date.now()
                                ?
                                    <Text style={setFont('200', 12)}>Fin {Moment(ticket.getEndDate()).fromNow()}</Text>
                                :
                                    null
                                }
                        </View>
                        <View style={{flex : 0.6,  justifyContent: 'center', alignItems: 'flex-end', marginRight : '5%', borderWidth : 0}}>
                            <View>
                                    <Progress.Bar progress={amount/ticket.getBroadcastAmount()} 
                                                    color={setColor('')} 
                                                    //width={this.screenWidth/2}
                                    />
                                    <View style={{alignItems: 'center', justifyContent: 'center', borderWidth : 0, marginTop : 3}}>
                                        <Text style={setFont('300', 12, 'gray')}>
                                            Promesses :  {currencyFormatDE(amount)} {ticket.getCurrency()}
                                        </Text>
                                    </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop : 25, marginLeft : 0.025*getConstant('width'), marginRight : '2.5%', flexDirection : 'row', borderWidth : 0}}>
                        <View style={{flex: 0.5}}>
                            <Text style={setFont('200', 16, 'black')}>
                                Je souhaite souscrire : 
                            </Text>
                        </View>
                        <View style={{flex: 0.5, justifyContent : 'center', alignItems: 'flex-end'}}>
               
                        </View>
                    </View>
                    <KeyboardAvoidingView behavior={'padding'} style={{flexDirection : 'row', marginTop : 5, marginLeft : 0.025*getConstant('width'), marginRight : '2.5%', borderWidth : 0}}>
                                <View style={{flex: 0.8 ,  justifyContent: 'center'}}
                                            ref={refNominal}
                                            onLayout={({nativeEvent}) => {
                                            if (refNominal.current) {
                                                refNominal.current.measure((x, y, width, height, pageX, pageY) => {
                                                        //console.log(x, y, width, height, pageX, pageY);
                                                })
                                            }
                                            }}
                                >
                                    <TextInput 
                                            style={{    
                                                    display: 'flex',
                                                    backgroundColor: 'white',
                                                    height : 30,
                                                    fontSize: 18,
                                                    color: isLocked ? setColor('lightBlue') : 'black',
                                                    borderColor : isLocked ? 'lightgray' : setColor('') ,
                                                    borderWidth: 1,
                                                    borderRadius: 4,
                                                    paddingRight: 5,
                                                    //textAlign: this.state.nominal === 0 ? 'left' : 'right',
                                                    textAlign: 'right' ,
                                                    textAlignVertical: 'center',
                                                    }}
                                            placeholder={nominal === 0 ? 'Souscrire' : 'EUR'}
                                            placeholderTextColor={'lightgray'}
                                            underlineColorAndroid={'#fff'}
                                            autoCorrect={false}
                                            keyboardType={'numeric'}
                                            returnKeyType={'done'}
                                            editable={!isLocked}
                                            onBlur={() => {
                                            //console.log("STATE NOMINAL : " + this.state.nominal +  "-  AUTOCALL NOMINAL : " + this.autocall.getNominal());
                                                ticket.setSouscriptionAmount(nominal);
                                                //updateProduct('nominal', nominal, currencyFormatDE(Number(nominal),0) );
                                            }}
                                            //onFocus={() =>  setNominal('')}
                                            //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                                            value={nominal === 0 ? '' : currencyFormatDE(Number(nominal),0)}
                                            // ref={(inputNominal) => {
                                            // this.inputNominal = inputNominal;
                                            // }}
                                            onChangeText={e => {
                                                //console.log(Number(e));
                                                setNominal(e === '' ? 0 : Numeral(e).value());
                                            }}
                                    />
                                </View>
                                <View style={{width : 0.2*getConstant('width'), borderWidth : 0, justifyContent : 'center', paddingLeft : 5}}>
                                    <Text style={setFont('400', 18,  'gray' , 'Regular')}>
                                        {ticket.getCurrency()}
                                    </Text>
                                </View>
                                {   ticket.getFrDueBy() < Date.now()
                                    ?
                                    <View style={{flex : 0.3, borderWidth: 0}}>
                                        {/* <Text style={[setFont('200', 14),{textAlign: 'center'}]}>Fin {Moment(ticket.getEndDate()).fromNow()}</Text> */}
                                        <Text style={[setFont('200', 14, 'red', 'Regular'),{textAlign: 'center'}]}>Proposition échue</Text>
                                    </View>
                                    :
                                    <TouchableOpacity style={{flex : 0.4, borderWidth: 1, borderColor : isLocked ? setColor('subscribeBlue') : 'red', borderRadius : 10, backgroundColor: isLocked ? setColor('subscribeBlue') : 'red', padding : 3, alignItems: 'center', justifyContent : 'center'}}
                                                        onPress={() => {
                                                            if (!isLocked) { 
                                                                let t = {};
                                                                t['cf_ps_nominal'] = nominal;
                                                                t['cf_rtro'] = UF*100;
                                                                t['cf_rtro_asso'] = UFAssoc*100;
                                                                t['cf_ps_currency'] = ticket.getCurrency();
                                                                setIsLoading(true);
                                                                updateSouscriptionTicket(firebase, ticket.getSouscriptionId(), ticket.getBroadcastId(), ticket.getId(), t)
                                                                .then((data) => {
                                                                    console.log(data);
                                                                    reloadTicket();
                                                                    setIsLoading(false);
                                                                })
                                                                .catch((error) => {
                                                                    alert("Erreur update souscription " + error);
                                                                    setIsLoading(false);
                                                                })
                                                            }
                                                            setIsLocked(!isLocked);
                                                        }}
                                    >
                                         <Text style={[setFont('400',14,'white', 'Bold'), {margin : 5}]} numberOfLines={1}>{isLocked ? 'MODIFIER' : 'ENREGISTRER'}</Text>
                                    </TouchableOpacity>
                                }   
                    </KeyboardAvoidingView>
                    <View style={{marginLeft :'2.5%', marginTop : 30}}>
                        <FLUF   isEditable={true} 
                                UF={UF}
                                UFAssoc={UFAssoc}
                                nominal={nominal}
                                currency={ticket.getProduct().getCurrency()}
                                company={user.getCompany()}
                                updateProduct={(id, value, valueLabel) => {
                                    (id === 'UF') ? setUF(value) : setUFAssoc(value);
                                }} 
                                locked={isLocked}
                                showSlider={ticket.getFrDueBy() < Date.now()}
                        />
                    </View>

 
                    {!ticket.isMine(user)
                     ?
                        <View style={{justifyContent: 'center', alignItems: 'flex-start', borderWidth : 0, marginRight : '2.5%', marginLeft : '2.5%', marginTop : 20}}>
                                <Text style={setFont('500', 18, 'black', 'Regular')}>Proposé par : </Text>
                        </View>
                     : null
                    }
                    {ticket.isMine(user)
                     ?
                        subscripters.hasOwnProperty('user')
                        ?
                            subscripters.user.map((u, index) => {
                                let user = new CUser(u.userInfo);
                                return (
                                        <View style={{ flexDirection : 'row', paddingLeft : 0, paddingRight : 10, paddingVertical:  0, marinRight : '2.5%', marginTop : index === 0 ? 20 : 0 }} key={index}>   
                                                <View style={{flexDirection : 'row', width : '70%', marginTop : 5, marginBottom : 2, padding : 1, justifyContent : 'space-between'}}>
                                                        <View style={{height : 40, width : 40, borderWith : 0, borderColor : 'white', borderRadius : 20, backgroundColor : setColor(''), marginLeft : 10,  marginTop :5, marginBottom : 5, alignItems : 'center', justifyContent : 'center'}}  >
                                                        {user.getAvatar() == null 
                                                        ?
                                                            <Text style={setFont('400', 16, 'white', 'Regular')}>{user.getFirstName().charAt(0)}.{user.getLastName().charAt(0)}.</Text>
                                                            : 
                                                            <Image style={{width: 40, height: 40, borderWidth : 0, borderRadius : 20, borderColor : 'white'}} source={{uri : user.getAvatar() }} />
                                                        }
                                                        </View>
                                                        <View style={{flex : 1, borderWidth : 0, marginLeft : 10, marginTop : 3, marginRight : 5}}>
                                                            <Text style={setFont('300', 14, 'black', 'Regular')}>
                                                            {user.getName()} 
                                                            </Text>
                                                            <Text style={setFont('300', 12, 'gray', 'Regular')}>
                                                            {user.getCompany()}
                                                            </Text>
                                                        </View>
                                                </View>

                                                <View style={{width : '30%', justifyContent : 'center', alignItems : 'center', borderWidth : 0}}>
                                                       <Text>{currencyFormatDE(subscripters.subscription[index])}</Text>
                                                </View>
                                        </View>
                                )
                            })


                        : null
                     :
                        <View style={{ flexDirection : 'row', paddingLeft : 0, paddingRight : 10, paddingVertical:  3, marinRight : '2.5%' }} >   
                                        <View style={{flexDirection : 'row', width : '70%', marginTop : 5, marginBottom : 2, padding : 1, justifyContent : 'space-between'}}>
                                                <View style={{height : 40, width : 40, borderWith : 0, borderColor : 'white', borderRadius : 20, backgroundColor : setColor(''), marginLeft : 10,  marginTop :5, marginBottom : 5, alignItems : 'center', justifyContent : 'center'}}  >
                                                {requester.getAvatar() == null 
                                                ?
                                                    <Text style={setFont('400', 16, 'white', 'Regular')}>{requester.getFirstName().charAt(0)}.{requester.getLastName().charAt(0)}.</Text>
                                                    : 
                                                    <Image style={{width: 40, height: 40, borderWidth : 0, borderRadius : 20, borderColor : 'white'}} source={{uri : requester.getAvatar() }} />
                                                }
                                                </View>
                                                <View style={{flex : 1, borderWidth : 0, marginLeft : 10, marginTop : 3, marginRight : 5}}>
                                                    <Text style={setFont('300', 14, 'black', 'Regular')}>
                                                    {requester.getName()} 
                                                    </Text>
                                                    <Text style={setFont('300', 12, 'gray', 'Regular')}>
                                                    {requester.getCompany()}
                                                    </Text>
                                                </View>
                                        </View>

                                        <View style={{width : '30%', justifyContent : 'center', alignItems : 'center', borderWidth : 0}}>
                                                <Image style={{ borderWidth : 0, height : 50, width : 50}} source={{uri : requesterOrg.logoUrl}} resizeMode={'cover'} />
                                        </View>
                        </View>
                    }




                    {ticket.isMine(user)
                    ?
                        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderWidth : 0, paddingRight : 0.025*getConstant('width'),paddingLeft : 0.025*getConstant('width'), marginTop : 20, backgroundColor: 'white'}}>
                            <View style={{flex: 0.4}}>
                                <Text style={[setFont('500', 20, 'black', 'Bold'), {textAlign: 'center'}]}>{ticket.getUnsolvedStep()}</Text>
                            </View>
                            <View style={{flex: 0.2, borderWidth : 0, alignItems: 'center', justifyContent: 'center'}}>
                                <MaterialCommunityIcons name={'fast-forward'} size={50} color={'gainsboro'} style={{transform: [{ rotate: '90deg'}]}} />
                            </View>
                            <View style={{flex: 0.4}}>
                                <Text style={[setFont('500', 20, 'lightgray', 'Regular'), {textAlign: 'center'}]}>{ticket.getSolvedStep()}</Text>
                            </View>
                        </View>
                    :   ticket.getFrDueBy() <  Date.now()
                        ?
                            <TouchableOpacity style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderWidth : 0, padding :10,  marginTop : 20, backgroundColor: 'orange'}}
                                                onPress={() => handleIndexChange(1)}
                            >
                                <Text style={[setFont('500', 20, 'white', 'Regular'), {textAlign: 'center'}]}>Attente d'une décision de {requester.getName()}</Text>
                                <MaterialIcons name={'chat'} size={35} color={'white'}/>
                            </TouchableOpacity>
                        : null
                            
                    }
        
                    <View style={{ justifyContent: 'center', alignItems: 'flex-start', borderWidth : 0, marginRight : '5%', marginLeft : '5%', marginTop : 20}}>
                        <Text style={setFont('500', 16, 'black')}>{ticket.getMessage()}</Text>
                    </View>
        
                    <TouchableOpacity style={{alignItems: 'center', marginTop : 20, borderWidth : 0}}
                                    onPress={() => {
                                        navigate('FLAutocallDetailHome', {
                                            autocall: ticket.getProduct(),
                                            isEditable : false,
                                        });
                                    }}
                    >
                        <FLTemplateAutocall autocall={ticket.getProduct()} screenWidth={1} templateType={TEMPLATE_TYPE.AUTOCALL_TICKET_TEMPLATE} isEditable={false} nominal={ticket.getNominal()} />
                    </TouchableOpacity>
                    
                    <View style={{height : 100}} />           
        </ScrollView> 
        )
}




