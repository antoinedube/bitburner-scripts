import { NS } from "@ns";

export function scanAllNetwork(ns: NS): string[] {
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

export async function buildPath(ns: NS, server: string): Promise<string[]> {
  const SLEEP_DURATION = 500;
  let pathList = [['home']];

  while (true) {
    if (pathList.length == 0) {
      await ns.sleep(SLEEP_DURATION);
      continue;
    }

    const currentPath = pathList.pop();

    if (!currentPath || currentPath.length == 0) {
      await ns.sleep(SLEEP_DURATION);
      continue;
    }

    const lastItem = currentPath.pop();
    const neighbors = ns.scan(lastItem);

    const neighborsWithoutServers = neighbors.filter(name => {
      !name.startsWith('neighbor-')
        && !name.startsWith('hacknet-')
        && !currentPath.includes(name)
    });

    for (let neighbor of neighborsWithoutServers) {
      let newPath = currentPath.slice();
      newPath.push(lastItem);
      newPath.push(neighbor);

      if (neighbor == server) {
        return newPath;
      }

      pathList.unshift(newPath);
    }

    await ns.sleep(250);  // Just so that the editor does not complain...
  }
}
