/** @param {NS} ns */

function scan_for_full_server_list(ns, root) {
    let servers_to_scan = [root];
    let server_list = [];

    while (servers_to_scan.length>0) {
        const server = servers_to_scan.pop();
        const neighbors = ns.scan(server);

        for (const neighbor of neighbors) {
            if (neighbor.startsWith('neighbor')) {
                servers_to_scan.push(neighbor);
                server_list.push(neighbor);
            }
        }
    }

    ns.print('Server list: ' + server_list);

    return server_list;
}

export async function main(ns) {
    const server_list = scan_for_full_server_list(ns, 'home');

    for (const server of server_list) {
        if (!ns.fileExists('weaken-remote.js', server)) {
            const scpStatus = await ns.scp('weaken-remote.js', server, 'home');
            if (!scpStatus) {
                ns.print('Failed to copy weaken-remote.js on ' + server);
            }
        }

        ns.exec('weaken-remote.js', server, 1024);
    }
}
