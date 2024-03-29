/** @param {NS} ns */
export function scanAllNetwork(ns) {
  let serversToScan = ['home'];
  let serverList = [];

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

/** @param {NS} ns */
export async function buildPath(ns, server) {
  let pathList = [['home']];

  while (true) {
    const currentPath = pathList.pop();
    const lastItem = currentPath.pop();
    const neighbors = ns.scan(lastItem);
    const neighborsWithoutServers = neighbors.filter(name => !name.startsWith('neighbor-') && !name.startsWith('hacknet-') && !currentPath.includes(name));

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
