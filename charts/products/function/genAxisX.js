export default function genAxisX(xmax) {
    let tab = [];

    for (let i = 1; i < xmax + 1; i++) {
        tab.push({ x: i, y: 98, symbol: "triangleUp", size: 1 })
    }

    return tab;
}