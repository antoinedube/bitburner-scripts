/** @param {NS} ns */

export async function main(ns) {
    const serverRam = 4096;  // Max: 1048576

    while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
        const serverIndex = ns.getPurchasedServers().length + 1;
        ns.print('Trying to buy server: neighbor-' + serverIndex);
        ns.purchaseServer('neighbor-' + serverIndex, serverRam);

        ns.exec('launch-on-servers.js', 'home', 1);
        
        await ns.sleep(1000*60*5);
    }
}