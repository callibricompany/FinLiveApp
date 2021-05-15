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
import Numeral from 'numeral';
import Moment from 'moment';
import 'numeral/locales/fr';

import { setFont, setColor } from '../../Styles/globalStyle';
import { getConstant } from '../../Utils';


export default function TermSheetAutocallAirbag({request, disable}) {

  let coupon = request.getValue('coupon') === 0 ? 0.05 : request.getValue('coupon');
  
  let ymin = 40;
  let ymax = 130;
  let xmax = 10;

  let typeAirbag = request.getValue('typeAirbag');

  let airbag = 0;
  let airbagText = 'sans airbag';
  if (typeAirbag === 'SA') {
    airbag = 0.5;
    airbagText = 'avec semi-airbag';
  }
  if (typeAirbag === 'FA') {
    airbag = 1;
    airbagText = 'avec airbag';
  }
  //disable = false;
  let barr_capital = request.getValue('barrierPDI');
  let barr_anticipe = request.getValue('autocallLevel') ;

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
     <View>
        <View style={{borderWidth : 0, marginRight : getConstant('width')*0.025}}>
          <View style={{}}>
            <Text style={setFont('400', 18, 'gray', 'Bold')}>Autocall Incremental</Text>
            <Text style={{ fontSize: 16, paddingBottom: 5, fontStyle: 'italic', color : 'darkgray' }}>
            {airbagText}
            </Text>
          </View>
          <View style={{}}>
            <Text style={setFont('300', 16, 'black')}>Illustrations de scénarii de remboursement</Text>
            <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>Les données utilisées dans ces exemples n’ont qu’une valeur indicative et informative, l’objectif étant de décrire le mécanisme
            du produit. Elles ne préjugent en rien de résultats futurs. L’ensemble des données est présenté hors fiscalité et/ou frais liés
            au cadre d’investissement.
            </Text>
            <Text style={{ paddingBottom: 15 }}>
              Produit à maturité {xmax} ans, {typeAirbag === 'NA' ? '' : typeAirbag  === "SA" ? "avec un mécanisme dit semi-airbag," : "avec un mécanisme dit airbag,"} une observation annuelle du sous-jacent, un coupon de {Numeral(coupon).format("0.00%")}, une barrière de rappel
              automatique anticipé de {Numeral(barr_anticipe).format("0.00%")} du niveau initial du sous-jacent, et une barrière de protection (observée à l’échéance) de {Numeral(barr_capital).format("0.00%")} du niveau initial du sous-jacent.
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
      </View>
  );
}

