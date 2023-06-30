/** @param {NS} ns */
async function scan(ns) {
    let servers_to_scan = ['home'];
    let serverList = [];

    while (servers_to_scan.length>0) {
        const server = servers_to_scan.pop();
        const neighbors = ns.scan(server);

        for (const neighbor of neighbors) {
            if (neighbor!='home' && !serverList.includes(neighbor)) {
                servers_to_scan.push(neighbor);
                serverList.push(neighbor);
            }
        }
    }

    return serverList;
}

/** @param {NS} ns */
function isAccessible(ns, server) {
    return ns.hasRootAccess(server) && ns.getServerRequiredHackingLevel(server)<=ns.getHackingLevel();
}

/** @param {NS} ns */
function hasMoney(ns, server) {
    const currentMoney = ns.getServerMoneyAvailable(server);
    const maxMoney = ns.getServerMaxMoney(server);
    const target = 0.90*maxMoney;

    ns.print(`[${server}] Money -> current: ${currentMoney.toFixed(2)}, target: ${target.toFixed(2)}`);
    return currentMoney > target;
}

/** @param {NS} ns */
function hasSecurityLevel(ns, server) {
    const currentLevel = ns.getServerSecurityLevel(server);
    const minLevel = ns.getServerMinSecurityLevel(server);
    const target = 1.10*minLevel;

    ns.print(`[${server}] Security level -> current: ${currentLevel.toFixed(2)}, target: ${target.toFixed(2)}`);
    return currentLevel < target;
}

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.enableLog('grow');
    ns.enableLog('hack');
    ns.enableLog('weaken');

    const runningScript = ns.getRunningScript();
    const numThreads = runningScript.threads;

    while (true) {
        const fullServerList = await scan(ns);
        const serverList = fullServerList.filter(name => !name.startsWith('neighbor-') && !name.startsWith('hacknet-server'));
        const server = serverList[Math.floor(Math.random()*serverList.length)];

        if (!isAccessible(ns, server)) {
            continue;
        }

        if (!hasSecurityLevel(ns, server)) {
            await ns.weaken(server, { threads: numThreads});
            ns.print(`[${server}] Security level weakened to ${ns.getServerSecurityLevel(server).toFixed(2)}`);
            continue;
        }

        if (!hasMoney(ns, server)) {
            await ns.grow(server, { threads: numThreads});
            ns.print(`[${server}] Money grown to ${ns.getServerMoneyAvailable(server).toFixed(2)}`);
            continue;
        }

        ns.print(`[${server}] Hacking`);
        await ns.hack(server, { threads: numThreads });
    }
}
