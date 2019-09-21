import React from 'react'
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, StyleSheet,TextInput, Alert, KeyboardAvoidingView} from 'react-native'
import { Icon, Button, Input} from 'native-base'
import Moment from 'moment';
import localization from 'moment/locale/fr'

import { globalStyle } from '../../Styles/globalStyle'
import { FontAwesome } from '@expo/vector-icons';

import { ssCreateStructuredProduct } from '../../API/APIAWS';

import { tabBackgroundColor, FLFontFamily } from '../../Styles/globalStyle';

import FLPanel from '../commons/FLPanel';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import Numeral from 'numeral'
import 'numeral/locales/fr'

import StepIndicator from 'react-native-step-indicator';

import Dimensions from 'Dimensions';

import * as TICKET_TYPE from '../../constants/ticket'
import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


const labels = ["Demande prix","Prix ferme","Ordre envoyé","Infos dépositaires","Traité", "Fiches produits ok", "Confirmé"];


class FLTicketPS extends React.Component {
    
    constructor(props) {
      super(props);
  
      this.item = this.props.navigation.getParam('item', '...');
      this.ticketType =  this.props.navigation.getParam('ticketType', '...');

      //recuperation du nom du produit
      this.productName = STRUCTUREDPRODUCTS.filter(obj => obj.id === this.item['data'].product)[0];
      //recuperation de la liste des sous-jacents
      let underlyings = this.props.allInfo.categories.filter(({codeCategory}) => codeCategory === 'PS')[0].subCategory;
      this.underlying = underlyings[underlyings.findIndex(udl => udl.underlyingCode === this.item['data'].underlying)].subCategoryName;
      //recuperation de la maturite
      this.maturity = '[MTY]';
      if (this.item['data'].hasOwnProperty('maturity')) {
        this.maturity = this.item['data'].maturity.substring(0,this.item['data'].maturity.length-1)
        let ans = " ans";
        if (this.maturity <= 1) {
          ans = " an";
        } 
        this.maturity = this.maturity + ans;
      }

      

      this.state = {
        nominal : 0,

        //barre de progression des statuts du ticket
        stepLabels : [],

        toto: true,
      }

    }

    componentDidMount () {

    }

    static navigationOptions = ({ navigation }) => {
    //static navigationOptions = {
      let item = navigation.getParam('item', '...');
      let productName = STRUCTUREDPRODUCTS.filter(obj => obj.id === item['data'].product)[0];
 
      const { params } = navigation.state;
      return {
      header: (
        <SafeAreaView style={globalStyle.header_safeviewarea}>
          {/*<View style={[globalStyle.header_left_view, {flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}]} >*/}
          <View style={globalStyle.header_left_view} >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name='ios-arrow-round-back' size={40} style={globalStyle.header_icon} />
              </TouchableOpacity>
              {/*<TouchableOpacity onPress={() => alert("Prochainement clone de l'opé")}>
                <FontAwesome name="clone" size={25} style={globalStyle.header_icon}/> 
                </TouchableOpacity>*/}
          </View>
          <View style={globalStyle.header_center_view} >
            <Text style={globalStyle.header_center_text_medium}>{productName.name}</Text>
          </View>
          <View style={globalStyle.header_right_view} >
     
            <Icon name='ios-menu' size={40} style={globalStyle.header_icon} />

          </View>
        </SafeAreaView>
      )
      }
    }

    /*createStructuredProduct() {
      if (isNaN(this.state.nominal)) {
        alert('Le nominal doit être un nombre');
        return;
      }
      this.freshProduct['cf_ps_nominal'] = this.state.nominal;
      this.props.firebase.doGetIdToken()
      .then(token => {
        console.log("REPONSE ID TOKEN"+token);


        ssCreateStructuredProduct(token, this.freshProduct)
        .then((data) => {
          //console.log("USER CREE AVEC SUCCES DANS ZOHO");
          
          console.log("SUCCES CREATION TICKET");
          //this.onRegisterSuccess();
        })
        .catch(error => {
          console.log("ERREUR CREATION TICKET: " + error);
          alert('ERREUR CREATION DE TICKET', '' + error);
        }) 
      });
    }*/





    render() {
      let stepIndicator  = this.ticketType !== TICKET_TYPE.PSCREATION ?
                          <TouchableOpacity  style={{borderLeftWidth : 1, alignItems : 'center', justifyContent: 'flex-start', paddingLeft : 3, paddingRight: 3}}
                              onPress={() => this.setState({stepLabels : this.state.stepLabels.length === 0 ? labels: []})}
                          >
                            <StepIndicator
                                  customStyles={{
                                  stepIndicatorSize: 25,
                                  currentStepIndicatorSize:30,
                                  separatorStrokeWidth: 2,
                                  currentStepStrokeWidth: 3,
                                  stepStrokeCurrentColor: '#85B3D3',
                                  stepStrokeWidth: 3,
                                  stepStrokeFinishedColor: '#85B3D3',
                                  stepStrokeUnFinishedColor: '#aaaaaa',
                                  separatorFinishedColor: '#85B3D3',
                                  separatorUnFinishedColor: '#aaaaaa',
                                  stepIndicatorFinishedColor: '#85B3D3',
                                  stepIndicatorUnFinishedColor: '#ffffff',
                                  stepIndicatorCurrentColor: '#ffffff',
                                  stepIndicatorLabelFontSize: 13,
                                  currentStepIndicatorLabelFontSize: 13,
                                  stepIndicatorLabelCurrentColor: '#85B3D3',
                                  stepIndicatorLabelFinishedColor: '#ffffff',
                                  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
                                  labelColor: '#999999',
                                  labelSize: 12,
                                  currentStepLabelColor: '#85B3D3'
                                  }}
                                  currentPosition={3}
                                  stepCount={labels.length}
                                  labels={this.state.stepLabels}
                                  direction={"vertical"}
                                  onPress={() => this.setState({stepLabels : this.state.stepLabels.length === 0 ? labels: []})}
                              />
                            </TouchableOpacity>
                          : null;
      return(
        <View style={{flex:1 ,flexDirection:'row', justifyContent:'center',alignItems:'flex-start'}}>

          <ScrollView style={{flex: 1, flexDirection: 'column',borderWidth: 0}}>
       
                <View style={{  flexDirection: 'row', marginTop : 15, marginRight : 0.05*DEVICE_WIDTH, marginLeft : 0.05*DEVICE_WIDTH, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                  <View style={{flex: 0.65}}>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', margin: 1}}
                                        onPress={() => {         
                                          let favoriteToSend = JSON.parse(JSON.stringify(this.item));
                                               
                                          favoriteToSend.toFavorites.active = !favoriteToSend.toFavorites.active;
                                          favoriteToSend.isFavorite = !favoriteToSend.isFavorite ;

                                          this.props.setFavorite(favoriteToSend)
                                          .then((fav) => {
                                            this.item = fav;
                                            //this.item.isFavorite = !this.item.isFavorite;
                                            this.setState({ toto: !this.state.toto })
                                          })
                                          .catch((error) => console.log("Erreur de mise en favori : " + error));
                                        }}
                      >
                         <Icon  size={5} style={{ color : 'darkred'}} name={this.item.isFavorite ? 'ios-star' : 'ios-star-outline'} />
                      </TouchableOpacity>
                      <View>
                        <Text style={{paddingLeft:10, fontSize: 18, fontWeight: '300', fontFamily : 'FLFontFamily', textAlign: 'left'}}>
                          {this.productName.name} {this.maturity}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.textProperty}>
                      {'\n'}
                      Sous-jacent : {this.underlying}{'\n'}
                      Devise : {this.item['data'].currency}
                    </Text>
                  </View>

                  <TouchableOpacity style={{flex: 0.35, justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => {
                                      console.log("TRAITERhhgghghhghghg");
                                    }}
                  >
                    <Text style={{padding: 5, fontSize: 18, fontWeight: '700', fontFamily : 'FLFontFamily', textAlign: 'center', backgroundColor: tabBackgroundColor}}>
                      TRAITER
                    </Text>
                    <Text style={{marginTop : 15, fontFamily: FLFontFamily, fontWeight:'500', fontSize: 20, color: 'limegreen'}}> 
                    
                       {Numeral(this.item['data'].coupon).format('0.00%')}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={{  flexDirection: 'row', marginRight : 0.05*DEVICE_WIDTH, marginLeft : 0.05*DEVICE_WIDTH, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                  <View style={{flex: 0.65}}>
                  </View>
                  <TouchableOpacity style={{flex: 0.35, justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => {
                                      console.log("Modif UF");
                                    }}
                  >
                    <Text style={{padding: 5, fontSize: 12, fontWeight: '700', fontFamily : 'FLFontFamily', textAlign: 'center', backgroundColor: 'pink'}}>
                      3,2%
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={{ flexDirection:'column', marginRight : 0.05*DEVICE_WIDTH, marginLeft : 0.05*DEVICE_WIDTH, borderWidth: 1, marginTop: 10}}>
                    <View style={{borderBottomColor: 'black', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 5}}>
                      <Text>DATES IMPORTANTES</Text>
                    </View>
                    <View style={{padding : 5}}>
                      <Text style={styles.textProperty}>
                        Date de striking : {Moment(this.item['data'].date, "YYYYMMDD").locale('fr',localization).format('ll')}{'\n'}
                        Date de constation finale : {Moment(this.item['data'].finaldate, "YYYYMMDD").locale('fr',localization).format('ll')}{'\n\n'}
                        Date d'émission : {Moment(this.item['data'].startdate, "YYYYMMDD").locale('fr',localization).format('ll')}{'\n'}
                        Date de remboursement : {Moment(this.item['data'].enddate, "YYYYMMDD").locale('fr',localization).format('ll')}{'\n'}
                      </Text>
                    </View>       
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center'}}>
               
                    <Text>Niveau de rappel : {this.item['data'].levelAutocall}</Text>
                    <Text>Dégressivité des niveaux de rappel : {this.item['data'].degressiveStep}</Text>
                    <Text>Coupon de rappel incrémental : {this.item['data'].isIncremental}</Text>
                    <Text>Fréquence des rappels : {this.item['data'].freqAutocall}</Text>
                    <Text>Date premier rappel : {this.item['data'].noCallNbPeriod}</Text>
                    <Text>Coupon de rappel : {this.item['data'].couponAutocall}</Text>
                    <Text>Niveau airbag : {this.item['data'].airbagLevel}</Text>
                    <Text>Barriere de Phoenix : {this.item['data'].barrierPhoenix}</Text>
                    <Text>Fréquence de Phoenix : {this.item['data'].freqPhoenix}</Text>
                    <Text>Coupon phoenix :  : {this.item['data'].couponPhoenix}</Text>
                    <Text>Coupon mémoire :  : {this.item['data'].isMemory}</Text>
                    <Text>Protection du capital : {this.item['data'].barrierPDI}</Text>
                    <Text>Type de protection : {this.item['data'].isPDIUS}</Text>
                    <Text>Marge totale : 3%</Text>

             </View>
           </ScrollView>     
           {stepIndicator}
        </View>
      );
      }
}

const styles = StyleSheet.create({
  textProperty: {
    fontSize: 16, 
    fontWeight: '300', 
    fontFamily : 'FLFontFamily', 
    textAlign: 'left'
  },
});

const condition = authUser => !!authUser;
const composedStructuredProductDetail = compose(
 withAuthorization(condition),
  withNavigation,
  withUser
);

//export default HomeScreen;
export default hoistStatics(composedStructuredProductDetail)(FLTicketPS);


/*



          */