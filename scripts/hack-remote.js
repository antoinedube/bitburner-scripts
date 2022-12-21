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
export async function main(ns) {
    ns.disableLog('hasRootAccess');
    ns.disableLog('getHackingLevel');
    ns.disableLog('getServerRequiredHackingLevel');
    ns.disableLog('getServerMoneyAvailable');
    ns.disableLog('getServerMaxMoney');

    const runningScript = ns.getRunningScript();
	const numThreads = runningScript.threads;

    while (true) {
        const fullServerList = await scan(ns);
        const serverList = fullServerList.filter(name => !name.startsWith('neighbor-'));
        for (let server of serverList) {
            const currentMoney = ns.getServerMoneyAvailable(server);
            const maxMoney = ns.getServerMaxMoney(server);
            
            const isAccessible = ns.hasRootAccess(server) && ns.getServerRequiredHackingLevel(server)<=ns.getHackingLevel();
            const hasMoney = currentMoney > 0.90*maxMoney;
            
            if (!isAccessible) {
                continue;
            }

            if (hasMoney) {
                await ns.hack(server, { threads: numThreads });
            }
        }

        await ns.sleep(250);
    }
}