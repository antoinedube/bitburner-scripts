import { NS } from '@ns';
import { scanAllNetwork } from "./scan";

async function spendHashesOnAction(ns: NS, action: string, target: string, amount: number): Promise<void> {
  const SLEEP_DURATION = 1000;

  if (ns.hacknet.hashCapacity() <= ns.hacknet.hashCost(action, amount)) {
    ns.print(`Hash capacity is too low for ${action}`);
    return;
  }

  while (ns.hacknet.numHashes() < ns.hacknet.hashCost(action, amount)) {
    await ns.sleep(SLEEP_DURATION);
  }

  if (!ns.hacknet.spendHashes(action, target, amount)) {
    ns.print(`Error while executing ${action} on ${target} with n=${amount}`);
  }
}

function selectRandomServer(ns: NS): string {
  const serversToAvoid = ['CSEC', 'I.I.I.I', 'run4theh111z', 'avmnite-02h', '.', 'darkweb', 'The-Cave', 'w0r1d_d43m0n'];

  const fullServerList = scanAllNetwork(ns);
  const filteredServerList = fullServerList.filter(name => !name.startsWith('neighbor-') && !name.startsWith('hacknet-') && !serversToAvoid.includes(name));
  const serverIndex = Math.floor(Math.random() * filteredServerList.length);
  return filteredServerList[serverIndex];
}

export async function main(ns: NS): Promise<void> {
  ns.disableLog('ALL');
  const SLEEP_DURATION = 1000;

  /*
    const upgrades = ns.hacknet.getHashUpgrades();

    [
      "Sell for Money",
      "Sell for Corporation Funds",
      "Reduce Minimum Security",
      "Increase Maximum Money",
      "Improve Studying",
      "Improve Gym Training",
      "Exchange for Corporation Research",
      "Exchange for Bladeburner Rank",
      "Exchange for Bladeburner SP",
      "Generate Coding Contract",
      "Company Favor"
    ]
  */

  const ten_trillions = 10 * 1000 * 1000 * 1000 * 1000;  // k -> m -> g -> t
  const hacking_level_boundary = 2500;
  const hacknetConstants = ns.formulas.hacknetServers.constants();

  try {
    while (true) {
      if (hacking_level_boundary < ns.getHackingLevel() && ns.hacknet.numNodes() == hacknetConstants['MaxServers']) {
        const r = Math.random();

        if (r < 0.1) {
          await spendHashesOnAction(ns, "Improve Gym Training", "target", 1);
          ns.print('Improved gym training');
        } else if (r < 0.2) {
          const target = selectRandomServer(ns);
          const minLevel = ns.getServerMinSecurityLevel(target);
          if (1.0 < minLevel) {
            await spendHashesOnAction(ns, "Reduce Minimum Security", target, 1);
            const minLevelAfter = ns.getServerMinSecurityLevel(target);
            ns.print(`Reduced minimum security level on ${target} from ${ns.format.number(minLevel)} to ${ns.format.number(minLevelAfter)}`);
          }
        } else if (r < 0.3) {
          const target = selectRandomServer(ns);
          const maxMoney = ns.getServerMaxMoney(target);
          if (maxMoney < ten_trillions) {
            await spendHashesOnAction(ns, "Increase Maximum Money", target, 1);
            const maxMoneyAfter = ns.getServerMaxMoney(target);
            ns.print(`Increased maximum money on ${target} from ${ns.format.number(maxMoney)}\$ to ${ns.format.number(maxMoneyAfter)}\$`);
          }
        }
      }

      // Clamp to [1, 500]
      const sellAmount = Math.min(Math.max(1, Math.floor(ns.hacknet.numHashes() / 5.0)), 500);

      await spendHashesOnAction(ns, "Sell for Money", "target", sellAmount);
      ns.print(`Sold hashes for money (${ns.format.number(sellAmount)})`);

      await ns.sleep(SLEEP_DURATION);
    }
  }
  catch (error) {
    ns.print(`Caught global error: ${error}`);
    return;
  }
}
