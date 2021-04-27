import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import PositiveScenarioGlobPhoenix from './ScenarioGlob/PositiveScenarioGlobPhoenix'
import NegativeScenarioGlobPhoenix from './ScenarioGlob/NegativeScenarioGlobPhoenix'
import MedianScenarioGlobPhoenix from './ScenarioGlob/MedianScenarioGlobPhoenix'

export default function TermSheetPhoenix({request}) {
  let coupon  = 5;
  let ymin = 40;
  ymax = 130;
  xmax = 10;
  let barr_capital = request.getValue('barrierPDI') * 100;
  let barr_anticipe = request.getValue('autocallLevel') * 100;
  let barr_coupon = request.getValue('barrierPhoenix') * 100;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.container}>
            <Text style={{ fontSize: 30, paddingTop: 5 }}>Phoenix</Text>
            {/* <Text style={{ fontSize: 26, paddingBottom: 5, fontStyle: 'italic' }}>avec ou sans airbag</Text> */}
          </View>
          <View style={styles.container}>
            <Text style={{ fontSize: 20, paddingVertical: 5 }}>Illustrations de scénarii de remboursement</Text>
            <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>Les données utilisées dans ces exemples n’ont qu’une valeur indicative et informative, l’objectif étant de décrire le mécanisme
            du produit. Elles ne préjugent en rien de résultats futurs. L’ensemble des données est présenté hors fiscalité et/ou frais liés
            au cadre d’investissement.
            </Text>
            <Text style={{ paddingBottom: 15 }}>
              Exemple avec un produit à maturité {xmax} ans, une observation annuelle du sous-jacent, un coupon de {coupon}%, une barrière de coupon de {
                barr_coupon}% du niveau initial du sous-jacent, une barrière de rappel automatique anticipé de {barr_anticipe}% du niveau initial du
              sous-jacent, et une barrière de protection (observée à l’échéance) de {barr_capital}% du niveau initial du sous-jacent.
            </Text>
          </View>

          <NegativeScenarioGlobPhoenix
            coupon={coupon}
            ymin={ymin}
            ymax={ymax}
            xmax={xmax}
            barr_capital={barr_capital}
            barr_coupon={barr_coupon}
            barr_anticipe={barr_anticipe}
          />

          <MedianScenarioGlobPhoenix
            coupon={coupon}
            ymin={ymin}
            ymax={ymax}
            xmax={xmax}
            barr_capital={barr_capital}
            barr_coupon={barr_coupon}
            barr_anticipe={barr_anticipe}
          />

          <PositiveScenarioGlobPhoenix
            coupon={coupon}
            ymin={ymin}
            ymax={ymax}
            xmax={xmax}
            barr_capital={barr_capital}
            barr_coupon={barr_coupon}
            barr_anticipe={barr_anticipe}
          />

        </View>
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
  },
});