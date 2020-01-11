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
  Alert
} from "react-native";

import { FLScrollView } from "../SearchBar/searchBarAnimation";

import { withUser } from "../../Session/withAuthentication";
import { withNavigation } from "react-navigation";
import { compose, hoistStatics } from "recompose";

import RobotBlink from "../../assets/svg/robotBlink.svg";

import Dimensions from "Dimensions";

import { setFont } from "../../Styles/globalStyle";

import FLTemplateAutocall from "../commons/Autocall/FLTemplateAutocall";
import FLTemplatePSBroadcast from '../commons/Ticket/FLTemplatePSBroadcast';
import FLTemplatePSPublicAPE from '../commons/Autocall/FLTemplatePSPublicAPE';
import { CAutocall } from "../../Classes/Products/CAutocall";
import * as TEMPLATE_TYPE from "../../constants/template";

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;

class TabHome extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      scrollTo: this.props.marginSearch,
      refreshing: false,

      filteredFeaturedProducts: []
    };

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

  componentWillReceiveProps(props) {
    //console.log("RECEIVE PROPS HOME : "+ props.filters);
    this.setState({ scrollTo: props.marginSearch, refreshing: false });
    typeof props.filters !== "undefined"
      ? this.updateFilters(props.filters)
      : null;
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
      this.props.homePage.forEach(product => {
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


  _renderFeatured = (item, index) => {
    switch (item.template) {
      case "PSLIST":
        return (
          <View style={{marginLeft: DEVICE_WIDTH * 0.025}}>
             <FLTemplateAutocall object={item} templateType={TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE} isEditable={true} source={'Home'}/>
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

      {this.props.broadcasts.length !== 0  ?
            <View>
              <View
                style={{
                  marginTop: 0,
                  marginLeft: DEVICE_WIDTH * 0.025,
                  alignItems: "flex-start",
                  borderWidth: 0
                }}
              >
                <Text style={setFont("400", 18, "black", "FLFontFamily")}>
                  APE sur mesure
                </Text>
              </View>
              <FlatList
                //style={styles.wrapper}
                //scrollTo={this.state.scrollTo}
                contentContainerStyle={{ marginTop: 10, marginBottom: 5 }}
                data={
                  this.props.filtersHomePage["category"] === "PSFAVORITES"
                    ? this.props.favorites
                    : this.isFiltered
                    ? this.state.filteredFeaturedProducts
                    : this.props.broadcasts
                }
                horizontal={true}
                renderItem={({ item, index }) => {
                  switch (item.template) {
                    case "PSBROADCAST":
                      return (
                        <View style={{marginLeft: DEVICE_WIDTH * 0.025}}>
                          <FLTemplatePSBroadcast object={item} templateType={TEMPLATE_TYPE.BROADCAST_PS_FULL_TEMPLATE} source={'Home'}/>
                        </View>
                      );
                    default:
                      return null;
                  }
                }}
                //tabRoute={this.props.route.key}
                keyExtractor={item => {
                  let key =
                    typeof item.data["id"] === "undefined"
                      ? item.data["code"]
                      : item.data["id"];
                  return key.toString();
                }}
              />
          </View>
        : null
        }


        <View
          style={{
            marginTop: 20,
            marginLeft: DEVICE_WIDTH * 0.025,
            alignItems: "flex-start",
            borderWidth: 0
          }}
        >
          <Text style={setFont("400", 18, "black", "FLFontFamily")}>
            Nos recommandations
          </Text>
        </View>

        <FlatList
          //style={{marginLeft : 100}}
          //scrollTo={this.state.scrollTo}
          contentContainerStyle={{ marginTop: 10, marginBottom: 5 }}
          data={
            this.props.filtersHomePage["category"] === "PSFAVORITES"
              ? this.props.favorites
              : this.isFiltered
              ? this.state.filteredFeaturedProducts
              : this.props.homePage
          }
          horizontal={true}
          renderItem={({ item, index }) => this._renderFeatured(item, index)}
          //tabRoute={this.props.route.key}
          keyExtractor={item => {
            let key =
              typeof item.data["id"] === "undefined"
                ? item.data["code"]
                : item.data["id"];
            return key.toString();
          }}
        />

        <View
          style={{
            marginTop: 20,
            marginLeft: DEVICE_WIDTH * 0.025,
            alignItems: "flex-start",
            borderWidth: 0
          }}
        >
          <Text style={setFont("400", 18, "black", "FLFontFamily")}>
            Meilleurs coupons par sous-jacent
          </Text>
        </View>
        <FlatList
          //style={styles.wrapper}
          //scrollTo={this.state.scrollTo}
          contentContainerStyle={{ marginTop: 10, marginBottom: 5 }}
          data={
            this.props.filtersHomePage["category"] === "PSFAVORITES"
              ? this.props.favorites
              : this.isFiltered
              ? this.state.filteredFeaturedProducts
              : this.props.homePage
          }
          horizontal={true}
          renderItem={({ item, index }) => {
            switch (item.template) {
              case "PSLIST":
                return (
                  <View style={{marginLeft: DEVICE_WIDTH * 0.025}}>
                    <FLTemplateAutocall object={item} templateType={TEMPLATE_TYPE.AUTOCALL_SHORT_TEMPLATE} source={'Home'}/>
                  </View>
                );
              default:
                return null;
            }
          }}
          //tabRoute={this.props.route.key}
          keyExtractor={item => {
            let key =
              typeof item.data["id"] === "undefined"
                ? item.data["code"]
                : item.data["id"];
            return key.toString();
          }}
        />


        {this.props.apeSRP.length !== 0  ?
            <View>
              <View
                style={{
                  marginTop: 20,
                  marginLeft: DEVICE_WIDTH * 0.025,
                  alignItems: "flex-start",
                  borderWidth: 0
                }}
              >
                <Text style={setFont("400", 18, "black", "FLFontFamily")}>
                  APE du marché
                </Text>
              </View>
              <FlatList
                //style={styles.wrapper}
                //scrollTo={this.state.scrollTo}
                contentContainerStyle={{ marginTop: 10, marginBottom: 5 }}
                data={
                  this.props.filtersHomePage["category"] === "PSFAVORITES"
                    ? this.props.favorites
                    : this.isFiltered
                    ? this.state.filteredFeaturedProducts
                    : this.props.apeSRP
                }
                horizontal={true}
                renderItem={({ item, index }) => {
                  switch (item.template) {
                    case TEMPLATE_TYPE.PSSRPLIST:
                      return (
                        <View style={{marginLeft: DEVICE_WIDTH * 0.025}}>
                          <FLTemplatePSPublicAPE object={item} templateType={TEMPLATE_TYPE.BROADCAST_PS_FULL_TEMPLATE} source={'Home'}/>
                        </View>
                      );
                    default:
                      return null;
                  }
                }}
                //tabRoute={this.props.route.key}
                keyExtractor={item => item.code}
              />
          </View>
        : null
        }

        <TouchableOpacity
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
          <Text style={{ fontFamily: "FLFontTitle" }}>F i n L i v e</Text>
        </TouchableOpacity>
      </FLScrollView>
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
