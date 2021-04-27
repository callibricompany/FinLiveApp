export default function genCoupon(data, coupon, barr_anticipe, airbag, barr_capital) {

    let tab = [];
    let test = false
    for (let i = 1; i < data.length; i++) {
        if (Number.isInteger(data[i].x) && data[i].y > barr_anticipe) {
            tab.push({ x: data[i].x, y: coupon*data[i].x + 100 });
            test = true;
        }
    }

    // if (test == false && airbag == 1 && data[data.length-1].y > barr_capital ) {
    //     tab.push({ x: data[data.length-1].x, y: coupon*data[data.length-1].x + 100 });
    // }

    return tab;
}