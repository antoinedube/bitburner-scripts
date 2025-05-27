import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
  ns.disableLog('ALL');
  const SLEEP_DELAY = 15000;  // in milliseconds
  const HOME_SERVER = 'home';
  const TOR_ROUTER_PRICE = 200000;

  if (!ns.hasTorRouter()) {
    ns.print('TOR router not purchased yet');
  }

  while (!ns.hasTorRouter()) {
    const moneyAvailable = ns.getServerMoneyAvailable(HOME_SERVER);

    if (TOR_ROUTER_PRICE <= moneyAvailable) {
      if (ns.singularity.purchaseTor()) {
        ns.print('TOR router purchased');
        break;
      }
    }

    await ns.sleep(SLEEP_DELAY);
  }

  while (true) {
    const allHackingPrograms = ns.singularity.getDarkwebPrograms();
    const purchasedHackingPrograms = allHackingPrograms.filter((program) => ns.fileExists(program));
    const hackingProgramsToPurchase = allHackingPrograms.filter((program) => !ns.fileExists(program));

    if (purchasedHackingPrograms.length == allHackingPrograms.length) {
      break;
    }

    for (const program of hackingProgramsToPurchase) {
      const programCost = ns.singularity.getDarkwebProgramCost(program);
      const moneyAvailable = ns.getServerMoneyAvailable(HOME_SERVER);

      if (programCost <= moneyAvailable) {
        if (ns.singularity.purchaseProgram(program)) {
          ns.print(`Purchased ${program}`);
        }
      }
    }

    await ns.sleep(SLEEP_DELAY);
  }
}
