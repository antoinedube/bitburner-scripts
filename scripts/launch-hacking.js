import {scan, buildPath} from "./scan.js";
import {buildHackingProgramList, countAvailablePrograms} from "./hacking-programs.js";

/** @param {NS} ns */
async function openPorts(ns, hackingPrograms, target) {
    for (const program of hackingPrograms) {
        if (ns.fileExists(program.executableName, "home")) {
            const executable = program['functionName'].bind(ns);
            await executable(target);
        }
    }
}

/** @param {NS} ns */
function launchScript(ns, script, server) {
    ns.print('script: ' + script + ' on server ' + server);

    const scriptRam = ns.getScriptRam(script);
    const availableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    ns.print('Available ram: ' + availableRam);

    const scriptNumThreads = ~~(availableRam / scriptRam);

    ns.print('Script num threads: ' + scriptNumThreads);

    if (scriptNumThreads>0) {
        ns.exec(script, server, scriptNumThreads);
    }
}

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('scan');
    ns.disableLog('sleep');
    ns.disableLog('getServerRequiredHackingLevel');
    ns.disableLog('getServerNumPortsRequired');

    const replace = false;  // Replace an existing script

    while (true) {
        const fullServerList = await scan(ns, 'home');
        const serverList = fullServerList.filter(name => !name.startsWith('neighbor-'));

        const playerHackingLevel = ns.getHackingLevel();
        const hackingPrograms = buildHackingProgramList(ns);
        const currentNumberOfPorts = countAvailablePrograms(ns, hackingPrograms);

        for (const server of serverList) {
            ns.print('Current server: ' + server);

            // Check server level vs player level
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
                ns.nuke(server);
            }

            if (ns.hasRootAccess(server)) {
                const path = await buildPath(ns, server);
                for (let item of path) {
                    // ns.print(`Connecting to ${item} from ${ns.singularity.getCurrentServer()}`);
                    if (!ns.singularity.connect(item)) {
                        ns.print(`Error while connecting to ${item}`);
                    };
                }
                
                await ns.singularity.installBackdoor();
                
                for (let item of path.reverse()) {
                    // ns.print(`Connecting to ${item} from ${ns.singularity.getCurrentServer()}`);
                    if (!ns.singularity.connect(item)) {
                        ns.print(`Error while connecting to ${item}`);
                    };
                }
            }

            if (replace) {
                ns.killall(server);
            }

            if (replace || !ns.fileExists('hack-server.js', server)) {
                const scpStatus = ns.scp('hack-server.js', server, 'home');
                if (!scpStatus) {
                    ns.print('Failed to copy hack-server.js on ' + server);
                }
            }

            if (!ns.isRunning('hack-server.js', server)) {
                launchScript(ns, 'hack-server.js', server);
            }

            ns.print('----------\n');
        }

        if (replace) {
            break;
        }

        await ns.sleep(1000*60*2) // sleep for 2 min
    }
}