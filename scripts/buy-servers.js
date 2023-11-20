import { scanAllNetwork } from "./scan";
import { formatNumber } from "./format-numbers";

/** @param {NS} ns */
function launchScript(ns, scriptName, server) {
    const scpStatus = ns.scp(scriptName, server, 'home');
    if (!scpStatus) {
        ns.print('Failed to copy ' + scriptName + ' on ' + server);
    }

    ns.killall(server);

    const maxRam = ns.getServerMaxRam(server);
    const usedRam = ns.getServerUsedRam(server);
    const availableRam = maxRam - usedRam;
    const scriptRam = ns.getScriptRam(scriptName, server);
    const numThreads = Math.floor(availableRam/scriptRam);
    if (numThreads>0) {
        if (ns.exec(scriptName, server, numThreads)==0) {
            ns.print('Error launching script');
        }
    }
}

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');
    const fifteen_seconds = 15*1000;

    await ns.sleep(fifteen_seconds);

    let targetRam = 4;
        while (targetRam<=ns.getPurchasedServerMaxRam()) {
            const maxNumberOfServers = ns.getPurchasedServerLimit();
            const availableMoney = ns.getServerMoneyAvailable('home');
            const serverCost = ns.getPurchasedServerCost(targetRam);

            if (availableMoney < maxNumberOfServers*serverCost) {
                targetRam /= 2;
                break;
            }

            targetRam *= 2;
        }

        if (targetRam<8) {
            targetRam = 8;
        }

        ns.print(`Starting target ram: ${targetRam}`);

    while (targetRam<=ns.getPurchasedServerMaxRam()) {
        const serverList = scanAllNetwork(ns);
        const purchasedServers = serverList.filter(name => name.startsWith('neighbor-'));

        let purchasedServersRam = purchasedServers.sort().map(name => {
            return { "name": name, "maxRam": ns.getServerMaxRam(name) };
        });

        let index = purchasedServersRam.length;
        while (purchasedServersRam.length<ns.getPurchasedServerLimit()) {
                const name = `neighbor-${index}`;
                const item = { "name": name, "maxRam": 0 };
                purchasedServersRam.push(item);
                index++;
        }

        let countServerWithTargetRam = 0;
        for (let purchasedServer of purchasedServersRam) {
            if (purchasedServer.maxRam>=targetRam) {
                countServerWithTargetRam++;
            }
        }

        const newServerCost = ns.getPurchasedServerCost(targetRam);
        for (let purchasedServer of purchasedServersRam) {
            const availableMoney = ns.getServerMoneyAvailable('home');

            if (purchasedServer.maxRam < targetRam && newServerCost <= availableMoney) {
                if (ns.serverExists(purchasedServer.name)) {
                    ns.killall(purchasedServer.name);
                    ns.deleteServer(purchasedServer.name);
                }

                ns.purchaseServer(purchasedServer.name, targetRam);
                ns.print(`Purchased server ${purchasedServer.name} with ${targetRam} RAM for ${formatNumber(newServerCost, '$')}`);

                launchScript(ns, 'hack-remote.js', purchasedServer.name);
            }

            await ns.sleep(250);
        }

        if (countServerWithTargetRam==ns.getPurchasedServerLimit()) {
            targetRam *= 2;
            const newServerCost = ns.getPurchasedServerCost(targetRam);
            ns.print(`Target RAM: ${targetRam}\tcost: ${formatNumber(newServerCost, '$')}`);
        }

        await ns.sleep(fifteen_seconds);
    }
}
