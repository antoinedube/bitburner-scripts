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
    const runningScript = ns.getRunningScript();
	const numThreads = runningScript.threads;

    while (true) {
        const fullServerList = await scan(ns);
        const serverList = fullServerList.filter(name => !name.startsWith('neighbor-'));
        for (let server of serverList) {
            if (ns.hasRootAccess(server)) {
                await ns.hack(server, { threads: numThreads });
            }
        }
    }
}