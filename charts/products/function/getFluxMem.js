export default function getFluxMem(dataBar, dataBarRec, remboursement) {

    let flux = [ -100 ];
    for (let i = 0; i < remboursement.x - 1; i++) {
        flux.push(dataBar[i].y + dataBarRec[i].y);
    }
    flux.push(remboursement.y);

    return flux;

}