import React from 'react';
import { Text, View } from 'react-native';
import { globalStyle } from '../../Styles/globalStyle'

const FLBadge = ({numero}) => {
  

  return (
    <View style={globalStyle.badge_view}>
        <Text style={globalStyle.badge_number}>{numero}</Text>
    </View>
  );
};



export { FLBadge };
