import { NS } from "@ns";
import { scanAllNetwork } from "./scan.js";

export async function main(ns: NS): Promise<void> {
  const fullServerList = scanAllNetwork(ns);
  const serverList = fullServerList.filter(name => name.startsWith('neighbor-'));

  for (const server of serverList) {
    ns.tprint('Deleting: ' + server);
    ns.killall(server);
    ns.deleteServer(server);
  }
}
