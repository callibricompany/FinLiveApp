import React from 'react'
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, StyleSheet, Platform, 
  TextInput, Modal, KeyboardAvoidingView, Keyboard, ActivityIndicator} from 'react-native'
import { Icon, Button, Input} from 'native-base'
import Moment from 'moment';
import localization from 'moment/locale/fr'

import { globalStyle } from '../../Styles/globalStyle'
import { FontAwesome } from '@expo/vector-icons';

import { ssCreateStructuredProduct } from '../../API/APIAWS';

import { tabBackgroundColor, FLFontFamily, generalFontColor, subscribeColor,
          headerTabColor } from '../../Styles/globalStyle';


import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withUser } from '../../Session/withAuthentication';
import { compose, hoistStatics } from 'recompose';

import Numeral from 'numeral'
import 'numeral/locales/fr'


import { ifIphoneX, ifAndroid, sizeByDevice, currencyFormatDE, isEqual} from '../../Utils';
import Dimensions from 'Dimensions';

import * as TICKET_TYPE from '../../constants/ticket'
import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json';
import FREQUENCYLIST from '../../Data/frequencyList.json'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

import { CAutocall } from '../../Classes/Products/CAutocall';




class FLAutocallDetail extends React.Component {
    
    constructor(props) {
      super(props);
  
      this.item = this.props.navigation.getParam('item', '...');

      if (!this.item['data'].hasOwnProperty('cf_cpg_choice')){
        this.item['cf_cpg_choice'] = 'Placement privé';
      }

      
      //this.ticketType =  this.props.navigation.getParam('ticketType', '...');
      console.log(this.item);

      //l'objet autocall Classe
      this.autocall = new CAutocall(this.item['data']);

      //recuperation du nom du produit
      //this.productName = STRUCTUREDPRODUCTS.filter(obj => obj.id === this.item['data'].product)[0];

      //recuperation de la liste des sous-jacents
      let underlyings = this.props.categories.filter(({codeCategory}) => codeCategory === 'PS')[0].subCategory;
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

      //phoenix
      this.isPhoenix = this.item["data"].barrierPhoenix === 1 ? false : true;



      //determination des dates et des niveaux d'zutocall
      this.callableDatas = [];
      let freq = FREQUENCYLIST.filter(({id}) => id === this.item['data'].freqAutocall)[0];
      let mat = Number(this.item['data'].maturity.substring(0,this.item['data'].maturity.length-1))*12;
      let numberOfDates = mat / freq.freq;
      let numberWithNoCall = this.item['data'].noCallNbPeriod / freq.freq;
      
      //console.log("Nombres de dates : " +numberOfDates + "  -  Nombre NNCall : " + numberWithNoCall);
      let obj = {};
      let ds = Number(this.item['data'].degressiveStep);
      let currentYear = 0;
      let incrementalMultiplier = 1;
      for (let i = numberWithNoCall; i <= numberOfDates; i++) {
        currentYear = Math.trunc(12* i / freq.freq);
        obj = {};
        d = Moment(this.item['data'].date, "YYYYMMDD").add(i * freq.freq, 'months');
        obj["date"] = d;
        obj["level"] = Number(this.item['data'].levelAutocall) - currentYear * ds/100;
        if (i === numberOfDates-1 ) {
          obj["level"] = Math.min(obj["level"], Number(this.item["data"].airbagLevel))
        }
        incrementalMultiplier = this.item["data"].isIncremental ? currentYear : 1;
        obj["coupon"] = this.isPhoenix ? 0 : incrementalMultiplier * Number(this.item['data'].coupon)*freq.freq/12;
        
        this.callableDatas.push(obj);
      }
      
      //determination des dates et des niveaux de phoenix
      this.phoenixDatas = [];
      if (this.isPhoenix){
            
          let freq = FREQUENCYLIST.filter(({id}) => id === this.item['data'].freqPhoenix)[0];
          let mat = Number(this.item['data'].maturity.substring(0,this.item['data'].maturity.length-1))*12;
          let numberOfDates = mat / freq.freq;
        
          let obj = {};
          let currentYear = 0;
          let incrementalMultiplier = 1;
          for (let i = 0; i < numberOfDates; i++) {
            currentYear = Math.trunc(i / freq.freq);
            obj = {};
            d = Moment(this.item['data'].date, "YYYYMMDD").add(i * freq.freq, 'months');
            obj["date"] = d;
            obj["level"] = Number(this.item['data'].barrierPhoenix);
            obj["coupon"] = Number(this.item['data'].coupon)*freq.freq/12;
            
            this.phoenixDatas.push(obj);
          }
      }
      this.state = {

        //barre de progression des statuts du ticket
        stepLabels : [],
        //nominal
        nominal : 0,


        //affchage du modal description avant traiter
        showModalDescription : false,


        toto: true,
      }

    }

    componentDidMount () {

    }

    static navigationOptions = ({ navigation }) => {
    //static navigationOptions = {
      let item = navigation.getParam('item', '...');
      //let productName = STRUCTUREDPRODUCTS.filter(obj => obj.id === item['data'].product)[0];
 
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
            <Text style={globalStyle.header_center_text_medium}>Création d'une demande</Text>
          </View>
          <View style={globalStyle.header_right_view} >
            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}} onPress={() => navigation.goBack()}>
             <Icon name='ios-notifications-outline' size={40} style={[globalStyle.header_icon, {paddingRight : 10}]}/>
             </TouchableOpacity>

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
      
    }*/

 

    //determine la frequence du produit
    _getFrequencyName() {

        name = this.item['data'].freqAutocall;
        let freq = FREQUENCYLIST.filter(({id}) => id === name);
        if (freq.length !== 0) {
          name = "Rappels "+ freq[0].name +"s";
        }


        return name;
    }

   
    //coupons si Phoenix
    _getCouponPhoenixBloc() {
      let coupons = <View><View style={{backgroundColor: tabBackgroundColor, borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 5}}>
        <Text style={{color: 'white'}}>COUPONS</Text>

      </View>
      <View style={{flexDirection : 'row', borderBottomWidth: 1, padding: 3}}>
        <Text style={{fontSize: 12, textAlign: 'justify'}}>
            {!this.isPhoenix ? 'Si à une date ci-dessous, le niveau du sous-jacent est supérieur ou égal au niveau de rappel alors le coupon de rappel est payé et le produit s\'arrête.' 
                              : 'Si à une date ci-dessous, le niveau du sous-jacent est supérieur ou égal au niveau de rappel le produit s\'arrête.'}
        </Text>
      </View>
      <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
        <View style={{flex: 0.33, backgroundColor: 'aliceblue'}}>
          <Text style={[styles.textProperty, {textAlign: 'center', textAlignVertical: 'center'}]}>
            DATE
          </Text>

        </View>
        <View style={{flex: 0.33,  borderLeftWidth: 1, backgroundColor: 'aliceblue'}}>
          <Text style={[styles.textProperty, {textAlign: 'center', textAlignVertical: 'center'}]}>
          NIVEAU
          </Text>
        </View>
        <View style={{flex: 0.33,  borderLeftWidth: 1, backgroundColor: 'aliceblue'}}>
        <Text style={[styles.textProperty, {textAlign: 'center', textAlignVertical: 'center'}]}>
          COUPON
          </Text>
        </View>
      </View>
      </View>
      
  
       return (
         <View>{coupons}
         {    this.phoenixDatas.map((obj, i) => {
            //console.log(i +"  :  "+obj);
            
           
              return (<View key={i} style={{flexDirection : 'row', borderBottomWidth: i === this.phoenixDatas.length - 1 ? 2 : 1}}>
                <View style={{flex: 0.33}}>
                  <Text style={[styles.textProperty, {textAlign: 'center'}]}>
                    {obj["date"].locale('fr',localization).format('ll')}
                  </Text>

                </View>
                <View style={{flex: 0.33,  borderLeftWidth: 1}}>
                  <Text style={[styles.textProperty, {textAlign: 'center'}]}>
                  {Numeral(obj['level']).format('0%')}
                  </Text>
                </View>
                <View style={{flex: 0.33,  borderLeftWidth: 1}}>
                  <Text style={[styles.textProperty, {textAlign: 'center'}]}>
                    {Numeral(obj['coupon']).format('0.00%')}
                  </Text>
                </View>
            </View>)
          
          //coupons = coupons + ech;
          })}
         </View>
       );
    }

    render() {
      //check if it is in favorites
      let isFavorite = false;
      this.props.favorites.forEach((fav) => {
        if (isEqual(fav.data, this.item.data)) {
          //isFavorite = this.item.isFavorite && this.item.toFavorites.active;
          isFavorite = true;
        }
      });
      //remise a jour de l'objet item en fonction de ce qui a été trouve dans favorites
      this.item.isFavorite = isFavorite;
      this.item.toFavorites.active = isFavorite;

      if (this.state.isLoading) {
        return (
            <View style={globalStyle.loading}>
              <ActivityIndicator size='large' />
            </View>
          );
      }

      return(
        <View opacity={this.state.showModalDescription ? 0.3 : 1} style={{flex:1 , flexDirection: 'column', marginTop : 20, backgroundColor: globalStyle.bgColor, width: DEVICE_WIDTH, justifyContent: 'center', alignItems: 'center'}}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showModalDescription}
            onRequestClose={() => {
              console.log('Modal has been closed');
            }
            }>
            <View 
              style={{flex:1, backgroundColor:'transparent'}} 
              onStartShouldSetResponder={() => true}
              //onStartShouldSetResponderCapture={() => true}
              //onMoveShouldSetResponderCapture={() => true}
              //onMoveShouldSetResponder={() => true}
              onResponderRelease={(evt) =>{
                let x = evt.nativeEvent.pageX;
                let y = evt.nativeEvent.pageY;
                //si on a clické en dehors du module view cidessous on ferme le modal
                let verifX = x < DEVICE_WIDTH*0.1  || x > DEVICE_WIDTH*0.9 ? true : false;
                let verifY = y < DEVICE_HEIGHT*0.15  || y > DEVICE_HEIGHT*0.55 ?true : false;
                if (verifX || verifY) {
                  this.setState({showModalDescription : false})
                }
              }}

            >
              <View 
                //directionalLockEnabled={true} 
                //contentContainerStyle={{
                  style={{
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    borderWidth :1,
                    borderColor : headerTabColor,
                    //borderRadius:10,
                    width: DEVICE_WIDTH*0.8,
                    height: DEVICE_HEIGHT*0.4,
                    top:  DEVICE_HEIGHT*0.15,
                    left : DEVICE_WIDTH*0.1,

                }}
              >


                <View style={{flex:0.2, backgroundColor: tabBackgroundColor, alignItems:'center', justifyContent: 'center'}}>
                    <Text style={{color: 'white' ,fontFamily: FLFontFamily, fontWeight: '500', fontSize: 14}}>INSTRUCTIONS DE COTATION</Text>
                </View>
                <View style={{flex:0.6, backgroundColor: globalStyle.bgColor, alignItems:'flex-start', justifyContent: 'flex-start'}}>
                    <Text style={{fontFamily: FLFontFamily, fontWeight: '300', fontSize: 12, padding: 10}}>Ajoutez vos instructions spéciales relatives à la confirmation du prix auprès des émetteurs :</Text>
                    <View style={{backgroundColor: globalStyle.bgColor, borderWidth :0}}>
                      <TextInput  style={{color: 'black', textAlignVertical:'top', backgroundColor: 'white' , margin : 10, padding: 5, borderWidth :1, borderRadius: 2,width: DEVICE_WIDTH*0.8-20, height: DEVICE_HEIGHT*0.15}}
                                multiline={true}
                                numberOfLines={5}
                                placeholder={'Vos instructions...'}
                                onChangeText={(e) => this.item['data'].description = e}
                                value={this.item['data'].description}
                                returnKeyType={'done'}
                                onSubmitEditing={() => Keyboard.dismiss()}
                       />
                    </View>
                </View>
                <View style={{flex:0.2, alignItems:'center', justifyContent: 'center'}}>
                  <TouchableOpacity style={{backgroundColor: subscribeColor}}
                                    onPress={() => {
                                      //on envoie le ticket 
                                      this.setState({ isLoading : true });
                                      this.props.firebase.doGetIdToken()
                                      .then(token => {
                                      
                                        let productToSend = JSON.parse(JSON.stringify(this.item['data']));
                                        productToSend['subject'] = this.autocall.getProductName()  + " " + this.maturity + " sur " + this.underlying + " / "  + this._getFrequencyName().toLowerCase();
                                        //productToSend['description'] = "C'est pour mon client le plus important";
                                        productToSend['type'] = 'Produit structuré';
                                        productToSend['department'] = 'FIN';
                                        productToSend['nominal'] = Number(this.state.nominal);
                                        //productToSend['cf_cpg_choice'] = "Appel public à l'épargne";
                                        //productToSend['cf_step_ape'] = "APEESRP";
                                        productToSend['cf_cpg_choice'] = "Placement Privé";
                                        productToSend['cf_step_pp'] = "PPDCC";
                                        //productToSend['UF'] = 0.03;
                                        //productToSend['UFAsso'] =0.001;
                                        console.log(productToSend);
                                        ssCreateStructuredProduct(token, productToSend)
                                        .then((data) => {
                                          //console.log("USER CREE AVEC SUCCES DANS ZOHO");
                                          
                                          console.log("SUCCES CREATION TICKET");
                                          console.log(data.data);
                                          this.props.addTicket(data.data);
                                          console.log("TICKET AJOUTE");
                                          this.setState({ isLoading : true , showModalDescription : false}, () => this.props.navigation.navigate('Tickets'));
                                        })
                                        .catch(error => {
                                          console.log("ERREUR CREATION TICKET: " + error);
                                          this.setState({ isLoading : true , showModalDescription : false}, () => alert('ERREUR CREATION DE TICKET', '' + error));
                                          
                                        }) 
                                      })
                                      .catch((error) => {
                                        this.setState({ isLoading : true , showModalDescription : false}, () => alert(error));
                                      });
                                    }}
                  >
                     <Text style={{color: 'white' , margin : 5}}>ENVOYER LA DEMANDE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
        </Modal>
      
  
          <View style={{flexDirection : 'row', backgroundColor: tabBackgroundColor, width : DEVICE_WIDTH*0.925}}>
                <TouchableOpacity style={{flex : 0.10, justifyContent: 'center', alignItems: 'center', margin: 1}}
                                  onPress={() => {
                                    this.props.setFavorite(this.item)
                                    .then((fav) => {
                                      this.item = fav;                                    

                                    })
                                    .catch((error) => console.log("Erreur de mise en favori : " + error));
                                  }}
                >
                  <Icon  size={5} style={{ color : 'darkred'}} name={isFavorite ? 'ios-star' : 'ios-star-outline'} />
                </TouchableOpacity>
                
                <View style={{borderWidth:0, flex: 0.75, marginTop: Platform.OS === 'ios' ? -2 : -5, justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Text style={{paddingTop: 2, fontFamily: FLFontFamily, fontWeight: '400', fontSize: 14, color: generalFontColor}}>
                          {this.autocall.getProductName()}  {this.maturity}
                        </Text>
                        <Text style={{fontFamily: FLFontFamily, fontWeight: '400', fontSize: 14, color: generalFontColor}}>
                          {this.underlying}  / {this._getFrequencyName().toLowerCase()}
                        </Text>
                </View>

                <TouchableOpacity style={{flex: 0.15, backgroundColor : tabBackgroundColor,justifyContent: 'center', alignItems: 'center'}} 
                      onPress={() => {
                          alert("On va revenir sur le produit");
                
                      }
                }>
                  <FontAwesome name={"gears"}  size={30} style={{color : "white"}}/> 
                      {/*<Text style={{fontFamily:  FLFontFamily, fontWeight: '300', fontSize: Platform.OS === 'ios' ? ifIphoneX() ?  16 : 14 : 16, color: generalFontColor}}>
                        MODIFIER
              </Text>*/}
                </TouchableOpacity>

           </View>
         
           <View style={{flexDirection : 'row', width : DEVICE_WIDTH*0.925, marginTop : 15}}>
                <View style={{flex: 0.6}}>
                  <TextInput 
                          style={{    
                                    display: 'flex',
                                    fontSize: 15,
                                    color: 'black',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    padding: 5,
                                    //textAlign: this.state.nominal === 0 ? 'left' : 'right',
                                    textAlign: 'right',
                                  }}
                          placeholder={this.item['data'].currency}
                          placeholderTextColor={'lightgray'}
                          underlineColorAndroid={'#fff'}
                          autoCorrect={false}
                          keyboardType={'numeric'}
                          returnKeyType={'done'}
                          onFocus={() => {
                            
                          }}
                          //value={currencyFormatDE(Number(this.state.nominal),0).toString()}
                          value={this.state.nominal === 0 ? '' : currencyFormatDE(Number(this.state.nominal),0)}
                          ref={(inputNominal) => {
                            this.inputNominal = inputNominal;
                          }}
                          onChangeText={e => {
                            //console.log(Number(e));
                            this.setState({ nominal : e === '' ? 0 : Numeral(e).value()  });
                            ;
                          }}
                  />
                </View>
                <TouchableOpacity style={{ flex: 0.4, marginLeft: 5, marginRight: 5, backgroundColor: subscribeColor, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => {
                              //on verifie le nominal
                              if (Number(this.state.nominal) <= 0) {
                                alert("Merci de rentrer un nominal pour demander un prix au marché.")
                              } else {
                                this.setState({showModalDescription : true});
                              }
                      
                            }}
                >
                    <Text style={{paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, fontFamily:  FLFontFamily, fontWeight: '600', fontSize: 18, color: generalFontColor}}>
                      TRAITER
                    </Text>
                </TouchableOpacity>

           </View>

           <ScrollView style={{flexDirection: 'column',borderWidth: 0, marginTop : 5, width: DEVICE_WIDTH*0.925}}>


                
                <View style={{flexDirection:'column', borderWidth: 1, marginTop: 10}}>
                    <View style={{backgroundColor: tabBackgroundColor, borderBottomColor: 'black', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 5}}>
                     <Text style={{color: 'white'}}>{this.item['data'].cf_cpg_choice.toUpperCase()}</Text>
                    </View>
                    <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                      <View style={{flex: 0.35}}>
                        <Text style={styles.textProperty}>
                          Marge
                        </Text>
                      </View>
                      <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                        <Text style={styles.textProperty}>
                        {Numeral(this.item['data'].UF).format('0.00%')} <Text style={{fontSize: 10}}>{this.state.nominal !== 0 ? " ("+currencyFormatDE(Number(this.item['data'].UF)*Number(this.state.nominal),0) + " EUR)" : null}
                        </Text></Text>
                      </View>
                    </View>
                    <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                      <View style={{flex: 0.35}}>
                        <Text style={styles.textProperty}>
                          Pour mes associations
                        </Text>
                      </View>
                      <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                        <Text style={styles.textProperty}>
                        {Numeral(this.item['data'].UFAssoc).format('0.00%')} <Text style={{fontSize: 10}}>{this.state.nominal !== 0 ? " ("+currencyFormatDE(Number(this.item['data'].UFAssoc)*Number(this.state.nominal),0) + " EUR)" : null}
                        </Text></Text>
                      </View>
                    </View>                  
                     <View style={{backgroundColor: tabBackgroundColor, borderBottomColor: 'black', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 5}}>
                     <Text style={{color: 'white'}}>{String('coupon annualisé').toUpperCase()}</Text>
                    </View>
                    <View style={{padding : 5, borderBottomWidth:2}}>
                      <Text style={{fontFamily: FLFontFamily, fontWeight:'500', fontSize: 20, color: 'limegreen', textAlign: 'center'}}>
                          {Numeral(this.item['data'].coupon).format('0.00%')}
                      </Text>
                    </View>    
                    <View style={{backgroundColor: tabBackgroundColor, borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 5}}>
                      <Text style={{color: 'white'}}>DATES IMPORTANTES</Text>
                    </View>
                    <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                      <View style={{flex: 0.35}}>
                        <Text style={styles.textProperty}>
                          Date de striking
                        </Text>
                      </View>
                      <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                        <Text style={styles.textProperty}>
                         {Moment(this.item['data'].date, "YYYYMMDD").locale('fr',localization).format('ll')}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                      <View style={{flex: 0.35}}>
                        <Text style={styles.textProperty}>
                         Date de constation finale 
                        </Text>
                      </View>
                      <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                        <Text style={styles.textProperty}>
                        {Moment(this.item['data'].finaldate, "YYYYMMDD").locale('fr',localization).format('ll')}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                      <View style={{flex: 0.35}}>
                        <Text style={styles.textProperty}>
                        Date d'émission 
                        </Text>
                      </View>
                      <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                        <Text style={styles.textProperty}>
                         {Moment(this.item['data'].startdate, "YYYYMMDD").locale('fr',localization).format('ll')}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection : 'row', borderBottomWidth: 2}}>
                      <View style={{flex: 0.35}}>
                        <Text style={styles.textProperty}>
                        Date de remboursement
                        </Text>
                      </View>
                      <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                        <Text style={styles.textProperty}>
                         {Moment(this.item['data'].enddate, "YYYYMMDD").locale('fr',localization).format('ll')}
                        </Text>
                      </View>
                    </View>   
                    <View style={{backgroundColor: tabBackgroundColor, borderBottomColor: 'black', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 5}}>
                     <Text style={{color: 'white'}}>SOUS-JACENT</Text>
                    </View>
                    <View style={{padding : 5, borderBottomWidth:2}}>
                      <Text style={{fontFamily: FLFontFamily, fontWeight:'300', fontSize: 16, textAlign: 'center'}}>
                          {this.underlying} (code : {this.item['data'].underlying})
                      </Text>
                    </View>   
                    <View style={{backgroundColor: tabBackgroundColor, borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 5}}>
                      <Text style={{color: 'white'}}>PROTECTION DU CAPITAL</Text>
                    </View>
                    <View style={{borderBottomWidth: 1, padding: 3}}>
                        <Text style={{fontSize: 12, textAlign: 'justify'}}>
                           100% de votre capital est protégé jusqu'à ce que le sous-jacent atteigne le niveau de protection. En-dessous, votre capital remboursé sera amputé de l'éventuelle baisse du sous-jacent à l'échéance.
                        </Text>
                    </View>
                    <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                      <View style={{flex: 0.35}}>
                        <Text style={styles.textProperty}>
                          Niveau de protection
                        </Text>
                      </View>
                      <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                        <Text style={styles.textProperty}>
                          {Numeral(this.item['data'].barrierPDI).format('0.00%')}
                        </Text>
                      </View>
                    </View>
                    <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                      <View style={{flex: 0.35}}>
                        <Text style={styles.textProperty}>
                          Désactivation de la protection
                        </Text>
                      </View>
                      <View style={{flex: 0.65,  borderLeftWidth: 1}}>
                        <Text style={[styles.textProperty, {fontSize: 14}]}>
                          {this.item['data'].isPDIUS ? 'A tout moment' : 'Déterminé par le cours de clotûre du dernier jour'}
                        </Text>
                      </View>
                    </View>
                    <View style={{backgroundColor: tabBackgroundColor, borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 5}}>
                      <Text style={{color: 'white'}}>RAPPELS</Text>
    
                    </View>
                    <View style={{flexDirection : 'row', borderBottomWidth: 1, padding: 3}}>
                      <Text style={{fontSize: 12, textAlign: 'justify'}}>
                           {!this.isPhoenix ? 'Si à une date ci-dessous, le niveau du sous-jacent est supérieur ou égal au niveau de rappel alors le coupon de rappel est payé et le produit s\'arrête.' 
                                            : 'Si à une date ci-dessous, le niveau du sous-jacent est supérieur ou égal au niveau de rappel le produit s\'arrête.'}
                      </Text>
                    </View>
                    <View style={{flexDirection : 'row', borderBottomWidth: 1}}>
                      <View style={{flex: !this.isPhoenix ? 0.33 : 0.5, backgroundColor: 'aliceblue'}}>
                        <Text style={[styles.textProperty, {textAlign: 'center', textAlignVertical: 'center'}]}>
                           DATE
                        </Text>
  
                      </View>
                      <View style={{flex: !this.isPhoenix ? 0.33 : 0.5,  borderLeftWidth: 1, backgroundColor: 'aliceblue'}}>
                        <Text style={[styles.textProperty, {textAlign: 'center', textAlignVertical: 'center'}]}>
                        NIVEAU RAPPEL
                        </Text>
                      </View>
                      <View style={{flex: !this.isPhoenix ? 0.33 : 0,  width: this.isPhoenix ? 0 : null, borderLeftWidth: 1, backgroundColor: 'aliceblue'}}>
                       <Text style={[styles.textProperty, {textAlign: 'center', textAlignVertical: 'center'}]}>
                        COUPON
                        </Text>
                      </View>
                    </View>

                   {
                     this.callableDatas.map((obj, i) => {
                       //console.log(i +"  :  "+obj);
                       
                       return (
                        <View key={i} style={{flexDirection : 'row', borderBottomWidth: i === this.callableDatas.length - 1 ? 2 : 1}}>
                          <View style={{flex: !this.isPhoenix ? 0.33 : 0.5}}>
                            <Text style={[styles.textProperty, {textAlign: 'center'}]}>
                              {obj["date"].locale('fr',localization).format('ll')}
                            </Text>
      
                          </View>
                          <View style={{flex: !this.isPhoenix ? 0.33 : 0.5,  borderLeftWidth: 1}}>
                            <Text style={[styles.textProperty, {textAlign: 'center'}]}>
                            {Numeral(obj['level']).format('0%')}
                            </Text>
                          </View>
                          <View style={{flex: !this.isPhoenix ? 0.33 : 0,  width: this.isPhoenix ? 0 : null, borderLeftWidth: 1}}>
                            <Text style={[styles.textProperty, {textAlign: 'center'}]}>
                               {Numeral(obj['coupon']).format('0.00%')}
                            </Text>
                          </View>
                      </View>
                       );
                     })
                   }

                   {this.isPhoenix ? this._getCouponPhoenixBloc() : null}
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
  inputText: {
    display: 'flex',

    fontSize: 15,
    color: 'black',
    borderWidth: 1,
    borderRadius: 4,
    padding: 5,
    textAlign: 'right',
  },
});

const condition = authUser => !!authUser;
const composedStructuredProductDetail = compose(
 withAuthorization(condition),
  withNavigation,
  withUser
);

//export default HomeScreen;
export default hoistStatics(composedStructuredProductDetail)(FLAutocallDetail);


/*

                <View style={{  flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                  <View style={{flex: 0.65}}>
                  </View>
                  <TouchableOpacity style={{flex: 0.35, justifyContent: 'center', alignItems: 'center'}}
                                    onPress={() => {
                                      console.log("Modif UF");
                                      console.log(this.inputNominal);
                                    }}
                  >
                    <Text style={{padding: 5, fontSize: 12, fontWeight: '700', fontFamily : 'FLFontFamily', textAlign: 'center', backgroundColor: 'pink'}}>
                      3,2%
                    </Text>
                  </TouchableOpacity>
                </View>

          */