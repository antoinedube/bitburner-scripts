import {scan} from "./scan.js";

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');
    let targetRam = 4;

    while (targetRam<ns.getPurchasedServerMaxRam()) {
        const serverList = await scan(ns);
        const purchasedServers = serverList.filter(name => name.startsWith('neighbor-'));
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
            targetRam*=4; // Skip a level
        }

        const newServerCost = ns.getPurchasedServerCost(targetRam);

        for (let purchasedServer of purchasedServersRam) {
            const availableMoney = ns.getServerMoneyAvailable('home');

            if (purchasedServer.maxRam < targetRam && newServerCost <= availableMoney) {
                if (ns.serverExists(purchasedServer.name)) {
                    ns.killall(purchasedServer.name);
                    ns.deleteServer(purchasedServer.name);
                }

                ns.print(`Buying/replacing: ${purchasedServer.name} with ${targetRam} at ${newServerCost.toFixed(2)}\$`);
                ns.purchaseServer(purchasedServer.name, targetRam);
            }
        }

        ns.exec('launch-on-servers.js', 'home', 1);

        await ns.sleep(1000*5);
    }
}
