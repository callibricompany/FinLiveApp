import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Icon } from 'native-base';
import {  globalSyle, 
    generalFontColor, 
    tabBackgroundColor,
    headerTabColor,
    selectElementTab,
    progressBarColor,
    subscribeColor,
    FLFontFamily,
    FLFontFamilyBold
 } from '../../Styles/globalStyle'

import Dimensions from 'Dimensions';
import Numeral from 'numeral'
import 'numeral/locales/fr'

import * as Progress from 'react-native-progress';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import * as TICKET_TYPE from '../../constants/ticket'

import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';


import podiumImage from '../../assets/podium.png'



import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json'
import FREQUENCYLIST from '../../Data/frequencyList.json'






const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class FLTicket extends React.Component {


  constructor(props) {
    super(props);

    this.state = {

      isGoodToShow : typeof this.props.isGoodToShow !== 'undefined' ? this.props.isGoodToShow : true,
    }

    //ticket
    this.item = this.props.item;

    //type de tycket
    this.type = typeof this.props.ticketType !== 'undefined' ? this.props.ticketType : this.item['template'].toUpperCase();
    if (this.type === TICKET_TYPE.PSCREATION) {
      this.type = TICKET_TYPE.LIST;
      this.item['data'] = this.props.item;

    }
   

    //le produit-ticket est filtre ou pas
    this.isFiltered = false;

  }

  componentWillReceiveProps (props) {
    //console.log("Prop received in FLTicket : " + props.isGoodToShow);
    typeof props.isGoodToShow !== 'undefined' ? this.setState({ isGoodToShow : props.isGoodToShow }) : null;
    typeof props.filters !== 'undefined' ? this.updateFilters(props.filters) : null;
  }

  //va aider pour savoir si on affiche ou pas 
  updateFilters(filters) {
    

    this.isFiltered = false;
    if (filters.hasOwnProperty('filterText') && String(filters['filterText']) !== '') {
      //console.log("pass : "+filters['filterText'])
      //construit une chaine de caractere avec tous mots clés
      let description = this._getProductTypeName() +
                        this._getFrequencyName() +
                        this._getUnderlyingName() +
                        this._getMaturityName() +
                        this._getBarrierPDITitle() +
                        this._getBarrierPDITypeTitle() +
                        this._getBarrierPhoenixTitle() +
                        this._getBarrierAirbagTitle() +
                        this._getDegressivityCallableTitle() +
                        this._getCouponTitle() +
                        this._getOrganization() +
                        this._getTypePlacement() +
                        this.item["code"];

      description.toLowerCase().includes(String(filters['filterText']).toLowerCase()) ? this.isFiltered = false : this.isFiltered = true;
    } else if (filters.length !== 0) {
      if (filters["subcategory"].codeSubCategory !== "PS") {   //on montre pas tout
        if (filters["subcategory"].subCategoryHead) { // c('st PSACTIONS ou PSINDICES qui est choisi
          filters["subcategory"].codeSubCategory !== this.item['category'] ? this.isFiltered = true : null;
        } else if (filters["subcategory"].groupingHead) {//c'est un secteur qui a été choisi
          //on recuepere toutes les actions du secteurs
          let underlyings = this.props.categories.filter(({codeCategory}) => codeCategory === 'PS')[0].subCategory;
          this.sectorList = [];
          this.isFiltered = true;
          underlyings.filter(obj => obj.groupingName === filters["subcategory"].groupingName).forEach((value) => {
            //console.log(JSON.stringify(value));
            value.underlyingCode === this.item['code'] ? this.isFiltered = false : null;
          });
        } else { //c'est donc un sous-jacent final
          filters["subcategory"].underlyingCode !== this.item['code'] ? this.isFiltered = true : null;
        }
      }

      //on filtre ensuite les favoris
      if (filters["category"] === "PSFAVORITES") {
        //console.log("Item favori : " + this.item['isFavorite']);
        this.item['isFavorite'] === false ? this.isFiltered = true : null;
      }
    }
  }

    //determine le nom du produit
  _getProductTypeName() {
      let product = this.type === TICKET_TYPE.LIST ? this.item.data : this.item.data.product;
      let name = '[PDT]';
      
      if (product.hasOwnProperty('product')) {        
        name = product.product;
        let ps = STRUCTUREDPRODUCTS.filter(({id}) => id === name);
        if (ps.length !== 0) {
          name = ps[0].name;
        }
      }

      return name;
  }

    //determine la frequence du produit
  _getFrequencyName() {
      let product = this.type === TICKET_TYPE.LIST ? this.item.data : this.item.data.product;
      let name = '[FREQ]';
      
      if (product.hasOwnProperty('freqAutocall')) {        
        name = product.freqAutocall;
        let freq = FREQUENCYLIST.filter(({id}) => id === name);
        if (freq.length !== 0) {
          name = "Rappels "+ freq[0].name +"s";
        }
      }

      return name;
  }

    //determine le nom du sous
  _getUnderlyingName() {
      let name = '[UDL]';
      let product = this.type === TICKET_TYPE.LIST ? this.item.data : this.item.data.product;
      //this.type === TICKET_TYPE.APE ? console.log(product) : null;
      
      if (product.hasOwnProperty('underlying')) {        
          name = product.hasOwnProperty('underlyingName') ? product.underlyingName : product.underlying;
      }

      return name;
  }

    //renvoie la maturité 
  _getMaturityName() {
      let name = '[MTY]';

      let product = this.type === TICKET_TYPE.LIST ? this.item.data : this.item.data.product;
      //this.type === TICKET_TYPE.APE ? console.log(product) : null;
      
      if (product.hasOwnProperty('maturity')) {        
          name = product.maturity.substring(0,product.maturity.length-1)
          let ans = " ans";
          if (name <= 1) {
            ans = " an";
          } 
          name = name + ans;
      }

      return name;
  }

  //determine le type d'action a realiser en fonction du type de ticket
  _getActionTitle() {
        let name = 'voir';
  
        if (this.type === TICKET_TYPE.BROADCAST) {
            name = 'souscrire';
        }
  
        return name;
  }


//renvoie la barriere PDI formatée
  _getBarrierPDITitle() {
      let name = '[XX]';

      let product = this.type === TICKET_TYPE.LIST ? this.item.data : this.item.data.product;
      
      if (product.hasOwnProperty('barrierPDI')) {        
          name = Numeral(product.barrierPDI-1).format('0%');
      }

      return name;
  }


  //renvoie le type de protection 
  _getBarrierPDITypeTitle() {
      let name = 'Protection européenne';
      
      let product = this.type === TICKET_TYPE.LIST ? this.item.data : this.item.data.product;

      if (product.hasOwnProperty('isPDIUS')) {  
        if (product.isPDIUS) {      
          name = 'Protection américaine';
        }
      }

      return name;
    }

    //renvoie la barriere PDI formatée
    _getBarrierPhoenixTitle() {
      let name = '[XX]';


      let product = this.type === TICKET_TYPE.LIST ? this.item.data : this.item.data.product;

      if (product.hasOwnProperty('barrierPhoenix')) {  
        
        name = product.barrierPhoenix === 99.99 ? Numeral(0).format('0%') : Numeral(product.barrierPhoenix - 1).format('0%')
      }


      return name;
    }

    //renvoie si airbag ou semi-airbag
    _getBarrierAirbagTitle () {
      let name = '[ABG]';

      let product = this.type === TICKET_TYPE.LIST ? this.item.data : this.item.data.product;

      if (product.hasOwnProperty('airbagLevel') && product.hasOwnProperty('levelAutocall') && product.hasOwnProperty('barrierPDI')) {  
        let PDI = product.barrierPDI;
        let autocallLevel = product.levelAutocall;
        let airbag  = product.airbagLevel;

        if (PDI === airbag) {
          name = "airbag";
        } else if (autocallLevel === airbag) {
          name = "sans airbag";
        }
        else if ((autocallLevel + PDI)/2 === airbag) {
          name = "semi-airbag";
        }
      }

      return name;
    }

    //renvoie la degressivite des niveaux de rappels
    _getDegressivityCallableTitle () {
      let name = '[DGS]';
      
      let product = this.type === TICKET_TYPE.LIST ? this.item.data : this.item.data.product;

      if (product.hasOwnProperty('degressiveStep')) { 
        if(product.degressiveStep === 0 ) {
          name = "non dégressif";
        } else {
          name = "dégressif de " + Numeral(product.degressiveStep).format('0%') + " par an";
        }
      }


      return name;
    }

    //renvoie le coupon annualisé
    _getCouponTitle () {
      let name = '[CPN]';
      let product = this.type === TICKET_TYPE.LIST ? this.item.data : this.item.data.product;

      if (product.hasOwnProperty('coupon')) {  
        name = Numeral(product.coupon).format('0.00%');
      }


      return name;
    }

    //retourne l'organisation
    _getOrganization() {
      let organization = '';
      if (this.type === TICKET_TYPE.APE) {
        organization = "lancé par " + this.item.data.userInfo.company;
      }
      return organization;
    }

    //retourne le type de placement
    _getTypePlacement() {
      let typePlacement = '';
      if (this.type === TICKET_TYPE.BROADCAST) {
        typePlacement = 'Broadcast';
      } else if (this.type === TICKET_TYPE.APE) {
        typePlacement = "Appel Public à l'Epargne";
      }
      return typePlacement;
    }

    //elebaore le titre du produit
    _getTitleTicket = () => {
      let organization = this._getOrganization();
      let typePlacement = this._getTypePlacement();
      let description = '';
     
      if (this.type === TICKET_TYPE.APE) {
        description = this.item['data'].hasOwnProperty('type') ? "  ["+this.item.data.type + "]" : '';
      }
      //this.item['data'].hasOwnProperty('type') 

      let title = null;
      //si on est en train de traiter le produit
      if (this.type === TICKET_TYPE.BROADCAST || this.type === TICKET_TYPE.APE) {
        title = <View style={{backgroundColor: this.type === TICKET_TYPE.BROADCAST ? headerTabColor : '#749B14'}}>
                  <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 16, color: 'white', padding: 5}}>
                    {typePlacement.toUpperCase()}
                    {organization !== '' ? '\n' + organization : null}
                    {description}
                    
                  </Text>
                </View>

      } 
      

      return title;
    }

    //elebaore le titre du produit
    _getTitleProduct = () => {

      let typeProduit = this._getProductTypeName();
      let underlying = this._getUnderlyingName();
      let maturite = this._getMaturityName();
      let frequency = this._getFrequencyName().toLowerCase();


      let title =   <View style={{borderWidth:0, flex: 0.55, marginTop: Platform.OS === 'ios' ? -2 : -5, justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Text style={{fontFamily: FLFontFamily, fontWeight: '400', fontSize: 14, color: generalFontColor}}>
                          {typeProduit}  {maturite}
                        </Text>
                        <Text style={{fontFamily: FLFontFamily, fontWeight: '400', fontSize: 14, color: generalFontColor}}>
                          {underlying}  / {frequency}
                        </Text>
                    </View>
      

      return (
            title
      );
    }


    //renvoie le sujet du broadcast
    _getBroadcastSubject () {
      let name = this.type === TICKET_TYPE.BROADCAST ?
                  <View style={{flex: 0.2, backgroundColor: 'azure', padding: 5, paddingLeft: 10, justifyContent: 'center', alignItems: 'flex-start'}}>
                    <Text style={{fontSize : 16, fontFamily:  FLFontFamily, fontWeight: '600', color:'black'}}>{this.item.data['subject']}</Text>
                </View>
                : null;
      return name;
    }

    //renvoie la progression du broadcast
    _getBroadcastResume () {
      let progressionBroadCast = Math.random();
      let name = this.type === TICKET_TYPE.BROADCAST ?
                              <View style={{flex: 0.2, borderWidth: 0,flexDirection: 'row', paddingBottom:10}}>
                                <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center', borderWidth:0  }}>
                                  <Image  style={{width: 30, height: 20}} source={podiumImage} />
                                </View>
                                <View style={{flex: 0.7, borderWidth: 0, justifyContent:'center', alignItems: 'center', paddingLeft : 3, paddingRight: 7}}>
                                  <View style={{position: 'absolute',  zIndex: 0}}>
                                    <Progress.Bar 
                                      progress={progressionBroadCast} 
                                      width={DEVICE_WIDTH*0.7*0.95-10} 
                                      height={11}
                                      unfilledColor={'lightgray'}
                                      borderColor={'gray'}
                                      borderWidth={2}
                                      color={progressBarColor}
                                      borderRadius={10}
                                      />
                                    </View>
                                    <View style={{position: 'absolute', paddingLeft: 10,width: DEVICE_WIDTH*0.7*0.95-10, zIndex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                                      <Text style={{fontFamily : FLFontFamily, fontWeight:'400', fontSize: 10}}>
                                        { Numeral(progressionBroadCast).format('0%')}collecté
                                      </Text>
                                    </View>
                                    <View style={{position: 'absolute', paddingRight: 10, width: DEVICE_WIDTH*0.7*0.95-10, zIndex: 2, justifyContent: 'center', alignItems: 'flex-end'}}>
                                      <Text style={{fontFamily : FLFontFamily, fontWeight:'400', fontSize: 10}}>
                                        {Moment(this.item.data.custom_fields.cf_broad_enddate).format('DD MMMM')}
                                      </Text>
                                    </View>
                                </View>
                                <View style={{flex: 0.1, justifyContent:'center', alignItems: 'center'}}>
                                  <Text style={{fontFamily : FLFontFamily, fontWeight:'300', fontSize: 12}}>
                                    2 M€
                                  </Text>
                                </View>
                              </View>
                      : null;

      return name;
    }


    render () {

      if (this.isFiltered) {
        return null;
      }
        
        return (
            <View opacity={this.state.isGoodToShow ? 1 : 0.1} style={[styles.item, {flexDirection : 'column', width: DEVICE_WIDTH*0.925, borderBottomWidth : 1}]}>
                {this._getTitleTicket()}
              <View style={{flex : 0.25, flexDirection : 'row', backgroundColor: tabBackgroundColor}}>
                  <TouchableOpacity style={{flex : 0.10, justifyContent: 'center', alignItems: 'center', margin: 1}}>
                    <Icon  size={5} style={{ color : 'darkred'}} name={this.item.isFavorite ? 'ios-star' : 'ios-star-outline'} />
                  </TouchableOpacity>
                  
                    {this._getTitleProduct()}

                  <TouchableOpacity style={{flex: 0.35}} onPress={() => alert("J'EN VEUX PUTAIN DE MERDE")}>
                    <View style={{flex : 1, flexDirection: 'row', backgroundColor : subscribeColor,justifyContent: 'center', alignItems: 'center'}}>
                      <View style={{flex:0.8, paddingLeft: 5, péddingRight: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: Platform.OS === 'ios' ? ifIphoneX() ?  14 : 12 : 14, color: generalFontColor}}>
                          {this._getActionTitle().toUpperCase()}
                        </Text>
                      </View>
                      <View style={{flex:0.2, width:20,  borderWidth:0, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 14, color: generalFontColor}}>
                          >
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
              </View>
              <View style={{flex : 0.75, flexDirection: 'column'}}>

                {this._getBroadcastSubject()}

                <View style={{flex: 0.6, flexDirection: 'row', marginTop:10, marginBottom: 15}}>
                  <View style={{flex: 0.4, flexDirection : 'column', borderWidth: 0}}>
                    <View style={{flex: 0.3, justifyContent: 'center', alignItems: 'center', margin:5}}>
                       <Text style={{fontFamily: FLFontFamily, fontWeight:'600', fontSize: 10, color: 'black'}}>
                          PROTECTION CAPITAL
                       </Text>         
                    </View>
                    <View style={{flex: 0.5, justifyContent: 'center', alignItems: 'center', padding:0}}>
    
                      <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: FLFontFamily, fontWeight:'500', fontSize: 16, color: 'red'}}>
                         {this._getBarrierPDITitle()}
                        </Text>
                      </View>
                    </View>
                    <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center', marginLeft:5}}>
                        <Text style={{fontFamily: FLFontFamily, fontWeight:'200', fontSize: 9,paddingTop:4}}>
                           {this._getBarrierPDITypeTitle()}
                        </Text>
                    </View>
                  </View>
                  <View style={{flex: 0.4, flexDirection : 'column', borderWidth: 0, justifyContent: 'center'}}>
                    <View style={{flex: 0.3, borderWidth: 0,justifyContent: 'flex-start', alignItems: 'flex-start', margin:5, marginLeft: 10}}>
                        <Text style={{fontFamily: FLFontFamily, fontWeight:'600', fontSize: 10, color: 'black'}}>
                            PROTECTION COUPON
                        </Text>         
                      </View>
                      <View style={{flex: 0.5, flexDirection: 'row',justifyContent: 'center', alignItems: 'center', padding:0}}>
                        <View style={{flex: 0.4, borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: FLFontFamily, fontWeight:'500', fontSize: 16}}>
                            {this. _getBarrierPhoenixTitle()}
                          </Text>
                        </View>
                        <View style={{flex: 0.4, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                          <Text style={{fontFamily: FLFontFamily, fontWeight:'200', fontSize: 9}}>
                            {this._getBarrierAirbagTitle()}
                          </Text>
                        </View>
                      </View>
                      <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'flex-start', marginLeft:10}}>
                          <Text style={{fontFamily: FLFontFamily, fontWeight:'200', fontSize: 9,paddingTop:4}}>
                            {this._getDegressivityCallableTitle()}
                          </Text>
                      </View>

                  </View>
                  <View style={{flex: 0.2, flexDirection : 'column', borderWidth: 0, justifyContent: 'center'}}>
                    <View style={{flex: 0.3, borderWidth: 0,justifyContent: 'flex-start', alignItems: 'flex-start', margin:5, marginLeft: 10}}>
                      <Text style={{fontFamily: FLFontFamily, fontWeight:'600', fontSize: 10, color: 'black'}}>
                        COUPON
                      </Text>         
                    </View>
                    <View style={{flex: 0.5, justifyContent: 'flex-end', alignItems: 'center'}}>
                      <Text style={{fontFamily: FLFontFamily, fontWeight:'500', fontSize: 20, color: 'limegreen'}}>
                        {this._getCouponTitle()}
                      </Text>
                    </View>
                    <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{fontFamily: FLFontFamily, fontWeight:'200', fontSize: 9}}>
                        équiv. annuel
                      </Text>
                    </View>

                  </View>
                </View>

                {this._getBroadcastResume()}

                <View style={{flex: 0.2, justifyContent: 'center',alignItems: 'center',backgroundColor: 'whitesmoke',borderWidth: 0,flexDirection: 'row', paddingBottom:5, paddingTop: 5}}>
              
                      <TouchableOpacity onPress={() => alert('Ouverture du KID')}
                                         style={{flex : 0.33, paddingLeft: 10, paddingRight: 10,marginLeft: 3,marginRight: 3, backgroundColor: '#C0C0C0', borderRadius: 2, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: FLFontFamily, fontSize: 16, fontWeight : '400'}}>
                            KID
                          </Text>
              
                      </TouchableOpacity>                    
          

                      <TouchableOpacity onPress={() => alert('Ouverture de la TS indic')}
                                      style={{flex : 0.33, paddingLeft: 10, paddingRight: 10,marginLeft: 3,marginRight: 3, backgroundColor: '#C0C0C0', borderRadius: 2, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: FLFontFamily, fontSize: 16, fontWeight : '400'}}>
                            TS indic
                          </Text>
      
                      </TouchableOpacity>       
        
                  
                     <TouchableOpacity onPress={() => alert('Ouverture de la TS indic')}
                                      style={{flex : 0.33, paddingLeft: 10, paddingRight: 10, marginLeft: 3,marginRight: 3, backgroundColor: '#C0C0C0', borderRadius: 2, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: FLFontFamily, fontSize: 16, fontWeight : '400'}}>
                            Descriptif
                          </Text>
       
                      </TouchableOpacity>  
     
                </View>
              </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    wrapper: {
      //paddingLeft: 15,
      //paddingRight: 15,
      //justifyContent : 'center',
      alignItems: 'center',
      marginTop: Platform.OS === 'ios' ? -60+45 : -25+45,
      
    },
    item: {
      //height: 150,
      backgroundColor: '#fff',
      marginBottom: 20,
      shadowColor: 'rgb(75, 89, 101)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,

    }
  })


export default FLTicket;