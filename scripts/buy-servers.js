import { scan } from "./scan.js";
import { formatNumber } from "./format-numbers.js";

/** @param {NS} ns */
async function launchScript(ns, scriptName, server) {
    const scpStatus = ns.scp(scriptName, server, 'home');
    if (!scpStatus) {
        ns.print('Failed to copy ' + scriptName + ' on ' + server);
    }

    ns.killall(server);

    ns.tprint('A');
    const maxRam = ns.getServerMaxRam(server);
    ns.tprint('B');
    const usedRam = ns.getServerUsedRam(server);
    ns.tprint('C');
    const availableRam = maxRam - usedRam;
    ns.tprint(`D. Avail RAM: ${availableRam}`);
    const scriptRam = ns.getScriptRam(scriptName, server);
    ns.tprint(`E. Script RAM: ${scriptRam}`);
    const numThreads = Math.floor(availableRam/scriptRam);
    ns.tprint(`F. Num threads: ${numThreads}`);
    if (numThreads>0) {
        ns.tprint(`Launching ${scriptName} on ${server} with ${numThreads} threads`);
        const status = ns.exec(scriptName, server, numThreads);
        ns.tprint(`Exec status: ${status}`);
    }

    ns.tprint('Script launched');
}

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');
    let targetRam = 16;
    const targetRamPrice = ns.getPurchasedServerCost(targetRam);
    ns.print(`Target ram: ${targetRam}, price: ${formatNumber(targetRamPrice, '$')}`);

    while (targetRam<=ns.getPurchasedServerMaxRam()) {
        const serverList = await scan(ns);
        const purchasedServers = serverList.filter(name => name.startsWith('neighbor-'));
        ns.tprint(`Purchased servers: ${purchasedServers}`);
        let purchasedServersRam = purchasedServers.map(name => {
            return {"name": name, "maxRam": ns.getServerMaxRam(name)};
        });

        if (purchasedServersRam.length<ns.getPurchasedServerLimit()) {
            for (let i=purchasedServersRam.length; i<ns.getPurchasedServerLimit(); i++) {
                const index = i+1;
                purchasedServersRam.push({"name": `neighbor-${index}`, "maxRam": 0});
            }
        }

        let countServerWithTargetRam = 0;
        for (let purchasedServer of purchasedServersRam) {
            if (purchasedServer.maxRam>=targetRam) {
                countServerWithTargetRam++;
            }
        }

        if (countServerWithTargetRam==ns.getPurchasedServerLimit()) {
            targetRam *= 4;
            const targetRamPrice = ns.getPurchasedServerCost(targetRam);
            ns.tprint(`Target ram: ${targetRam}, price: ${formatNumber(targetRamPrice, '$')}`);
        }

        const newServerCost = ns.getPurchasedServerCost(targetRam);

        for (let purchasedServer of purchasedServersRam) {
            const availableMoney = ns.getServerMoneyAvailable('home');

            if (purchasedServer.maxRam < targetRam && newServerCost <= availableMoney) {
                if (ns.serverExists(purchasedServer.name)) {
                    ns.killall(purchasedServer.name);
                    ns.deleteServer(purchasedServer.name);
                }

                ns.tprint(`Buying/replacing: ${purchasedServer.name} with ${targetRam} at ${formatNumber(newServerCost, '$')}`);
                ns.purchaseServer(purchasedServer.name, targetRam);

                await launchScript(ns, 'hack-remote.js', purchasedServer.name);
            }

            await ns.sleep(100);
        }

        ns.tprint('Sleeping');
        await ns.sleep(1000*5);
        ns.tprint('Looping');
    }
}
