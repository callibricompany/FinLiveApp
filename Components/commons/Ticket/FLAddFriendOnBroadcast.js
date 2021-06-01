import React, { useState, useCallback, useEffect} from 'react';
import { ScrollView, Text, View, Image, FlatList, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import  Ionicons  from 'react-native-vector-icons/Ionicons';

import Moment from 'moment';

import { GiftedChat, Send, InputToolbar, Composer, Message, Bubble, MessageImage} from 'react-native-gifted-chat';
import Lightbox from 'react-native-lightbox';

import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';

import { globalStyle, setFont, setColor} from '../../../Styles/globalStyle';
import { ifIphoneX, isIphoneX, ifAndroid, isAndroid, sizeByDevice, currencyFormatDE, isEqual, getConstant, getContentTypeIcon, getContentTypeColor, niceBytes } from '../../../Utils';
import { createreply } from '../../../API/APIAWS';


import * as TEMPLATE_TYPE from '../../../constants/template';

import Numeral from 'numeral'
import 'numeral/locales/fr'
import { CUsers } from '../../../Classes/CUsers';




export function FLAddFriendOnBroadcast ({ }) {
   


        return (
            <View style={{flex : 1, borderWidth : 0}}>
                <Text>sjhfjdshfjh</Text>
                
            </View>

        )
}




