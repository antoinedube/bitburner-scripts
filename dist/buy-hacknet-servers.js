/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');
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
                ns.print('Bought net node');
            }
        }
        for (let i = 0; i < ns.hacknet.numNodes(); i++) {
            if (ns.hacknet.getNodeStats(i).level < targetLevel) {
                const cost = ns.hacknet.getLevelUpgradeCost(i, 1);
                if (ns.getServerMoneyAvailable("home") >= cost) {
                    ns.hacknet.upgradeLevel(i, 1);
                    const newLevel = ns.hacknet.getNodeStats(i).level;
                    ns.print(`Upgrading node ${i} to level ${newLevel}`);
                }
            }
        }
        for (let i = 0; i < ns.hacknet.numNodes(); i++) {
            if (ns.hacknet.getNodeStats(i).ram < targetRam) {
                const cost = ns.hacknet.getRamUpgradeCost(i, 1);
                if (ns.getServerMoneyAvailable("home") >= cost) {
                    ns.hacknet.upgradeRam(i, 1);
                    const newLevel = ns.hacknet.getNodeStats(i).ram;
                    ns.print(`Upgrading node ${i} to ram ${newLevel}`);
                }
            }
        }
        for (let i = 0; i < ns.hacknet.numNodes(); i++) {
            if (ns.hacknet.getNodeStats(i).cores < targetCore) {
                const cost = ns.hacknet.getCoreUpgradeCost(i, 1);
                if (ns.getServerMoneyAvailable("home") >= cost) {
                    ns.hacknet.upgradeCore(i, 1);
                    const newLevel = ns.hacknet.getNodeStats(i).cores;
                    ns.print(`Upgrading node ${i} to cores ${newLevel}`);
                }
            }
        }
        for (let i = 0; i < ns.hacknet.numNodes(); i++) {
            if (ns.hacknet.getNodeStats(i).cache < targetCache) {
                const cost = ns.hacknet.getCacheUpgradeCost(i, 1);
                if (ns.getServerMoneyAvailable("home") >= cost) {
                    ns.hacknet.upgradeCache(i, 1);
                    const newLevel = ns.hacknet.getNodeStats(i).cache;
                    ns.print(`Upgrading node ${i} to cache ${newLevel}`);
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
        await ns.sleep(250);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV5LWhhY2tuZXQtc2VydmVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NjcmlwdHMvYnV5LWhhY2tuZXQtc2VydmVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQkFBcUI7QUFDckIsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBRTtJQUMzQixFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXJCLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDaEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFtQkU7SUFFRixNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNuRCxNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxNQUFNLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QyxNQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoRCxNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVqRCxPQUFPLElBQUksRUFBRTtRQUNYLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxXQUFXLEVBQUU7WUFDdkMsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzlDLElBQUksRUFBRSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRTtnQkFDOUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDMUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQzdCO1NBQ0Y7UUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFB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LENBQUMsR0FBRyxDQUFDLENBQUM7S0FDckI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBwYXJhbSB7TlN9IG5zICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFpbihucykge1xuICBucy5kaXNhYmxlTG9nKCdBTEwnKTtcblxuICBjb25zdCBoYWNrbmV0Q29uc3RhbnRzID0gbnMuZm9ybXVsYXMuaGFja25ldFNlcnZlcnMuY29uc3RhbnRzKCk7XG4gIC8qXG4gICAgICBucy5mb3JtdWxhcy5oYWNrbmV0U2VydmVycy5jb25zdGFudHMoKVxuICAgICAge1xuICAgICAgICAgIFwiSGFzaGVzUGVyTGV2ZWxcIjowLjAwMSxcbiAgICAgICAgICBcIkJhc2VDb3N0XCI6NTAwMDAsXG4gICAgICAgICAgXCJSYW1CYXNlQ29zdFwiOjIwMDAwMCxcbiAgICAgICAgICBcIkNvcmVCYXNlQ29zdFwiOjEwMDAwMDAsXG4gICAgICAgICAgXCJDYWNoZUJhc2VDb3N0XCI6MTAwMDAwMDAsXG4gICAgICAgICAgXCJQdXJjaGFzZU11bHRcIjozLjIsXG4gICAgICAgICAgXCJVcGdyYWRlTGV2ZWxNdWx0XCI6MS4xLFxuICAgICAgICAgIFwiVXBncmFkZVJhbU11bHRcIjoxLjQsXG4gICAgICAgICAgXCJVcGdyYWRlQ29yZU11bHRcIjoxLjU1LFxuICAgICAgICAgIFwiVXBncmFkZUNhY2hlTXVsdFwiOjEuODUsXG4gICAgICAgICAgXCJNYXhTZXJ2ZXJzXCI6MjAsXG4gICAgICAgICAgXCJNYXhMZXZlbFwiOjMwMCxcbiAgICAgICAgICBcIk1heFJhbVwiOjgxOTIsXG4gICAgICAgICAgXCJNYXhDb3Jlc1wiOjEyOCxcbiAgICAgICAgICBcIk1heENhY2hlXCI6MTVcbiAgICAgIH1cbiAgKi9cblxuICBjb25zdCB0YXJnZXRDb3VudCA9IGhhY2tuZXRDb25zdGFudHNbJ01heFNlcnZlcnMnXTtcbiAgY29uc3QgdGFyZ2V0TGV2ZWwgPSBoYWNrbmV0Q29uc3RhbnRzWydNYXhMZXZlbCddO1xuICBjb25zdCB0YXJnZXRSYW0gPSBoYWNrbmV0Q29uc3RhbnRzWydNYXhSYW0nXTtcbiAgY29uc3QgdGFyZ2V0Q29yZSA9IGhhY2tuZXRDb25zdGFudHNbJ01heENvcmVzJ107XG4gIGNvbnN0IHRhcmdldENhY2hlID0gaGFja25ldENvbnN0YW50c1snTWF4Q2FjaGUnXTtcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIGlmIChucy5oYWNrbmV0Lm51bU5vZGVzKCkgPCB0YXJnZXRDb3VudCkge1xuICAgICAgY29uc3QgY29zdCA9IG5zLmhhY2tuZXQuZ2V0UHVyY2hhc2VOb2RlQ29zdCgpO1xuICAgICAgaWYgKG5zLmdldFNlcnZlck1vbmV5QXZhaWxhYmxlKFwiaG9tZVwiKSA+PSBjb3N0KSB7XG4gICAgICAgIG5zLmhhY2tuZXQucHVyY2hhc2VOb2RlKCk7XG4gICAgICAgIG5zLnByaW50KCdCb3VnaHQgbmV0IG5vZGUnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5zLmhhY2tuZXQubnVtTm9kZXMoKTsgaSsrKSB7XG4gICAgICBpZiAobnMuaGFja25ldC5nZXROb2RlU3RhdHMoaSkubGV2ZWwgPCB0YXJnZXRMZXZlbCkge1xuICAgICAgICBjb25zdCBjb3N0ID0gbnMuaGFja25ldC5nZXRMZXZlbFVwZ3JhZGVDb3N0KGksIDEpO1xuICAgICAgICBpZiAobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoXCJob21lXCIpID49IGNvc3QpIHtcbiAgICAgICAgICBucy5oYWNrbmV0LnVwZ3JhZGVMZXZlbChpLCAxKTtcbiAgICAgICAgICBjb25zdCBuZXdMZXZlbCA9IG5zLmhhY2tuZXQuZ2V0Tm9kZVN0YXRzKGkpLmxldmVsO1xuICAgICAgICAgIG5zLnByaW50KGBVcGdyYWRpbmcgbm9kZSAke2l9IHRvIGxldmVsICR7bmV3TGV2ZWx9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5zLmhhY2tuZXQubnVtTm9kZXMoKTsgaSsrKSB7XG4gICAgICBpZiAobnMuaGFja25ldC5nZXROb2RlU3RhdHMoaSkucmFtIDwgdGFyZ2V0UmFtKSB7XG4gICAgICAgIGNvbnN0IGNvc3QgPSBucy5oYWNrbmV0LmdldFJhbVVwZ3JhZGVDb3N0KGksIDEpO1xuICAgICAgICBpZiAobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoXCJob21lXCIpID49IGNvc3QpIHtcbiAgICAgICAgICBucy5oYWNrbmV0LnVwZ3JhZGVSYW0oaSwgMSk7XG4gICAgICAgICAgY29uc3QgbmV3TGV2ZWwgPSBucy5oYWNrbmV0LmdldE5vZGVTdGF0cyhpKS5yYW07XG4gICAgICAgICAgbnMucHJpbnQoYFVwZ3JhZGluZyBub2RlICR7aX0gdG8gcmFtICR7bmV3TGV2ZWx9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5zLmhhY2tuZXQubnVtTm9kZXMoKTsgaSsrKSB7XG4gICAgICBpZiAobnMuaGFja25ldC5nZXROb2RlU3RhdHMoaSkuY29yZXMgPCB0YXJnZXRDb3JlKSB7XG4gICAgICAgIGNvbnN0IGNvc3QgPSBucy5oYWNrbmV0LmdldENvcmVVcGdyYWRlQ29zdChpLCAxKTtcbiAgICAgICAgaWYgKG5zLmdldFNlcnZlck1vbmV5QXZhaWxhYmxlKFwiaG9tZVwiKSA+PSBjb3N0KSB7XG4gICAgICAgICAgbnMuaGFja25ldC51cGdyYWRlQ29yZShpLCAxKTtcbiAgICAgICAgICBjb25zdCBuZXdMZXZlbCA9IG5zLmhhY2tuZXQuZ2V0Tm9kZVN0YXRzKGkpLmNvcmVzO1xuICAgICAgICAgIG5zLnByaW50KGBVcGdyYWRpbmcgbm9kZSAke2l9IHRvIGNvcmVzICR7bmV3TGV2ZWx9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5zLmhhY2tuZXQubnVtTm9kZXMoKTsgaSsrKSB7XG4gICAgICBpZiAobnMuaGFja25ldC5nZXROb2RlU3RhdHMoaSkuY2FjaGUgPCB0YXJnZXRDYWNoZSkge1xuICAgICAgICBjb25zdCBjb3N0ID0gbnMuaGFja25ldC5nZXRDYWNoZVVwZ3JhZGVDb3N0KGksIDEpO1xuICAgICAgICBpZiAobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoXCJob21lXCIpID49IGNvc3QpIHtcbiAgICAgICAgICBucy5oYWNrbmV0LnVwZ3JhZGVDYWNoZShpLCAxKTtcbiAgICAgICAgICBjb25zdCBuZXdMZXZlbCA9IG5zLmhhY2tuZXQuZ2V0Tm9kZVN0YXRzKGkpLmNhY2hlO1xuICAgICAgICAgIG5zLnByaW50KGBVcGdyYWRpbmcgbm9kZSAke2l9IHRvIGNhY2hlICR7bmV3TGV2ZWx9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgY291bnRDb21wbGV0ZWx5VXBncmFkZWQgPSAwO1xuICAgIGlmIChucy5oYWNrbmV0Lm51bU5vZGVzKCkgPT0gdGFyZ2V0Q291bnQpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnMuaGFja25ldC5udW1Ob2RlcygpOyBpKyspIHtcbiAgICAgICAgY29uc3Qgbm9kZVN0YXRzID0gbnMuaGFja25ldC5nZXROb2RlU3RhdHMoaSk7XG4gICAgICAgIGNvbnN0IGFsbExldmVsVXBncmFkZWQgPSBub2RlU3RhdHMubGV2ZWwgPT0gdGFyZ2V0TGV2ZWw7XG4gICAgICAgIGNvbnN0IGFsbFJhbVVwZ3JhZGVkID0gbm9kZVN0YXRzLnJhbSA9PSB0YXJnZXRSYW07XG4gICAgICAgIGNvbnN0IGFsbENvcmVVcGdyYWRlZCA9IG5vZGVTdGF0cy5jb3JlcyA9PSB0YXJnZXRDb3JlO1xuICAgICAgICBjb25zdCBhbGxDYWNoZVVwZ3JhZGVkID0gbm9kZVN0YXRzLmNhY2hlID09IHRhcmdldENhY2hlO1xuXG4gICAgICAgIGlmIChhbGxMZXZlbFVwZ3JhZGVkICYmIGFsbFJhbVVwZ3JhZGVkICYmIGFsbENvcmVVcGdyYWRlZCAmJiBhbGxDYWNoZVVwZ3JhZGVkKSB7XG4gICAgICAgICAgY291bnRDb21wbGV0ZWx5VXBncmFkZWQrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb3VudENvbXBsZXRlbHlVcGdyYWRlZCA9PSB0YXJnZXRDb3VudCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgYXdhaXQgbnMuc2xlZXAoMjUwKTtcbiAgfVxufVxuIl19