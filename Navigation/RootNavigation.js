import * as React from 'react';


export const navigationRef = React.createRef();

export const isMountedRef = React.createRef();


export function navigate(name, params) {
  if (isMountedRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {

    console.log("ELSE DU NAVIGATION_REF");
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}



