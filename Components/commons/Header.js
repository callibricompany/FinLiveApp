import React from 'react';
import { Text, View } from 'react-native';

const Header = (props) => {
    const { textStyle, viewStyle } = callibriStyle;
    return (
        <View style={viewStyle}>
            <Text style={textStyle}>{props.headerText}</Text>
        </View>    
    );
};

const callibriStyle = {
    textStyle: {
        fontSize: 40
    },

    viewStyle: {
        backgroundColor: '#B5B1F2',
        paddingTop: 40,
        height: 100,
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap'

    }
};

export { Header };
