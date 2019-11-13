const Spline = require('cubic-spline');


export function maturityToDate(mat){
    //check if 18M
    if (mat.substring(mat.length-1, mat.length) === 'M'){
      let months = mat.substring(0,mat.length-1);
      return new Date(Date.now() + months * 365.25 * 86400 * 1000/12);
    }
    let years = mat.substring(0,mat.length-1);
    return new Date(Date.now() + years * 365.25 * 86400 * 1000);

}

export function getJsDateFromExcel(excelDate) {

    // JavaScript dates can be constructed by passing milliseconds
    // since the Unix epoch (January 1, 1970) example: new Date(12312512312);
  
    // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")             
    // 2. Convert to milliseconds.
  
    return new Date(Math.round((excelDate - (25567 + 2))*86400)*1000);
  
  }

export function linearRegression(y,x){
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < y.length; i++) {

        sum_x += x[i];
        sum_y += y[i];
        sum_xy += (x[i]*y[i]);
        sum_xx += (x[i]*x[i]);
        sum_yy += (y[i]*y[i]);
    }

    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
}



