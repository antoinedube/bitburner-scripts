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
    let targetRam = 16;

    while (targetRam<=ns.getPurchasedServerMaxRam()) {
        const serverList = scanAllNetwork(ns);
        const purchasedServers = serverList.filter(name => name.startsWith('neighbor-'));

        let purchasedServersRam = purchasedServers.map(name => {
            return {"name": name, "maxRam": ns.getServerMaxRam(name)};
        });

        if (purchasedServersRam.length<ns.getPurchasedServerLimit()) {
            for (let i=purchasedServersRam.length; i<ns.getPurchasedServerLimit(); i++) {
                const index = i+1;
                const item = {"name": `neighbor-${index}`, "maxRam": 0};
                purchasedServersRam.push(item);
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
            const newServerCost = ns.getPurchasedServerCost(targetRam);
            ns.print(`Target RAM: ${targetRam}\tcost: ${newServerCost}`);
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

        await ns.sleep(1000*5);
    }
}
