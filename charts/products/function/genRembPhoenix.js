export default function genRembPhoenix(end_under, x, coupon, barr_coupon, barr_capital) {

    let remb = end_under < barr_capital ? end_under : (end_under > barr_coupon ? 100 + coupon : 100);

    return { x: x, y: remb};
}