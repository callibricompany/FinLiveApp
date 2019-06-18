import React from 'react'
import { View, SafeAreaView, ScrollView, Text, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView} from 'react-native'
import { Title, Icon, Label, Card, Content, CardItem, Form, Body, Item, Button, Input} from 'native-base'
import Moment from 'moment';
import localization from 'moment/locale/fr'

import { globalStyle } from '../../Styles/globalStyle'
import SwipeGesture from '../../Gesture/SwipeGesture'
import FadeInLeft from '../../Animated/FadeInLeft'

import { appToFresh } from '../../Utils/convertFresh'
import { getJsDateFromExcel } from '../../Utils/math'
import FLProductTicket from '../commons/FLProductTicket'

import { ssCreateStructuredProduct } from '../../API/APIAWS';

import { withAuthorization } from '../../Session';
import { withNavigation, getActiveChildNavigationOptions } from 'react-navigation';
import { withFirebase } from '../../Database';
import { compose, hoistStatics } from 'recompose';

import { FLBadge } from '../../Components/commons/FLBadge'
import bgSrc from '../../assets/icon_196.png'
import FontAwesomeI from 'react-native-vector-icons/FontAwesome'

import StepIndicator from 'react-native-step-indicator';
import Dimensions from 'Dimensions';

import UNDERLYINGS from '../../Data/underlyings.json'
import STRUCTUREDPRODUCTS from '../../Data/structuredProducts.json'
import FREQUENCYLIST from '../../Data/frequencyList.json'



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


const labels = ["Demande prix","Prix ferme","Ordre envoyé","Infos dépositaires","Traité", "Fiches produits ok", "Confirmé"];


class StructuredProductDetail extends React.Component {
    
    constructor(props) {
      super(props);
  
      this.product = this.props.navigation.getParam('product', '...');
      this.UF = this.props.navigation.getParam('UF', '...');
   
      this.product['UF'] = this.UF;


      //converti les champs app en champs freshdesk
      this.freshProduct = appToFresh(this.product);
      delete this.freshProduct['Price'];
      delete this.freshProduct['Vega'];
      delete this.freshProduct['code'];
      
      delete this.freshProduct['swapPrice'];
      delete this.freshProduct['spreadBarrier'];
      delete this.freshProduct['gearingPDI'];
      delete this.freshProduct['spreadAutocall'];
      delete this.freshProduct['spreadPDI'];
      delete this.freshProduct['finalDate'];
      delete this.freshProduct['endDate'];

      //test si c'est un autocall ou phoenix
      if (this.freshProduct['barrierPhoenix'] > this.freshProduct['cf_seuil_de_rappel']) {
        this.freshProduct['cf_coupon_de_rappel_en'] = this.freshProduct['coupon']*100;
        this.freshProduct['cf_coupon_phoenix'] = 0;
      } else { //c'est un Phoenix
        this.freshProduct['cf_coupon_de_rappel_en'] = 0;
        this.freshProduct['cf_coupon_phoenix'] = this.freshProduct['coupon']*100;
      }
      delete this.freshProduct['barrierPhoenix'];
      delete this.freshProduct['coupon'];
      delete this.freshProduct['couponPhoenix'];
      delete this.freshProduct['strike'];

      //adapte le format de certains champs
      this.freshProduct['cf_date_de_strike'] = Moment(getJsDateFromExcel(this.freshProduct['cf_date_de_strike'])).format('YYYY-MM-DD');
      this.freshProduct['cf_ps_startdate'] = Moment(getJsDateFromExcel(this.freshProduct['cf_ps_startdate'])).format('YYYY-MM-DD');
      
      this.freshProduct['subject'] = (STRUCTUREDPRODUCTS.filter(({id}) => id === this.product.product))[0].name;
      delete this.freshProduct['product'];
      this.freshProduct['descript'] = 'Pricing';
      this.freshProduct['department'] = 'FIN';
      this.freshProduct['cf_statusproduct'] = 'Optimisé';
      


      console.log(this.freshProduct);

      this.state = {
        nominal : 0,

      }

      

    }

    componentDidMount () {

    }

    static navigationOptions = ({ navigation }) => {
    //static navigationOptions = {
      item = navigation.getParam('product', '...');
      let productName = STRUCTUREDPRODUCTS.filter(({id}) => id === item.product);
      

      const { params } = navigation.state;
      return {
      header: (
        <SafeAreaView style={globalStyle.header_safeviewarea}>
          <TouchableOpacity style={globalStyle.header_left_view} onPress={() => navigation.goBack()}>
            <Icon name='md-arrow-back' style={globalStyle.header_icon} />
          </TouchableOpacity>
          <View style={globalStyle.header_center_view} >
            <Title style={globalStyle.header_center_text_medium}>{productName[0].name}</Title>
          </View>
          <View style={globalStyle.header_right_view} >
     
            <Icon name='md-help-circle-outline' style={globalStyle.header_icon} />

          </View>
        </SafeAreaView>
      )
      }
    }

    createStructuredProduct() {
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
    }





    render() {
  
      return(
        <View style={{flex:1 ,flexDirection:'row', justifyContent:'center',alignItems:'center'}}>
          <View style={{width : Math.min(32,DEVICE_WIDTH*0.1)}}>
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
                  labelSize: 13,
                  currentStepLabelColor: '#85B3D3'
                }}
                currentPosition={2}
                stepCount={labels.length}
                labels={labels}
                direction={"vertical"}
            />
          </View>
          <View style={{width : Math.max(DEVICE_WIDTH-32, DEVICE_WIDTH*0.9)}}>
            <ScrollView >
              {
                /*
              <Text>{JSON.stringify(this.product)}</Text>
              <Text>====================</Text>
              <Text>{JSON.stringify(this.freshProduct)}</Text>
              */}
                    <FLProductTicket item={this.product} />
                    <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>  
                        <TextInput 
                            style={{height : 50}}
                            clearButtonMode="always"
                            placeholder={"0"}
                            keyboardType='numeric'
                            onChangeText={e => this.setState({ nominal : e })} 
                        />
                      </KeyboardAvoidingView>
          

                    <Button info 
                      onPress={() => {
                        this.createStructuredProduct();
                      }}
                    >
                      <Text> JE TRAITE </Text>
                    </Button>

        
            </ScrollView>     
          </View>

        </View>
      );
      }
}



const condition = authUser => !!authUser;
const composedPricerScreen = compose(
 withAuthorization(condition),
  withFirebase,
  withNavigation,
);

//export default HomeScreen;
export default hoistStatics(composedPricerScreen)(StructuredProductDetail);
