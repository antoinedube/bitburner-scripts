/** @param {NS} ns */
function buildServerList(ns) {
    let serversToScan = ['home'];
    let serverList = [];

    while (serversToScan.length>0) {
        const server = serversToScan.pop();
        const neighbors = ns.scan(server);

        for (const neighbor of neighbors) {
            if (neighbor!='home' && !serverList.includes(neighbor)) {
                serversToScan.push(neighbor);
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
        let server_list = buildServerList(ns, 'home');

        ns.print('server list:\n' + server_list);

        for (const server of server_list) {
            await ns.weaken(server, { threads: numThreads });
        }
    }
}
