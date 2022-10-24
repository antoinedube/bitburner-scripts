/** @param {NS} ns */

export async function main(ns) {
    const limit = ns.getPurchasedServerLimit();
    const serverRam = 1048576;  // Max: 1048576
    const serverCost = ns.getPurchasedServerCost(serverRam);
    ns.tprint("Limit of servers: " + limit);
    ns.tprint("Server ram: " + serverRam);
    ns.tprint("Server cost: " + serverCost);

    const existingServers = ns.getPurchasedServers();
    const numExistingServers = existingServers.length;
    
    for (let i=numExistingServers; i<limit; i++) {
        const serverIndex = i+1;
        ns.tprint('Buying server neighbor-' + serverIndex);
        ns.purchaseServer('neighbor-' + serverIndex, serverRam);
    }
}