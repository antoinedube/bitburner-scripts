/** @param {NS} ns */

export async function main(ns) {
    ns.disableLog('getServerMoneyAvailable');
    ns.disableLog('sleep');

    const targetCount = 30;  // Start: 9, Max: 24
    const targetLevel = 200;  // Start: 50, Max: 200
    const targetRam = 64;  // Start: 1, Max: 64
    const targetCore = 16;  // Start: 1, Max: 16

    while (true) {
        if (ns.hacknet.numNodes() < targetCount) {
            const cost = ns.hacknet.getPurchaseNodeCost();
            if (ns.getServerMoneyAvailable("home") >= cost) {
                ns.hacknet.purchaseNode();
            } else {
                ns.print("Need $" + cost.toFixed(2) + ". Have $" + ns.getServerMoneyAvailable("home").toFixed(2) + " to buy new node");
            }
        }

        for (let i=0; i<ns.hacknet.numNodes(); i++) {
            if (ns.hacknet.getNodeStats(i).level < targetLevel) {
                const cost = ns.hacknet.getLevelUpgradeCost(i, 1);
                if (ns.getServerMoneyAvailable("home") >= cost) {
                    ns.hacknet.upgradeLevel(i, 1);
                } else {
                    ns.print("Need $" + cost.toFixed(2) + ". Have $" + ns.getServerMoneyAvailable("home").toFixed(2) + " to upgrade level");
                }
            }
        }

        for (let i=0; i<ns.hacknet.numNodes(); i++) {
            if (ns.hacknet.getNodeStats(i).ram < targetRam) {
                const cost = ns.hacknet.getRamUpgradeCost(i, 1);
                if (ns.getServerMoneyAvailable("home") >= cost) {
                    ns.hacknet.upgradeRam(i, 1);
                } else {
                    ns.print("Need $" + cost.toFixed(2) + ". Have $" + ns.getServerMoneyAvailable("home").toFixed(2) + " to upgrade RAM");
                }
            }
        }

        for (let i=0; i<ns.hacknet.numNodes(); i++) {
            if (ns.hacknet.getNodeStats(i).cores < targetCore) {
                const cost = ns.hacknet.getCoreUpgradeCost(i, 1);
                if (ns.getServerMoneyAvailable("home") >= cost) {
                    ns.hacknet.upgradeCore(i, 1);
                } else {
                    ns.print("Need $" + cost.toFixed(2) + ". Have $" + ns.getServerMoneyAvailable("home").toFixed(2) + " to upgrade core");
                }
            }
        }

        let countCompletelyUpgraded = 0;
        if (ns.hacknet.numNodes()==targetCount) {
            for (let i=0; i<ns.hacknet.numNodes(); i++) {
                const nodeStats = ns.hacknet.getNodeStats(i);

                const allLevelUpgraded = nodeStats.level==targetLevel ? true : false;
                const allRamUpgraded = nodeStats.ram==targetRam ? true : false;
                const allCoreUpgraded = nodeStats.cores==targetCore ? true : false;

                if (allLevelUpgraded && allRamUpgraded && allCoreUpgraded) {
                    countCompletelyUpgraded++;
                }
            }
        }

        if (countCompletelyUpgraded==targetCount) {
            break;
        }

        await ns.sleep(1000);
    }
}