import { scanAllNetwork } from "./scan.js";

/** @param {NS} ns */
export async function main(ns) {
    const scriptName = 'hack-remote.js';
    const serverList = scanAllNetwork(ns);
    // const purchasedServers = serverList.filter(name => name.startsWith('neighbor-'));
    const purchasedServers = serverList.filter(name => {
          name.startsWith('hacknet-server-')
            && name!='w0r1d_d43m0n'
    });

    for (let server of purchasedServers) {
        const scpStatus = ns.scp(scriptName, server, 'home');
        if (!scpStatus) {
            ns.tprint('Failed to copy ' + scriptName + ' on ' + server);
        }

        ns.killall(server);

        const maxRam = ns.getServerMaxRam(server);
        const usedRam = ns.getServerUsedRam(server);
        const availableRam = 0.95*(maxRam - usedRam); // Factor: leave room for hash computation
        const scriptRam = ns.getScriptRam(scriptName, server);
        const numThreads = Math.floor(availableRam/scriptRam);

        if (numThreads>0) {
            ns.tprint(`Launching ${scriptName} on ${server} with ${numThreads} threads`);
            ns.exec(scriptName, server, numThreads);
        }
    }
}
