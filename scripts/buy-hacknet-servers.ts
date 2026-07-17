import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
  ns.disableLog('ALL');
  const SLEEP_DURATION = 1000;

  // const hacknetConstants = ns.formulas.hacknetServers.constants();
  // const targetCount = hacknetConstants['MaxServers'];
  // const targetLevel = hacknetConstants['MaxLevel'];
  // const targetRam = hacknetConstants['MaxRam'];
  // const targetCore = hacknetConstants['MaxCores'];
  // const targetCache = hacknetConstants['MaxCache'];

  // Target count
  // 21*(hackingLevel / 100 as integer + 1)

  const targetCount = 72;
  const targetLevel = 300;
  const targetRam = 8192;
  const targetCore = 128;
  const targetCache = 15;

  while (true) {
    if (ns.hacknet.numNodes() < targetCount) {
      const cost = ns.hacknet.getPurchaseNodeCost();
      if (ns.getServerMoneyAvailable("home") >= cost) {
        ns.hacknet.purchaseNode();
        ns.print('Bought hacknet node');
      }
    }

    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
      const nodeStats = ns.hacknet.getNodeStats(i);
      if (nodeStats.level < targetLevel) {
        const cost = ns.hacknet.getLevelUpgradeCost(i, 1);
        if (ns.getServerMoneyAvailable("home") >= cost) {
          ns.hacknet.upgradeLevel(i, 1);
          ns.print(`Upgraded level on node ${i}`);
        }
      }
    }

    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
      const nodeStats = ns.hacknet.getNodeStats(i);
      if (nodeStats.ram < targetRam) {
        const cost = ns.hacknet.getRamUpgradeCost(i, 1);
        if (ns.getServerMoneyAvailable("home") >= cost) {
          ns.hacknet.upgradeRam(i, 1);
          ns.print(`Upgraded RAM on node ${i}`);
        }
      }
    }

    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
      const nodeStats = ns.hacknet.getNodeStats(i);
      if (nodeStats.cores < targetCore) {
        const cost = ns.hacknet.getCoreUpgradeCost(i, 1);
        if (ns.getServerMoneyAvailable("home") >= cost) {
          ns.hacknet.upgradeCore(i, 1);
          ns.print(`Upgraded core on node ${i}`);
        }
      }
    }

    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
      const nodeStats = ns.hacknet.getNodeStats(i);
      if (!nodeStats.cache) {
        continue;
      }

      if (nodeStats.cache < targetCache) {
        const cost = ns.hacknet.getCacheUpgradeCost(i, 1);
        if (ns.getServerMoneyAvailable("home") >= cost) {
          ns.hacknet.upgradeCache(i, 1);
          ns.print(`Upgraded cache on node ${i}`);
        }
      }
    }

    let countCompletelyUpgraded = 0;
    if (ns.hacknet.numNodes() == targetCount) {
      for (let i = 0; i < ns.hacknet.numNodes(); i++) {
        const nodeStats = ns.hacknet.getNodeStats(i);
        const allLevelUpgraded = nodeStats.level == targetLevel;
        const allRamUpgraded = nodeStats.ram == targetRam;
        const allCoreUpgraded = nodeStats.cores == targetCore;
        const allCacheUpgraded = nodeStats.cache == targetCache;

        if (allLevelUpgraded && allRamUpgraded && allCoreUpgraded && allCacheUpgraded) {
          countCompletelyUpgraded++;
        }
      }
    }

    if (countCompletelyUpgraded == targetCount) {
      // HERE ALSO
      break;
    }

    await ns.sleep(SLEEP_DURATION);
  }
}
