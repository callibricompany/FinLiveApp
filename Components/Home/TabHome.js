import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Text, Platform} from 'react-native'; 
import { Thumbnail, Toast, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";

import { FlatList } from '../SearchBar/searchBarAnimation';

import { ifIphoneX, ifAndroid, sizeByDevice } from '../../Utils';

import { withNavigation } from 'react-navigation';
import { compose, hoistStatics } from 'recompose';

import * as Progress from 'react-native-progress';

import Moment from 'moment';
import localization from 'moment/locale/fr'

import Dimensions from 'Dimensions';

import {  globalSyle, 
  generalFontColor, 
  tabBackgroundColor,
  headerTabColor,
  selectElementTab,
  progressBarColor,
  subscribeColor,
  FLFontFamily,
  FLFontFamilyBold
} from '../../Styles/globalStyle';

import fullStarImage from '../../assets/star.png'
import emptyStarImage from '../../assets/emptystar.png'
import couponImage from '../../assets/ticket_carre.png'
import couponProtectionImage from '../../assets/couponPhoenix.png'
import pdiImage from '../../assets/iconPDI.png'
import podiumImage from '../../assets/podium.png'


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


class TabHome extends React.PureComponent {
  
    constructor(props) {
      super(props);
  
      this.state = {
        dataSource: Array(12).fill().map((_, index) => ({id: index}))
      };
    }
  

    _renderTicket = ({ item , id}) => {
        //console.log("item : " +id)
        if (id < 0) {
          
          return (<View style={{height: 100, width:200, backgroundColor:'magenta'}}>
          <Text>AHAH</Text></View>);
        } else {
          return (
            <View style={[styles.item, {flexDirection : 'column', width: DEVICE_WIDTH*0.925, borderBottomWidth : 1}]}>
              <View style={{flex : 0.25, flexDirection : 'row', backgroundColor: tabBackgroundColor}}>
                  <View style={{flex : 0.10, justifyContent: 'center', alignItems: 'center', margin: 5}}>
                    <Image style={{width: 25, height: 25}} source={Math.random() < 0.5 ? fullStarImage : emptyStarImage} />
                  </View>
                  <View style={{flex : 0.70, paddingLeft: 5,flexDirection: 'column'}}>
                    <View style={{borderWidth:0,flex: 0.3, marginTop: Platform.OS === 'ios' ? 0 : -3, justifyContent: 'center', alignItems: 'flex-start', paddingTop: 4}}>
                      <Text style={{fontFamily:  FLFontFamily, fontWeight: '300', fontSize: 12, color: generalFontColor}}>
                          INSTITUT DU PATRIMOINE / APE
                      </Text>
                    </View>
                    <View style={{borderWidth:0,flex: 0.6, marginTop: Platform.OS === 'ios' ? -2 : -5, justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 14, color: generalFontColor}}>
                          AUTOCALL CAC 40 8 ANS 
                        </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={{flex: 0.35}} onPress={() => alert("J'EN VEUX PUTAIN DE MERDE")}>
                    <View style={{flex : 1, flexDirection: 'row', backgroundColor : subscribeColor,justifyContent: 'center', alignItems: 'center'}}>
                      <View style={{flex:0.8, paddingLeft: 5, péddingRight: 5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: Platform.OS === 'ios' ? ifIphoneX() ?  14 : 12 : 14, color: generalFontColor}}>
                          SOUSCRIRE
                        </Text>
                      </View>
                      <View style={{flex:0.2, width:20, height:20, borderWidth:0, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{fontFamily:  FLFontFamily, fontWeight: '400', fontSize: 14, color: generalFontColor}}>
                          >
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
              </View>
              <View style={{flex : 0.75, flexDirection: 'column'}}>
                <View style={{flex: 0.6, flexDirection: 'row', height: 1*(DEVICE_WIDTH*0.6*0.25*0.975-5)/1, marginTop:10, marginBottom: 15}}>
                  <View style={{flex: 0.4, flexDirection : 'row', borderWidth: 0}}>
                    <View style={{flex: 0.50, backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'center', padding:10}}>
                      <View style={{position: 'absolute',  zIndex: 0}}>
                        <Image  style={{width: DEVICE_WIDTH*0.6*0.25*0.975-10, height: 1*(DEVICE_WIDTH*0.6*0.25*0.975-10)/1}} source={couponProtectionImage} />
                      </View>
                      <View style={{position: 'absolute',  zIndex: 1, bottom: DEVICE_WIDTH*0.6*0.3*0.975*0.25}}>
                        <Text style={{fontFamily: FLFontFamily, fontWeight:'500', fontSize: 14}}>
                          20%
                        </Text>
                      </View>
                    </View>
                    <View style={{flex: 0.50, backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'center', padding:10}}>
                    <View style={{position: 'absolute',  zIndex: 0, bottom:-3}}>
                        <Image  style={{width: DEVICE_WIDTH*0.6*0.25*0.975-5, height: (DEVICE_WIDTH*0.6*0.25*0.975-5)}} source={pdiImage} />
                      </View>
                      <View style={{position: 'absolute',  zIndex: 1, bottom: DEVICE_WIDTH*0.6*0.3*0.975*0.25}}>
                        <Text style={{fontFamily: FLFontFamily, fontWeight:'500', fontSize: 14}}>
                          -40%
                        </Text>
                      </View>
                    
                    </View>

  
                  </View>
                  <View style={{flex: 0.6, flexDirection : 'row', borderWidth: 0, justifyContent: 'center'}}>
                    <View style={{flex: 0.3, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
                      <TouchableOpacity onPress={() => alert('Ouverture du KID')}>
                        <View style={{backgroundColor: '#C0C0C0', borderRadius: 7,width: DEVICE_WIDTH*0.6*0.3*0.975-10, height: 3*(DEVICE_WIDTH*0.6*0.3*0.975-10)/5, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: FLFontFamily, fontSize: 18, fontWeight : '400'}}>
                            KID
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{flex: 0.3, borderWidth:0 ,backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>
                      <TouchableOpacity onPress={() => alert('Ouverture du détail du ticket')}>
                        <View style={{marginLeft : 5, backgroundColor: progressBarColor, borderRadius: 7,width: DEVICE_WIDTH*0.6*0.3*0.975-10, height: 3*(DEVICE_WIDTH*0.6*0.3*0.975-10)/5, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: FLFontFamily, fontSize: 18, fontWeight : '400'}}>
                            Info
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{flex: 0.10, backgroundColor: 'transparent'}}>
                    </View>
                    <View style={{flex: 0.30, borderWidth: 0,justifyContent: 'center', alignItems: 'center', paddingRight: 20}}>
                      <View style={{position: 'absolute',  zIndex: 0}}>
                        <Image  style={{resizeMode: 'contain', width: DEVICE_WIDTH*0.6*0.3, height: (DEVICE_WIDTH*0.6*0.3)}} source={couponImage} />
                      </View>
                      <View style={{position: 'absolute',  zIndex: 1, bottom: DEVICE_HEIGHT*0.6*0.3/8}}>
                        <Text style={{paddingLeft: 10,fontFamily: FLFontFamily, fontWeight:'500', fontSize: 16, color: 'red'}}>
                          8.5%
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{flex: 0.2, borderWidth: 0,flexDirection: 'row', paddingBottom:10}}>
                  <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center', borderWidth:0  }}>
                    <Image  style={{width: 30, height: 20}} source={podiumImage} />
                  </View>
                  <View style={{flex: 0.7, borderWidth: 0, justifyContent:'center', alignItems: 'center', paddingLeft : 3, paddingRight: 7}}>
                    <View style={{position: 'absolute',  zIndex: 0}}>
                      <Progress.Bar 
                        progress={0.65} 
                        width={DEVICE_WIDTH*0.7*0.95-10} 
                        height={11}
                        unfilledColor={'lightgray'}
                        borderColor={'gray'}
                        borderWidth={2}
                        color={progressBarColor}
                        borderRadius={10}
                        />
                      </View>
                      <View style={{position: 'absolute', paddingLeft: 10,width: DEVICE_WIDTH*0.7*0.95-10, zIndex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                        <Text style={{fontFamily : FLFontFamily, fontWeight:'400', fontSize: 10}}>
                          65% collecté
                        </Text>
                      </View>
                      <View style={{position: 'absolute', paddingRight: 10, width: DEVICE_WIDTH*0.7*0.95-10, zIndex: 2, justifyContent: 'center', alignItems: 'flex-end'}}>
                        <Text style={{fontFamily : FLFontFamily, fontWeight:'400', fontSize: 10}}>
                          {Moment("20190929").format('DD MMMM')}
                        </Text>
                      </View>
                  </View>
                  <View style={{flex: 0.1, justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontFamily : FLFontFamily, fontWeight:'300', fontSize: 12}}>
                      2 M€
                    </Text>
                  </View>
                </View>
                <View style={{flex: 0.2, justifyContent: 'flex-end',alignItems: 'flex-end',backgroundColor: 'whitesmoke',borderWidth: 0,flexDirection: 'row', paddingBottom:5, paddingTop: 5}}>
                  <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 0 }}>
                      <TouchableOpacity onPress={() => alert('Ouverture du KID')}>
                        <View style={{paddingLeft: 10,paddingRight: 10, backgroundColor: '#C0C0C0', borderRadius: 7,width: DEVICE_WIDTH*0.6*0.3*0.975-10, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: FLFontFamily, fontSize: 16, fontWeight : '400'}}>
                            KID
                          </Text>
                        </View>
                      </TouchableOpacity>                    
                  </View>
                  <View style={{borderWidth: 0, justifyContent:'center', alignItems: 'center', paddingLeft : 3, paddingRight: 7}}>
                      <TouchableOpacity onPress={() => alert('Ouverture de la TS indic')}>
                        <View style={{paddingLeft: 10,paddingRight: 10, backgroundColor: '#C0C0C0', borderRadius: 7, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: FLFontFamily, fontSize: 16, fontWeight : '400'}}>
                            TS indic
                          </Text>
                        </View>
                      </TouchableOpacity>       
                  </View>
                  <View style={{justifyContent:'center', alignItems: 'center'}}>
                     <TouchableOpacity onPress={() => alert('Ouverture de la TS indic')}>
                        <View style={{paddingLeft: 10,paddingRight: 10, backgroundColor: '#C0C0C0', borderRadius: 7, height: 20, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontFamily: FLFontFamily, fontSize: 16, fontWeight : '400'}}>
                            Descriptif
                          </Text>
                        </View>
                      </TouchableOpacity>  
                  </View>
                </View>
              </View>
            </View>
          )
        }
    }


    render() {
      return (

          <FlatList
            style={styles.wrapper}
            data={this.state.dataSource}
            //renderItem={this._renderRow}
            keyExtractor={(item) => item.id.toString()}
            tabRoute={this.props.route.key}
            renderItem={({item}) => (
              this._renderTicket(item)      
            )}
          />

      );
    }
  }

  const styles = StyleSheet.create({
    wrapper: {
      //paddingLeft: 15,
      //paddingRight: 15,
      //justifyContent : 'center',
      alignItems: 'center',
      marginTop: Platform.OS === 'ios' ? -60+45 : -25+45,
      
    },
    item: {
      //height: 150,
      backgroundColor: '#fff',
      marginBottom: 20,
      shadowColor: 'rgb(75, 89, 101)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1
    }
  })
const composedWithNav = compose(
    //withAuthorization(condition),
     withNavigation,
   );
   
   //export default HomeScreen;
export default hoistStatics(composedWithNav)(TabHome);
