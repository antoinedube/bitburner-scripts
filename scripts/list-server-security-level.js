import { scanAllNetwork } from "./scan.js";

/** @param {NS} ns */
export async function main(ns) {
  const fullServerList = scanAllNetwork(ns);
  const serverList = fullServerList.filter(name => !name.startsWith('neighbor-'));

  for (let server of serverList) {
    const currentSecurityLevel = ns.getServerSecurityLevel(server);
    const minSecurityLevel = ns.getServerMinSecurityLevel(server)

    ns.tprint(`Server: ${server} --> ${ns.formatNumber(currentSecurityLevel)} / ${ns.formatNumber(minSecurityLevel)}`);
  }
}
