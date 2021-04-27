export default function genCouponPhoenix(data, coupon, barr_coupon) {

    let tab = [];
    for (let i = 1; i < data.length; i++) {
        if (Number.isInteger(data[i].x)) {
            if (data[i].y > barr_coupon) {
                tab.push({ x: data[i].x, y: coupon + 100 });
            } else {
                tab.push({ x: data[i].x, y: 100 });
            }
        }
    }

    return tab;
}