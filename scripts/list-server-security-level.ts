import { NS } from "@ns";

import { scanAllNetwork } from "./scan";

export async function main(ns: NS): Promise<void> {
  const fullServerList = scanAllNetwork(ns);
  const serverList = fullServerList.filter(name => !name.startsWith('neighbor-'));

  for (let server of serverList) {
    const currentSecurityLevel = ns.getServerSecurityLevel(server);
    const minSecurityLevel = ns.getServerMinSecurityLevel(server)

    ns.tprint(`Server: ${server} --> ${ns.format.number(currentSecurityLevel)} / ${ns.format.number(minSecurityLevel)}`);
  }
}
