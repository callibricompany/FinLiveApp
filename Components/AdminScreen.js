import React from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { Title } from 'native-base'

import { withAuthorization } from '../Session';
import {withAuthentication} from '../Session/';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';


import { globalStyle } from '../Styles/globalStyle'


class AdminScreen extends React.Component {

  static navigationOptions = {
    header: (
      <SafeAreaView style={globalStyle.header_safeviewarea}>
        <View style={globalStyle.header_left_view} />
        <View style={globalStyle.header_center_view} >
          <Title style={globalStyle.header_center_text_big}>ADMIN</Title>
        </View>
        <View style={globalStyle.header_right_view} />
      </SafeAreaView>
    )
  }


  constructor(props) {
    super(props)

  }

  
  render() {
    return (
      <View style={globalStyle.container}>
        <Text>Je suis admin</Text>
      </View>
    );
  }
  
}


const composedWithAuthentication = compose(
  //connect(mapStateToProps, mapDispatchToProps),
  withAuthentication
);



export default hoistStatics(composedWithAuthentication)(AdminScreen);
