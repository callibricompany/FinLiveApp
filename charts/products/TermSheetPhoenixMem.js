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


export default function TermSheetPhoenixMem({request}) {
  let coupon  = request.getValue('coupon') === 0 ? 0.05 : request.getValue('coupon');
  let ymin = 40;
  var ymax = 130;
  var xmax = 10;
  let barr_capital = request.getValue('barrierPDI') ;
  let barr_anticipe = request.getValue('autocallLevel') ;
  let barr_coupon = request.getValue('barrierPhoenix') ;
  return (
    <View>
        <View style={styles.container}>
          <View style={styles.container}>
            <Text style={{ fontSize: 30, paddingTop: 5 }}>Phoenix Mémoire</Text>
            {/* <Text style={{ fontSize: 26, paddingBottom: 5, fontStyle: 'italic' }}>avec ou sans airbag</Text> */}
          </View>
          <View style={styles.container}>
            <Text style={{ fontSize: 20, paddingVertical: 5 }}>Illustrations de scénarii de remboursement</Text>
            <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>Les données utilisées dans ces exemples n’ont qu’une valeur indicative et informative, l’objectif étant de décrire le mécanisme
            du produit. Elles ne préjugent en rien de résultats futurs. L’ensemble des données est présenté hors fiscalité et/ou frais liés
            au cadre d’investissement.
            </Text>
            <Text style={{ paddingBottom: 15 }}>
              Exemple avec un produit à maturité {xmax} ans, une observation annuelle du sous-jacent, un coupon de {Numeral(coupon).format("0.00%")}, une barrière de coupon de {
                Numeral(barr_coupon).format("0.00%")} du niveau initial du sous-jacent, une barrière de rappel automatique anticipé de {Numeral(barr_anticipe).format("0.00%")} du niveau initial du
              sous-jacent, et une barrière de protection (observée à l’échéance) de {Numeral(barr_capital).format("0.00%")} du niveau initial du sous-jacent.
              </Text>
            <Text style={{ paddingBottom: 15 }}>
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
          />

          <MedianScenarioGlobPhoenixMem
            coupon={coupon}
            ymin={ymin}
            ymax={ymax}
            xmax={xmax}
            barr_capital={barr_capital}
            barr_coupon={barr_coupon}
            barr_anticipe={barr_anticipe}
          />

          <PositiveScenarioGlobPhoenixMem
            coupon={coupon}
            ymin={ymin}
            ymax={ymax}
            xmax={xmax}
            barr_capital={barr_capital}
            barr_coupon={barr_coupon}
            barr_anticipe={barr_anticipe}
          />

        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});