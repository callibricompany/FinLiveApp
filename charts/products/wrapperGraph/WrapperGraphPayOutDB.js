import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import GraphPayOutDB from '../graph/GraphPayOutDB'

export default function WrapperGraphPayOutDB({ xmax, barr_capital, barr_anticipe, deg }) {

  return (
    <View style={styles.container}>
      <GraphPayOutDB
        end_under={100}
        coupon={5}
        ymin={40}
        ymax={130}
        xmax={xmax}
        barr_capital={barr_capital}
        barr_anticipe={barr_anticipe}
        xrel={0}
        airbag={0}
        deg={deg}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.dashedLineRed} />
        <View style={{}}>
          <Text style={{ paddingLeft: 10 }}>Barrière de protection</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.dashedLineOrange} />
        <View>
          <Text style={{ paddingLeft: 10 }}>Barrière de rappel anticipé</Text>
        </View>
      </View>
      {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.dashedLineGrey} />
        <View>
          <Text style={{ paddingLeft: 10 }}>Evolution du sous-jacent</Text>
        </View>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'flex-start',
    alignItems: 'flex-start',
  },
  dashedLineRed: {
    width: 50,
    height: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#c43a31',
    borderStyle: 'dashed'
  },
  dashedLineOrange: {
    width: 50,
    height: 1,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: 'orange',
    borderStyle: 'dashed'
  },
  dashedLineGrey: {
    width: 50,
    height: 1,
    borderWidth: 1,
    borderColor: '#CCC',
  },
});