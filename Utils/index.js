//  Created by Artem Bogoslavskiy on 7/5/18.

import { Dimensions, Platform, NativeModules } from 'react-native';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export function isIphoneX() {

  //const majorVersionIOS = parseInt(Platform.Version, 10);
  //console.log("iOS version " + majorVersionIOS);

  const DeviceInfo = NativeModules.DeviceInfo;

  //const deviceName = DeviceInfo.getName();
  //console.log("Device : " + JSON.stringify(DeviceInfo));

  //var isX = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && (height === 812 || width === 812);
  var isX = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && (height/width > 2.16) && (height/width < 2.17);
  //console.log("isIPhoneX : " + isX);

  return isX;
}

export function ifIphoneX(iphoneXStyle, regularStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export function sizeByDevice(iphoneXStyle, regularIphoneStyle, androidStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  } else if (isAndroid()) {
    return androidStyle;
  } else {
    return regularIphoneStyle;
  }
}

export function isAndroid() {
  return (Platform.OS === 'android');
}

export function ifAndroid(androidStyle, regularStyle) {
  if (isAndroid()) {
    return androidStyle;
  }
  return regularStyle;
}

const isFunction = input => typeof input === 'function';
export function renderIf(predicate) {
  return function(elemOrThunk) {
    return predicate ? (isFunction(elemOrThunk) ? elemOrThunk() : elemOrThunk) : null;
  }
}