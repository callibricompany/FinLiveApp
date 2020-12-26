import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Modal, Animated} from 'react-native';
import { NavigationActions } from 'react-navigation';


import {  globalStyle, setFont,setColor} from '../../../Styles/globalStyle'


import Numeral from 'numeral'
import 'numeral/locales/fr'

import { withUser } from '../../../Session/withAuthentication';
import { withAuthorization } from '../../../Session';
import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import * as TEMPLATE_TYPE from '../../../constants/template'

import { ifIphoneX, ifAndroid, sizeByDevice, currencyFormatDE, isAndroid , getConstant } from '../../../Utils';


import { VictoryPie, VictoryLabel, VictoryLegend } from "victory-native";







class FLTemplateEmpty extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      animatedValue : new Animated.Value(0.5),
    }


    //type de tycket
    this.type = this.props.hasOwnProperty('templateType')  ? this.props.templateType : TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE;

    //largeur de la cartouche sur l'ecran
    this.screenWidth = 0.975;
    switch (this.type) {
      case TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE : this.screenWidth = 0.9; break;
      case TEMPLATE_TYPE.AUTOCALL_MEDIUM_TEMPLATE : this.screenWidth = 0.9; break;
      case TEMPLATE_TYPE.AUTOCALL_SHORT_TEMPLATE : this.screenWidth = 0.6; break;
      default : this.screenWidth = 0.975; break;
    }
    this.screenWidth = this.screenWidth * getConstant('width');

    

  }


componentDidMount() {
  this._fadeOut();
}

_fadeOut() {
  this.state.animatedValue.setValue(0.5);
  Animated.timing(this.state.animatedValue, {
    toValue: 1,
    duration: 1500,
    useNativeDriver: true,
  }).start(() => this._fadeIn());
}

_fadeIn() {
    this.state.animatedValue.setValue(1);
    Animated.timing(this.state.animatedValue, {
      toValue: 0.5,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => this._fadeOut());
}


_renderHeaderShortTemplate() {

  return (

                <View style={{
                              paddingLeft : 20,  
                              backgroundColor: setColor('lightBlue'), 
                              borderTopLeftRadius: 10, 
                              borderTopRightRadius: 10, 
                              flexDirection: 'row',
                              
                              //paddingTop: 5,
                              //paddingBottom: 5,
                              }}
                >                                                    
                  <View style={{flex : 0.85, flexDirection: 'column', justifyContent: 'center' , paddingTop: 3, paddingBottom: 3}}>
                    <View>
                      <Text style={setFont('400', 18, 'white')}>
                        
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>

                        <Text style={setFont('400', 18, 'white')}>   
                          
                        </Text>   
                    </View>
                  </View>
                  <View style={{flex : 0.15,  justifyContent: 'center', alignItems: 'center',backgroundColor: 'lightgray', borderTopRightRadius: 10}}>
                      <Text style={setFont('300', 20, 'white', 'Regular')}></Text>
                  </View>
                </View>
  
  );
}

_renderAutocallShortTemplate() {

  return (
   <View style={{flexDirection : 'row', backgroundColor: 'white', paddingTop:1}}>
     <View style={{flex : 0.7, flexDirection : 'column', padding: 10, borderWidth: 0}}>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ width: 25, height : 20, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}> </Text>
                </View>
            </View>
            <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5}}>
                <View style={{ width: 25, height : 20,  borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}></Text>
                </View>
            </View>
        </View>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ width: 25, height : 20, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                 
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}></Text>
                </View>
            </View>

        </View>
        <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.5, flexDirection: 'row', borderWidth: 0}}>
                <View style={{ width: 25, height : 20, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={setFont('300', 12, setColor(''), 'Light')}></Text>
                </View>
            </View>
            <View style={{flex: 0.5, flexDirection: 'row', paddingLeft: 5}}>
                <View style={{ width: 25, borderWidth: 0, padding: 2, alignItems: 'center', justifyContent: 'center',}}>
                  
                </View>
                <View style={{paddingLeft : 3, borderWidth: 0, alignItems: 'flex-start', justifyContent: 'center'}}>
                    <Text style={setFont('300', 12, setColor(''), 'Light')}></Text>
                </View>
            </View>
        </View>
     </View>
     <View style={{flex : 0.3,  padding: 5, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={setFont('400', 16, 'green')} numberOfLines={1}>        
         
        </Text>  
     </View>   
  </View>
  )
}

_renderFooterShortTemplate(isFavorite) {
  //remplisaaage des dropdown
  return (
           <View style={{flex : 0.10, flexDirection : 'row', borderTopWidth : 1, borderTopColor: 'lightgray', padding :3, backgroundColor: 'white', borderBottomRightRadius: 10, borderBottomLeftRadius: 10}}>
                <View style={{flex : 0.33, justifyContent: 'center', alignItems: 'center', height: 20, width: 20}} >
                  
                </View>

                <View style={{flex : 0.33, justifyContent: 'center', alignItems: 'center'}} >
           
                </View>  
                <View style={{flex : 0.33, justifyContent: 'center', alignItems: 'center'}} >
           
                </View>
              </View>

  );
}



_renderAutocallFullTemplate() {

  return (
   <View style={{ flexDirection : 'row', backgroundColor: 'white', paddingTop:5}}>
      <View style={{flex : 0.8, borderWidth : 0, marginLeft : 10,  marginTop : 10}}>
            <View style={{flexDirection : 'row',  marginTop : 0, marginBottom : 10}} >

                    <View style={{flex : 0.5, borderWidth : 0, paddingRight : 15}}>
                                    <View style={{marginBottom : 5}}>
                                        <Text style={setFont('200', 12, 'lightgray')}>Capital</Text>
                                    </View>

                                    <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
                                            <View style={{ borderLeftWidth: 1, borderLeftColor : 'lightgray',  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                              
                                            </View>
                                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0, paddingLeft : 5 }}>
                   
                                            </View>
                       
                                        </View>

                            </View>    


                    <View style={{flex : 0.5, borderWidth : 0, paddingRight : 15}}>
                            <View style={{marginBottom : 5}}>
                                <Text style={setFont('200', 12, 'lightgray')}>Maturité</Text>
                            </View>

                            <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }} >
                                  <View style={{ borderLeftWidth: 1, borderLeftColor : 'lightgray',  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                         
                                  </View>
                                  <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0, paddingLeft : 5 }}>
                                  </View>
                  
                              </View>

                    </View>  


                    </View>
            <View style={{flexDirection : 'row', borderWidth : 0, height : 105}}>


                    <View style={{flex : 0.5, borderWidth : 0, paddingRight : 15}}>
                                <View style={{marginBottom : 5}}>
                                    <Text style={setFont('200', 12, 'lightgray')}>Coupons</Text>
                                </View>

                                <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
              

                                      <View style={{ borderLeftWidth: 1, borderLeftColor : 'lightgray',  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                        
                                      </View>

                                      <View style={{flex: 1, justifyContent: 'center',  alignItems: 'flex-start', paddingLeft : 5}}>
                                       
                                      </View>
                                </View>





                                <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
                                      <View style={{ borderLeftWidth: 1, borderLeftColor : 'lightgray',  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                        
                                      </View>
                                      <View style={{flex: 1, justifyContent: 'center',  alignItems: 'flex-start', paddingLeft : 5}}>
                                            <Text style={[setFont('200', 12, setColor(''),'Regular'), {textAlign: 'center'}]} numberOfLines={1}>
            
                                                <Text style={setFont('200', 12, setColor(''),'Regular')}> </Text>   
                                            </Text>     
                                      </View>
                                </View>




                                <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
                                      <View style={{ borderLeftWidth: 1, borderLeftColor : 'lightgray',  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                       
                                      </View>
                                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0, paddingLeft : 5 }}>
                 
                                      </View>     
                                </View>
                    </View>    


                    <View style={{flex : 0.5, borderWidth : 0, paddingRight : 15}}>
                                <View style={{marginBottom : 5}}>
                                    <Text style={setFont('200', 12, 'lightgray')}>Rappels</Text>
                                </View>

                                <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }} >
              

                                      <View style={{ borderLeftWidth: 1, borderLeftColor : 'lightgray',  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                       
                                      </View>

                                      <View style={{flex: 1, justifyContent: 'center',  alignItems: 'flex-start', paddingLeft : 5}}>
                                   
                                      </View>

                                      
                                </View>





                                <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
                                      <View style={{ borderLeftWidth: 1, borderLeftColor : 'lightgray',  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                        
                                      </View>
                                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0, paddingLeft : 5 }}>
       
                                        </View>
                                </View>




                                <View style={{flexDirection: 'row', borderWidth: 0, justifyContent: 'flex-start', alignItems: 'center', }}>
                                      <View style={{ borderLeftWidth: 1, borderLeftColor : 'lightgray',  width : 22, height : 20,  alignItems: 'center', justifyContent: 'center',marginLeft : 5, paddingLeft : 4}}>
                                        
                                      </View>
                                      <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start',  borderWidth: 0, paddingLeft : 5 }}>
                                    </View>
                                </View>
                    </View>     
            </View>


      </View>     
      <View style={{flex : 0.2, borderWidth : 0, marginRight : 10, marginTop : 10,}} >
          <View style={{marginBottom : 5}}>
              <Text style={setFont('200', 12, 'lightgray')}>Probabilités</Text>
          </View>

              <View style={{borderWidth : 0, height : 80}}>
                  
                      <VictoryPie data={[{ y: 100 }, { y: 0 }, { y: 0 }]} 
                                  origin={{ x: 0.2*(0.9*getConstant('width') - 10)/2, y: 40 }}
                                  //origin={{ x: 20, y: 20 }}
                                  width={150} 
                                  height={150} 
                                  colorScale={['snow', 'snow', 'snow']} 
                                  labelComponent={<VictoryLabel  style={{fontSize : 10, fill : 'lightgray'}} />}
                                  innerRadius={10}  
                                  animate={{ easing: 'exp' }}
                                  labels={( data ) => ''}
                                  labelRadius={28}
                                  startAngle={-120}
                      />
              </View>
              <View style={{marginTop : 0, borderWidth: 0, height : 60}}>
                      <VictoryLegend x={5} y={10}
                                      //title="Legend"
                                      centerTitle
                                      orientation="vertical"
                                      rowGutter={0}
                                      height={100}
                                      style={{ labels: {fontSize: 11 } }}
                                      symbolSpacer={2}
                                      labelComponent={<VictoryLabel  dx={3} style={{fontSize : isAndroid() ? 10 : 12, fill : 'gray'}} />}
                                      data={[
                                        { name: "", symbol: { fill: 'snow', type: "square" } },
                                        { name: "", symbol: { fill: 'snow', type: "square"} },
                                        { name: "", symbol: { fill: 'snow', type: "square" } }
                                      ]}
                                      
                      />
              </View>
    
                                  
      </View>                  

    </View>
         

  );

}


render () {

      if (this.type === TEMPLATE_TYPE.AUTOCALL_SHORT_TEMPLATE) {
        
        return (
          <Animated.View style={{width: this.screenWidth, opacity : this.state.animatedValue}}>
            {this._renderHeaderShortTemplate()}
            {this._renderAutocallShortTemplate()}
            {this._renderFooterShortTemplate()}
          </Animated.View>
        );
      } else if (this.type === TEMPLATE_TYPE.AUTOCALL_FULL_TEMPLATE) {
        
        return (
          <Animated.View style={{width: this.screenWidth, opacity : this.state.animatedValue}}>
            {this._renderHeaderShortTemplate()}
            {this._renderAutocallFullTemplate()}
            {this._renderFooterShortTemplate()}
          </Animated.View>
        );
      }

      return null;

    }
}



  const condition = authUser => !!authUser;

  const composedWithNav = compose(
    withAuthorization(condition),
     withNavigation,
     withUser
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(FLTemplateEmpty);
