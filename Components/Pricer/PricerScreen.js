import React from 'react'
import { Modal, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image, ScrollView, Picker, StatusBar, Platform } from 'react-native'
import { ListItem, List, Left, Body, Content, Title, Item, Right, Icon, Input, Button, Thumbnail } from 'native-base'
import { TabView, TabBar, SceneMap, PagerScroll } from 'react-native-tab-view';


import { globalStyle, tabBackgroundColor, backgdColor, FLFontFamily, subscribeColor } from '../../Styles/globalStyle'

import { SearchBarProvider } from '../SearchBar/searchBarAnimation';
import SearchBarPricer from './SearchBarPricer';

import { ifIphoneX, ifAndroid } from '../../Utils';

import { maturityToDate } from '../../Utils/math'
import FLPanel from '../commons/FLPanel'


import SwipeGesture from '../../Gesture/SwipeGesture'

import TabPricer from './TabPricer';
import TabResults from './TabResults';
import TabUF from './TabUF';


import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { TextInputMask } from 'react-native-masked-text'
import Numeral from 'numeral'
import 'numeral/locales/fr'

import { VictoryBar, VictoryChart, VictoryTheme, VictoryGroup, VictoryStack } from 'victory-native'


import { UserContext } from '../../Session/UserProvider';
import FLSearchInput from '../commons/FLSearchInput';

import { withAuthorization } from '../../Session';
import { withNavigation } from 'react-navigation';
import { withFirebase } from '../../Database';
import { compose, hoistStatics } from 'recompose';

import { FLBadge } from '../commons/FLBadge'
import botImage from '../../assets/bot.png'

import { searchProducts } from '../../API/APIAWS';

import UNDERLYINGS from '../../Data/subCategories.json'
import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json'

import PARAMETERSSTRUCTUREDPRODUCT from '../../Data/optionsPricingPS.json'

import Dimensions from 'Dimensions';


import PRICES from '../../Data/20190517.json';
import FREQUENCYLIST from '../../Data/frequencyList.json'

const Spline = require('cubic-spline');
var polynomial = require('everpolate').polynomial;
var interpolator = require('../../Utils/spline.js');

const dataForge = require('data-forge');

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const initialLayout = {
  width: DEVICE_WIDTH,
  height: DEVICE_HEIGHT
};

class PricerScreen extends React.Component {

  constructor(props) {
    super(props);
    Numeral.locale('fr');
    this.initialMessageLoading = 'Interrogation du marché...';
    this.messageLoading = '';
    this.state = {
      isLoading: false,
      index: 0,
      currentTab: 'tabPricerParameters',
      routes: [
        { key: 'tabPricerParameters', title: 'Sur-mesure' },
        { key: 'tabPricerResults', title: 'Résultats' },
        { key: 'tabPricerUF', title: 'Par' }
      ],
      messageLoading : this.initialMessageLoading,

      //les prix ne sont plus bons : un parametre au moins a été touché
      needToRefresh: false,
    }



    this.product = {
      'typeAuction': {
        'value': 'PP',
        'valueLabel': 'Placement privé',
        'defaultValueLabel': 'Optimisé',
        'title': 'TYPE DE DEMANDE',
        'isActivated': true,
        'isMandatory': true,
      },
      'type': {
        'value': 'classicAutocall',
        'valueLabel': 'Autocall',
        'defaultValueLabel': 'Optimisé',
        'title': 'CHOIX DU PRODUIT',
        'isActivated': false,
        'isMandatory': false,
      },
      'underlying': {
        'value': ['CAC'],
        'valueLabel': 'CAC 40',
        'defaultValueLabel': 'Optimisé',
        'title': 'SOUS-JACENT',
        'isActivated': true,
        'isMandatory': false,
      },
      'maturity': {
        'value': [4, 10],
        'valueLabel': '4 à 10 ans',
        'defaultValueLabel': 'Optimisé',
        'title': 'MATURITE',
        'isActivated': true,
        'isMandatory': false,
      },
      'barrierPDI': {
        'value': 0.6,
        'isActivated': false,
        'defaultValueLabel': 'Optimisé',
        'title': 'PROTECTION DU CAPITAL',
        'valueLabel': Numeral(0.6).format('0%'),
        'isMandatory': false,
      },
      'freq': {
        'value': "1Y",
        'isActivated': false,
        'defaultValueLabel': 'Optimisé',
        'title': 'FREQUENCE',
        'valueLabel': '1 an',
        'isMandatory': false,
      },
      'barrierPhoenix': {
        'value': 1,
        'isActivated': false,
        'defaultValueLabel': 'Optimisé',
        'valueLabel': Numeral(1).format('0%'),
        'title': 'PROTECTION DES COUPONS',
        'isMandatory': false,
      },
      'airbagLevel': {
        'value': "NA", //NA : pas d airbag   SA : semi-airbag   FA : full airbag
        'isActivated': false,
        'defaultValueLabel': 'Optimisé',
        'valueLabel': 'Aucun airbag',
        'title': 'EFFET AIRBAG',
        'isMandatory': false,
      },

      //pas encore d'ecran
      'degressiveStep': {
        'value': 0,
        'isActivated': false,
        'defaultValueLabel': 'Optimisé',
        'valueLabel': 'Pas de dégressivité',
        'title': 'DEGRESSIVITE',
        'isMandatory': false,
      },
      'isMemory': {
        'value': false,
        'isActivated': false,
        'defaultValueLabel': 'Optimisé',
        'valueLabel': '',
        'title': 'EFFET MEMOIRE',
        'isMandatory': false,
      },
      'isPDIUS': {
        'value': false,
        'isActivated': false,
        'defaultValueLabel': 'Optimisé',
        'valueLabel': '',
        'title': 'AMERICAIN',
        'isMandatory': false,
      },

      //pas de choix pour le user
      'nominal': {
        'value': 100000,
        'isActivated': true,
        'defaultValueLabel': 'Optimisé',
        'isMandatory': false,
      },
      'currency': {
        'value': 'EUR',
        'isActivated': true,
        'defaultValueLabel': 'Optimisé',
        'isMandatory': false,
      },
      'UF': {
        'value': 0.02,
        'isActivated': true,
        'defaultValueLabel': 'Optimisé',
        'isMandatory': true,
      },
      'UFAssoc': {
        'value': 0.002,
        'isActivated': true,
        'defaultValueLabel': 'Optimisé',
        'isMandatory': true,
      },
    };

    this.bestProducts = [];
  }


  static navigationOptions = {
    header: null
  }

  //au chargemnt de la page recupération des meilleurs resultats
  async componentDidMount() {

   // this.calculateProducts();
   this.needToRefresh();

  }

  //elebore le messgage d'attente lors du calcul
  eleborateMessageLoading(message) {
    if (message === '') {
      this.messageLoading = '';
    } else {

      this.messageLoading = this.messageLoading + (message === '.' ? '.' : ('\n' + message));
    }
    return this.messageLoading; 
  }

  async calculateProducts() {

    this.state.isLoading === false ? this.setState({ isLoading: true }) : null;
    //this.setState({ isLoading : true }, () => {
    this.bestProducts = [];

    //chagrgement des prix depuis le serveur
    let criteria = {};
    this.product.underlying.isActivated ? criteria['underlying'] = this.product.underlying.value : null;
    this.product.freq.isActivated ? criteria['freqAutocall'] = this.product.freq.value : null;
    this.product.type.isActivated ? criteria['product'] = [this.product.type.value] : null;
    console.log(criteria);
    
    //criteria['maturity'] = ["3Y", "5Y", "8Y"];
    this.props.firebase.doGetIdToken()
      .then(token => {
        searchProducts(token, criteria)
          .then((data) => {
            //console.log("USER CREE AVEC SUCCES DANS ZOHO");
            this.setState({ messageLoading : this.eleborateMessageLoading('Réception et analyse des prix')});
            console.log(data[1]);
            this.interpolateBestProducts(data);
            //console.log(data);
            //this.onRegisterSuccess();
          })
          .catch(error => {
            console.log("ERREUR recup prix: " + error);
            alert('ERREUR calcul des prix', '' + error);
            this.setState({ isLoading : false , messageLoading : this.initialMessageLoading});
          })
      });

    //});
  }

  async interpolateBestProducts(data) {

    //chargement des meilleurs prix
    //var allPricesDF = dataForge.fromJSON(JSON.stringify(PRICES));
    var allPricesDF = dataForge.fromJSON(JSON.stringify(data));
    //correction des string en nombre
    allPricesDF = allPricesDF.transformSeries({
      vega: value => Number(typeof value === 'string' ? value.replace(',','.') : value),
      price: value => Number(typeof value === 'string' ? value.replace(',','.') : value),
    });

    let underlyingsList = [];
    let structuredProductsList = [];
    var df = new dataForge.DataFrame(allPricesDF);

    console.log("Taille départ : " + df.toRows().length);
    this.setState({ messageLoading : this.eleborateMessageLoading(df.toRows().length + " prix reçus")} );
    //retrouve tous les sous jacents distincts
    if (this.product.underlying.isActivated) {
      df = df.where((row) => this.product.underlying.value.includes(row.underlying));
    } 

    

    let ppppp = df.getSeries('product').distinct().toArray();
    console.log(ppppp);
    let mmmmmm = df.getSeries('maturity').distinct().toArray();
    console.log(mmmmmm);

    //on filtre les produits
    if (this.product.type.isActivated) {
        //on adapte ce choix sur les autres options
        df = df.where(row => row.product === this.product.type.value);

        if (this.product.type.value === 'memoryPhoenix') {
          this.product.isMemory.isActivated = true;
          this.product.isMemory.value = true;
        }
        if (this.product.type.value === 'incrementalAutocall') {
          df = df.where(row => row.isIncremental === true);
        }
    } else {
        //isIncremental à false : c'est mieux pour le coupon
        df = df.where(row => row.isIncremental === false);
    }




    /**  on a la data-frame filtré au maximum, il faut avoir le meilleur prix
     pour chaque sous-jacent et pour chaque produit
     on va retenir :
            - sans effet airbag
            - sans degressivite
            - une frequence la plus faible
            - une periode sans rappel la plus elevée
            - PDI US ou EU : PDI EU
            - isMemory : non
            - la barrirer de protection la plus eleve --> si nombre saisi par user on interpolera
            - la protection des coupons la plus haute --> si nombre saisi par user on interpolera


      on va interpoler les maturités demandées
      on va appliquer les UF + notre marge + un bump trading
      on va sortir le max et les neufs suivants
    */

    //AIRBAG
    if (this.product.airbagLevel.isActivated) {
      switch (this.product.airbagLevel.value) {
        case 'NA': //pas d'airbag
          df = df.where((row) => row.airbagLevel === 1);
          break;
        case 'SA': //semi-airbag
          df = df.where((row) => row.airbagLevel === (1 + row.barrierPDI) / 2);
          break;
        case 'FA': // fullairbag
          df = df.where((row) => row.airbagLevel === row.barrierPDI);
          break;
        default:
          break;
      }
    } else { //on ne garde que les sans airbag
      df = df.where((row) => row.airbagLevel === 1);
    }

    //DEGRESSIVITE ......
    //on le met systematiquement a 0
    df = df.where((row) => row.degressiveStep === 0);

    //FREQUENCE
    if (this.product.freq.isActivated) {
      df = df.where((row) => row.freqAutocall === this.product.freq.value);
    } else { //on prend la plus faible parmis les dispos
      //let f = [...new Set(PRICES.map(x => x.freqAutocall))];
      let f = df.getSeries('freqAutocall').distinct().toArray();
      freqArray = FREQUENCYLIST.filter(({ id }) => f.includes(id));
      freqMin = Math.min(...freqArray.map((x) => x.freq));
      freq = freqArray.filter(id => id.freq === freqMin)[0];
      df = df.where((row) => row.freqAutocall === freq.id);
    }


    //PERIODE SANS RAPPEL ......
    //on la duree sans rappel la plus elevee
    let noCallMonthsArray = df.getSeries('noCallNbPeriod').distinct().toArray();
    let noCallMonths = Math.max(...noCallMonthsArray);
    console.log("NOMBRE NO CALL : "+ noCallMonths);
    df = df.where((row) => row.noCallNbPeriod === 12);

    //PDI US ou EU
    if (this.product.isPDIUS.isActivated) {
      df = df.where((row) => row.isPDIUS === this.product.isPDIUS.value);
    } else { //on prend EUROPEEN => meilleur coupon
      df = df.where((row) => row.isPDIUS === false);
    }

    //IS MEMORY  
    if (this.product.isMemory.isActivated) {
      df = df.where((row) => row.isMemory === this.product.isMemory.value);
    } else { //on prend le non memoire => meilleur coupon
      df = df.where((row) => row.isMemory === false);
    }

    console.log("Taille apres 1ers filtres : " + df.toRows().length);


    //PDI
    if (this.product.barrierPDI.isActivated) {
      //verifier que la matu n'existe pas deja
      if (df.where((row) => row.barrierPDI === this.product.barrierPDI.value).toRows().length !== 0) {
        df = df.where((row) => row.barrierPDI === this.product.barrierPDI.value);
      } else {
        this.setState({ messageLoading : this.eleborateMessageLoading('Interpolation des PDI')});
        //il faut interpoler et distinguer tous 
        let distinctProducts = df.getSeries('product').distinct();
        let distinctUnderlyings = df.getSeries('underlying').distinct();
        let distinctMaturities = df.getSeries('maturity').distinct();
        let distinctBarrierPhoenix = df.getSeries('barrierPhoenix').distinct();
        let distinctFreqAutocall = df.getSeries('freqAutocall').distinct();
        let distinctFreqPhoenix = df.getSeries('freqPhoenix').distinct();
        let distinctAirbagLevel = df.getSeries('airbagLevel').distinct();
        let distinctDegressiveStep = df.getSeries('degressiveStep').distinct();
        let distinctCoupon = df.getSeries('coupon').distinct();
        //isIncremental
        //noCallNbPeriod



        let dfToAdd = new dataForge.DataFrame();
        //[...new Set(PRICES.map(x => x.maturity))].forEach((mat) => {
        distinctMaturities.forEach((mat) => {
          d = new dataForge.DataFrame(df);
          //d = d.dropSeries(['code','currency','strike','strikeDate', 'finalDate','startDate','endDate','swapPrice','levelAutocall','spreadAutocall','spreadPDI','gearingPDI','spreadBarrier','Vega', 'couponAutocall','couponPhoenix']);
          d1 = d.where((row) => row.maturity === mat);
          distinctProducts.forEach((prod) => {
            d2 = d1.where((row) => row.product === prod);
            distinctUnderlyings.forEach((udl) => {
              d3 = d2.where((row) => row.underlying === udl);
              distinctBarrierPhoenix.forEach((bPh) => {
                d4 = d3.where((row) => row.barrierPhoenix === bPh);
                distinctFreqAutocall.forEach((freqAut) => {
                  d5 = d4.where((row) => row.freqAutocall === freqAut);
                  distinctFreqPhoenix.forEach((freqPh) => {
                    d6 = d5.where((row) => row.freqPhoenix === freqPh);
                    distinctAirbagLevel.forEach((abgLavel) => {
                      d7 = d6.where((row) => row.airbagLevel === abgLavel);
                      distinctDegressiveStep.forEach((ds) => {
                        d8 = d7.where((row) => row.degressiveStep === ds);
                        distinctCoupon.forEach((cpn) => {
                          //calcul du prix a cette barriere
                          d9 = d8.where((row) => row.coupon === cpn);
                          if (d9.toRows().length !== 0) {
                            this.setState({ messageLoading : this.eleborateMessageLoading('.')});
                            //interpolation
                            xs = d9.getSeries('barrierPDI').distinct().toArray();
                            ys = d9.getSeries('price').distinct().toArray();

                            splinePDIBarrier = new Spline(xs, ys);

                            //console.log("barrierPDI @ "+ this.product.barrierPDI.value +" : "+splinePDIBarrier.at(this.product.barrierPDI.value));
                            //console.log("Apres reduction : " + d9.toRows().length);
                            //console.log(d9.toString());
                            //on ne garde que le premier pour recrer le meme tableau
                            d10 = d9.head(1);
                            bPDIToChange = d10.getSeries('barrierPDI').toArray().toString();
                            d10 = d10.transformSeries({
                              barrierPDI: value => this.product.barrierPDI.value,
                              price: value => splinePDIBarrier.at(this.product.barrierPDI.value),
                              //il faut reconstiturer le code
                              code: value => value.replace('_BPDI:' + bPDIToChange, '_BPDI:' + this.product.barrierPDI.value)
                            });
                            dfToAdd = dfToAdd.concat(d10);

                          }
                        })
                      })
                    })
                  })
                })
              })
            })
          })

        })
        //console.log(dfToAdd.toString());
        df = dfToAdd;
      }
    } else { //pas d'instruction : on prend le max
      //on prend le min dispo
      //let pdi = [...new Set(PRICES.map(x => x.barrierPDI))];
      let pdi = df.getSeries('barrierPDI').distinct().toArray();
      pdiMax = Math.max(...pdi);

      df = df.where((row) => row.barrierPDI === pdiMax);
    }
    console.log("Taille apres PDI : " + df.toRows().length);


    //BARRIER PHOENIX
    if (this.product.barrierPhoenix.isActivated) {
      //verifier que la matu n'existe pas deja
      if (df.where((row) => row.barrierPhoenix === this.product.barrierPhoenix.value).toRows().length !== 0) {
        df = df.where((row) => row.barrierPhoenix === this.product.barrierPhoenix.value);
      } else {
        this.setState({ messageLoading : this.eleborateMessageLoading('Analyse des barrières Phoenix')});
        //il faut interpoler et distinguer tous 
        let distinctProducts = df.getSeries('product').distinct();
        let distinctUnderlyings = df.getSeries('underlying').distinct();
        let distinctMaturities = df.getSeries('maturity').distinct();
        let distinctFreqAutocall = df.getSeries('freqAutocall').distinct();
        let distinctFreqPhoenix = df.getSeries('freqPhoenix').distinct();
        let distinctAirbagLevel = df.getSeries('airbagLevel').distinct();
        let distinctDegressiveStep = df.getSeries('degressiveStep').distinct();
        let distinctCoupon = df.getSeries('coupon').distinct();
        //isIncremental
        //noCallNbPeriod



        let dfToAdd = new dataForge.DataFrame();
        //[...new Set(PRICES.map(x => x.maturity))].forEach((mat) => {
        distinctMaturities.forEach((mat) => {
          d = new dataForge.DataFrame(df);
          //d = d.dropSeries(['code','currency','strike','strikeDate', 'finalDate','startDate','endDate','swapPrice','levelAutocall','spreadAutocall','spreadPDI','gearingPDI','spreadBarrier','Vega', 'couponAutocall','couponPhoenix']);
          d1 = d.where((row) => row.maturity === mat);
          distinctProducts.forEach((prod) => {
            d2 = d1.where((row) => row.product === prod);
            distinctUnderlyings.forEach((udl) => {
              d3 = d2.where((row) => row.underlying === udl);
   
              distinctFreqAutocall.forEach((freqAut) => {
                d5 = d3.where((row) => row.freqAutocall === freqAut);
                distinctFreqPhoenix.forEach((freqPh) => {
                  d6 = d5.where((row) => row.freqPhoenix === freqPh);
                  distinctAirbagLevel.forEach((abgLavel) => {
                    d7 = d6.where((row) => row.airbagLevel === abgLavel);
                    distinctDegressiveStep.forEach((ds) => {
                      d8 = d7.where((row) => row.degressiveStep === ds);
                      distinctCoupon.forEach((cpn) => {
                        //calcul du prix a cette barriere
                        d9 = d8.where((row) => row.coupon === cpn);
                        if (d9.toRows().length !== 0) {
                          this.setState({ messageLoading : this.eleborateMessageLoading('.')});
                          //interpolation
                          xs = d9.getSeries('barrierPhoenix').distinct().toArray();
                          ys = d9.getSeries('price').distinct().toArray();

                          splinePhoenixBarrier = new Spline(xs, ys);

                          //on ne garde que le premier pour recrer le meme tableau
                          d10 = d9.head(1);
                          bPhoenixToChange = d10.getSeries('barrierPhoenix').toArray().toString();
                          d10 = d10.transformSeries({
                            barrierPhoenix: value => this.product.barrierPhoenix.value,
                            price: value => splinePhoenixBarrier.at(this.product.barrierPhoenix.value),
                            //il faut reconstiturer le code
                            code: value => value.replace('_CB:' + bPhoenixToChange, '_CB:' + this.product.barrierPhoenix.value)
                          });
                          dfToAdd = dfToAdd.concat(d10);

                        }
                      })
                    })
                  })
                })
              })
       
            })
          })

        })
        //console.log(dfToAdd.toString());
        df = dfToAdd;
      }
    } else { //pas d'instruction : on prend le max
      //on prend le max dispo
      let phoenix = df.getSeries('barrierPhoenix').distinct().toArray();
      phoenixMax = Math.max(...phoenix);

      df = df.where((row) => row.barrierPhoenix === phoenixMax);
    }

    console.log("Taille apres BARRIER PHOENIX : " + df.toRows().length);

    
    //MATURITY
    //verifier que la matu n'existe pas deja
    this.setState({ messageLoading : this.eleborateMessageLoading(df.toRows().length + "prix analysés")} );
    if (this.product.maturity.value[0] === this.product.maturity.value[1] && df.where((row) => row.maturity === this.product.maturity.value[0]).toRows().length !== 0) {
      df = df.where((row) => row.maturity === this.product.maturity.value[0]);
    } else {
      this.setState({ messageLoading : this.eleborateMessageLoading('Analyse des maturités')});
      //il faut interpoler et distinguer tous 
      let distinctProducts = df.getSeries('product').distinct();
      let distinctUnderlyings = df.getSeries('underlying').distinct();
      let distinctBarrierPhoenix = df.getSeries('barrierPhoenix').distinct();
      let distinctFreqAutocall = df.getSeries('freqAutocall').distinct();
      let distinctFreqPhoenix = df.getSeries('freqPhoenix').distinct();
      let distinctAirbagLevel = df.getSeries('airbagLevel').distinct();
      let distinctDegressiveStep = df.getSeries('degressiveStep').distinct();
      let distinctCoupon = df.getSeries('coupon').distinct();

      //isIncremental
      //noCallNbPeriod

      let dfToAdd = new dataForge.DataFrame();
      let allMat = ["1Y", "1.5Y", "2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y", "9Y", "10Y"];
      let allMatDate = [1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      /*let allMatDate = []; //[1,1.5,2,3,4,5,6,7,8,9,10];
      cpteur = 0;
      allMat.map((x, i) => {
        z  = Number(x.substring(0,x.length-1));
        if (z >= this.product.maturity.value[0] && z <= this.product.maturity.value[1]){
          allMatDate[cpteur] = z;
          cpteur = cpteur + 1;
        }
      });*/
      //allMat.map((x,i) => console.log(x +" : "+allMatDate[i]));
      console.log("All Mat date " + allMatDate);
      let dfPrint3 = new dataForge.DataFrame(df);
      dfPrint3 = dfPrint3.subset(["product", "coupon", "maturity", "price", "code"]);
      console.log(dfPrint3.toString()); 
      distinctProducts.forEach((prod) => {

        d = new dataForge.DataFrame(df);
        //d = d.dropSeries(['code','currency','strike','strikeDate', 'finalDate','startDate','endDate','swapPrice','levelAutocall','spreadAutocall','spreadPDI','gearingPDI','spreadBarrier','Vega', 'couponAutocall','couponPhoenix']);

        d2 = d.where((row) => row.product === prod);
        distinctUnderlyings.forEach((udl) => {
          d3 = d2.where((row) => row.underlying === udl);
          distinctBarrierPhoenix.forEach((bPh) => {
            d4 = d3.where((row) => row.barrierPhoenix === bPh);
            distinctFreqAutocall.forEach((freqAut) => {
              d5 = d4.where((row) => row.freqAutocall === freqAut);
              distinctFreqPhoenix.forEach((freqPh) => {
                d6 = d5.where((row) => row.freqPhoenix === freqPh);
                distinctAirbagLevel.forEach((abgLavel) => {
                  d7 = d6.where((row) => row.airbagLevel === abgLavel);
                  distinctDegressiveStep.forEach((ds) => {
                    d8 = d7.where((row) => row.degressiveStep === ds);
                    distinctCoupon.forEach((cpn) => {
                      //calcul du prix a cette barriere
                      this.setState({ messageLoading : this.eleborateMessageLoading('.')});
                      d9 = d8.where((row) => row.coupon === cpn);
                      if (d9.toRows().length !== 0) {
                        //interpolation
                        xs = d9.getSeries('maturity').distinct().toArray();
                        ys = d9.getSeries('price').distinct().toArray();

                        //xs.map((x, i) => console.log(x+" : "+ys[i]));
                        xs.map((x, i) => xs[i] = Number(x.substring(0, x.length - 1)));
                        //inter et extrapolation
                        points = [];
                        xs.map((x, i) => points[i] = [xs[i], ys[i]]);

          

                        f = interpolator(points);

                        //on fait le tour des maturite et on ajoute les manquantes
                        allMatDate.forEach((mat) => {
                          //console.log(mat + "  :   " + f(mat));
                          if (mat >= this.product.maturity.value[0] && mat <= this.product.maturity.value[1]) {
                            d10 = d9.head(1);
                            matToChange = d9.head(1).getSeries('maturity').toArray().toString();
                            d10 = d10.transformSeries({
                              maturity: value => mat + "Y",
                              price: value => f(mat) + this.product.UF.value + this.product.UFAssoc.value,
                              //il faut reconstituer le code
                              code: value => value.replace('_M:' + matToChange, '_M:' + mat + "Y")
                            });
                    

                            dfToAdd = dfToAdd.concat(d10);
                          }
                        });

                      }
                    })
                  })
                })
              })
            })
          })
        })
      })

      df = dfToAdd;
    }

    console.log("Taille apres MATURITY : " + df.toRows().length);

    //on applique les UF et bumps FINLIVE aux prix
    /*df = df.transformSeries({
      //price: value => value + this.product.UF.value + this.product.UFAssoc.value,
      price: value => value,
    });*/

    let dfPrint2 = new dataForge.DataFrame(interpolatedProducts);
    dfPrint2 = dfPrint2.subset(["product", "coupon", "maturity", "price", "code"]);
    //dfPrint = dfPrint.dropSeries(['code','currency','strike','strikeDate', 'finalDate','startDate','endDate','swapPrice','levelAutocall','spreadAutocall','spreadPDI','gearingPDI','spreadBarrier','Vega', 'couponAutocall','couponPhoenix']);
    console.log(dfPrint2.toString()); 

    //on passe sur tous les produits distincts et on interpoler
    let interpolatedProducts = new dataForge.DataFrame();
    let distinctProducts = df.getSeries('product').distinct();
    let distinctMaturities = df.getSeries('maturity').distinct();
    let distinctUnderlyings = df.getSeries('underlying').distinct();
    let distinctBarrierPhoenix = df.getSeries('barrierPhoenix').distinct();
    let distinctFreqAutocall = df.getSeries('freqAutocall').distinct();
    let distinctFreqPhoenix = df.getSeries('freqPhoenix').distinct();
    let distinctAirbagLevel = df.getSeries('airbagLevel').distinct();
    let distinctDegressiveStep = df.getSeries('degressiveStep').distinct();
    distinctProducts.forEach((prod) => {
      d = new dataForge.DataFrame(df);
      d2 = d.where((row) => row.product === prod);
      distinctUnderlyings.forEach((udl) => {
        this.setState({ messageLoading : this.eleborateMessageLoading("Analyse de : " + udl)} );
        d3 = d2.where((row) => row.underlying === udl);
        distinctBarrierPhoenix.forEach((bPh) => {
          d4 = d3.where((row) => row.barrierPhoenix === bPh);
          distinctFreqAutocall.forEach((freqAut) => {
            d5 = d4.where((row) => row.freqAutocall === freqAut);
            distinctFreqPhoenix.forEach((freqPh) => {
              d6 = d5.where((row) => row.freqPhoenix === freqPh);
              distinctAirbagLevel.forEach((abgLavel) => {
                d7 = d6.where((row) => row.airbagLevel === abgLavel);
                distinctDegressiveStep.forEach((ds) => {
                  d8 = d7.where((row) => row.degressiveStep === ds);
                  distinctMaturities.forEach((mat) => {
                    this.setState({ messageLoading : this.eleborateMessageLoading('.')});
                    //calcul du prix a cette barriere
                    d9 = d8.where((row) => row.maturity === mat);

                    coupons = d9.getSeries('coupon').toArray();
                    prix = d9.getSeries('price').toArray();
                    points = [];
                    coupons.map((x, i) => points[i] = [prix[i], coupons[i]]);
                    f = interpolator(points);
                    CPN = f(0);
                    
                    /*let dfPrint = new dataForge.DataFrame(d9);
                    dfPrint = dfPrint.subset(["product","price", "coupon", "maturity", "code"]);
                    //dfPrint = dfPrint.dropSeries(['code','currency','strike','strikeDate', 'finalDate','startDate','endDate','swapPrice','levelAutocall','spreadAutocall','spreadPDI','gearingPDI','spreadBarrier','Vega', 'couponAutocall','couponPhoenix']);
                    console.log(dfPrint.toString());*/
              

                    if (CPN >= 0) {//on conserve le produit
                      dTemp = d9.head(1);
                      cpnToChange = dTemp.getSeries('coupon').toArray().toString();
                      //console.log("COUPON : " + cpnToChange + "      ->   "+ CPN);
                      //codeAvant = dTemp.getSeries('code').toArray().toString();
                      //console.log(codeAvant);
                      //console.log(codeAvant.replace('_C:' + cpnToChange, '_C:' + CPN));
                      dTemp = dTemp.transformSeries({
                        price: value => 0,
                        coupon: value => CPN,
                        //il faut reconstituer le code
                        code: value => value.replace('_C:' + cpnToChange, '_C:' + CPN),
                      });
                    
                      //console.log(dfPrint.toString());
                      
                      interpolatedProducts = interpolatedProducts.concat(dTemp);
                    }
                  })
                })
              })
            })
          })
        })
      })
    });

    //on classe par coupon descendant
    
    let dfPrint = new dataForge.DataFrame(interpolatedProducts);
    dfPrint = dfPrint.subset(["product", "coupon", "maturity", "isIncremental", "code"]);
    //dfPrint = dfPrint.dropSeries(['code','currency','strike','strikeDate', 'finalDate','startDate','endDate','swapPrice','levelAutocall','spreadAutocall','spreadPDI','gearingPDI','spreadBarrier','Vega', 'couponAutocall','couponPhoenix']);
    console.log(dfPrint.toString());
    interpolatedProducts = interpolatedProducts.orderByDescending(row => row.coupon);
    /*df = df.generateSeries({
     SomeNewColumn: row => 'bonjour'
    });*/
    this.bestProducts = interpolatedProducts.toArray();
    //console.log(this.bestProducts[0]);
    await setTimeout(() => {
      this.messageLoading = '';
      this.setState({ isLoading: false, needToRefresh: false, messageLoading: this.initialMessageLoading });
    }, 500);
  }

  //parameter du produit changé et donc updaté
  parameterProductUpdated = (productParameters) => {

    this.product = productParameters;
    //this.needToRefresh();


    //pour rafraichir l'affichage
    //this.setState({toto : !this.state.toto})
  }

  //demande le calcul au serveur et affichage des résultats 
  launchPricing = (param) => {
    //console.log("CA AKHZAHZJAHZJAHZ " + productParameters);

    //changement d'onglet si necessaire
    if (this.state.currentTab !== 'tabPricerResults') {
      this._handleIndexChange(1);
    }
    this.calculateProducts();
  }

  //les prix ne sont plus bons : un parametre au moins a été touché
  needToRefresh = () => {
    //console.log("Besoin de refresh");
    this.setState({ needToRefresh: true });
  }


  //les UF ont été changés
  updateUF = (UF, UFAssoc) => {
    //console.log("UF Updated " + UF + "   et    " + UFAssoc);
    this.product["UF"].value = UF;
    this.product["UFAssoc"].value = UFAssoc;

  }



  _getLabelText = ({ route }) => route.title.toUpperCase();

  //affichage de l'en-tete de la page
  _renderHeader2 = () => props => (
    <TabBar
      onTabPress={({ route }) => {
        console.log("ROUTE : " + JSON.stringify(route));
      }
      }

      getLabelText={this._getLabelText}

      //indicatorStyle={{backgroundColor: backgdColor, height: 45, width: this.state.currentTab === 'tabPricerUF' ? 50 : (DEVICE_WIDTH -50)/2 , borderWidth: 1}}
      //style={{zIndex: 1, 'pink': tabBackgroundColor, elevation: 0, height: 45 , justifyContent: 'center'}}
      style={{ height: 0 }}
      //tabStyle={[this._getTabWidth, {height:100}]}
      //contentContainerStyle={{height:100, DEVICE_WIDTH , borderWidth: 5}}
      //indicatorContainerStyle={{height: 80, width:50, backgroundColor:'pink', borderWidth: 1}}
      //labelStyle={{flexWrap: "nowrap",fontFamily: FLFontFamily, margin: 0, fontWeight: '200'}}
      //labelStyle={{ color:  'black', margin: 0, marginTop: 0, marginBottom: 0, fontWeight: '200', height: 35 }}
      activeColor={tabBackgroundColor}
      inactiveColor={backgdColor}
      {...props}
    />
  );

  _renderScene = ({ route, jumpTo }) => {

    switch (route.key) {
      case 'tabPricerResults':
        //return <View style={{ flex: 1, borderWidth:4 }}><Text>Meilleurs prix</Text></View>
        return <TabResults route={route} jumpTo={jumpTo} products={this.bestProducts} isGoodToShow={!this.state.needToRefresh} />;
      case 'tabPricerParameters':
        return <TabPricer route={route} jumpTo={jumpTo} launchPricing={this.launchPricing} product={this.product} needToRefresh={this.needToRefresh} parameterProductUpdated={this.parameterProductUpdated} />;
      //return <View style={{ flex: 1, borderWidth:4 }}><Text>Meilleurs prix</Text></View>
      case 'tabPricerUF':
        return <TabUF route={route} jumpTo={jumpTo} launchPricing={this.launchPricing} needToRefresh={this.needToRefresh} updateUF={this.updateUF} product={this.product}/>;
      //return <View style={{ flex: 1, borderWidth:4 }}><Text>Meilleurs prix</Text></View>

      default:
        return null;
    }
  };

  _handleIndexChange = index => {
    this.setState({
      index,
      currentTab: this.state.routes[index].key,
    });
  }




  render() {
    var render = <View style={{

      width: DEVICE_WIDTH,
      height: DEVICE_HEIGHT
    }}>
      <View style={{ flexDirection: 'row', height: 37, width: DEVICE_WIDTH, borderBottomWidth: 4, borderBottomColor: backgdColor }}>
        <TouchableOpacity style={[tabStyle(this.state.index === 0), { width: (DEVICE_WIDTH - 50) / 2 }]}
          onPress={() => this._handleIndexChange(0)}>
          <Text style={[texTabStyle(this.state.index === 0)]}>
            Structuration
                                              </Text>

        </TouchableOpacity>
        <TouchableOpacity style={[tabStyle(this.state.index === 1), { width: (DEVICE_WIDTH - 50) / 2 }]}
          onPress={() => this._handleIndexChange(1)}>
          <Text style={[texTabStyle(this.state.index === 1)]}>
            Résultats
                                              </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[tabStyle(this.state.index === 2), { width: 50 }]}
          onPress={() => this._handleIndexChange(2)}>
          <Icon name='ios-settings' size={20} style={{ color: this.state.index === 2 ? tabBackgroundColor : backgdColor }} />
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: backgdColor, height: 10 }}>
      </View>
      <View style={{ flexDirection: 'row', backgroundColor: backgdColor, height: 45, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 8, borderBottomColor: backgdColor}}>
        <View style={{ flex: 0.5, borderWidth: 0, height: 35, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: FLFontFamily, fontWeight: '500', fontSize: 16 }}>
            {String("Produit structuré").toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: this.state.needToRefresh ? 'center' : 'flex-start' }}>
          {
            this.state.needToRefresh ? <TouchableOpacity style={{ backgroundColor: subscribeColor, borderRadius: 4, height: 40, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => this.launchPricing('toto')}>
              <Text style={{ paddingLeft: 12, paddingRight: 12, fontFamily: FLFontFamily, fontWeight: '300', fontSize: 14, color: 'white' }}>
                ELABORER MES PRODUITS
                                                                  </Text>
            </TouchableOpacity>
              : <View style={{ height: 40, justifyContent: 'center', alignItems: 'flex-start' }}>
                <Text style={{ paddingLeft: 10, fontFamily: FLFontFamily, fontWeight: '200', fontSize: 12, color: 'black' }}>
                  {this.bestProducts.length} résultat(s)
                                                                    </Text>
              </View>
          }
        </View>
      </View>
      <TabView
        style={[globalStyle.bgColor, { flex: 1 }]}
        navigationState={this.state}
        /*navigationState={{index: this.state.index,   
          routes: [
            { key: 'tabPricerResults', title: 'Résultats' },
            { key: 'tabPricerParameters', title: 'Sur-mesure' },
            { key: 'tabPricerUF', title: 'Paramètres' }
          ],
        }}*/

        renderScene={this._renderScene}
        renderPager={(props) => <PagerScroll {...props} />}
        //renderTabBar={this._renderHeader(animation, canJumpToTab)}
        renderTabBar={this._renderHeader2()}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
        swipeEnabled={false} // TODO ...
        //canJumpToTab={() => canJumpToTab}
        useNativeDriver
      />

    </View>



    if (this.state.isLoading) {
      render = <View style={globalStyle.loading}>
        <ActivityIndicator size='large' />
        <View style={{ position: 'absolute', top: 2 * DEVICE_HEIGHT / 3,top: DEVICE_HEIGHT/5,left : 0, width: DEVICE_WIDTH, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{this.state.messageLoading}</Text>
        </View>
      </View>
    }

    return (
      <SafeAreaView style={{ backgroundColor: tabBackgroundColor }}>
        {render}
      </SafeAreaView>
    );
  }
}


function tabStyle(focused) {
  return {
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: focused ? backgdColor : tabBackgroundColor,
  }
};

function texTabStyle(focused) {
  return {
    flexWrap: "nowrap",
    fontFamily: FLFontFamily,
    margin: 0,
    fontWeight: '400',
    fontSize: 16,
    color: focused ? tabBackgroundColor : backgdColor,
  }
};


const condition = authUser => !!authUser;


const composedPricerScreen = compose(
  withAuthorization(condition),
  withFirebase,
  withNavigation,
);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(PricerScreen);


//<UserContext.Consumer>
//{value => <Label>{value.searchInputText}</Label>}
//</UserContext.Consumer> 
