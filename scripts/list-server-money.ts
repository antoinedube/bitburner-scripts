import { NS } from "@ns";

import { scanAllNetwork } from "./scan";

export async function main(ns: NS): Promise<void> {
  const fullServerList = scanAllNetwork(ns);
  const serverList = fullServerList.filter(name => !name.startsWith('neighbor-'));

  for (let server of serverList) {
    const moneyAvailable = ns.getServerMoneyAvailable(server);
    const maxMoneyAvailable = ns.getServerMaxMoney(server);

    ns.tprint(`Server: ${server} --> ${ns.format.number(moneyAvailable)}\$ / ${ns.format.number(maxMoneyAvailable)}\$`);
  }
}
