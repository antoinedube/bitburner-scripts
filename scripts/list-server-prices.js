/** @param {NS} ns */

export async function main(ns) {
    for (let i=2; i<21; i++) {
        const serverRam = Math.pow(2.0, i);
        const serverCost = ns.getPurchasedServerCost(serverRam);
        ns.tprint("Server ram: " + serverRam);
        ns.tprint("Server cost: " + serverCost);
        ns.tprint("Cost for 25 servers: " + 25.0*serverCost);
        ns.tprint("\n\n");
    }
}