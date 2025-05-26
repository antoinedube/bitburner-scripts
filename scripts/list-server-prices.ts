import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  for (let i = 2; i < 21; i++) {
    const serverRam = Math.pow(2.0, i);
    const serverCost = ns.getPurchasedServerCost(serverRam);
    ns.tprint(`Server ram: ${ns.format.ram(serverRam)}`);
    ns.tprint("\n");
    ns.tprint(`Server cost: ${ns.format.number(serverCost)}\$`);
  }
}
