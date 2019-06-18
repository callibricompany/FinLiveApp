import CONVERTING_TABLE from '../Data/fresh2app.json'



export function appToFresh(product){

    let fresh = JSON.stringify(product);
    
    
    var objs = CONVERTING_TABLE[0];
    for ( var key in objs) { 
        //console.log(" key is : "   + key + "   and value for key is   " + objs[key]);
        re = new RegExp(objs[key],"gi");
        fresh = fresh.replace(re, key);
    
    }
    
    //fresh = fresh.replace(/UF/gi, 'cf_rtro');

    return JSON.parse(fresh);
}

export function sortResults(data, prop, asc) {
    data.sort(function(a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
    return data;
}