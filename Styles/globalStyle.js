
import { StyleSheet, Platform, StatusBar} from 'react-native'
import Dimensions from 'Dimensions'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const globalStyle = StyleSheet.create({

///////////////////////////////
//        header
///////////////////////////////

    header_safeviewarea :{
      //flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#C8D1DB',
      height: Platform.OS === 'ios' ? 95 : 95-STATUSBAR_HEIGHT,
      marginTop: STATUSBAR_HEIGHT,
      //flexWrap: "nowrap",
    },

    header_left_view : {
      marginRight: 0.05*DEVICE_WIDTH, 
      height: 40, 
      width: 40,  
      //borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: 'steelblue'
      backgroundColor: 'transparent'
    },
    header_center_view : {
      flex: 1,
      width: (DEVICE_WIDTH*0,9-2*40),
      backgroundColor: 'transparent',
      flexWrap: "nowrap",
    },

    header_center_text_big : {
      color: '#707070', 
      fontSize:36,
    },
    header_center_text_medium : {
      color: '#707070', 
      fontSize:22,
    },

    header_right_view : {
      marginRight: 0.05*DEVICE_WIDTH, 
      height: 40, 
      width: 40,  
      //borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: 'steelblue'
      backgroundColor: 'transparent'
    },
    header_icon : { 
      backgroundColor:'transparent',
      color: '#707070'
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
    }
  })

export { globalStyle }