import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import WrapperGraphPayOutDB from './wrapperGraph/WrapperGraphPayOutDB';

export default function DegressivityBarrier({request, degressivity}) {
  let xmax = 10;
  let barr_capital = request.getValue('barrierPDI') * 100;
  let barr_anticipe = request.getValue('autocallLevel') * 100;
  //let deg = -request.getValue('degressiveStep');

  const [deg, setDeg] = useState(-degressivity);
  useEffect(() => {
    setDeg(-degressivity);
  }, [ degressivity ]);
  
  return (
    <View>
      <WrapperGraphPayOutDB
        xmax={xmax}
        barr_capital={barr_capital}
        barr_anticipe={barr_anticipe}
        deg={deg}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});