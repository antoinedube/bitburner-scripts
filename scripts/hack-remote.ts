import { NS } from "@ns";

function buildServerList(ns: NS): string[] {
  let serversToScan = ['home'];
  let serverList: string[] = [];

  while (serversToScan.length > 0) {
    const server = serversToScan.pop();
    const neighbors = ns.scan(server);

    for (const neighbor of neighbors) {
      if (neighbor != 'home' && !serverList.includes(neighbor)) {
        serversToScan.push(neighbor);
        serverList.push(neighbor);
      }
    }
  }

  return serverList;
}

function isAccessible(ns: NS, server: string): boolean {
  return ns.hasRootAccess(server) && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel();
}

function hasMoney(ns: NS, server: string): boolean {
  const currentMoney = ns.getServerMoneyAvailable(server);
  const maxMoney = ns.getServerMaxMoney(server);
  const target = 0.90 * maxMoney;

  ns.print(`[${server}] Money -> current: ${ns.format.number(currentMoney)}\$, target: ${ns.format.number(target)}\$`);
  return currentMoney > target;
}

function hasSecurityLevel(ns: NS, server: string): boolean {
  const currentLevel = ns.getServerSecurityLevel(server);
  const minLevel = ns.getServerMinSecurityLevel(server);
  const target = 1.10 * minLevel;

  ns.print(`[${server}] Security level -> current: ${currentLevel.toFixed(2)}, target: ${target.toFixed(2)}`);
  return currentLevel < target;
}

export async function main(ns: NS): Promise<void> {
  ns.disableLog('ALL');
  ns.enableLog('grow');
  ns.enableLog('hack');
  ns.enableLog('weaken');

  const runningScript = ns.getRunningScript();
  const numThreads = runningScript!.threads;

  while (true) {
    await ns.sleep(500);

    const fullServerList = buildServerList(ns);
    const filteredServerList = fullServerList.filter(name => !name.startsWith('neighbor-') && !name.startsWith('hacknet-'));

    const serverIndex = Math.floor(Math.random() * filteredServerList.length);
    const server = filteredServerList[serverIndex];

    if (!isAccessible(ns, server)) {
      continue;
    }

    if (!hasSecurityLevel(ns, server)) {
      await ns.weaken(server, { threads: numThreads });
      ns.print(`[${server}] Security level weakened to ${ns.getServerSecurityLevel(server).toFixed(2)}`);
      continue;
    }

    if (!hasMoney(ns, server)) {
      await ns.grow(server, { threads: numThreads });
      ns.print(`[${server}] Money grown to ${ns.getServerMoneyAvailable(server).toFixed(2)}`);
      continue;
    }

    ns.print(`[${server}] Hacking`);
    await ns.hack(server, { threads: numThreads });
  }
}
