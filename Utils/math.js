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

export function getJSONFromCode(code, date) {

    var obj = {};
    
    
    obj ['code'] = code
    obj ['price'] = 0;
    obj ['vega'] = 0;
    obj['date'] = date;


    var parameters = currentline[0].split('_');
    
    for(var j=0; j < parameters.length; j++){
        let value = parameters[j].split(':');
        switch (value[0]) {
            case 'U' :
                value[0] = 'underlying';
                break;
            case 'M' :
                value[0] = 'maturity';
                break;
            case 'CU' :
                value[0] = 'currency';
                break;
            case 'S' :
                value[0] = 'strike';
                value[1] = Number(value[1].replace(',','.'));
                break;
            case 'LA' :
                value[0] = 'levelAutocall';
                value[1] = Number(value[1].replace(',','.'));
                break;
            case 'CA' :
                value[0] = 'couponAutocall';
                value[1] = Number(value[1].replace(',','.'));
                break;
            case 'II' :
                value[0] = 'isIncremental';
                (value[1].toLowerCase() === 'true' || value[1].toLocaleUpperCase() === 'true') ? value[1] = true : value[1] = false;
                break;
            case 'FA' :
                value[0] = 'freqAutocall';
                break;
            case 'DS' :
                value[0] = 'degressiveStep';
                value[1] = Number(value[1].replace(',','.'));
                break;
            case 'NNCP' :
                value[0] = 'noCallNbPeriod';
                value[1] = Number(value[1].replace(',','.'));
                break;
            case 'AL' :
                value[0] = 'airbagLevel';
                value[1] = Number(value[1].replace(',','.'));
                break;
            case 'BPDI' :
                value[0] = 'barrierPDI';
                value[1] = Number(value[1].replace(',','.'));
                break;
            case 'PDIUS' :
                value[0] = 'isPDIUS';
                value[1].toLowerCase() === 'true' || value[1].toLocaleUpperCase() === 'true' ? value[1] = true : value[1] = false;
                break;
            case 'GPDI' :
                value[0] = 'gearingPDI';
                value[1] = Number(value[1].replace(',','.'));
                break;
            case 'CP' :
                value[0] = 'couponPhoenix';
                value[1] = Number(value[1].replace(',','.'));
                break;
            case 'FP' :
                value[0] = 'freqPhoenix';
                break;
            case 'CB' :
                value[0] = 'barrierPhoenix';
                value[1] = Number(value[1].replace(',','.'));
                break;
            case 'IM' :
                value[0] = 'isMemory';
                (value[1].toLowerCase() === 'true' || value[1].toLocaleUpperCase() === 'true') ? value[1] = true : value[1] = false;
                break;
            case 'C' :
                value[0] = 'coupon';
                value[1] = Number(value[1].replace(',','.'));
                break;
            default : break;
        }
        obj[value[0]] = value[1];
    }
    // determination du nom du produit
    if (obj['barrierPhoenix'] !== 1) { //phoenix
            obj['isMemory'] ? obj['product'] = 'memoryPhoenix' : obj['product'] = 'classicPhoenix';
    } else { //c'est un autocall
            obj['isIncremental'] ?  
                                    (obj['airbagLevel'] === obj['barrierPDI'] || obj['airbagLevel'] === (1 + obj['barrierPDI'])/2) ?  obj['product'] = 'airbagAutocall'
                                                                              :  obj['product'] = 'incrementalAutocall'
                                  : obj['product'] = 'classicAutocall';
    }
    return obj;
}
/*Object {

  "category": "PSACTIONS",
  "code": "U:FP FP_M:8Y_CU:EUR_S:1_LA:1_CA:0_II:FALSE_FA:1Y_DS:0_NNCP:1_AL:1_BPDI:0.4_PDIUS:FALSE_GPDI:-1_CP:0.102_FP:1Y_CB:0.5_IM:TRUE_C:0.102",
  "sector": "Energie",
  "underlyingName": "Total",
 
}*/


