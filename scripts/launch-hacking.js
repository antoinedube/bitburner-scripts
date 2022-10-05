/** @param {NS} ns */

function scan_for_full_server_list(ns, root) {
    let servers_to_scan = ['home'];
    let server_list = [];

    while (servers_to_scan.length>0) {
        const server = servers_to_scan.pop();
        const neighbors = ns.scan(server);

        for (const neighbor of neighbors) {
            if (neighbor!='home' && !server_list.includes(neighbor)) {
                servers_to_scan.push(neighbor);
                server_list.push(neighbor);
            }
        }
    }

    ns.print('Server list: ' + server_list);

    return server_list;
}

function buildHackingProgramList(ns) {
    return [
        {name: 'brute-ssh', functionName: ns.brutessh, executableName: "BruteSSH.exe"},
        {name: 'ftp-crack', functionName: ns.ftpcrack, executableName: "FTPCrack.exe"},
        {name: 'relay-smtp', functionName: ns.relaysmtp, executableName: "relaySMTP.exe"},
        {name: 'http-worm', functionName: ns.httpworm, executableName: "HTTPWorm.exe"},
        {name: 'sql-inject', functionName: ns.sqlinject, executableName: "SQLInject.exe"}
    ];
}

function countAvailablePrograms(ns, hackingPrograms) {
    var count = 0;

    for (const program of hackingPrograms) {
        if (ns.fileExists(program.executableName, "home")) {
            ns.print(program.executableName + ' is available');
            count++;
        }
    }

    ns.print("There are " + count + " existing programs");

    return count;
}

async function openPorts(ns, hackingPrograms, target) {
    for (const program of hackingPrograms) {
        if (ns.fileExists(program.executableName, "home")) {
            await program.functionName(target);
        }
    }
}

function launchScript(ns, script, server) {
    ns.print('script: ' + script + ' on server ' + server);

    const availableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    ns.print('Available ram: ' + availableRam);

    const scriptNumThreads = ~~(availableRam / 2.45);  // 2.45Gb for hack-server.js

    ns.print('Script num threads: ' + scriptNumThreads);

    if (scriptNumThreads>0) {
        ns.exec(script, server, scriptNumThreads);
    }
}

export async function main(ns) {

    while (true) {
        let server_list = scan_for_full_server_list(ns, 'home');

        ns.print('server list:\n' + server_list);

        const playerHackingLevel = ns.getHackingLevel();
        const hackingPrograms = buildHackingProgramList(ns);
        const currentNumberOfPorts = countAvailablePrograms(ns, hackingPrograms);

        for (const server of server_list) {
            ns.print('Current server: ' + server);

            // Check server level vs our level
            var machineHackingLevel = ns.getServerRequiredHackingLevel(server);
            ns.print('Level player, level machine: ' + playerHackingLevel + ', ' + machineHackingLevel);
            if (playerHackingLevel<machineHackingLevel) {
                continue;
            }

            // Check number of ports required vs number of programs available
            var requiredNumberOfPorts = ns.getServerNumPortsRequired(server);
            ns.print('Required num ports, current num ports: ' + requiredNumberOfPorts + ', ' + currentNumberOfPorts);
            if (currentNumberOfPorts<requiredNumberOfPorts) {
                continue;
            }

            if (!ns.hasRootAccess(server)) {
                await openPorts(ns, hackingPrograms, server);
                await ns.nuke(server);
            }

            if (!ns.fileExists('hack-server.js', server)) {
                await ns.scp('hack-server.js', server, 'home');
            }

            if (!ns.isRunning('hack-server.js', server)) {
                launchScript(ns, 'hack-server.js', server);
            }
        }

        await ns.sleep(1000*60*5) // sleep for five minutes
    }
}
