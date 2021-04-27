import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import WrapperGraphPayOut from './wrapperGraph/WrapperGraphPayOut'
import getRandomInt from './function/getRandomInt'

import Airbag from './option/Airbag'
import { getConstant } from '../../Utils';

export default function AirbagIllustration({request, airbagChoice}) {

	let coupon = 5;
	let ymin = 40;
	let ymax = 130;
	let xmax = 10;

	//airbag = 1;
	let barr_capital = request.getValue('barrierPDI') * 100;
	let barr_anticipe = request.getValue('autocallLevel') * 100;

	disable = false;

	const [scenarioNeutre, setScenarioNeutre] = useState(getRandomInt(65, 90));
	const [switchAirbag, setSwitchAirbag] = useState(() => {
															let airbag = request.getValue("typeAirbag");
															switch(airbag) {
															case 'FA' : return 1;
															case 'SA' : return 0.5;
															default : return  0;
															}
														});

	useEffect(() => {

		switch(airbagChoice) {
			case 'FA' : setSwitchAirbag(1); break;
			case 'SA' : setSwitchAirbag(0.5); break;
			default : setSwitchAirbag(0); break;
		}

	}, [ airbagChoice ]);

	function changeAirbag(value) {
		setSwitchAirbag(value);
		console.log("airbag Changed to " + value)
	}

	// function newScenarioNeutre() {
	//   setScenarioNeutre(getRandomInt(61, 90));
	// }

	return (
		<View style={{marginTop : 20, width : getConstant('width')*0.9}}>
		<View>
			<Text style={{ paddingBottom: 15 }}>
			Mise en évidence de l'effet ou non airbag lorsque le sous jacent atteint à l'échéance
			un niveau compris entre la barrière en capital et la barrière de rappel:
			</Text>
		</View>
		{/* <View style={{ paddingVertical: 10 }} >
			<Airbag airbag={switchAirbag} airbag_func={(val) => changeAirbag(val)} disable={disable} />
		</View> */}
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
		<View>
			<Text style={{ paddingVertical: 15 }}>
			Caractéristiques du produit: maturité {xmax} ans, une observation annuelle du sous-jacent, un coupon de {coupon}%, 
			une barrière de protection en capital de {barr_capital}%.
			</Text>
		</View>
		</View>
	);
	}

