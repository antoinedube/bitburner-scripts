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

async function launch_script(ns, scriptName, server) {
    if (!ns.fileExists(scriptName, server)) {
        const scpStatus = await ns.scp(scriptName, server, 'home');
        if (!scpStatus) {
            ns.print('Failed to copy ' + scriptName + ' on ' + server);
        }
    }
    
    if (ns.isRunning(scriptName, server)) {
        return;
    }

    const maxRam = ns.getServerMaxRam(server);
    const usedRam = ns.getServerUsedRam(server);
    const availableRam = maxRam - usedRam;
    const scriptRam = ns.getScriptRam(scriptName, server);
    const numThreads = Math.floor(availableRam/scriptRam);

    ns.exec(scriptName, server, numThreads);
}

export async function main(ns) {
    const server_list = scan_for_full_server_list(ns, 'home');
    var serverNameRegex = /neighbor-([0-9]*)/;

	for (const server of server_list) {
        ns.print('Server: ' + server);
        var matchResults = serverNameRegex.exec(server);
        if (matchResults == null) {
            continue;
        }
        const serverIndex = matchResults[1];
        ns.print('Server index: ' + matchResults[1]);

        if (serverIndex%2==0) {
            ns.print('Even');
            await launch_script(ns, 'grow-remote.js', server);
        } else {
            ns.print('Odd');
            await launch_script(ns, 'weaken-remote.js', server);
        }
	}
}