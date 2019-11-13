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

export function currencyFormatDE(num, nbDecimals) {
  return (
    num
      .toFixed(nbDecimals) // always two decimal digits
      .replace('.', ',') // replace decimal point character with ,
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') 
      //.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + ' €'
  ) // use . as a separator
}

export function isEqual( x, y ) {
  if ( x === y ) return true;
    // if both x and y are null or undefined and exactly the same

  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    // if they are not strictly equal, they both need to be Objects

  if ( x.constructor !== y.constructor ) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

  for ( var p in x ) {
    if ( ! x.hasOwnProperty( p ) ) continue;
      // other properties were tested using x.constructor === y.constructor

    if ( ! y.hasOwnProperty( p ) ) return false;
      // allows to compare x[ p ] and y[ p ] when set to undefined

    if ( x[ p ] === y[ p ] ) continue;
      // if they have the same strict value or identity then they are equal

    if ( typeof( x[ p ] ) !== "object" ) return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

    if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
      // Objects and Arrays must be tested recursively
  }

  for ( p in y ) {
    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
      // allows x[ p ] to be set to undefined
  }
  return true;
}