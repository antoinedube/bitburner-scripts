import { scanAllNetwork, buildPath } from "./scan.js";
import { buildHackingProgramList, countAvailablePrograms } from "./hacking-programs.js";

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
  const scriptRam = ns.getScriptRam(script);
  const availableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
  const scriptNumThreads = ~~(availableRam / scriptRam);

  if (scriptNumThreads > 0) {
    ns.exec(script, server, scriptNumThreads);
  }
}

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');

  const replace = false;  // Replace an existing script

  while (true) {
    const fullServerList = scanAllNetwork(ns, 'home');
    const filteredServerList = fullServerList.filter(name => !name.startsWith('neighbor-') && !name.startsWith('hacknet-'));

    for (const server of filteredServerList) {
      ns.print(`Current server: ${server}`);

      const playerHackingLevel = ns.getHackingLevel();
      const hackingPrograms = buildHackingProgramList(ns);
      const numberAvailablePrograms = countAvailablePrograms(ns, hackingPrograms);

      // Check server level vs player level
      const machineHackingLevel = ns.getServerRequiredHackingLevel(server);
      ns.print(`Level player: ${playerHackingLevel}, level machine: ${machineHackingLevel}`);

      // Check number of ports required vs number of programs available
      const requiredNumberOfPorts = ns.getServerNumPortsRequired(server);
      ns.print(`Required num ports: ${requiredNumberOfPorts}, number available programs: ${numberAvailablePrograms}`);

      if (playerHackingLevel < machineHackingLevel) {
        ns.print('----------\n');
        continue;
      }

      if (numberAvailablePrograms < requiredNumberOfPorts) {
        ns.print('----------\n');
        continue;
      }

      if (!ns.hasRootAccess(server)) {
        await openPorts(ns, hackingPrograms, server);
        ns.nuke(server);

        if (server == 'w0r1d_d43m0n') {
          ns.tprint('\n#########################################\n#  w0r1d_d43m0n is now root-accessible  #\n#########################################');
        }
      }

      ns.print(`hasRootAccess: ${ns.hasRootAccess(server)}`);

      const isBackdoorInstalled = ns.getServer(server).backdoorInstalled;
      ns.print(`isBackdoorInstalled: ${isBackdoorInstalled}`);
      if (ns.hasRootAccess(server) && !isBackdoorInstalled && server != 'w0r1d_d43m0n') {
        const path = await buildPath(ns, server);
        for (let item of path) {
          // ns.print(`Connecting to ${item} from ${ns.singularity.getCurrentServer()}`);
          if (!ns.singularity.connect(item)) {
            ns.print(`Error while connecting to ${item}`);
          };
        }

        ns.print('Installing backdoor');
        await ns.singularity.installBackdoor();
        ns.print('Backdoor installed');

        for (let item of path.reverse()) {
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
          ns.print(`Failed to copy hack-server.js on ${server}`);
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

    await ns.sleep(1000 * 5);
  }
}
