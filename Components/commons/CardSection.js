import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
    return (
        <View style={styles.containerStyle}>           
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
      borderBottomWidth: 0,
      borderTopWidth: 1,
      padding: 5,
      backgroundColor: '#fff',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      borderColor: '#d1d',
      position: 'relative'
    }
  };
  

export { CardSection };
