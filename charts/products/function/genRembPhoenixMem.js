export default function genRembPhoenixMem(end_under, x, coupon, barr_coupon, barr_capital, lastCoupon) {

    let remb = end_under < barr_capital ? end_under : lastCoupon + 100;

    return { x: x, y: remb};
}