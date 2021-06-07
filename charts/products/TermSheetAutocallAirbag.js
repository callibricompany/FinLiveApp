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


export default function TermSheetAutocallAirbag(props) {
  var request = props.request;
  
  var width_ratio = props.hasOwnProperty('width') ? props.width : 0.9;
  var show_labels = props.hasOwnProperty('labels') ? props.labels : true;

  let coupon  = request.getValue('coupon') === 0 ? 0.05 : request.getValue('coupon');
  let ymin = request.getValue('barrierPDI')*100*0.7;
  var ymax = request.getValue('autocallLevel')*100*1.1;
  var xmax = props.hasOwnProperty('xmax') ? props.xmax : 10;
  let barr_capital = request.getValue('barrierPDI')*100;
  let barr_anticipe = request.getValue('autocallLevel')*100;

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


  const [scenarioNegatif, setScenarioNegatif] = useState(barr_capital*0.6, barr_capital*0.97)
  const [scenarioNeutre, setScenarioNeutre] = useState(barr_capital*1.1, 0.97*barr_anticipe)
  const [scenarioPositif, setScenarioPositif] = useState(getRandomInt(1.05*barr_anticipe, 1.15*barr_anticipe))
  const [switchAirbag, setSwitchAirbag] = useState(airbag)

  function changeAirbag(value) {
    setSwitchAirbag(value);
    // console.log("airbag Changed to " + value)
  }

  function newScenarioNegatif() {
    setScenarioNegatif(getRandomInt(barr_capital*0.6, barr_capital*0.97));
  }

  function newScenarioNeutre() {
    setScenarioNeutre(getRandomInt(barr_capital*1.1, 0.97*barr_anticipe));
  }

  function newScenarioPositif() {
    setScenarioPositif(getRandomInt(1.05*barr_anticipe, 1.15*barr_anticipe));
  }

  return (
     <View>
        <View style={{borderWidth : 0, marginRight : getConstant('width')*0.025}}>
        {show_labels ?
          <View style={{}}>
            <Text style={setFont('400', 18, 'gray', 'Bold')}>Autocall Incremental</Text>
            <Text style={{ fontSize: 16, paddingBottom: 5, fontStyle: 'italic', color : 'darkgray' }}>
            {airbagText}
            </Text>
          </View>
          : null
        }
          <View style={{}}>
          <Text style={setFont('300',16, 'black', 'Regular')}>Illustrations de scénarii de remboursement</Text>
          <Text style={setFont('300',12, 'black', 'Bold')}>Les données utilisées dans ces exemples n’ont qu’une valeur indicative et informative, l’objectif étant de décrire le mécanisme
            du produit. Elles ne préjugent en rien de résultats futurs. L’ensemble des données est présenté hors fiscalité et/ou frais liés
            au cadre d’investissement.
            </Text>
            <Text style={setFont('300',12, 'gray')}>
            {show_labels ?
              "Exemple avec un produit à maturité "
              :
              "Maturité "
            } {xmax} ans, {typeAirbag === 'NA' ? '' : typeAirbag  === "SA" ? "avec un mécanisme dit semi-airbag," : "avec un mécanisme dit airbag,"} une observation annuelle du sous-jacent, un coupon de {Numeral(coupon).format("0.00%")}, une barrière de rappel
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
              width={width_ratio}
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
              width={width_ratio}
            />
            <View style={{
                backgroundColor: 'red', fontSize: 15, paddingVertical: 5,
                paddingHorizontal: 10, borderRadius: 7, marginVertical: 10, marginRight : 5
            }}>
                <Text style={{ fontSize: 15, color: 'gold', fontWeight: 'bold' }}>
                    ➔ Remboursement final de {Numeral(scenarioNegatif/100).format('0.00%')}</Text>
                <Text style={{ fontSize: 13, color: 'white' }}>
                    Retour sur investissement annualisé {((Math.pow(scenarioNegatif / 100, 1 / xmax) - 1) * 100).toFixed(1)}%</Text>
            </View>
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
              disable={props.disable}
              width={width_ratio}
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
              width={width_ratio}
            />
            <View style={{
                backgroundColor: 'darkgrey', fontSize: 15, paddingVertical: 5,
                paddingHorizontal: 10, borderRadius: 7, marginVertical: 10, marginRight : 5
            }}>
                <Text style={{ fontSize: 15, color: 'gold', fontWeight: 'bold' }}>
                    ➔ Remboursement final de {100 + coupon * xmax * airbag }%</Text>
                <Text style={{ fontSize: 13, color: 'white' }}>
                    Retour sur investissement annualisé {((Math.pow((100 + coupon * xmax * airbag) / 100, 1 / xmax) - 1) * 100).toFixed(1)}%</Text>
            </View>
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
              width={width_ratio}
            />
            <WrapperGraphPayOut
              remb={scenarioPositif}
              coupon={coupon}
              ymin={ymin}
              ymax={ymax + 10}
              xmax={xmax}
              barr_capital={barr_capital}
              barr_anticipe={barr_anticipe}
              xrel={1}
              airbag={airbag}
              width={width_ratio}
            />
          </View>
          <View style={{
                backgroundColor: 'green', fontSize: 15, paddingVertical: 5,
                paddingHorizontal: 10, borderRadius: 7, marginVertical: 10, marginRight : 5
            }}>
                <Text style={{ fontSize: 15, color: 'gold', fontWeight: 'bold' }}>
                    ➔ Remboursement final de {Numeral(1 + coupon).format("0.00%")}</Text>
                <Text style={{ fontSize: 13, color: 'white' }}>
                    Retour sur investissement annualisé {Numeral(coupon).format("0.00%")}</Text>
            </View>
        </View>
      </View>
  );
}

