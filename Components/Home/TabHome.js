import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Platform,
  Alert,
  Dimensions
} from "react-native";
import { NavigationActions } from 'react-navigation';

import { FLScrollView } from "../SearchBar/searchBarAnimation";

import { withAuthorization } from '../../Session';

import { withUser } from "../../Session/withAuthentication";
import { withNavigation } from "react-navigation";
import NavigationService from '../../Navigation/NavigationService';
import { compose, hoistStatics } from "recompose";

import { searchProducts, getMostPricedPS, getUserFavorites} from '../../API/APIAWS';
import { interpolateBestProducts } from '../../Utils/interpolatePrices';

import RobotBlink from "../../assets/svg/robotBlink.svg";


import { setFont, setColor } from "../../Styles/globalStyle";

import FLTemplateAutocall from "../commons/Autocall/FLTemplateAutocall";
import FLTemplateEmpty from "../commons/Autocall/FLTemplateEmpty";
import FLTemplatePSBroadcast from '../commons/Ticket/FLTemplatePSBroadcast';
import FLTemplatePSPublicAPE from '../commons/Autocall/FLTemplatePSPublicAPE';
import FLTemplatePP from '../commons/Ticket/FLTemplatePP';

import { CAutocall } from "../../Classes/Products/CAutocall";
import * as TEMPLATE_TYPE from "../../constants/template";
import { CPSRequest } from "../../Classes/Products/CPSRequest";
import { isAndroid, isEqual, getConstant } from "../../Utils";
import { CWorkflowTicket } from "../../Classes/Tickets/CWorkflowTicket";
import { CTicket } from '../../Classes/Tickets/CTicket';
import { CSouscriptionTicket } from "../../Classes/Tickets/CSouscriptionTicket";

import { CAutocall2 } from '../../Classes/Products/CAutocall2';
import { CAutocallSRP } from "../../Classes/Products/CAutocallSRP";



class TabHome extends React.PureComponent {
  constructor(props) {
    super(props);
      
    this.state = {
      scrollTo: this.props.marginSearch,
      refreshing: false,

      filteredFeaturedProducts: [],

      bestCouponsExtraData : true,


      //gestion affichage activityindicator en fin des flatlist
      apeSRPRefreshing : false,

      //rentre le nombre de ticket non lus pour mettre à jour les template
      allNotificationsCount : this.props.allNotificationsCount,

      //tickets
      tickets : this.props.tickets,
      souscriptionTickets : this.props.souscriptionTickets,

      //searchtext
      searchText : '',
    };

    this.bestCoupons = [];






    //le produit-ticket est filtre ou pas
    //this.isFiltered = false;

    //
  }

  async UNSAFE_componentWillReceiveProps(props) {
    //console.log("RECEIVE PROPS HOME : ");
    // if (!isEqual(props.tickets, this.props.tickets)) {
    //   console.log("##########################################  ATTENTION TICKETS NON EGAUX IL FAUT LES RAJOUTER");
    // } else {
    //   console.log(" ATTENTION TICKETS sont  EGAUX  ---------------------------------------------");
    // }
    if (!isEqual(props.tickets, this.state.tickets)) {
      this.setState({ tickets : props.tickets, });
    }
    if (!isEqual(props.souscriptionTickets, this.state.souscriptionTickets)) {
      this.setState({ souscriptionTickets : props.souscriptionTickets });
    }
    
    this.setState({ allNotificationsCount :props.allNotificationsCount });
    this.setState({ scrollTo: props.marginSearch, refreshing: false });
    if (!isEqual(props.filters, this.props.filters)) {
  
        if (props.filters['category'] !== this.props.filters['category']) {
          if (props.filters['category'] === 'PSFAVORITES') {
              try {
                this.setState({ refreshing : true });
                var products = await getUserFavorites(this.props.firebase, 'ALL');
                var favoriteProducts =[];
                if (products['products'].length > 0) {
                  products['products'].forEach((autocall) => {
                    favoriteProducts.push(new CAutocall2(autocall));
                  });
                } 

                if (products['structuredproducts'].length > 0) {
                  products['structuredproducts'].forEach((autocall) => {
                    favoriteProducts.push(new CAutocallSRP(autocall));
                  });
                }

                this.props.setFavoriteProducts(favoriteProducts );
                
              } catch (error) {
                alert('Erreur dans la récupération des favoris');
                console.log(error);
                this.props.setFilters();
                this.props.setFavoriteProducts([]);
              }
          } else if (props.filters['category'] === 'PS') {
            this.props.setFavoriteProducts();
          }
        }

        this.setState({ searchText : props.filters['filterText'] })
        //this.props.setFilters(props.filters);

    }
  }

  
  async componentDidMount(){

              //chargement des meilleurs coupons
              let allUnderlyings = this.props.getAllUndelyings();

              // allUnderlyings.forEach((u) => {
              u = allUnderlyings[0];
              //console.log(u);
              let request = new CPSRequest();
              //request.setCriteria('type', autocall.getProductCode(), autocall.getProductName());
              //request.setCriteria('underlying', u.split(), u);
              request.setCriteria('underlying', ['CAC'], 'CAC');
              request.setCriteria('maturity', [8,8], "8Y");
              request.setCriteria('barrierPDI', 0.6, "Protégé jusqu'à -40%");
              request.setCriteria('barrierPhoenix', 1, "Coupon payé au rappel");
              request.setCriteria('isMemory', true, "Mémoire");

              try {
                var data = await searchProducts(this.props.firebase, request.getCriteria(), false)
                if (data.length > 0) {
                  data.forEach((autocall) => {
                    autocall['PRICINGLOG'] = "SUGGESTION_BEST_COUPONS";
                    this.bestCoupons.push(new CAutocall2(autocall));
                  });
                  this.setState({ bestCouponsExtraData : !this.state.bestCouponsExtraData });
                }
              }
              catch(error) {
                console.log("ERREUR recup prix " + error);
                //alert('ERREUR calcul des prix', '' + error);
              };

              //chargement des produits structurés les plus demandés
              try {
                var dataFeatured = await getMostPricedPS(this.props.firebase)
                //console.log(JSON.stringify(dataFeatured));
                var autocallArray = [];
                dataFeatured.forEach((autocall) => autocallArray.push(new CAutocall2(autocall)))
                this.setState({ filteredFeaturedProducts : autocallArray });
              }
              catch(error) {
                console.log("ERREUR recup prix les plus demandés " + error);
                //alert('ERREUR calcul des prix', '' + error);
              };

  }

  _renderFavorites() {

    var elemToShow = [];
    if (this.state.searchText !== '') {
      this.props.favoriteProducts.forEach((elem) => {
          if (elem.getFilterText().includes(this.state.searchText.toLowerCase())) {
            elemToShow.push(elem);
          }
      });
    } else {
      elemToShow = this.props.favoriteProducts;
    }

    return (
      <View style={{ flex : 1, marginTop: 60 , borderWidth : 0}}>
            <FlatList
              contentContainerStyle={{ marginTop: 10, marginBottom: 200 }}
              data={elemToShow}
              renderItem={({ item, index }) => {

                    switch(item.getProductType()) {
                      case 'STRUCTURED_PRODUCT' : 
                        return (
                            <View style={{marginBottom : 20, justifyContent : 'center', alignItems : 'center'}}>
                                <FLTemplateAutocall autocall={item} templateType={TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE} isEditable={true}/> 
                            </View>
                        )
                      case 'STRUCTURED_PRODUCT_SRP' : 
                        return (
                            <View style={{marginBottom : 20, justifyContent : 'center', alignItems : 'center'}}>
                                <FLTemplatePSPublicAPE product={item} />
                            </View>
                        )
                      default : return <View />
                    }
              }}
              extraData={this.state.searchText}
              keyExtractor={(item, index) =>  item.getUniqueId()}
              ListFooterComponent={() => <View style={{height : 200}} />}
            />
        </View>
  
    );
  }

  render() {
    //gestion des filtres et du searchtext
    var souscriptionTickets = [];
    var tickets = [];
    var filteredFeaturedProducts = [];
    var bestCoupons = [];
    var apeSRP = [];
    
    if (this.state.searchText !== '') {

      //tickets de souscription (invitations)
      this.state.souscriptionTickets.forEach((elem) => {
          if (elem.getFilterText().includes(this.state.searchText.toLowerCase())) {
            souscriptionTickets.push(elem);
          }
      });
      
      //tickets classiques
      this.state.tickets.forEach((elem) => {
        if (elem.getFilterText().includes(this.state.searchText.toLowerCase())) {
          tickets.push(elem);
        }
      });

      //featured
      this.state.filteredFeaturedProducts.forEach((elem) => {
        if (elem.getFilterText().includes(this.state.searchText.toLowerCase())) {
          filteredFeaturedProducts.push(elem);
        }
      });

      //best coupons
      this.bestCoupons.forEach((elem) => {
        if (elem.getFilterText().includes(this.state.searchText.toLowerCase())) {
          bestCoupons.push(elem);
        }
      });

      //ape srp
      this.props.apeSRP.forEach((elem) => {
        if (elem.getFilterText().includes(this.state.searchText.toLowerCase())) {
          apeSRP.push(elem);
        }
      });

    } else {
      souscriptionTickets = this.state.souscriptionTickets;
      tickets = this.state.tickets;
      filteredFeaturedProducts = this.state.filteredFeaturedProducts;
      bestCoupons = this.bestCoupons;
      apeSRP = this.props.apeSRP;
    }

    if (this.state.refreshing) {
      return (
            <View style={{flex : 1, justifyContent: 'center', alignItems: 'center'}}>
                  <ActivityIndicator size='large' />
            </View>
      );
    }

    if (this.props.filters !== '' && this.props.filters !== [] && this.props.filters['category'] === 'PSFAVORITES') {
      return this._renderFavorites();
    }

    return (
      <FLScrollView
        style={{ marginTop: Platform.OS === "android" ? -65 : -45 }}
      >

          {souscriptionTickets.length !== 0  ?
                <View style={{marginRight: 0.025*getConstant('width')}}>
                  <View
                    style={{
                      marginLeft: getConstant('width') * 0.025,
                      alignItems: "flex-start",
                      borderWidth: 0
                    }}
                  >
                    <Text style={setFont("400", 18)}>
                      Invitations
                    </Text>
                  </View>
                  <FlatList
                    //style={styles.wrapper}
                    //scrollTo={this.state.scrollTo}
                    contentContainerStyle={{ marginTop: 10, marginBottom: 25 }}
                    data={souscriptionTickets}
                    horizontal={true}
                    renderItem={({ item, index }) => {
       
                      if (item.getTicketType() ===  "Produit structuré" ) {
                        return (
                          <View style={{marginLeft: getConstant('width') * 0.025,}}>
                            <FLTemplatePP ticket={item} templateType={TEMPLATE_TYPE.TICKET_MEDIUM_TEMPLATE} source={'Home'} isBroadcast={true}/>
                          </View>
                          // <View style={{marginLeft: getConstant('width') * 0.025}}>
                          //   <FLTemplatePSBroadcast ticket={ticket} templateType={TEMPLATE_TYPE.BROADCAST_PS_FULL_TEMPLATE} source={'Home'}/>
                          // </View>
                        );
                      }
                      return null;
                 
                    }}
                    extraData={this.state.searchText}
                    keyExtractor={item => item.getId().toString()}
                  />
              </View>
            : null
            }

            {tickets.length !== 0  ?
                <View  style={{marginRight: getConstant('width') * 0.025}}>
                  <TouchableOpacity style={{marginLeft: getConstant('width') * 0.025, marginRight: getConstant('width') * 0.025, alignItems: "flex-start", borderWidth: 0}}
                                    onPress={()=>{
                                      
                                      this.props.navigation.dispatch(NavigationActions.navigate({
                                       routeName: 'Tickets',
                                       action: NavigationActions.navigate({ routeName: 'Tickets' , params : {
                                         'templateType' : TEMPLATE_TYPE.TICKET_FULL_TEMPLATE
                                       }} ),
                                      }));
                                   }}
                  >
                    <Text style={setFont("400", 18)}>
                      Mes trades en cours
                    </Text>
                  </TouchableOpacity>
                  <FlatList
                    //style={styles.wrapper}
                    //scrollTo={this.state.scrollTo}
                    contentContainerStyle={{ marginTop: 10, marginBottom: 10 }}
                    data={tickets}
                    //extraData={this.state.allNotificationsCount}
                    extraData={this.state.searchText}
                    horizontal={true}
                    renderItem={({ item, index }) => {
                      //let isNotified = this.props.isNotified('TICKET', item.getId());
                      switch(item.getTicketType()) {
                         case "Produit structuré" :
                            //switch (item.getTemplate()) {
                             // case TEMPLATE_TYPE.PSAPE : 
                             //   return null;
                             // case TEMPLATE_TYPE.PSPP :         
                                return (
                                  <View style={{marginLeft: getConstant('width') * 0.025,}}>
                   
                                    <FLTemplatePP ticket={item} templateType={TEMPLATE_TYPE.TICKET_MEDIUM_TEMPLATE} source={'Home'}/>
                                  </View>
                                );
                              //default : return null;
                            //}
                         default : return <View />;
                      }
                    }}
                    keyExtractor={(item) => {
                      return item.getId().toString();
                    }}
                  />
              </View>
            : null
            }

            {(this.state.searchText !== '' && filteredFeaturedProducts.length === 0)
            ? null
            :
                <View  style={{marginRight: getConstant('width') * 0.025, marginTop : 15}}>
                    <View
                      style={{
                        marginLeft: getConstant('width') * 0.025,
                        marginRight: getConstant('width') * 0.025,
                        alignItems: "flex-start",
                        borderWidth: 0
                      }}
                    >
                      <Text style={setFont("400", 18)}>
                        Les plus demandés 
                      </Text>
                    </View>
                    <FlatList
                      //style={{marginLeft : 100}}
                      //scrollTo={this.state.scrollTo}
                      contentContainerStyle={{ marginTop: 10, marginBottom: 25 }}
                      data={filteredFeaturedProducts.length === 0 ? new Array(2) : filteredFeaturedProducts}
                      horizontal={true}
                      renderItem={({ item, index }) => {
                        return (
                            <View style={{marginLeft: getConstant('width') * 0.025}}>
                              {filteredFeaturedProducts.length === 0 ?
                                  <FLTemplateEmpty templateType={TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE} />
                                : 	<FLTemplateAutocall autocall={item} templateType={TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE} isEditable={true}/> 
                              }
                            
                              {/* <FLTemplateAutocall autocall={item} templateType={TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE} isEditable={true} source={'Home'}/> */}
                            </View>
                        )
                      }}
                      keyExtractor={(item, index) =>  filteredFeaturedProducts.length === 0 ? String(index) : item.getUniqueId()}
                      extraData={this.state.searchText}
                    />
                </View>
            }

          {(this.state.searchText !== '' && bestCoupons.length === 0)
          ? null
          :
            <View  style={{marginRight: getConstant('width') * 0.025}}>
                <View
                  style={{
                    marginLeft: getConstant('width') * 0.025,
                    alignItems: "flex-start",
                    borderWidth: 0
                  }}
                >
                  <Text style={setFont("400", 18)}>
                    Meilleurs coupons par sous-jacent
                  </Text>
                </View>
                <FlatList
                  //style={styles.wrapper}
                  //scrollTo={this.state.scrollTo}
                  contentContainerStyle={{ marginTop: 10, marginBottom: 25 }}
                  data={bestCoupons.length === 0 ? new Array(2) : bestCoupons}
                  horizontal={true}
                  
                  renderItem={({ item, index }) => {

                        return (
                          <View style={{marginLeft: getConstant('width') * 0.025}}>
                          {bestCoupons.length === 0 ?
                              <FLTemplateEmpty templateType={TEMPLATE_TYPE.AUTOCALL_SHORT_TEMPLATE} />
                            : <FLTemplateAutocall autocall={item} templateType={TEMPLATE_TYPE.AUTOCALL_SHORT_TEMPLATE}/> 
                          }
                          </View>
                        );
        
                  }}
                  extraData={this.state.searchText}
                  keyExtractor={(item, index) =>  bestCoupons.length === 0 ? String(index) : item.getUniqueId()}
                />
            </View>
          }

            {apeSRP.length !== 0  ?
                <View  style={{marginRight: getConstant('width') * 0.025}}>
                  <View
                    style={{
                      marginLeft: getConstant('width') * 0.025,
                      marginRight: getConstant('width') * 0.025,
                      alignItems: "flex-start",
                      borderWidth: 0
                    }}
                  >
                    <Text style={setFont("400", 18)}>
                      Offres publiques en cours
                    </Text>
                  </View>
                  <FlatList
                    //style={styles.wrapper}
                    //scrollTo={this.state.scrollTo}
                    contentContainerStyle={{ marginTop: 10, marginBottom: 25 }}
                    data={apeSRP}
                    horizontal={true}
                    renderItem={({ item, index }) => {
                          return (
                            <View style={{marginLeft: getConstant('width') * 0.025}}>
                              <FLTemplatePSPublicAPE product={item} />
                            </View>
                          );
                    }}
                    //tabRoute={this.props.route.key}
                    keyExtractor={item => item.getUniqueId()}
                    extraData={this.state.searchText}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                      
                      if (this.state.apeSRPRefreshing) {
                        return null;
                      }
                      console.log("onEndReached");
                      this.setState({ apeSRPRefreshing : false });
        
                    }}
                    ListFooterComponent={this.state.apeSRPRefreshing ? <View style={{flex: 1, marginLeft : 30, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size={'large'} /></View> : null }
                  />
              </View>
            : null
            }
            <View style={{height: isAndroid() ? 100 : 150}} />
 
      </FLScrollView>
    );
  }
}


const condition = authUser => !!authUser;
const composedWithNav = compose(
  withAuthorization(condition),
  withNavigation,
  withUser,

);

//export default HomeScreen;
export default hoistStatics(composedWithNav)(TabHome);
