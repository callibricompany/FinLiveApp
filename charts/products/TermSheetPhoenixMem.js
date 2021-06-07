import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import PositiveScenarioGlobPhoenixMem from './ScenarioGlob/PositiveScenarioGlobPhoenixMem'
import NegativeScenarioGlobPhoenixMem from './ScenarioGlob/NegativeScenarioGlobPhoenixMem'
import MedianScenarioGlobPhoenixMem from './ScenarioGlob/MedianScenarioGlobPhoenixMem'
import Numeral from 'numeral';
import Moment from 'moment';
import 'numeral/locales/fr';
import { getConstant } from '../../Utils';
import { setFont } from '../../Styles/globalStyle';



export default function TermSheetPhoenixMem(props) {
  var request = props.request;
  var width_ratio = props.hasOwnProperty('width') ? props.width : 0.9;
  var show_labels = props.hasOwnProperty('labels') ? props.labels : true;

  let coupon  = request.getValue('coupon') === 0 ? 0.05 : request.getValue('coupon');
  let ymin = request.getValue('barrierPDI')*100*0.7;
  var ymax = request.getValue('autocallLevel')*100*1.1;
  var xmax = props.hasOwnProperty('xmax') ? props.xmax : 10;;
  let barr_capital = request.getValue('barrierPDI') ;
  let barr_anticipe = request.getValue('autocallLevel') ;
  let barr_coupon = request.getValue('barrierPhoenix') ;
  

  return (
    <View style={{borderWidth : 0, width : getConstant('width')*width_ratio}}>
        <View style={{}}>
        {show_labels ?
          <View style={{}}>
            <Text style={{ fontSize: 30, paddingTop: 5 }}>Phoenix Mémoire</Text>

          </View>
          : false
        }
          <View style={{}}>
            <Text style={setFont('300',16, 'black', 'Regular')}>Illustrations de scénarii de remboursement{'\n'}</Text>
            <Text style={setFont('300',12, 'black', 'Bold')}>Les données utilisées dans ces exemples n’ont qu’une valeur indicative et informative, l’objectif étant de décrire le mécanisme
            du produit. Elles ne préjugent en rien de résultats futurs. L’ensemble des données est présenté hors fiscalité et/ou frais liés
            au cadre d’investissement.{'\n'}
            </Text>
            <Text style={setFont('300',12, 'gray')}>
            {show_labels ?
              "Exemple avec un produit à maturité "
              :
              "Maturité "
            }
               {xmax} ans, une observation annuelle du sous-jacent, un coupon de {Numeral(coupon).format("0.00%")}, une barrière de coupon de {
                Numeral(barr_coupon).format("0.00%")} du niveau initial du sous-jacent, une barrière de rappel automatique anticipé de {Numeral(barr_anticipe).format("0.00%")} du niveau initial du
              sous-jacent, et une barrière de protection 
              {request.getValue('isPDIUS')
              ? " (observée à tout moment) "
              : " (observée à l’échéance) "
               } de {Numeral(barr_capital).format("0.00%")} du niveau initial du sous-jacent.
              </Text>
              <Text></Text>
              <Text style={setFont('300',12, 'gray')}>
              Ce produit possède un effet mémoire qui lui permet de récupérer les coupons non versés en cas de dépassement à la hausse de la barrière de coupon.
            </Text>
          </View>

          <NegativeScenarioGlobPhoenixMem
            coupon={coupon}
            ymin={ymin}
            ymax={ymax}
            xmax={xmax}
            barr_capital={barr_capital}
            barr_coupon={barr_coupon}
            barr_anticipe={barr_anticipe}
            width={width_ratio}
          />

          <MedianScenarioGlobPhoenixMem
            coupon={coupon}
            ymin={ymin}
            ymax={ymax}
            xmax={xmax}
            barr_capital={barr_capital}
            barr_coupon={barr_coupon}
            barr_anticipe={barr_anticipe}
            width={width_ratio}
          />

          <PositiveScenarioGlobPhoenixMem
            coupon={coupon}
            ymin={ymin}
            ymax={ymax}
            xmax={xmax}
            barr_capital={barr_capital}
            barr_coupon={barr_coupon}
            barr_anticipe={barr_anticipe}
            width={width_ratio}
          />

        </View>
      </View>
  );
}

