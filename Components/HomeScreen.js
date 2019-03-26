import React from 'react'
import { View, TouchableOpacity, ActivityIndicator, FlatList,Text,SafeAreaView,Platform, StatusBar} from 'react-native'
import { Thumbnail, ListItem, Spinner, Input, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem }  from "native-base";
import { globalStyle } from '../Styles/globalStyle'
import { getNews } from '../API/APINews'
import Dimensions from 'Dimensions';
import { UserContext } from '../Context/UserProvider';
import FLInput from '../Components/commons/FLInput'



//import Icon from 'react-native-vector-icons/FontAwesome'

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;



class HomeScreen extends React.Component {

  constructor(props) {
      super(props)
      this.state = {
        isLoading: true,
        news: []
      }
       // console.log("PLATE-FORME : " + Platform.OS)
    }



    
    static navigationOptions = {
      header: (
        <SafeAreaView style={{
          //flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#C8D1DB',
          height: Platform.OS === 'ios' ? 90 : 90-STATUSBAR_HEIGHT,
          marginTop: STATUSBAR_HEIGHT
        }}>
          <View style={{
            marginLeft: 0.05*DEVICE_WIDTH, 
            width: 50, 
            height: 50,  
            //backgroundColor: 'powderblue'
            backgroundColor: 'transparent'
            }} 
            />
        <View style={{  backgroundColor: 'transparent'}} >
          <Title style={{color: '#9A9A9A', fontSize:36}}>FinLive</Title>
        </View>
        <View style={{
              marginRight: 0.05*DEVICE_WIDTH, 
              height: 40, 
              width: 40,  
              //borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              //backgroundColor: 'steelblue'
              backgroundColor: 'transparent'
              }} 
          >
          <Icon name='ios-notifications' style={{
                      backgroundColor:'transparent',
                      color: '#9A9A9A'
                    }}
          />
          <View 
                    style={{
                      position: 'absolute',
                      width :18,
                      height : 18,
                      borderRadius: 9,
                      backgroundColor:'red',
                      justifyContent: 'center',
                      alignItems: 'center',
                      top: 0,
                      left: 40 - 18
                    }}
                    >
                      <Text style={{backgroundColor:'transparent',fontSize: 15, color: 'white'}}>4</Text>
            </View>

        </View>
    
       
  
               
       </SafeAreaView>
   
      )
    }

    componentWillMount(){
      this._getNewsList();

    }
    _NavToNewsList = () => {
      this.props.navigation.navigate('NewsList');
    };

   
    _getNewsList = () => {
       getNews().then(data => {
        //this.setState( {isLoading : false})
         //response.json({ message: 'Request received!', data })
         
         
         //console.log(data);
         
         this.setState( {news: data, isLoading: false});
         //this.setState( {isLoading : false})
       }) 
       
       //console.log(this.state.news)   
     };

     _displayLoading() {
      if (this.state.isLoading) {
        return (
          <View style={globalStyle.loading_container}>
              <ActivityIndicator size='large' />
            </View>
        )
      }
    }

    _displayNews = ({ item }) => {
    
      //console.log(item);
        return (
            

       
        <Card style={{
              width: DEVICE_WIDTH*0.65,
              marginRight: DEVICE_WIDTH*0.01,
              marginLeft:DEVICE_WIDTH*0.05,
   
              }}
              
              >
        <TouchableOpacity onPress={this._NavToNewsList.bind(this)}>
        <CardItem > 
          <Left>
            <Thumbnail source={{uri: item.urlToImage}} />
            <Body>
            <Text>{item.title}</Text>
              
              <Text>{item.author} - {item.publishedAt}</Text>
            </Body>
          </Left>
        </CardItem>
        </TouchableOpacity>
        </Card>
        
        )
    }

    render() {
      //console.log(this.props);
      return(
        <Container>
        
          <Content>
            <Text style={{
              marginLeft: DEVICE_WIDTH*0.05,
              marginTop: 20,
              marginBottom: 5,
              fontSize:26,
              color: '#707070'

            }}>Actualités</Text>
            <FlatList
              data={this.state.news}
              renderItem={this._displayNews}
              keyExtractor={item => item.title}
              horizontal={true}
              //stickyHeaderIndices={this.state.stickyHeaderIndices}
           />

   


          </Content>
          {this._displayLoading()}
         
        </Container>
      );
    }
}


export default HomeScreen

//<Input autoCorrect={false} onChange={e => {this.props.setName(e.nativeEvent.text)}}/>