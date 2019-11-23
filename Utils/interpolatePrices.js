const dataForge = require('data-forge');
var interpolator = require('./spline.js');

function print(df, tab) {
    console.log("\n$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");    
    let dfPrint3 = new dataForge.DataFrame(df);
    dfPrint3 = dfPrint3.subset(tab);
    console.log(dfPrint3.toString());    

}

function getBumps(type, vega, maturity, nominal) {
    //on renorme les bumps vega avec la maturite
    bump = maturity * Math.abs(0.8*vega) / 10;

    //estimation CC vendeur emetteur
    bump = 1.5 * bump;
    return bump;
    //return 0;
}

function getFLMargin(nominal) {
    return 0.000;
}

export function interpolatePDI (df, pdi) {
        //verifier que la matu n'existe pas deja
        if (df.where((row) => row.barrierPDI === pdi).toRows().length !== 0) {
          df = df.where((row) => row.barrierPDI === pdi).bake();
        } else {
          ////this.setState({ messageLoading : this.eleborateMessageLoading('Interpolation des PDI')});
          //il faut interpoler et distinguer tous 
          let distinctMaturities = df.getSeries('maturity').bake().distinct();
          let distinctUnderlyings = df.getSeries('underlying').bake().distinct();
          let distinctBarrierPhoenix = df.getSeries('barrierPhoenix').bake().distinct();
          
          let distinctDegressiveStep = df.getSeries('degressiveStep').bake().distinct();
          let distinctCoupon = df.getSeries('coupon').bake().distinct();
          //isIncremental
          //noCallNbPeriod
  
  
  
          let dfToAdd = new dataForge.DataFrame();
          //[...new Set(PRICES.map(x => x.maturity))].forEach((mat) => {
          distinctMaturities.forEach((mat) => {
            d = new dataForge.DataFrame(df);
            //d = d.dropSeries(['code','currency','strike','strikeDate', 'finalDate','startDate','endDate','swapPrice','levelAutocall','spreadAutocall','spreadPDI','gearingPDI','spreadBarrier','Vega', 'couponAutocall','couponPhoenix']);
            d1 = d.where((row) => row.maturity === mat).bake();
              distinctUnderlyings.forEach((udl) => {
                d2 = d1.where((row) => row.underlying === udl).bake();
                distinctBarrierPhoenix.forEach((bPh) => {
                  d3 = d2.where((row) => row.barrierPhoenix === bPh).bake();
                        distinctDegressiveStep.forEach((ds) => {
                          d5 = d3.where((row) => row.degressiveStep === ds).bake();
                          distinctCoupon.forEach((cpn) => {
                            //calcul du prix a cette barriere
                            d6 = d5.where((row) => row.coupon === cpn).bake();
                            if (d6.toRows().length !== 0) {
                                ////this.setState({ messageLoading : this.eleborateMessageLoading('.')});
                                //interpolation
                                xs = d6.getSeries('barrierPDI').bake().distinct().toArray();
                                ys = d6.getSeries('price').bake().distinct().toArray();
    
                                ysVega = d6.getSeries('vega').bake().distinct().toArray();

                                //xs.map((x, i) => console.log(x+" : "+ys[i]));
                                //xs.map((x, i) => xs[i] = Number(x.substring(0, x.length - 1)));
                                //inter et extrapolation
                                points = [];
                                xs.map((x, i) => points[i] = [xs[i], ys[i]]);
                                f = interpolator(points);
                              
                                pointsVega = [];
                                xs.map((x, i) => pointsVega[i] = [xs[i], ysVega[i]]);
                                fVega = interpolator(pointsVega);

                                //print(d6, ["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                                
                                //splinePDIBarrier = new Spline(xs, ys);
    
                                //console.log("barrierPDI @ "+ pdi +" : "+splinePDIBarrier.at(pdi) + "     f : "+f(pdi));
                                //console.log("Apres reduction : " + d9.toRows().length);
                                //console.log(d9.toString());
                                //on ne garde que le premier pour recrer le meme tableau
                                d10 = d6.head(1);
                                bPDIToChange = d10.getSeries('barrierPDI').bake().toArray().toString();
                                d10 = d10.transformSeries({
                                    barrierPDI: value => pdi,
                                    price: value => f(pdi),
                                    vega: value => fVega(pdi),
                                    //il faut reconstiturer le code
                                    code: value => value.replace('_BPDI:' + bPDIToChange, '_BPDI:' + pdi)
                                });
                                dfToAdd = dfToAdd.concat(new dataForge.DataFrame(d10));
  
                            }
                          })

                      })
                    
              })
            })
  
          })
          //console.log(dfToAdd.toString());
          df = dfToAdd;
        }

        return df;
      /*} else { //pas d'instruction : on prend le max
        //on prend le min dispo
        //let pdi = [...new Set(PRICES.map(x => x.barrierPDI))];
        let pdi = df.getSeries('barrierPDI').distinct().toArray();
        pdiMax = Math.max(...pdi);
  
        df = df.where((row) => row.barrierPDI === pdiMax);
      }*/

}


export function interpolateAirbag (df, airbag) {

    if (df.where((row) => row.airbagLevel === airbag).toRows().length !== 0) {
      df = df.where((row) => row.airbagLevel === airbag).bake();
    } else {
      ////this.setState({ messageLoading : this.eleborateMessageLoading('Interpolation des PDI')});
      //il faut interpoler et distinguer tous 
      let distinctMaturities = df.getSeries('maturity').bake().distinct();
      let distinctUnderlyings = df.getSeries('underlying').bake().distinct();
      let distinctBarrierPhoenix = df.getSeries('barrierPhoenix').bake().distinct();
      let dictinctPDI = df.getSeries('barrierPDI').bake().distinct();
      let distinctDegressiveStep = df.getSeries('degressiveStep').bake().distinct();
      let distinctCoupon = df.getSeries('coupon').bake().distinct();


      let dfToAdd = new dataForge.DataFrame();
      //[...new Set(PRICES.map(x => x.maturity))].forEach((mat) => {
      distinctMaturities.forEach((mat) => {
        d = new dataForge.DataFrame(df);
        //d = d.dropSeries(['code','currency','strike','strikeDate', 'finalDate','startDate','endDate','swapPrice','levelAutocall','spreadAutocall','spreadPDI','gearingPDI','spreadBarrier','Vega', 'couponAutocall','couponPhoenix']);
        d1 = d.where((row) => row.maturity === mat).bake();
          distinctUnderlyings.forEach((udl) => {
            d2 = d1.where((row) => row.underlying === udl).bake();
            distinctBarrierPhoenix.forEach((bPh) => {
              d3 = d2.where((row) => row.barrierPhoenix === bPh).bake();
                dictinctPDI.forEach((pdiLevel) => {
                    d4 = d3.where((row) => row.barrierPDI === pdiLevel).bake();
                    distinctDegressiveStep.forEach((ds) => {
                      d5 = d4.where((row) => row.degressiveStep === ds).bake();
                      distinctCoupon.forEach((cpn) => {
                        //calcul du prix a cette barriere
                        d6 = d5.where((row) => row.coupon === cpn).bake();
                        if (d6.toRows().length !== 0) {
                            ////this.setState({ messageLoading : this.eleborateMessageLoading('.')});
                            
                            //interpolation
                            xs = d6.getSeries('airbagLevel').bake().distinct().toArray();
                            //ys = d6.getSeries('price').distinct().toArray();
                            let ys ={};
                            xs.map((x, i) => ys[i] = d6.where((row) => row.airbagLevel === x).getSeries('price').bake().toArray()[0]);
                            let ysVega ={};
                            xs.map((x, i) => ysVega[i] = d6.where((row) => row.airbagLevel === x).getSeries('vega').bake().toArray()[0]);

                            //xs.map((x, i) => console.log(x+" : "+ys[i]));
                            //xs.map((x, i) => xs[i] = Number(x.substring(0, x.length - 1)));
                            //inter et extrapolation
                            points = [];
                            xs.map((x, i) => points[i] = [xs[i], ys[i]]);
                            f = interpolator(points);
                            
                            pointsVega = [];
                            xs.map((x, i) => pointsVega[i] = [xs[i], ysVega[i]]);
                            fVega = interpolator(pointsVega);

                            //print (d6,[ "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "degressiveStep", "code"]);
                                

                            //on ne garde que le premier pour recrer le meme tableau
                            d10 = d6.head(1).bake();
                            //print (d10,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                             
                            bAirbagOld = d10.getSeries('airbagLevel').bake().toArray().toString();
                            //console.log(bAirbagOld + " -> " + airbag + " : " + f(airbag));
                            d10 = d10.transformSeries({
                                airbagLevel: value => airbag,
                                price: value => f(airbag),
                                vega: value => fVega(airbag),
                                //il faut reconstiturer le code
                                code: value => value.replace('_AL:' + bAirbagOld, '_AL:' + airbag)
                            });
                            //print (d10,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                             

                            dfToAdd = dfToAdd.concat(new dataForge.DataFrame(d10).bake());
                            //print (dfToAdd,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                             

                        }
                      })
                    })
                  })
                
          })
        })

      })
      //console.log(dfToAdd.toString());
      //print (dfToAdd,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                             
      df = dfToAdd;
    }
    return df;
}

export function interpolateDS (df, ds) {

    if (df.where((row) => row.degressiveStep === ds).toRows().length !== 0) {
      df = df.where((row) => row.degressiveStep === ds).bake();
    } else {
      ////this.setState({ messageLoading : this.eleborateMessageLoading('Interpolation des PDI')});
      //il faut interpoler et distinguer tous 
      let distinctMaturities = df.getSeries('maturity').bake().distinct();
      let distinctUnderlyings = df.getSeries('underlying').bake().distinct();
      let distinctBarrierPhoenix = df.getSeries('barrierPhoenix').bake().distinct();
      let distinctCoupon = df.getSeries('coupon').bake().distinct();
      //isIncremental
      //noCallNbPeriod



      let dfToAdd = new dataForge.DataFrame();
      //[...new Set(PRICES.map(x => x.maturity))].forEach((mat) => {
      distinctMaturities.forEach((mat) => {
        d = new dataForge.DataFrame(df);
        //d = d.dropSeries(['code','currency','strike','strikeDate', 'finalDate','startDate','endDate','swapPrice','levelAutocall','spreadAutocall','spreadPDI','gearingPDI','spreadBarrier','Vega', 'couponAutocall','couponPhoenix']);
        d1 = d.where((row) => row.maturity === mat).bake();
          distinctUnderlyings.forEach((udl) => {
            d2 = d1.where((row) => row.underlying === udl).bake()
            distinctBarrierPhoenix.forEach((bPh) => {
              d3 = d2.where((row) => row.barrierPhoenix === bPh).bake()
                      distinctCoupon.forEach((cpn) => {
                        //calcul du prix a cette barriere
                        d6 = d3.where((row) => row.coupon === cpn).bake();
                        if (d6.toRows().length !== 0) {
                            ////this.setState({ messageLoading : this.eleborateMessageLoading('.')});
                            //interpolation
                            xs = d6.getSeries('degressiveStep').bake().distinct().toArray();
                            ys = d6.getSeries('price').bake().distinct().toArray();
                            ysVega = d6.getSeries('vega').bake().distinct().toArray();
                          
                            //xs.map((x, i) => console.log(x+" : "+ys[i]));
                            //xs.map((x, i) => xs[i] = Number(x.substring(0, x.length - 1)));
                            //inter et extrapolation
                            points = [];
                            xs.map((x, i) => points[i] = [xs[i], ys[i]]);
                            f = interpolator(points);
                            
                            pointsVega = [];
                            xs.map((x, i) => pointsVega[i] = [xs[i], ysVega[i]]);
                            fVega = interpolator(pointsVega);


                            //print (d6,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                                

                            //on ne garde que le premier pour recrer le meme tableau
                            d10 = d6.head(1);
                            //print (d10,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                             
                            bDSOld = d10.getSeries('degressiveStep').bake().toArray().toString();
                            //console.log(bDSOld + " -> " + ds + " : " + f(ds));
                            d10 = d10.transformSeries({
                                degressiveStep: value => ds,
                                price: value => f(ds),
                                vega: value => fVega(ds),
                                //il faut reconstiturer le code
                                code: value => value.replace('_DS:' + bDSOld, '_DS:' + ds)
                            });
                            //print (d10,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                             

                            dfToAdd = dfToAdd.concat(new dataForge.DataFrame(d10));
                            //print (dfToAdd,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                             

                        }
  
                  })
                
          })
        })

      })
      //console.log(dfToAdd.toString());
      //print (dfToAdd,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                             
      df = dfToAdd;
    }
    return df;
}

export function interpolateBarrierPhoenix (df, barrierPhoenix) {

    if (df.where((row) => row.barrierPhoenix === barrierPhoenix).toRows().length !== 0) {
      df = df.where((row) => row.barrierPhoenix === barrierPhoenix).bake();
    } else {
      ////this.setState({ messageLoading : this.eleborateMessageLoading('Interpolation des PDI')});
      //il faut interpoler et distinguer tous 
      let distinctMaturities = df.getSeries('maturity').bake().distinct();
      let distinctUnderlyings = df.getSeries('underlying').bake().distinct();
      let distinctCoupon = df.getSeries('coupon').bake().distinct();
      //isIncremental
      //noCallNbPeriod



      let dfToAdd = new dataForge.DataFrame();
      //[...new Set(PRICES.map(x => x.maturity))].forEach((mat) => {
      distinctMaturities.forEach((mat) => {
        d = new dataForge.DataFrame(df);
        //d = d.dropSeries(['code','currency','strike','strikeDate', 'finalDate','startDate','endDate','swapPrice','levelAutocall','spreadAutocall','spreadPDI','gearingPDI','spreadBarrier','Vega', 'couponAutocall','couponPhoenix']);
        d1 = d.where((row) => row.maturity === mat).bake();
          distinctUnderlyings.forEach((udl) => {
            d2 = d1.where((row) => row.underlying === udl).bake();
                      distinctCoupon.forEach((cpn) => {
                        //calcul du prix a cette barriere
                        d6 = d2.where((row) => row.coupon === cpn).bake();
                        if (d6.toRows().length !== 0) {
                            ////this.setState({ messageLoading : this.eleborateMessageLoading('.')});
                            //interpolation
                            xs = d6.getSeries('barrierPhoenix').bake().distinct().toArray();
                            ys = d6.getSeries('price').bake().distinct().toArray();
                            ysVega = d6.getSeries('vega').bake().distinct().toArray();
                          
                            //xs.map((x, i) => console.log(x+" : "+ys[i]));
                            //xs.map((x, i) => xs[i] = Number(x.substring(0, x.length - 1)));
                            //inter et extrapolation
                            points = [];
                            xs.map((x, i) => points[i] = [xs[i], ys[i]]);
                            f = interpolator(points);
                            
                            pointsVega = [];
                            xs.map((x, i) => pointsVega[i] = [xs[i], ysVega[i]]);
                            fVega = interpolator(pointsVega);

                            //print (d6,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                                

                            //on ne garde que le premier pour recrer le meme tableau
                            d10 = d6.head(1);
                            //print (d10,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                             
                            bPhOld = d10.getSeries('barrierPhoenix').bake().toArray().toString();
                            //console.log(bDSOld + " -> " + ds + " : " + f(ds));
                            d10 = d10.transformSeries({
                                barrierPhoenix: value => barrierPhoenix,
                                price: value => f(barrierPhoenix),
                                vega: value => fVega(barrierPhoenix),
                                //il faut reconstiturer le code
                                code: value => value.replace('_CB:' + bPhOld, '_CB:' + barrierPhoenix)
                            });
                            //print (d10,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                             

                            dfToAdd = dfToAdd.concat(new dataForge.DataFrame(d10));
                            //print (dfToAdd,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                             

                        }   
          })
        })

      })
      //console.log(dfToAdd.toString());
      //print (dfToAdd,["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
                             
      df = dfToAdd;
    }
    return df;
}

export  function interpolateBestProducts(data, request) {

    var product = request.getProduct();
    var criteria = request.getCriteria();
    
    //chargement des meilleurs prix
    var allPricesDF = dataForge.fromJSON(JSON.stringify(data));
    //correction des string en nombre
    allPricesDF = allPricesDF.transformSeries({
      vega: value => Number(typeof value === 'string' ? value.replace(',','.') : value),
      price: value => Number(typeof value === 'string' ? value.replace(',','.') : value),
    });

    var df = new dataForge.DataFrame(allPricesDF);
    console.log("Taille départ : " + df.toRows().length);

    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
    //
    //  on filtre sur tous les elements qui sont sensés être uniques
    //
    //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    //        LE PRODUIT
    df = df.where((row) => product.type.value === row.product).bake();

     //        LA FREQUENCE
     df = df.where((row) => criteria['freqAutocall'] === row.freqAutocall).bake();    

    //         LE NOMBRE DE PERIODES SANS RAPPEL
    df = df.where((row) => criteria['noCallNbPeriod'] === row.noCallNbPeriod).bake(); 

    //         INCREMENTAL
    df = df.where((row) => criteria['isIncremental'] === row.isIncremental).bake(); 

    //         PDI US ou EU
    df = df.where((row) => criteria['isPDIUS'] === row.isPDIUS).bake(); 

    //         PHOENIX MEMOIRE
    df = df.where((row) => criteria['isMemory'] === row.isMemory).bake(); 

    console.log("Taille apres 1 er filtres simples : " + df.toRows().length);

    
    //AIRBAG
    //print(df, ["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
    if (product.airbagLevel.isActivated) {
      switch (product.airbagLevel.value) {
        case 'NA': //pas d'airbag
          df = df.where((row) => row.airbagLevel === 1).bake();
          break;
/*        case 'SA': //semi-airbag
          df = df.where((row) => row.airbagLevel === (1 + row.barrierPDI) / 2);
          break;
        case 'FA': // fullairbag
          df = df.where((row) => row.airbagLevel === row.barrierPDI);
          break;*/
        default:  //il s'agit des airbag et semi-airbag
          let pdi = criteria.hasOwnProperty('barrierPDI') ? criteria['barrierPDI'] : product.barrierPDI.value;
          let abg = product.airbagLevel.value === 'FA' ? pdi : ((pdi + 1)/2);
          df = interpolateAirbag (df, abg);
          break;
      }
    } else { //on ne garde que les sans airbag
      df = df.where((row) => row.airbagLevel === 1);
    }
    //print(df, ["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);
    
    console.log("Taille apres AIRBAG : " + df.toRows().length);
    
    

    //FREQUENCE
    /*
    if (product.freq.isActivated) {
      df = df.where((row) => row.freqAutocall === product.freq.value);
    } else { //on prend la plus faible parmis les dispos
      //let f = [...new Set(PRICES.map(x => x.freqAutocall))];
      let f = df.getSeries('freqAutocall').distinct().toArray();
      freqArray = FREQUENCYLIST.filter(({ id }) => f.includes(id));
      freqMin = Math.min(...freqArray.map((x) => x.freq));
      freq = freqArray.filter(id => id.freq === freqMin)[0];
      df = df.where((row) => row.freqAutocall === freq.id);
    }
    */



    //PDI
    df = interpolatePDI (df, criteria.hasOwnProperty('barrierPDI') ? criteria['barrierPDI'] : product.barrierPDI.value);
    console.log("Taille apres PDI : " + df.toRows().length);
    //print(df, ["product", "coupon", "maturity", "barrierPDI", "airbagLevel", "price", "code"]);


    //STEPDOWN
    //print(df, ["coupon", "maturity", "barrierPDI", "airbagLevel", "price", "degressiveStep", "code"]);
    df = interpolateDS (df, criteria.hasOwnProperty('degressiveStep') ? criteria['degressiveStep'] : product.degressiveStep.value);
    console.log("Taille apres STEPDOWN : " + df.toRows().length);

    //BARRIER PHOENIX
    //print(df, ["coupon", "maturity", "barrierPDI", "airbagLevel", "price", "barrierPhoenix", "code"]);
    df = interpolateBarrierPhoenix (df, criteria.hasOwnProperty('barrierPhoenix') ? criteria['barrierPhoenix'] : product.barrierPhoenix.value);
    interpolateBarrierPhoenix
    //print(df, ["coupon", "maturity", "barrierPDI", "airbagLevel", "price", "barrierPhoenix", "code"]);

    console.log("Taille apres BARRIER PHOENIX : " + df.toRows().length);

    
    //MATURITY
    //verifier que la matu n'existe pas deja
    //this.setState({ messageLoading : this.eleborateMessageLoading(df.toRows().length + "prix analysés")} );
    print(df, ["coupon", "maturity", "barrierPDI", "airbagLevel", "price", "barrierPhoenix", "code"]);
    if (product.maturity.value[0] === product.maturity.value[1] && df.where((row) => row.maturity === product.maturity.value[0]).toRows().length !== 0) {
      df = df.where((row) => row.maturity === product.maturity.value[0]).bake();
    } else {
      //this.setState({ messageLoading : this.eleborateMessageLoading('Analyse des maturités')});
      //il faut interpoler et distinguer tous 
      let distinctUnderlyings = df.getSeries('underlying').bake().distinct();
      let distinctCoupon = df.getSeries('coupon').bake().distinct();

      let dfToAdd = new dataForge.DataFrame();
      let allMat = ["1Y", "1.5Y", "2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y", "9Y", "10Y"];
      let allMatDate = [1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      /*let allMatDate = []; //[1,1.5,2,3,4,5,6,7,8,9,10];
      cpteur = 0;
      allMat.map((x, i) => {
        z  = Number(x.substring(0,x.length-1));
        if (z >= product.maturity.value[0] && z <= product.maturity.value[1]){
          allMatDate[cpteur] = z;
          cpteur = cpteur + 1;
        }
      });*/
      //allMat.map((x,i) => console.log(x +" : "+allMatDate[i]));
      //onsole.log("All Mat date " + allMatDate);

      distinctUnderlyings.forEach((underlying) => {

        d = new dataForge.DataFrame(df);
        //d = d.dropSeries(['code','currency','strike','strikeDate', 'finalDate','startDate','endDate','swapPrice','levelAutocall','spreadAutocall','spreadPDI','gearingPDI','spreadBarrier','Vega', 'couponAutocall','couponPhoenix']);

        d2 = d.where((row) => row.underlying === underlying).bake();
                    distinctCoupon.forEach((cpn) => {
                      //calcul du prix a cette barriere
                      //this.setState({ messageLoading : this.eleborateMessageLoading('.')});
                      d9 = d2.where((row) => row.coupon === cpn).bake();
                      if (d9.toRows().length !== 0) {
                        //interpolation
                        xs = d9.getSeries('maturity').bake().distinct().toArray();
                        ys = d9.getSeries('price').bake().distinct().toArray();
                        ysVega = d9.getSeries('vega').bake().distinct().toArray();

                        //xs.map((x, i) => console.log(x+" : "+ys[i]));
                        xs.map((x, i) => xs[i] = Number(x.substring(0, x.length - 1)));
                        //inter et extrapolation
                        points = [];
                        xs.map((x, i) => points[i] = [xs[i], ys[i]]);

                        pointsVega = [];
                        xs.map((x, i) => pointsVega[i] = [xs[i], ysVega[i]]);        

                        f = interpolator(points);
                        fVega = interpolator(pointsVega);

                        //on fait le tour des maturite et on ajoute les manquantes
                        allMatDate.forEach((mat) => {
                          console.log(mat + "  :   " + f(mat) + "      /      "+ product.maturity.value[0] + " et " + product.maturity.value[1]);
                          if (mat >= product.maturity.value[0] && mat <= product.maturity.value[1]) {
                            d10 = d9.head(1);
                            matToChange = d10.getSeries('maturity').bake().toArray().toString();
                            //vega = Number(d10.getSeries('vega').bake().toArray().toString());
                            d10 = d10.transformSeries({
                              maturity: value => mat + "Y",
                              price: value => f(mat) + product.UF.value + product.UFAssoc.value + (product.typeAuction.value === 'PP' ? 0 : 0.005) + getBumps(1, fVega(mat), mat, 0) + getFLMargin(),
                              vega: value => fVega(mat),
                              //il faut reconstituer le code
                              code: value => value.replace('_M:' + matToChange, '_M:' + mat + "Y")
                            });
                    

                            dfToAdd = dfToAdd.concat(new dataForge.DataFrame(d10));
                          }
                        });
 
                      }
                    })
      })

      df = dfToAdd;
    }
    print(df, ["coupon", "maturity", "barrierPDI", "airbagLevel", "price", "barrierPhoenix", "code"]);
    console.log("Taille apres MATURITY : " + df.toRows().length);

    //on passe sur tous les produits distincts et on interpoler
    let interpolatedProducts = new dataForge.DataFrame();
    let distinctMaturities = df.getSeries('maturity').distinct();
    let distinctUnderlyings = df.getSeries('underlying').distinct();

      d = new dataForge.DataFrame(df);
      distinctUnderlyings.forEach((udl) => {
        ////this.setState({ messageLoading : this.eleborateMessageLoading("Analyse de : " + udl)} );
        d3 = d.where((row) => row.underlying === udl).bake();
                  distinctMaturities.forEach((mat) => {
                    ////this.setState({ messageLoading : this.eleborateMessageLoading('.')});
                    //calcul du prix a cette barriere
                    d9 = d3.where((row) => row.maturity === mat).bake();

                    coupons = d9.getSeries('coupon').bake().toArray();
                    prix = d9.getSeries('price').bake().toArray();
                    vega = d9.getSeries('vega').bake().toArray();

                    points = [];
                    coupons.map((x, i) => points[i] = [prix[i], coupons[i]]);
                    f = interpolator(points);
                    CPN = f(0);

                    pointsVega = [];
                    coupons.map((x, i) => pointsVega[i] = [prix[i], vega[i]]);
                    fVega = interpolator(pointsVega);
                    newVega = fVega(0);

                    if (CPN >= 0) {//on conserve le produit
                      dTemp = d9.head(1);
                      cpnToChange = dTemp.getSeries('coupon').toArray().toString();
                      //console.log("COUPON : " + cpnToChange + "      ->   "+ CPN);
                      //codeAvant = dTemp.getSeries('code').toArray().toString();
                      //console.log(codeAvant);
                      //console.log(codeAvant.replace('_C:' + cpnToChange, '_C:' + CPN));
                      dTemp = dTemp.transformSeries({
                        price: value => 0,
                        coupon: value => CPN,
                        vega: value => newVega,
                        //il faut reconstituer le code
                        code: value => value.replace('_C:' + cpnToChange, '_C:' + CPN),
                      });
                    
                      //console.log(dfPrint.toString());
                      
                      interpolatedProducts = interpolatedProducts.concat(new dataForge.DataFrame(dTemp));
                    }
                  })
    });

    //on classe par coupon descendant
    
    print(interpolatedProducts, ["coupon", "maturity", "barrierPDI", "airbagLevel", "vega", "code"]);

    interpolatedProducts = interpolatedProducts.orderByDescending(row => row.coupon);

    //on rajoute comme info les UF
    interpolatedProducts = interpolatedProducts.generateSeries({
     UF: row => product.UF.value,
     UFAssoc : row => product.UFAssoc.value,
     couponPhoenix : row => row.coupon,
     cf_cpg_choice : row => product.typeAuction.valueLabel,
    });
   
    return interpolatedProducts.toArray();

  }
