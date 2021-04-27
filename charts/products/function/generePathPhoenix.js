import getRandomInt from './getRandomInt';

export default function generePathPhoenix(xmax, end_under, barr_capital, barr_coupon, xrel) {

    var diff = 0.3;
    var tab = [];

    if (end_under < 100) {
        for (let i = 0; i < xmax + 1; i++) {
            let a = 100 + i / xmax * (end_under - 100);
            let t = Math.random();
            let b;
            if (end_under < barr_capital) {
                b = Math.min(a * (1 - diff) + t * diff * 100, barr_coupon - 1);
            } else {
                b = Math.min(a * (1 - diff) + t * diff * 100, 98);
            }
            if (i == 0) {
                tab.push({ x: i, y: 100 })
            } else if (i == xmax) {
                tab.push({ x: i, y: end_under })
            } else {
                tab.push({ x: i, y: b })
            }
        }
    } else {

        let duration = xrel;
        if (duration === 0) {
            duration = getRandomInt(1, xmax);
        }

        if (duration == 1) {
            tab.push({ x: 0, y: 100 })
            tab.push({ x: 0.4, y: 100 + 2 / 3 * (end_under - 100) })
            tab.push({ x: 0.8, y: 1.02 * end_under })
            tab.push({ x: 1, y: end_under })
        } else {
            tab.push({ x: 0, y: 100 })
            for (let i = 1; i < duration; i++) {
                tab.push({ x: i, y: getRandomInt(85, 97) })
            }
            // tab.push({ x: duration-1+0.1, y: 100 })
            tab.push({ x: duration - 1 + 0.4, y: 100 + 2 / 3 * (end_under - 100) })
            tab.push({ x: duration - 1 + .8, y: 1.02 * end_under })
            tab.push({ x: duration, y: end_under })
        }
    }

    return tab
}