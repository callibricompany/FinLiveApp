export default function genRemb(end_under, x, coupon, barr_anticipe, airbag, barr_capital) {
   
    let remb = end_under < barr_capital ? end_under : (end_under > 100 ? 100 + coupon * x : 
        airbag > 0 ? 100 + coupon * x * airbag : 100);

    return { x: x, y: remb};
}