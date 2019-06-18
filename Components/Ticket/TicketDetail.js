import React from 'react'
import { View, ScrollView, Text, Animated, SafeAreaView, TouchableOpacity} from 'react-native'
import { Icon, Title } from 'native-base';
  
import { globalStyle } from '../../Styles/globalStyle'



class TicketDetail extends React.Component {


    constructor(props) {
      super(props)

      this.ticket = this.props.navigation.getParam('ticket', '');
      
    }


    static navigationOptions = ({ navigation }) => {
      //static navigationOptions = {
        //item = navigation.getParam('item', '...');
        const { params } = navigation.state;
        params !== undefined &&
        params.changingHeight !== undefined
          ? params.changingHeight
          : console.log("HEIGHT " +params.changingHeight);
        return {
        header: (
          <SafeAreaView style={globalStyle.header_safeviewarea}>
            <Animated.View
                style={{
                    height: 
                      params !== undefined &&
                      params.changingHeight !== undefined
                        ? params.changingHeight
                        : 50,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'green',
                      width: "100%",
                      //justifyContent: "center",
                      //alignItems: "center"
                }}
            >
                <TouchableOpacity style={globalStyle.header_left_view} onPress={() => navigation.goBack()}>
                  <Icon name='md-arrow-back' style={globalStyle.header_icon} />
                </TouchableOpacity>
                <View style={globalStyle.header_center_view} >
                  <Title style={globalStyle.header_center_text_medium}>Ticket</Title>
                </View>
                <View style={globalStyle.header_right_view} >
                <TouchableOpacity onPress={() => params.shareNews()}>
                  <Icon name='ios-share' style={globalStyle.header_icon} />
                </TouchableOpacity>
                </View>
            </Animated.View>
          </SafeAreaView>
        )
        }
      }

    componentDidMount() {
      this.scrollY = new Animated.Value(0);
      this.changingHeight = this.scrollY.interpolate({
          inputRange: [0, 60],
          outputRange: [120, 60],
          extrapolate: "clamp"
      });
      
      this.props.navigation.setParams({
          changingHeight: this.changingHeight
      });
    }



  
    render() {

      return(

          <View style={{ flex: 1 }}>
              <ScrollView
                  //style={{ height: 50 }}
                  scrollEventThrottle={16}
                  onScroll = {
                    Animated.event([
                      {
                          nativeEvent: {
                              contentOffset: {
                                  y: this.scrollY
                              }
                          }
                      }
                  ], console.log("djhdsh"))
                }
              >
                  <View style={{ height: 120 }} />
                  <Text>Les chaussettes de l'archi-duchesse ....</Text>
                  <Text>{JSON.stringify(this.ticket)}</Text>
              </ScrollView>

              
          </View>


      );
      }
}

export default TicketDetail