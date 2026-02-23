import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
  ns.disableLog('ALL');
  const SLEEP_DURATION = 500;

  const hacknetConstants = ns.formulas.hacknetServers.constants();
  /*
      ns.formulas.hacknetServers.constants()
      {
          "HashesPerLevel":0.001,
          "BaseCost":50000,
          "RamBaseCost":200000,
          "CoreBaseCost":1000000,
          "CacheBaseCost":10000000,
          "PurchaseMult":3.2,
          "UpgradeLevelMult":1.1,
          "UpgradeRamMult":1.4,
          "UpgradeCoreMult":1.55,
          "UpgradeCacheMult":1.85,
          "MaxServers":20,
          "MaxLevel":300,
          "MaxRam":8192,
          "MaxCores":128,
          "MaxCache":15
      }
  */

  const targetCount = hacknetConstants['MaxServers'];
  const targetLevel = hacknetConstants['MaxLevel'];
  const targetRam = hacknetConstants['MaxRam'];
  const targetCore = hacknetConstants['MaxCores'];
  const targetCache = hacknetConstants['MaxCache'];

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
      break;
    }

    await ns.sleep(SLEEP_DURATION);
  }
}
