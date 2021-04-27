import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import WrapperGraphPayOut from './wrapperGraph/WrapperGraphPayOut'
import getRandomInt from './function/getRandomInt'

import NegativeScenario from './Scenario/NegativeScenario'
import PositiveScenario from './Scenario/PositiveScenario'
import MedianScenario from './Scenario/MedianScenario'

export default function TermSheetAutocallAirbag({request}) {
  let coupon = 5;
  let ymin = 40;
  let ymax = 130;
  let xmax = 10;

  airbag = 1;
  disable = false;
  let barr_capital = request.getValue('barrierPDI') * 100;
  let barr_anticipe = request.getValue('autocallLevel') * 100;

  const [scenarioNegatif, setScenarioNegatif] = useState(getRandomInt(44, 58))
  const [scenarioNeutre, setScenarioNeutre] = useState(getRandomInt(61, 90))
  const [scenarioPositif, setScenarioPositif] = useState(getRandomInt(110, 121))
  const [switchAirbag, setSwitchAirbag] = useState(airbag)
  
  function changeAirbag(value) {
    setSwitchAirbag(value);
    // console.log("airbag Changed to " + value)
  }

  function newScenarioNegatif() {
    setScenarioNegatif(getRandomInt(44, 58));
  }

  function newScenarioNeutre() {
    setScenarioNeutre(getRandomInt(61, 90));
  }

  function newScenarioPositif() {
    setScenarioPositif(getRandomInt(110, 121));
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.container}>
            <Text style={{ fontSize: 30, paddingTop: 5 }}>Autocall Incremental</Text>
            <Text style={{ fontSize: 26, paddingBottom: 5, fontStyle: 'italic' }}>avec ou sans airbag</Text>
          </View>
          <View style={styles.container}>
            <Text style={{ fontSize: 20, paddingVertical: 5 }}>Illustrations de scénarii de remboursement</Text>
            <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>Les données utilisées dans ces exemples n’ont qu’une valeur indicative et informative, l’objectif étant de décrire le mécanisme
            du produit. Elles ne préjugent en rien de résultats futurs. L’ensemble des données est présenté hors fiscalité et/ou frais liés
            au cadre d’investissement.
            </Text>
            <Text style={{ paddingBottom: 15 }}>
              Exemple avec un produit à maturité {xmax} ans, avec ou sans un mécanisme dit "airbag", une observation annuelle du sous-jacent, un coupon de {coupon}%, une barrière de rappel
              automatique anticipé de {barr_anticipe}% du niveau initial du sous-jacent, et une barrière de protection (observée à l’échéance) de {barr_capital}%
              du niveau initial du sous-jacent.
            </Text>
          </View>

          {/* ****************** Bloc ****************************************************** */}
          <View style={{ paddingBottom: 30 }}>
            <NegativeScenario
              remb={scenarioNegatif}
              coupon={coupon}
              ymin={ymin}
              ymax={ymax}
              xmax={xmax}
              barr_capital={barr_capital}
              barr_anticipe={barr_anticipe}
              xrel={0}
              airbag={airbag}
              rand_func={() => newScenarioNegatif()}
            />
            <WrapperGraphPayOut
              remb={scenarioNegatif}
              coupon={coupon}
              ymin={ymin}
              ymax={ymax}
              xmax={xmax}
              barr_capital={barr_capital}
              barr_anticipe={barr_anticipe}
              xrel={0}
              airbag={airbag}
            />
          </View>

          {/* ****************** Bloc ****************************************************** */}
          <View style={{ paddingBottom: 30 }}>
            <MedianScenario
              remb={scenarioNeutre}
              coupon={coupon}
              ymin={ymin}
              ymax={ymax}
              xmax={xmax}
              barr_capital={barr_capital}
              barr_anticipe={barr_anticipe}
              xrel={0}
              airbag={switchAirbag}
              rand_func={() => newScenarioNeutre()}
              airbag_func={(val) => changeAirbag(val)}
              disable={disable}
            />
            <WrapperGraphPayOut
              remb={scenarioNeutre}
              coupon={coupon}
              ymin={ymin}
              ymax={ymax}
              xmax={xmax}
              barr_capital={barr_capital}
              barr_anticipe={barr_anticipe}
              xrel={0}
              airbag={switchAirbag}
            />
          </View>

          {/* ****************** Bloc ****************************************************** */}
          <View style={{ paddingBottom: 10 }}>
            <PositiveScenario
              remb={scenarioPositif}
              coupon={coupon}
              ymin={ymin}
              ymax={ymax}
              xmax={xmax}
              barr_capital={barr_capital}
              barr_anticipe={barr_anticipe}
              xrel={1}
              airbag={airbag}
              rand_func={() => newScenarioPositif()}
            />
            <WrapperGraphPayOut
              remb={scenarioPositif}
              coupon={coupon}
              ymin={ymin}
              ymax={ymax}
              xmax={xmax}
              barr_capital={barr_capital}
              barr_anticipe={barr_anticipe}
              xrel={1}
              airbag={airbag}
            />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
  },
});