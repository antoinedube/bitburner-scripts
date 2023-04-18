/** @param {NS} ns */
function scan_for_full_server_list(ns, root) {
    let servers_to_scan = [root];
    let server_list = [];

    while (servers_to_scan.length>0) {
        const server = servers_to_scan.pop();
        const neighbors = ns.scan(server);

        for (const neighbor of neighbors) {
            if (neighbor!='home' && !neighbor.startsWith('neighbor') && ns.hasRootAccess(neighbor) && !server_list.includes(neighbor)) {
                servers_to_scan.push(neighbor);
                server_list.push(neighbor);
            }
        }
    }

    ns.print('Server list: ' + server_list);

    return server_list;
}

/** @param {NS} ns */
export async function main(ns) {
    const runningScript = ns.getRunningScript();
    const numThreads = runningScript.threads;

    while (true) {
        let server_list = scan_for_full_server_list(ns, 'home');

        ns.print('server list:\n' + server_list);

        for (const server of server_list) {
            await ns.weaken(server, { threads: numThreads });
        }
    }
}
