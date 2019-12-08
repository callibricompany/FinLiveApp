import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback} from 'react-native';


import { globalStyle, blueFLColor, backgdColor, setFont, setColor, subscribeColor } from '../../../Styles/globalStyle'



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export class FLProductDetail extends Component{

    constructor(props) {
        super(props);

        this.state = { 
            //currentChoice : STRUCTUREDPRODUCTS.findIndex(obj => obj.id == this.props.initialValue),
            currentChoice : this.props.initialValue,

        }


    }


    render() {
        return (
            <View style={{flex : 1, flexDirection : 'column',  marginLeft: 0.05*DEVICE_WIDTH, marginRight: 0.05*DEVICE_WIDTH, borderWidth:0}}>
                    
              <View style={{marginTop : 20, borderTopWidth : 1}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                      {'\n'}Influence
                    </Text>
                    <Text style={setFont('300', 12)}>
                    Le produit choisi reflète le profil de risque de votre client. Il offrira plus ou moins de rendement en fonction du risque pris. Consultez les rubriques d'aide pour consulter les fiches descriptives de chacun de nos produits et leurs argumentaires commerciaux facilement transférables à vos clients.
                    </Text>
                    <Text style={setFont('300', 12)}>{'\n'}
                    Athéna : le paiements des coupons intervient au moment du rappel{'\n'}
                    Phoenix : le coupon est mieux protégé car il peut être payé à un niveau inférieur au niveau de rappel
                    </Text>
              </View>
              <View style={{marginTop : 10, borderTopWidth : 0}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                    Vérification
                    </Text>
                    <Text style={setFont('300', 12)}>
                    Etudiez et validez le profil de risque du produit choisi avec votre client.
                    </Text>
              </View>
              <View style={{marginTop : 10, borderTopWidth : 0}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                    Risques
                    </Text>
                    <Text style={setFont('300', 12)}>
                    Choisir un type de produit peut entrainer une lourde perte de capital
                    </Text>
              </View>
              <View style={{marginTop : 10, borderTopWidth : 0}}>
                    <Text style={setFont('400', 14, 'black', 'Regular')}>
                    Illustration
                    </Text>
   
              </View>
            </View>
        );
    }


}


