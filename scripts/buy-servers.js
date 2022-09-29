/** @param {NS} ns */

function myMoney(ns) {
    return ns.getServerMoneyAvailable("home");
}

export async function main(ns) {
	const targetCount = 18;
	const targetLevel = 100;
	const targetRam = 32;
	const targetCore = 32;

	while (ns.hacknet.numNodes() < targetCount) {
		const cost = ns.hacknet.getPurchaseNodeCost();
		while (myMoney(ns) < cost) {
			ns.tprint("Need $" + cost + " . Have $" + myMoney(ns) + " to buy new node");
			await ns.sleep(1000*60);
		}

		ns.hacknet.purchaseNode();
	};

	for (let i = 0; i < targetCount; i++) {
		while (ns.hacknet.getNodeStats(i).level < targetLevel) {
			const cost = ns.hacknet.getLevelUpgradeCost(i, 1);
			while (myMoney(ns) < cost) {
				ns.tprint("Need $" + cost + " . Have $" + myMoney(ns) + " to upgrade level");
				await ns.sleep(1000*60);
			}
			const res = ns.hacknet.upgradeLevel(i, 1);
			ns.tprint("Upgraded level of node " + i + " with result: " + res);
		};
	};

	ns.tprint("All nodes upgraded to level " + targetLevel);

	for (let i = 0; i < targetCount; i++) {
		while (ns.hacknet.getNodeStats(i).ram < targetRam) {
			const cost = ns.hacknet.getRamUpgradeCost(i, 1);
			while (myMoney(ns) < cost) {
				ns.tprint("Need $" + cost + " . Have $" + myMoney(ns) + " to upgrade ram");
				await ns.sleep(1000*60);
			}
			const res = ns.hacknet.upgradeRam(i, 1);
			ns.tprint("Upgraded ram of node " + i + " with result: " + res);
		};
	};

	ns.tprint("All nodes upgraded to " + targetRam + "GB RAM");

	for (let i = 0; i < targetCount; i++) {
		while (ns.hacknet.getNodeStats(i).cores < targetCore) {
			const cost = ns.hacknet.getCoreUpgradeCost(i, 1);
			while (myMoney(ns) < cost) {
				ns.tprint("Need $" + cost + " . Have $" + myMoney(ns) + " to upgrade core");
				await ns.sleep(1000*60);
			}
			const res = ns.hacknet.upgradeCore(i, 1);
			ns.tprint("Upgraded core number of node " + i + " with result: " + res);
		};
	};

	ns.tprint("All nodes upgraded to " + targetCore + " cores");
}