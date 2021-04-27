export default function genCouponPhoenix(data, coupon, barr_coupon) {

    let tab = [];
    let tabReserve = [];
    let tabCumul = [];
    let reliquatCoupon = [];
    for (let i = 1; i < data.length; i++) {
        if (Number.isInteger(data[i].x)) {

            // console.log("reliquat",reliquatCoupon);

            if (data[i].y > barr_coupon) {
                if (i === 1) {
                    tab.push({ x: data[i].x, y: coupon });
                    tabReserve.push({ x: data[i].x, y: 0 });
                    reliquatCoupon.push(0)
                    tabCumul.push({ x: data[i].x, y: 0 });
                } else {
                    tab.push({ x: data[i].x, y: coupon });
                    tabReserve.push({ x: data[i].x, y: 0 });
                    if ( typeof reliquatCoupon[i-2] === 'undefined') {
                        tabCumul.push({ x: data[i].x, y: 0 });
                    } else {
                        tabCumul.push({ x: data[i].x, y: reliquatCoupon[i-2] });
                    }
                    reliquatCoupon.push(0)
                }
            } else {
                tab.push({ x: data[i].x, y: 0 });
                tabReserve.push({ x: data[i].x, y: coupon })
                tabCumul.push({ x: data[i].x, y: 0 })
                if (i === 1) {
                    reliquatCoupon.push(coupon);
                } else {
                    // console.log('reliquatCoupon :>> ', reliquatCoupon);
                    // console.log("i",reliquatCoupon[i-2])
                    reliquatCoupon.push(reliquatCoupon[i-2] + coupon);
                    // console.log('reliquatCoupon :>> ', reliquatCoupon);
                }
            }
        }
    }

    let lastCoupon = -1;
    let nTab = tab.length;

    tab.forEach((obj) => { 
        if (obj.y > 0 ) { 
            lastCoupon = obj.x;
        }
    })

    for (let i = 0; i < tab.length; i++) {
        if ( tabReserve[i].x > lastCoupon ) { 
            tabReserve[i].y = 0;
        }
    }

    return { coupon: tab, missedCoupon: tabReserve, getBackCoupon: tabCumul };
}