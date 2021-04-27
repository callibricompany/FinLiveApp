export default function getFlux(dataBar, remboursement) {

    let flux = [ -100 ];
    for (let i = 0; i < remboursement.x - 1; i++) {
        flux.push(dataBar[i].y);
    }
    flux.push(remboursement.y);

    return flux;

}
