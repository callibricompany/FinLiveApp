
import { StyleSheet, Platform, StatusBar, Dimensions} from 'react-native'

import { sizeByDevice, isAndroid, isIphoneX, getConstant } from '../Utils'






//applique les couleurs FinLive
export function setFont ( weight, size, color='black', family='Light') {

  return {
    fontWeight : weight,
    //fontSize: sizeByDevice(size +2, size, getConstant('width') < 350  && size > 12 ? size - 4 : size ) ,
    fontSize: sizeByDevice(size +1, size, getConstant('width') < 321 ? size < 10 ? size : size < 12 ? size - 1 : size < 16 ? size -2  : size < 20 ? size - 3 : size - 4  : size-1) ,
    fontFamily : family,
    color,
    textAlignVertical : 'center',
    //fontStyle : 'italic',
  }
}


//retourne les couleurs FinLive
export function setColor(color) {
  const blueFL  = '#5980AB';//'#597fab'; //'#13223C'; //'whitesmoke';  //ghostwhite   //#45688e
  switch(color) {
    case 'blue' : return blueFL;
    case 'darkBlue' : return '#13223C';
    case 'lightBlue' : return '#9BB0CB';
    case 'gray' : return '#CFD9E5';
    case 'subscribeBlue' : return '#00B6FF';
    case 'granny' : return '#749B14';
    case 'subscribeticket' : return '#87B916';
    case 'background' : return '#edeef0';
    default : return blueFL;
  }
}



const globalStyle = StyleSheet.create({


///////////////////////////////
//        header
///////////////////////////////

    header_safeviewarea :{
      //flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomColor : setColor(''),
      borderBottomWidth : 1,
      height: sizeByDevice(80, 65, 65 - getConstant('statusBar')),
      marginTop: 0,
      backgroundColor : 'white',
      //flexWrap: "nowrap",
    },

    header_left_view : {
      //marginRight: 0.05*getConstant('width'), 
      //height: 40, 
       width: getConstant('width')/4,  
      //borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'flex-start',
      
      //backgroundColor: 'pink',
      backgroundColor: 'transparent'
    },
    header_center_view : {
      width: getConstant('width')/2,  
      //backgroundColor: 'pink',
      justifyContent : 'center',
      alignItems: 'center',
      flexWrap: "nowrap",
    },

    header_right_view : {
      //marginRight: 0.05*getConstant('width'), 
      //height: 40, 
      width: getConstant('width')/4,  
      //borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'flex-end',
      
      //backgroundColor: 'steelblue'
      backgroundColor: 'transparent'
    },

    header_center_text_big : {
      color: 'black', 
      fontSize:36,
    },
    header_left_text_medium : {
      color: 'black', 
      fontSize:18,
      fontWeight : '600',
      alignItems : 'flex-start'
    },
    header_center_text_medium : {
      color: setColor(''), 
      fontWeight : '400',
      fontSize:16,
    },



    header_icon : { 
      backgroundColor:'transparent',
      color: setColor(''),
    },

///////////////////////////////
//        BADGE
///////////////////////////////
    badge_view : {
      position: 'absolute',
      width :18,
      height : 18,
      borderRadius: 9,
      backgroundColor:'red',
      justifyContent: 'center',
      alignItems: 'center',
      top: 0,
      left: 40 - 18
    },
    badge_number : {
      backgroundColor:'transparent',
      fontSize: 15, 
      color: 'white'
    },

///////////////////////////////
//        DETAIL ACTUALITE
///////////////////////////////

news_detail_image : {
  height: getConstant('width')*0.707, 
  width: getConstant('width'),  
},


///////////////////////////////
//        HOME
///////////////////////////////
 rectangle : {
   //flex: 1,
  //width: getConstant('width')*0.75,
  //height: 150,
  marginRight: getConstant('width')*0.01,
  marginLeft:getConstant('width')*0.05,
  marginVertical: 5,
  marginHorizontal: 2,
  borderWidth: 1,
  borderRadius: 2,
  borderColor: '#ccc',
  flexWrap: "wrap",
  backgroundColor: 'white',
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 1.5,
  elevation: 3,
  flexDirection: 'row',
  justifyContent: 'space-evenly'
  },

  heeader_text_home : {
    marginLeft: getConstant('width')*0.05,
    marginTop: 20,
    marginBottom: 5,
    fontSize:26,
    color: '#707070'

  },



///////////////////////////////
//        DIVERS
///////////////////////////////
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    defaultText: {
      fontSize: 20,
      paddingBottom: 10
    },
    loading_container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 100,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    },
    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: getConstant('height')/2,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    },


///////////////////////////////
//        SWIPE
///////////////////////////////
    swipesGestureContainer:{
      height:'100%',
      width:'100%'
    },

///////////////////////////////
//        ITEM TEMPLATE TICKET
/////////////////////////////// 
    itemTicket: {
      //height: 150,
      //backgroundColor: '#fff',
      marginBottom: 20,
      shadowColor: 'rgb(75, 89, 101)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.9,

    },


    templateIcon : {
      paddingLeft: 5,
      paddingRight : 5,
      paddingTop: 3,
      paddingBottom : 3, 
      justifyContent: 'center',
      alignItems: 'center'
    }

    
  })






export { globalStyle }