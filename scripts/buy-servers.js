import { scanAllNetwork } from "./scan.js";

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
        const status = ns.exec(scriptName, server, numThreads);
        ns.print(`script exec status: ${status}`);
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

                launchScript(ns, 'hack-remote.js', purchasedServer.name);
            }

            await ns.sleep(250);
        }

        await ns.sleep(1000*5);

    }
}
