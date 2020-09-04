import React, { useState, useCallback, useEffect} from 'react';
import { ScrollView, Text, View, Image, FlatList, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import  Ionicons  from 'react-native-vector-icons/Ionicons';

import Moment from 'moment';

import { GiftedChat, Send, InputToolbar, Composer, Message, Bubble, MessageImage} from 'react-native-gifted-chat';
import Lightbox from 'react-native-lightbox';
import HTML from 'react-native-render-html';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';

import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle';
import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual, getConstant, getContentTypeIcon, getContentTypeColor, niceBytes } from '../../../Utils';
import { createreply } from '../../../API/APIAWS';

import { FLDatePicker } from '../FLDatePicker';
import FLTemplateAutocall from '../Autocall/FLTemplateAutocall';
import { FLUF } from "../Autocall/FLUF";

import * as TEMPLATE_TYPE from '../../../constants/template';

import Numeral from 'numeral'
import 'numeral/locales/fr'
import { CUsers } from '../../../Classes/CUsers';







  
  
  function renderInputToolbar (props, lineCount) {
    
    return (
   
        <InputToolbar {...props} containerStyle={{

                                    //marginLeft: 15,
                                    //marginRight: 15,
                                    //marginBottom: 5 + 35 * (lineCount-1),
                                    //marginTop: 5,
                                    borderWidth: 1,
                                    borderBottomWidth : 0, 
                                    borderColor: 'grey',
                                    
                                    //height: 35 * lineCount,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor : 'lightgray',
                                    //textAlignVertical: 'center'
                                  }} 
        />

    );
  }



 
 function renderBubble(props) {
      //console.log(props.currentMessage);

      return ( 
        <View>
         <Bubble {...props}  wrapperStyle={{left: {backgroundColor: 'white'}, right : {backgroundColor: setColor('granny')} }} />
         </View>
      );
  }


function renderComposer(props, currentConversation) {

  if (currentConversation != null && currentConversation.hasOwnProperty('rw') && !currentConversation['rw']) {
    return (
      <View style={{height : 30, textAlign: 'left', textAlignVertical :'center', paddingLeft : 15, marginRight : 15, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={setFont('300', 18)}>
          Suivez la conversation
        </Text>
      </View>
    )
  } else {
    return <Composer {...props} textInputStyle={{textAlign: 'left', textAlignVertical :'center', backgroundColor : 'white', borderWidth : 1, marginTop : sizeByDevice(6,5,3) , borderRadius: 5, paddingTop :  sizeByDevice(9,8,0), paddingLeft : 15, marginRight : 15}}/>
  }
}


  function renderCustomView(props) {
    //console.log(props.currentMessage)
    if (props.currentMessage.hasOwnProperty('attachments') && props.currentMessage['attachments'].length > 0) {
 
  
                let toto = props.currentMessage['attachments'].map((message, index) => {
                   if(message.content_type.indexOf('image') !== -1) {
                      return (
                        <Lightbox style={{ resizeMode: 'contain'}} 
                                  renderContent={() => <Image style={{  flex : 1,resizeMode: 'contain',}} source={{ uri: url }} />}
                                  renderHeader={close => (
                                    <TouchableOpacity onPress={close} style={{marginTop : getConstant('statusBar'), marginRight : 20,  borderWith : 4, borderColor : 'red', alignItems : 'flex-end'}}>
                                      <MaterialCommunityIcons name='close' size={50} color='white' />
                                    </TouchableOpacity>
                                  )}
                                  key={index}
                        >
                            <Image style={{  width: 150, height: 100, borderRadius: 13, margin: 3,resizeMode: 'cover',}}
                                  source={{ uri: message.attachment_url }}
                            />
                        </Lightbox>
                        
                      );
                    } else {
                      let contentIcon = getContentTypeIcon(message.content_type);
                      return (
                        <TouchableOpacity key={index}
                                          onPress={() => {
                                            WebBrowser.openBrowserAsync(message.attachment_url, { enableBarCollapsing: true, showTitle: true });
                                          }}
                        >
                            <View style={{flexDirection : 'row', paddingLeft : 3, paddingTop : 3, paddingRight : 0, borderWidth :0, borderTopLeftRadius : index === 0 ? 15 : 0, borderTopRightRadius : index === 0 ? 15 : 0}} >
                              <View style={{borderWidth : 0, justifyContent: 'center', justifyContent : 'center'}}>
                                <MaterialCommunityIcons name={contentIcon} size={35} color={getContentTypeColor(message.content_type)}/>
                              </View>
                              <View style={{backgroundColor: 'lightgray', padding : 3, marginRight : 10, marginBottom : 3}}>
                                <Text style={setFont('200', 10)} >{message.name} </Text>
                              </View>
                            </View>
                            <View style={{height : 70 , backgroundColor : 'orange'}}>
                               <WebView source={{uri: message.attachment_url}}  scalesPageToFit={true}/>
                            </View>
                        </TouchableOpacity>
                        
                      );
                    }
                });
               return toto;    
    
    }

    return null;
      
    //   let titi = '';
    //   props.currentMessage['attachments'].map((message, index) => {
    //     // return (
    //     //   <View key={index}>
    //     //     <Text>jshj</Text>
    //     //     </View>
    //     // );
    //     titi = titi.concat('<View><Text>Merde</Text></View>');
    //     console.log(message);
    // });
    //   return (
    //     <View style={{backgroundColor : 'green', borderTopLeftRadius : 15, borderTopRightRadius : 15}} >
    //      <Text> {titi} </Text>
    //     </View>
    //   );
  }



export function FLChat ({isFocused, ticket, firebase, isLoading }) {
   
        const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
        const [currentConversation, setCurrentConversation] = useState(ticket.getConversations()[0]);
        const [currentTicketId, setCurrentTicketId] = useState(ticket.getId());
        const [linesInputCount, setLinesInputCount] = useState(1);
        const [messages, setMessages] = useState([]);

        useEffect(() => {
            
              //changement du message indiquant qui voit les conversations
              let conversations = ticket.getConversations();

              if (conversations !== null && conversations.length > currentConversationIndex) {
                let conv  = conversations[currentConversationIndex];
                //console.log(Object.keys(conv));
                setCurrentConversation(conv);
                setMessages(ticket.getChat(conv['id']));
                setCurrentTicketId(conv['id']);
              } else {
                setMessages([]);
              }
             //messages[messages.length-1].text = "Jaimy est un con";
          }, [currentConversationIndex]);

        useEffect(() => {
            //console.log("LE TICKET IL A BOUGE MON POTE : " + isFocused +  "  :  " + currentTicketId);
            if (isFocused && !isLoading) { //on recharge les conversations

                let conversations = ticket.getConversations();
                let conv  = conversations[currentConversationIndex];
                setCurrentConversation(conv);

                setMessages(ticket.getChat(currentTicketId));
            }
        }, [isFocused, isLoading]);


        const onSend = useCallback((newMessages, idTicket) => {


            //createReply({ ticketId: 232, body: '<B>|Pierre via App|:</B> Je pense que j en veux.' }, 'undefined').then(val => {console.log(val)}).catch(err => {console.log(err)});
          
            var mess = {};
        
            
            mess['ticketId'] = idTicket;
            mess['body'] = newMessages.length > 0 ? newMessages[0].text : '';
            //mess['from_email'] = this.props.authUser.email;
            mess['user_id'] = CUsers.ME.getCodeTS();
            //mess['replied_to'] = ['zlutsyuk@gmail.com'];
            mess['replied_to'] = 'zlutsyuk@gmail.com';
            
        
            createreply(firebase, mess)
            .then((data) => {
              console.log("SUCCES ENVOIE DU MESSAGE : " + mess['body']);
            })
            .catch(error => {
                console.log("Erreur ENVOIE DU MESSAGE : " + error);
            });
        
            console.log(mess);
            setMessages(prevMessages => [...newMessages, ...prevMessages])
        }, [])

        // console.log("REQUESTER ID : " + ticket.getRequesterId());
        // console.log("BROADCAST REQUESTER ID : ");
        
        return (
            <View style={{flex : 1, borderWidth : 0}}>
                {ticket.isShared() 
                ?
                        <View >
                            <View style={{height : 15, width : getConstant('width'), backgroundColor: 'white'}} />
                            <FlatList
                                //style={styles.wrapper}
                                //scrollTo={this.state.scrollTo}
                                contentContainerStyle={{ marginHorizontal: 0 , borderWidth : 0}}
                                data={ticket.getConversations()}
                                horizontal={true}
                                //extraData={isLoading}
                                renderItem={({ item, index }) => {
                                    let rn =  null;
              
                                    switch(index) {
                                        case 0 : //c'est le ticket general
                                            rn =  <View style={{justifyContent: 'center', alignItems : 'center'}}>
                                                    <MaterialCommunityIcons name='chat' size={40} color={index === currentConversationIndex ? 'black' : 'gray'}/>
                                                    <Text style={setFont('200',12, index === currentConversationIndex ? 'black' : 'gray')}>Emetteur</Text>
                                                  </View>;
                                            break;   
                                        case 1 : //c'est le ticket broadcast
                                            rn =  <View style={{justifyContent: 'center', alignItems : 'center'}}>
                                                        <Ionicons name='ios-chatbubbles' size={40} color={index === currentConversationIndex ? 'black' : 'gray'}/>
                                                        <Text style={setFont('200',12, index === currentConversationIndex ? 'black' : 'gray')}>Groupe</Text>
                                                    </View>;
                                            break; 
                                        
                                        default : 
                                            rn =  <View style={{height : 40, width : 40, borderWith : 0, borderColor : 'white', borderRadius : 20, backgroundColor : setColor(''), marginLeft : 10,  marginTop :5, marginBottom : 5, alignItems : 'center', justifyContent : 'center'}}  >
                                                        {item.hasOwnProperty('userInfo') 
                                                        ?   !item.userInfo.hasOwnProperty('avatarLink')
                                                            ? <Text style={setFont('400', 16, 'white', 'Regular')}>{item.userInfo.firstName.charAt(0)}.{item.userInfo.lastName.charAt(0)}.</Text>
                                                            : <Image style={{width: 40, height: 40, borderWidth : 0, borderRadius : 20, borderColor : 'white'}} source={{uri : item.userInfo.avatarLink}} />
                                                            // <Text style={setFont('200',12, index === currentConversationIndex ? 'black' : 'gray')}>{item.userInfo.firstName}</Text>
                                                        : null
                                                        }
                                                    </View>
                                           
                                            break;
                                    }
                             
                         
                                    return (
                                            <TouchableOpacity   style={{height : 60, 
                                                                        width : 70,  
                                                                        backgroundColor : index === currentConversationIndex ? 'whitesmoke' : 'lightgray', 
                                                                        justifyContent: 'center', 
                                                                        alignItems: 'center',
                                                                        //borderBottomWidth : index === currentConversationIndex ? 4 : 0,
                                                                        //borderBottomColor : index === currentConversationIndex ? 'red' : null,
                                                                    }}
                                                                onPress={() => {
                                                                    setCurrentConversationIndex(index);
                                                 
                                                                    
                                                                }}
                                            >
                                                {rn}
                                            </TouchableOpacity>
                                    );
                                }}
                                keyExtractor={item => item.id.toString()}
                            />  
                        </View> 
                : null
                }
                <View style={{flex: 1, borderWidth : 0, backgroundColor: 'whitesmoke', opacity : isLoading ? 0.3 : 1 }}>
                    <GiftedChat
                        messages={messages}
                        onSend={messages => onSend(messages, currentTicketId)}
                        placeholder={"Tapez votre message ..."}
                        keyboardShouldPersistTaps={'never'}
                        //locale={'fr-fr'}
                        timeFormat={"HH:mm"}
                        dateFormat={'ll'}
                        //dateFormat={Moment.format('ll')}
                        user={{
                            _id: 1,
                            //  name : 'Manu MACRON'
                        }}
                        renderSend={(props) => {
                            return (
                                <Send {...props} containerStyle={{borderWidth: 0, marginRight: 15 , marginLeft : 10, justifyContent:'center', alignItems:'center'}}>
                                    <View style={{width : 35, height : 35, borderColor : 'white', borderWidth : 1, borderRadius : 18, backgroundColor : 'white', paddingLeft : 4, justifyContent:'center', alignItems:'center',}}>
                                    <MaterialCommunityIcons name='send' size={25} color={setColor('subscribeticket')}/>
                                    </View>
                                
                                </Send>
                            )
                        }}
                        renderInputToolbar={(props) => renderInputToolbar(props, linesInputCount)}
                        multiline={true}
                        renderAvatar={() => null}
                        showUserAvatar={false}
                        showAvatarForEveryMessage={true}
                        onInputTextChanged={(input) => {
                            let lines = input.split(/\r\n|\r|\n/);
                            setLinesInputCount(lines.length);
                        }}
                        //renderComposer={(props) =>  <Composer {...props} textInputStyle={{textAlign: 'left', textAlignVertical :'center', backgroundColor : 'white', borderWidth : 1, marginTop : sizeByDevice(6,5,3) , borderRadius: 5, paddingTop :  sizeByDevice(9,8,0), paddingLeft : 15, marginRight : 15}}/>}
                        renderComposer={(props) =>  renderComposer(props, currentConversation)}
                        renderUsernameOnMessage={(currentConversation != null && currentConversation.hasOwnProperty('type') && currentConversation['type'] !== 'TICKET_PRODUCT')}
                        renderBubble={(props) => renderBubble(props)}
                        renderCustomView={(props) => renderCustomView(props)}
                        //isCustomViewBottom={true}

                    />
                </View>
                
            </View>

        )
}




