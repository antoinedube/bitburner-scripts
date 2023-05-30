import { scan } from "./scan.js";

/** @param {NS} ns */
export async function main(ns) {
    const scriptName = 'hack-remote.js';
    const serverList = await scan(ns);
    const purchasedServers = serverList.filter(name => name.startsWith('neighbor-'));

    for (let server of purchasedServers) {
        const scpStatus = ns.scp(scriptName, server, 'home');
        if (!scpStatus) {
            ns.tprint('Failed to copy ' + scriptName + ' on ' + server);
        }

        ns.killall(server);

        const maxRam = ns.getServerMaxRam(server);
        const usedRam = ns.getServerUsedRam(server);
        const availableRam = maxRam - usedRam;
        const scriptRam = ns.getScriptRam(scriptName, server);
        const numThreads = Math.floor(availableRam/scriptRam);

        if (numThreads>0) {
            ns.tprint(`Launching ${scriptName} on ${server} with ${numThreads} threads`);
            ns.exec(scriptName, server, numThreads);
        }
    }
}
