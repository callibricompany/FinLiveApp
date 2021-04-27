import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import WrapperGraphPayOut from './wrapperGraph/WrapperGraphPayOut'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { setFont,  setColor } from '../../Styles/globalStyle';


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function TermSheetAutocall({request}) {

  let coupon = 7;
  let ymin = 40;
  let xmax = 10;
  let barr_capital = request.getValue('barrierPDI') * 100;
  let barr_anticipe = request.getValue('autocallLevel') * 100;

  const [scenarioNegatif, setScenarioNegatif] = useState(getRandomInt(41, 58))
  const [scenarioNeutre, setScenarioNeutre] = useState(getRandomInt(61, 98))
  const [scenarioPositif, setScenarioPositif] = useState(getRandomInt(110, 121))

  function newScenarioNegatif() {
    setScenarioNegatif(getRandomInt(41, 58));
  }

  function newScenarioNeutre() {
    setScenarioNeutre(getRandomInt(61, 98));
  }

  function newScenarioPositif() {
    setScenarioPositif(getRandomInt(110, 121));
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.container}>
            <Text style={setFont('300', 22, 'black', 'Bold')}>Autocall Incremental</Text>
          </View>
          <View style={styles.container}>
            <Text style={[setFont('300', 16, 'black','Regular'),{paddingVertical : 10}]}>Illustrations de scénarii de remboursement</Text>
            <Text style={{ paddingVertical: 5, fontWeight: 'bold' }}>Les données utilisées dans ces exemples n’ont qu’une valeur indicative et informative, l’objectif étant de décrire le mécanisme
            du produit. Elles ne préjugent en rien de résultats futurs. L’ensemble des données est présenté hors fiscalité et/ou frais liés
            au cadre d’investissement.
            </Text>
            <Text style={{ paddingBottom: 15 }}>
              Exemple avec un produit à maturité {xmax} ans, une observation annuelle du sous-jacent, un coupon de {coupon}%, une barrière de rappel
              automatique anticipé de {barr_anticipe}% du niveau initial du sous-jacent, et une barrière de protection (observée à l’échéance) de {barr_capital}%
              du niveau initial du sous-jacent.
            </Text>
          </View>

          {/* ****************** Bloc ****************************************************** */}
          <View style={{ paddingBottom: 30 }}>
            <View style={{
              borderColor: 'midnightblue', borderWidth: 1, paddingVertical: 10,
              paddingHorizontal: 10, marginVertical: 10
            }}>
              <Text style={{ fontSize: 20, color: 'midnightblue' }}>Scénario défavorable:</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ width: 300, fontSize: 16, color: 'midnightblue' }}>
                  baisse du sous-jacent de plus de {100 - barr_capital}% à l’échéance des {xmax} ans
                  </Text>
                <Text style={{ width: 300, fontSize: 16, color: 'midnightblue' }}>
                  ➔ Perte de {100 - scenarioNegatif}% par exemple alors :
                </Text>
              </View>
              <TouchableOpacity style={{}} onPress={() => newScenarioNegatif()} >
                <MaterialCommunityIcons name='recycle' size={25}  style={{color : 'darkgrey'}}/>
              </TouchableOpacity>
            </View>
            <View style={{
              backgroundColor: 'red', fontSize: 15, paddingVertical: 5,
              paddingHorizontal: 10, borderRadius: 7, marginVertical: 10
            }}>
              <Text style={{ fontSize: 15, color: 'gold', fontWeight: 'bold' }}>
                Remboursement {scenarioNegatif}%</Text>
              <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>
                Retour sur investissement annualisé {((Math.pow(scenarioNegatif / 100, 1 / xmax) - 1) * 100).toFixed(1)}%</Text>
            </View>
            <WrapperGraphPayOut
              remb={scenarioNegatif}
              coupon={coupon}
              ymin={ymin}
              xmax={xmax}
              barr_capital={barr_capital}
              barr_anticipe={barr_anticipe}
            />
          </View>

          {/* ****************** Bloc ****************************************************** */}
          <View style={{ paddingBottom: 30 }}>
            <View style={{
              borderColor: 'midnightblue', borderWidth: 1, paddingVertical: 10,
              paddingHorizontal: 10, marginVertical: 10
            }}>
              <Text style={{ fontSize: 20, color: 'midnightblue' }}>Scénario médian:</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ width: 300, fontSize: 16, color: 'midnightblue' }}>
                  baisse du sous-jacent de moins de {100 - barr_capital}% à l’échéance des {xmax} ans
                  </Text>
                <Text style={{ width: 300, fontSize: 16, color: 'midnightblue' }}>
                  ➔ Perte de {100 - scenarioNeutre}% par exemple alors :
                </Text>
              </View>
              <TouchableOpacity style={{}} onPress={() => newScenarioNeutre()} >
                <MaterialCommunityIcons name='recycle' size={25}  style={{color : 'darkgrey'}}/>
              </TouchableOpacity>
            </View>
            <View style={{
              backgroundColor: 'darkgrey', fontSize: 15, paddingVertical: 5,
              paddingHorizontal: 10, borderRadius: 7, marginVertical: 10
            }}>
              <Text style={{ fontSize: 15, color: 'gold', fontWeight: 'bold' }}>
                Remboursement 100%</Text>
              <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>
                Retour sur investissement annualisé 0%</Text>
            </View>
            <WrapperGraphPayOut
              remb={scenarioNeutre}
              coupon={coupon}
              ymin={ymin}
              xmax={xmax}
              barr_capital={barr_capital}
              barr_anticipe={barr_anticipe}
            />
          </View>

          {/* ****************** Bloc ****************************************************** */}
          <View style={{ paddingBottom: 10 }}>
            <View style={{
              borderColor: 'midnightblue', borderWidth: 1, paddingVertical: 10,
              paddingHorizontal: 10, marginVertical: 10
            }}>
              <Text style={{ fontSize: 20, color: 'midnightblue' }}>Scénario favorable:</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ width: 300, fontSize: 16, color: 'midnightblue' }}>
                  hausse du sous-jacent en année 1, mise en évidence du plafonnement du gain
                  </Text>
                <Text style={{ width: 300, fontSize: 16, color: 'midnightblue' }}>
                  ➔ Gain de {scenarioPositif - 100}% par exemple alors :
                  </Text>
              </View>
              <TouchableOpacity style={{}} onPress={() => newScenarioPositif()} >
                <MaterialCommunityIcons name='recycle' size={25}  style={{color : 'darkgrey'}}/>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={{ fontSize: 16, color: 'midnightblue', fontWeight: 'bold' }}>
                L’investisseur ne reçoit que la hausse partielle du sous-jacent du fait du plafonnement du gain.
                  </Text>
            </View>
            <View style={{
              backgroundColor: 'green', fontSize: 15, paddingVertical: 5,
              paddingHorizontal: 10, borderRadius: 7, marginVertical: 10
            }}>
              <Text style={{ fontSize: 15, color: 'gold', fontWeight: 'bold' }}>
                Remboursement {100 + coupon}%</Text>
              <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>
                Retour sur investissement annualisé {coupon}%</Text>
            </View>
            <WrapperGraphPayOut
              remb={scenarioPositif}
              coupon={coupon}
              ymin={ymin}
              xmax={xmax}
              barr_capital={barr_capital}
              barr_anticipe={barr_anticipe}
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