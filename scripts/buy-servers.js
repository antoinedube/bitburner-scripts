import { scanAllNetwork } from "./scan";

function generateUUID() {
  // https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
  // crypto.randomUUID();
  // crypto.getRandomValues();
}

/** @param {NS} ns */
function launchScript(ns, scriptName, server) {
  const scpStatus = ns.scp(scriptName, server, 'home');
  if (!scpStatus) {
    ns.print('Failed to copy ' + scriptName + ' on ' + server);
  }

  ns.killall(server);

  const maxRam = ns.getServerMaxRam(server);
  const usedRam = ns.getServerUsedRam(server);
  const availableRam = maxRam - usedRam;
  const scriptRam = ns.getScriptRam(scriptName, server);
  const numThreads = Math.floor(availableRam / scriptRam);
  if (numThreads > 0) {
    if (ns.exec(scriptName, server, numThreads) == 0) {
      ns.print('Error launching script');
    }
  }
}

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  const BUYING_DELAY = 250;
  const UPGRADING_DELAY = 5 * 1000;
  const FOLLOWING_BATCH_DELAY = 1000 * 60 * 5;
  const HOME_SERVER = 'home';

  let targetRam = 4;
  while (targetRam <= ns.getPurchasedServerMaxRam()) {
    const maxNumberOfServers = ns.getPurchasedServerLimit();
    const availableMoney = ns.getServerMoneyAvailable('home');
    const serverCost = ns.getPurchasedServerCost(targetRam);

    if (availableMoney < maxNumberOfServers * serverCost) {
      targetRam /= 2;
      break;
    }

    targetRam *= 2;
  }

  if (targetRam < 8) {
    targetRam = 8;
  }

  ns.print(`Starting target ram: ${targetRam}`);

  // Purchase missing servers
  while (true) {
    // List current servers
    const serverList = scanAllNetwork(ns);
    let purchasedServers = serverList.filter(name => name.startsWith('neighbor-'));

    // Stopping criteria
    if (purchasedServers.length == ns.getPurchasedServerLimit()) {
      break;
    }

    // If limit is not reached, buy server at current targetRam
    if (ns.getPurchasedServerCost(targetRam) < ns.getServerMoneyAvailable(HOME_SERVER)) {
      const name = `neighbor-${purchasedServers.length}`;
      ns.print(`Purchasing server ${name}`);
      ns.purchaseServer(name, targetRam);
      purchasedServers.push(name);
    }

    await ns.sleep(BUYING_DELAY);
  }

  const purchasedServers = scanAllNetwork(ns).filter(name => name.startsWith('neighbor-'));
  ns.print(`Purchased servers: ${purchasedServers}`);

  targetRam *= 2;
  while (true) {
    // Stopping criteria
    let countServerWithTargetRam = 0;
    for (const purchasedServer of purchasedServers) {
      const purchasedServerRam = ns.getServer(purchasedServer).maxRam;
      if (purchasedServerRam >= targetRam) {
        countServerWithTargetRam++;
      }
    }

    ns.print(`Number of servers at target (target: ${ns.formatRam(targetRam)} / max: ${ns.formatRam(ns.getPurchasedServerMaxRam())}): ${countServerWithTargetRam} vs ${ns.getPurchasedServerLimit()}`);
    if (countServerWithTargetRam == ns.getPurchasedServerLimit()) {
      if (targetRam >= ns.getPurchasedServerMaxRam()) {
        break;
      }

      targetRam *= 2;

      await ns.sleep(FOLLOWING_BATCH_DELAY);
    }

    for (const purchasedServer of purchasedServers) {
      const purchasedServerRam = ns.getServer(purchasedServer).maxRam;
      if (purchasedServerRam < targetRam) {
        const moneyAvailable = ns.getServerMoneyAvailable('home');
        const upgradeCost = ns.getPurchasedServerUpgradeCost(purchasedServer, targetRam);
        if (upgradeCost < moneyAvailable) {
          if (ns.upgradePurchasedServer(purchasedServer, targetRam)) {
            ns.print(`Upgraded ${purchasedServer} to ${targetRam}Gb with cost of ${ns.formatNumber(upgradeCost)}\$`);
            launchScript(ns, 'hack-remote.js', purchasedServer);
          } else {
            ns.print(`Error while upgrading purchased server ${purchasedServer} to ${targetRam}Gb`);
          }
        }
      }
    }

    await ns.sleep(UPGRADING_DELAY);
  }
}
