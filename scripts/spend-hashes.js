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
  const serversToAvoid = ['CSEC', 'I.I.I.I', 'run4theh111z', 'avmnite-02h', 'The-Cave', 'w0r1d_d43m0n'];

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
  const low_high_hack_exp_limit = 1500;

  for (let i = 0; i < 5; i++) {
    ns.print(`--> Improve studying ${i} of 5`);
    await spendHashesOnAction(ns, 'Improve Studying', 'home', 1);
  }

  while (true) {
    const r = Math.random();
    if (r < 0.1) {
      const target = selectRandomServer(ns);
      const minLevel = ns.getServerMinSecurityLevel(target);
      if (minLevel > 1.0 && ns.getHackingLevel() > low_high_hack_exp_limit) {
        await spendHashesOnAction(ns, "Reduce Minimum Security", target, 1);
        const minLevelAfter = ns.getServerMinSecurityLevel(target);
        ns.print(`Reduced minimum security level on ${target} from ${minLevel} to ${minLevelAfter}`);
      }
    } else if (r < 0.2) {
      const target = selectRandomServer(ns);
      const maxMoney = ns.getServerMaxMoney(target);
      if (maxMoney < ten_trillions && ns.getHackingLevel() > low_high_hack_exp_limit) {
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
      await spendHashesOnAction(ns, "Sell for Money", "target", 25);
      ns.print(`Sold hashes for money`);
    }

    await ns.sleep(250);
  }
}
