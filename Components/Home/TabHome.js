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

import { searchProducts, getMostPricedPS } from '../../API/APIAWS';
import { interpolateBestProducts } from '../../Utils/interpolatePrices';

import RobotBlink from "../../assets/svg/robotBlink.svg";


import { setFont, setColor } from "../../Styles/globalStyle";

import FLTemplateAutocall from "../commons/Autocall/FLTemplateAutocall";
import FLTemplateAutocall2 from "../commons/Autocall/FLTemplateAutocall2";
import FLTemplateEmpty from "../commons/Autocall/FLTemplateEmpty";
import FLTemplatePSBroadcast from '../commons/Ticket/FLTemplatePSBroadcast';
import FLTemplatePSPublicAPE from '../commons/Autocall/FLTemplatePSPublicAPE';
import FLTemplatePP from '../commons/Ticket/FLTemplatePP';

import { CAutocall } from "../../Classes/Products/CAutocall";
import * as TEMPLATE_TYPE from "../../constants/template";
import { CPSRequest } from "../../Classes/Products/CPSRequest";
import { isAndroid, isEqual, getConstant } from "../../Utils";
import { CWorkflowTicket } from "../../Classes/Tickets/CWorkflowTicket";
import { CBroadcastTicket } from '../../Classes/Tickets/CBroadcastTicket';
import { CTicket } from '../../Classes/Tickets/CTicket';
import { CSouscriptionTicket } from "../../Classes/Tickets/CSouscriptionTicket";

import { CAutocall2 } from '../../Classes/Products/CAutocall2';



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
    };

	this.bestCoupons = [];





    //le produit-ticket est filtre ou pas
    this.isFiltered = false;

    //
  }

  UNSAFE_componentWillReceiveProps(props) {
    console.log("RECEIVE PROPS HOME : ");
    // if (!isEqual(props.tickets, this.props.tickets)) {
    //   console.log("##########################################  ATTENTION TICKETS NON EGAUX IL FAUT LES RAJOUTER");
    // } else {
    //   console.log(" ATTENTION TICKETS sont  EGAUX  ---------------------------------------------");
    // }
    this.setState({ tickets : this.props.tickets, souscriptionTickets : this.props.souscriptionTickets });
    this.setState({ allNotificationsCount :props.allNotificationsCount });
    this.setState({ scrollTo: props.marginSearch, refreshing: false });
    typeof props.filters !== "undefined"
      ? this.updateFilters(props.filters)
      : null;
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

  //va aider pour savoir si on affiche ou pas
  updateFilters(filters) {
    //filtre sur les featured
    this.isFiltered = false;
    if (
      filters.hasOwnProperty("filterText") &&
      String(filters["filterText"]) !== ""
    ) {
      this.isFiltered = true;

      let newData = [];
      this.props.featured.forEach(product => {
        //verifier son type
        if (product.template === "PSLIST") {
          //c'est un autocall
          let autocall = new CAutocall(product.data);
          if (
            autocall
              .getDescription()
              .toLowerCase()
              .includes(String(filters["filterText"]).toLowerCase())
          ) {
            newData.push(product);
          }
        }
      });
      this.setState({ filteredFeaturedProducts: newData });
    }
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
                          this._getCoupon() +
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


  _renderFeatured = (item, index) => {
    switch (item.template) {
      case "PSLIST":
        return (
          <View style={{marginLeft: getConstant('width') * 0.025}}>
             <FLTemplateAutocall autocall={item} templateType={TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE} isEditable={true} source={'Home'}/>
          </View>
        );
      default:
        return null;
    }
  };

  render() {
    //console.log(this.props.userOrg);

    return (
      <FLScrollView
        style={{ marginTop: Platform.OS === "android" ? -65 : -45 }}
      >

          {this.state.souscriptionTickets.length !== 0  ?
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
                    data={this.state.souscriptionTickets}
                    horizontal={true}
                    renderItem={({ item, index }) => {
                      // console.log(item.getType());
                      // console.log(item.getWorkflowName());
                      // console.log(item.getTemplate());
                      if (item.getType() ===  "Produit structuré" ) {
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
                    //tabRoute={this.props.route.key}
                    keyExtractor={item => item.getId().toString()}
                  />
              </View>
            : null
            }

            {this.state.tickets.length !== 0  ?
                <View  style={{marginRight: getConstant('width') * 0.025}}>
                  <TouchableOpacity style={{marginLeft: getConstant('width') * 0.025, marginRight: getConstant('width') * 0.025, alignItems: "flex-start", borderWidth: 0}}
                                    onPress={()=>{
                                      
                                      this.props.navigation.dispatch(NavigationActions.navigate({
                                       routeName: 'Tickets',
                                       action: NavigationActions.navigate({ routeName: 'Tickets' , params : {
                                         'templateType' : TEMPLATE_TYPE.TICKET_FULL_TEMPLATE
                                       }} ),
                                      }));

                                      // NavigationService.navigate('Tickets' , {
                                      //   'templateType' : TEMPLATE_TYPE.TICKET_FULL_TEMPLATE
                                      // });

                                      // notif = {
                                      //   "event": "{priority:{from:2,to:3}}",
                                      //   "id": 110,
                                      //   "read": false,
                                      //   "subTitle": "Athéna 8 ans sur CAC Large 60 Index / mensuel",
                                      //   "subType": "Produit structuré",
                                      //   "timestamp": 1587143240454,
                                      //   "title": "TICKET : Athéna 8 ans sur CAC Large 60 Index / mensuel",
                                      //   "type": "TICKET",
                                      //   "uid": "xjoRccvRXBVo5Tqe3iaWuGBe0aX2",
                                      // };
                                      
                                      //this.props.addNotification([].concat(notif));
                                      //this.props._showToast(notif, this.props.tickets[0]);
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
                    data={this.state.tickets}
                    extraData={this.state.allNotificationsCount}
                    horizontal={true}
                    renderItem={({ item, index }) => {
                      
                      //let isNotified = this.props.isNotified('TICKET', item.getId());
                      
                      switch(item.getType()) {
                         case "Produit structuré" :
                            switch (item.getTemplate()) {
                              case TEMPLATE_TYPE.PSAPE : 
                                return null;
                              case TEMPLATE_TYPE.PSPP :         
                                return (
                                  <View style={{marginLeft: getConstant('width') * 0.025,}}>
                   
                                    <FLTemplatePP ticket={item} templateType={TEMPLATE_TYPE.TICKET_MEDIUM_TEMPLATE} source={'Home'}/>
                                  </View>
                                );
                              default : return null;
                            }
                         default : return null;
                      }
                    }}
                    keyExtractor={(item) => item.getId().toString()}
                  />
              </View>
            : null
            }

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
                  // data={
                  //   this.props.filtersHomePage["category"] === "PSFAVORITES"
                  //     ? this.props.favorites
                  //     : this.isFiltered
                  //     ? this.state.filteredFeaturedProducts
                  //     : this.props.featured
                  // }
                  data={this.state.filteredFeaturedProducts.length === 0 ? this.props.featured.slice(0,2) : this.state.filteredFeaturedProducts}
                  horizontal={true}
                  renderItem={({ item, index }) => {
                    return (
                        <View style={{marginLeft: getConstant('width') * 0.025}}>
                          {this.state.filteredFeaturedProducts.length === 0 ?
                              <FLTemplateEmpty templateType={TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE} />
                            : 	<FLTemplateAutocall2 autocall={item} templateType={TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE} isEditable={true}/> 
                          }
						            
                          {/* <FLTemplateAutocall autocall={item} templateType={TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE} isEditable={true} source={'Home'}/> */}
                        </View>
                    )
                  }}
                  keyExtractor={item =>  this.state.filteredFeaturedProducts.length === 0 ? item.getInternalCode() : item.getUniqueId()}
                />
            </View>

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
                  data={this.bestCoupons.length === 0 ? this.props.featured.slice(0,2) : this.bestCoupons}
                  horizontal={true}
                  
                  renderItem={({ item, index }) => {

                        return (
                          <View style={{marginLeft: getConstant('width') * 0.025}}>
                          {this.bestCoupons.length === 0 ?
                              <FLTemplateEmpty templateType={TEMPLATE_TYPE.AUTOCALL_SHORT_TEMPLATE} />
                            : <FLTemplateAutocall2 autocall={item} templateType={TEMPLATE_TYPE.AUTOCALL_SHORT_TEMPLATE}/> 
                          }
                          </View>
                        );
        
                  }}
                  extraData={this.state.extraData}
                  keyExtractor={item =>  this.bestCoupons.length === 0 ? item.getInternalCode() : item.getUniqueId()}
                />
            </View>


            {this.props.apeSRP.length !== 0  ?
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
                      APE du marché
                    </Text>
                  </View>
                  <FlatList
                    //style={styles.wrapper}
                    //scrollTo={this.state.scrollTo}
                    contentContainerStyle={{ marginTop: 10, marginBottom: 25 }}
                    data={this.props.apeSRP}
                    horizontal={true}
                    renderItem={({ item, index }) => {
                      switch (item.template) {
                        case TEMPLATE_TYPE.PSSRPLIST:
                          return (
                            <View style={{marginLeft: getConstant('width') * 0.025}}>
                              {/* <FLTemplatePSPublicAPE object={item} templateType={TEMPLATE_TYPE.BROADCAST_PS_FULL_TEMPLATE} source={'Home'}/> */}
                            </View>
                          );
                        default:
                          return null;
                      }
                    }}
                    //tabRoute={this.props.route.key}
                    keyExtractor={item => item.code}
                    onEndReachedThreshold={0.1}
                    onEndReached={() => {
                      
                      if (this.state.apeSRPRefreshing) {
                        return null;
                      }
                      console.log("onEndReached");
                      this.setState({ apeSRPRefreshing : true });
        
                    }}
                    ListFooterComponent={this.state.apeSRPRefreshing ? <View style={{flex: 1, marginLeft : 30, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size={'large'} /></View> : null }
                  />
              </View>
            : null
            }
            <View style={{height: isAndroid() ? 100 : 150}} />
            {/*<TouchableOpacity
              onPress={() => {
                Alert.alert("FinLive SAS", "Copyright ©");
              }}
              style={{
                height: 150,
                alignItems: "center",
                marginTop: 100,
                marginBottom: 150
              }}
            >
              <RobotBlink width={100} height={100} />
              <Text style={{ fontFamily: "FLFont" }}>F i n L i v e</Text>
            </TouchableOpacity>*/}
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
