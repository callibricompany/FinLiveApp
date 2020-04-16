import React from 'react'
import { Modal, View, Text,  Dimensions } from 'react-native'; 
import { WebView } from 'react-native-webview';
import { URL_AWS } from '../../API/APIAWS';
import { setFont } from '../../Styles/globalStyle';


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class FLAnimatedSVG extends React.Component{
    constructor(props){
        super(props);

        this.svgName = this.props.name;  

        this.state = {       
            isVisible : this.props.visible,
            text : this.props.text
        };
        console.log(URL_AWS);
    }

    UNSAFE_componentWillReceiveProps(props) {

        this.setState({ isVisible : props.visible , text : props.text });
    }



    


    render(){
        if (!this.state.isVisible) {
            return null;
        }

        return (
            <Modal animationType="fade" transparent={true} visible={this.state.isVisible}>
                    <View style={{width : 100, height : 100,  top: DEVICE_HEIGHT/2-50, left : DEVICE_WIDTH/2 - 50, backgroundColor:'transparent', alignItems : 'center', justifyContent: 'flex-start', borderWidth: 0}}>
        
                        <WebView source={{uri: URL_AWS + '/svg?page=' + this.svgName}} style={{  width : 150, height : 100, marginTop: -50, marginLeft : -50}} scalesPageToFit={false}/>
               
                        
                    </View>
                    <View style={{position : 'absolute', top : DEVICE_HEIGHT/2 + 70, left : DEVICE_WIDTH/4,  width : DEVICE_WIDTH/2, borderWidth: 0, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={[setFont('300', 16, 'black', 'Regular'), {textAlign: 'center'}]}>
                            {this.state.text}
                        </Text>
                    </View>
            </Modal>
      
      
          );
    }
}

export default FLAnimatedSVG;

