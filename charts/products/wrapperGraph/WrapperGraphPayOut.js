import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import GraphPayOut from '../graph/GraphPayOut'

export default function WrapperGraphPayOut({remb,
  coupon,
  ymin,
  xmax,
  ymax,
  barr_capital,
  barr_anticipe, 
  xrel,
  airbag,
  width}) {

  return (
    <View style={styles.container}>
      <GraphPayOut
        end_under={remb}
        coupon={coupon}
        ymin={ymin}
        ymax={ymax}
        xmax={xmax}
        barr_capital={barr_capital}
        barr_anticipe={barr_anticipe}
        xrel={xrel}
        airbag={airbag}
        width={width}
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.dashedLineGrey} />
        <View>
          <Text style={{ paddingLeft: 10 }}>Evolution du sous-jacent</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop : 20
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