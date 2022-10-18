/** @param {NS} ns */

export async function main(ns) {
    const limit = ns.getPurchasedServerLimit();
    const serverRam = 2048;  // Max: 1048576
    const serverCost = ns.getPurchasedServerCost(serverRam);
    ns.tprint("Limit of servers: " + limit);
    ns.tprint("Server ram: " + serverRam);
    ns.tprint("Server cost: " + serverCost);

    ns.purchaseServer('neighbor', serverRam);
}
