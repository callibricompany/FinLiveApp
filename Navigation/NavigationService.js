import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
 
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}


function handleBadges(key, count) {

  //console.log(_navigator);

  _navigator.dispatch(NavigationActions.setParams({
    key ,
    params: { badge: count }
  }));
}
// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  handleBadges,

};