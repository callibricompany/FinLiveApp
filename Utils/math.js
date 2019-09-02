const Spline = require('cubic-spline');


export function maturityToDate(mat){
    let y = mat.substring(0,mat.length-1);
    return new Date(Date.now() + y * 365.25 * 86400 * 1000);

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


export function calculateBestCoupon(structuredProduct, df, UF){
        //console.log(structuredProduct);

        filteredDf = df.where(row => row.underlying === structuredProduct[0].underlying);
        filteredDf = filteredDf.where(row => row.maturity === structuredProduct[0].maturity);
        filteredDf = filteredDf.where(row => row.currency === structuredProduct[0].currency);
        filteredDf = filteredDf.where(row => row.strike === structuredProduct[0].strike);
        filteredDf = filteredDf.where(row => row.levelAutocall === structuredProduct[0].levelAutocall);
        filteredDf = filteredDf.where(row => row.isIncremental === structuredProduct[0].isIncremental);
        filteredDf = filteredDf.where(row => row.freqAutocall === structuredProduct[0].freqAutocall);
        filteredDf = filteredDf.where(row => row.degressiveStep === structuredProduct[0].degressiveStep);
        filteredDf = filteredDf.where(row => row.noCallNbPeriod === structuredProduct[0].noCallNbPeriod);
        filteredDf = filteredDf.where(row => row.airbagLevel === structuredProduct[0].airbagLevel);
        filteredDf = filteredDf.where(row => row.barrierPDI === structuredProduct[0].barrierPDI);
        filteredDf = filteredDf.where(row => row.isPDIUS === structuredProduct[0].isPDIUS);
        filteredDf = filteredDf.where(row => row.gearingPDI === structuredProduct[0].gearingPDI);
        filteredDf = filteredDf.where(row => row.freqPhoenix === structuredProduct[0].freqPhoenix);
        filteredDf = filteredDf.where(row => row.isMemory === structuredProduct[0].isMemory);
 
        //on applique le filtre UF
        filteredDf = filteredDf.transformSeries({
            Price: value => value + UF
          });


        //on recupere 2 series : les prix et les coupons
        seriePrices = filteredDf.getSeries('Price');
        serieCoupon = filteredDf.getSeries('coupon');

        //on regresse
        console.log(seriePrices.toArray());
        console.log(serieCoupon.toArray());


        var lr = linearRegression(serieCoupon.toArray(), seriePrices.toArray());
        return lr.intercept;
}

