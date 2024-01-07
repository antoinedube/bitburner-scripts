import { scanAllNetwork } from "./scan.js";

/** @param {NS} ns */
async function spendHashesOnAction(ns, action, target, amount) {
  while (ns.hacknet.numHashes() < ns.hacknet.hashCost(action, amount)) {
    await ns.sleep(1000);
  }

  if (!ns.hacknet.spendHashes(action, target, amount)) {
    ns.print(`Error while executing ${action} on ${target} with n=${amount}`);
  }
}

/** @param {NS} ns */
function selectRandomServer(ns) {
  const serversToAvoid = ['CSEC', 'I.I.I.I', 'run4theh111z', 'avmnite-02h', '.', 'darkweb', 'The-Cave', 'w0r1d_d43m0n'];

  const fullServerList = scanAllNetwork(ns, 'home');
  const filteredServerList = fullServerList.filter(name => !name.startsWith('neighbor-') && !name.startsWith('hacknet-') && !serversToAvoid.includes(name));
  const serverIndex = Math.floor(Math.random() * filteredServerList.length);
  return filteredServerList[serverIndex];
}

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');

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
  const hacking_level_boundary = 1000;

  if (ns.getHackingLevel() < 1000) {
    for (let i = 0; i < 10; i++) {
      await spendHashesOnAction(ns, 'Improve Studying', 'home', 1);
      ns.print(`--> Improve studying ${i + 1} of 10`);

      await spendHashesOnAction(ns, "Sell for Money", "target", 1);
      ns.print(`Sold hashes for money (x1)`);
    }
  }

  while (true) {
    // Change probabilities based on hacking level
    // Low hacking level: more spending on money
    // High hacking level: more spending on reducing security / increasing money on servers
    const r = Math.random();
    if (r < 0.2) {
      const target = selectRandomServer(ns);
      const minLevel = ns.getServerMinSecurityLevel(target);
      if (minLevel > 1.0 && ns.getHackingLevel() > hacking_level_boundary) {
        await spendHashesOnAction(ns, "Reduce Minimum Security", target, 1);
        const minLevelAfter = ns.getServerMinSecurityLevel(target);
        ns.print(`Reduced minimum security level on ${target} from ${ns.formatNumber(minLevel)} to ${ns.formatNumber(minLevelAfter)}`);
      }
    } else if (r < 0.4) {
      const target = selectRandomServer(ns);
      const maxMoney = ns.getServerMaxMoney(target);
      if (maxMoney < ten_trillions && ns.getHackingLevel() > hacking_level_boundary) {
        await spendHashesOnAction(ns, "Increase Maximum Money", target, 1);
        const maxMoneyAfter = ns.getServerMaxMoney(target);
        ns.print(`Increased maximum money on ${target} from ${ns.formatNumber(maxMoney)}\$ to ${ns.formatNumber(maxMoneyAfter)}\$`);
      }
      /*
      } else if (r < 0.3) {
              if (ns.bladeburner.inBladeburner()) {
                      await spendHashesOnAction(ns, 'Exchange for Bladeburner Rank', 'home', 1);
              }
      } else if (r < 0.4) {
              if (ns.bladeburner.inBladeburner()) {
                      await spendHashesOnAction(ns, 'Exchange for Bladeburner SP', 'home', 1);
              }
      */
    } else {
      const sellAmount = ns.hacknet.numHashes() / 4;

      if (sellAmount < 1) {
        await spendHashesOnAction(ns, "Sell for Money", "target", 1);
        ns.print(`Sold hashes for money (${ns.formatNumber(1)})`);
      } else {
        await spendHashesOnAction(ns, "Sell for Money", "target", sellAmount);
        ns.print(`Sold hashes for money (${ns.formatNumber(sellAmount)})`);
      }
    }

    await ns.sleep(1000);
  }
}
