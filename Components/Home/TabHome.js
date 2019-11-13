import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Text, Platform, Alert} from 'react-native'; 
import { Thumbnail, Toast, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";

import { FLFlatList } from '../SearchBar/searchBarAnimation';

import { withUser } from '../../Session/withAuthentication';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';


import Dimensions from 'Dimensions';

import {  globalStyle, 
  generalFontColor, 
  tabBackgroundColor,
  headerTabColor,
  selectElementTab,
  progressBarColor,
  subscribeColor,
  FLFontFamily,
  FLFontFamilyBold
} from '../../Styles/globalStyle';

import FLTemplateAutocall from '../commons/Autocall/FLTemplateAutocall';
import { CAutocall } from '../../Classes/Products/CAutocall';
import * as TEMPLATE_TYPE from '../../constants/template';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class TabHome extends React.PureComponent {
  
    constructor(props) {
      super(props);
  
      this.state = {
        scrollTo : this.props.marginSearch,
        refreshing : false,
        
      };
   

    this.allProducts = this.props.homePage;
    //console.log(this.allProducts[0]);
   /* this.allProducts.forEach((product) => {
      //console.log(product);
      switch(product.template) {
          case 'PSLIST' :
            product['obj'] = new CAutocall(product.data);
            break;
          default : break;
      }
    });*/
    //le produit-ticket est filtre ou pas
    this.isFiltered = false;
      
    }
  
    componentWillReceiveProps (props) {
      //console.log("RECEIVE PROPS HOME : "+ props.marginSearch);
      this.setState({ scrollTo: props.marginSearch, refreshing : false });
      typeof props.filters !== 'undefined' ? this.updateFilters(props.filters) : null;
    }


    //va aider pour savoir si on affiche ou pas 
    updateFilters(filters) {
      
      /*this.isFiltered = false;
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
                          this.item["data"]["code"];

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
      }*/
    }

  _handleFavorite=(index) => {
    console.log(index);
      console.log(this.allProducts[index]);
      this.props.setFavorite(this.allProducts[index])
      .then((fav) => {
        this.allProducts[index] = fav;                                    
        //console.log(fav);
        //this.setState({ isFavorite: this.allProducts[index].isFavorite })
      })
      .catch((error) => console.log("Erreur de mise en favori : " + error));
  } 


  _renderTicket = ( item , index) => {   
 //       let objProduct = item.obj;
 //       console.log(objProduct.parle());
 //       console.log(objProduct.crie());
        
        switch(item.template) {
          case 'PSLIST' : return (
              <FLTemplateAutocall 
                  object={item}
                  filters={this.props.filtersHomePage}
              />
            );
          default : return null;
        }


    }


    render() {
      //console.log(JSON.stringify(this.props.filtersHomePage));
      return (
          <View style={{marginTop :  Platform.OS === 'android' ? -25 : 0}}>
            <View>
              <FLFlatList
                //style={styles.wrapper}
                scrollTo={this.state.scrollTo}
                contentContainerStyle={globalStyle.wrapperFlatList}
                data={this.props.filtersHomePage["category"] === 'PSFAVORITES' ? this.props.favorites : this.allProducts }
                //data={this.props.homePage}
                //renderItem={this._renderRow}
                keyExtractor={(item) => {
                  let key = typeof item.data['id'] === 'undefined' ? item.data['code'] : item.data['id'];
                  return key.toString();
                }}
                tabRoute={this.props.route.key}
                renderItem={({item, index}) => (
                  this._renderTicket(item, index)    
                )}
                ListFooterComponent={() => {
                  return (
                    <TouchableOpacity onPress={() => {
                             Alert.alert("FinLive SAS","Copyright ©")
                        }}
                        style={{height : 150}}>
                      <Text style={{fontFamily : 'FLFontTitle'}}>F i n L i v e</Text>
                    </TouchableOpacity>
                  );
                }}
                /*ListHeaderComponent={() => {
                  
                  return (
                    this.state.refreshing ?
                      <ActivityIndicator style={{height: 80}} size={"small"} /> : <View/>
              
                  );
                }}*/

                //refreshing={this.state.refreshing}
                /*onRefresh={() => {
                  console.log("Est rafraichi");
                  
                  //this.setState({ refreshing: true }, () => this.props.getUserAllInfo());
                  this.setState({ refreshing: true });
                }}*/
                
              />
            </View>
    
  
  
          </View>

      );
    }
  }


const composedWithNav = compose(
    //withAuthorization(condition),
     withNavigation,
     withUser
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(TabHome);
