
import { StyleSheet, Platform, StatusBar} from 'react-native'
import Dimensions from 'Dimensions'
import { sizeByDevice } from '../Utils'
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

export const blueFLColor = '#5980AB';//'#597fab'; //'#13223C'; //'whitesmoke';  //ghostwhite   //#45688e
export const generalFontColor = 'white'; //#707070
export const subscribeColor = '#00B6FF'; //#71CCF1
export const lightBlueFLColor = '#9BB0CB';
export const lightGrayFLColor = '#CFD9E5';
export const backgdColor = '#edeef0';

export const headerTabColor = '#13223C'; //'#749B14';
export const apeColor = '#749B14';
export const selectElementTab = '#13223C';//'#87B916';
export const progressBarColor = '#87B916';



export const FLFontFamily = Platform.OS !== 'ios' ? 'sans-serif-condensed' :'Arial';
export const FLFontFamilyBold = Platform.OS !== 'ios' ? 'notoserif' :'Papyrus';


export const backgdColorPricerParameter = 'snow';





export function setFont ( weight, size, color='black', family='Light', verticalAlign='center') {
  //'FLFontFamily'
  return {
    fontWeight : weight,
    //fontSize: sizeByDevice(size +2, size, DEVICE_WIDTH < 350  && size > 12 ? size - 4 : size ) ,
    fontSize: sizeByDevice(size +1, size, DEVICE_WIDTH < 321 ? size - 2 : size) ,
    fontFamily : family,
    color,
    textAlignVertical : verticalAlign
  }
}

export function setColor(color='blueFLColor') {
  switch(color) {
    case 'blue' : return blueFLColor;
    case 'light' : return lightBlueFLColor;
    case 'gray' : return lightGrayFLColor;
    case 'turquoise' : return subscribeColor;
    default : return blueFLColor
  }
}



const globalStyle = StyleSheet.create({



///////////////////////////////
//        BACKGROUNG COLOR 
///////////////////////////////
  bgColor :{
      backgroundColor: '#edeef0'//'#F9FAFC' //#edeef0
      //backgroundColor:'linen'
  },




///////////////////////////////
//        header
///////////////////////////////

    header_safeviewarea :{
      //flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomColor : blueFLColor,
      borderBottomWidth : 1,
      height: sizeByDevice(80, 65, 65 - STATUSBAR_HEIGHT),
      marginTop: 0,
      backgroundColor : 'white',
      //flexWrap: "nowrap",
    },

    header_left_view : {
      //marginRight: 0.05*DEVICE_WIDTH, 
      //height: 40, 
       width: DEVICE_WIDTH/4,  
      //borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'flex-start',
      
      //backgroundColor: 'pink',
      backgroundColor: 'transparent'
    },
    header_center_view : {
      width: DEVICE_WIDTH/2,  
      //backgroundColor: 'pink',
      justifyContent : 'center',
      alignItems: 'center',
      flexWrap: "nowrap",
    },

    header_right_view : {
      //marginRight: 0.05*DEVICE_WIDTH, 
      //height: 40, 
      width: DEVICE_WIDTH/4,  
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
      color: blueFLColor, 
      fontWeight : '400',
      fontSize:16,
    },



    header_icon : { 
      backgroundColor:'transparent',
      color: blueFLColor,
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
  height: DEVICE_WIDTH*0.707, 
  width: DEVICE_WIDTH,  
},


///////////////////////////////
//        HOME
///////////////////////////////
 rectangle : {
   //flex: 1,
  //width: DEVICE_WIDTH*0.75,
  //height: 150,
  marginRight: DEVICE_WIDTH*0.01,
  marginLeft:DEVICE_WIDTH*0.05,
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
    marginLeft: DEVICE_WIDTH*0.05,
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
      top: DEVICE_HEIGHT/2,
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