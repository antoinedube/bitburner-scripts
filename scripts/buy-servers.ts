import { NS } from '@ns';
import { scanAllNetwork } from "./scan";

function launchScript(ns: NS, scriptName: string, server: string) {
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

export async function main(ns: NS) {
  ns.disableLog('ALL');
  const BUYING_DELAY = 250;
  const UPGRADING_DELAY = 5 * 1000;
  const FOLLOWING_BATCH_DELAY = 1000 * 30;
  const HOME_SERVER = 'home';

  let targetRam = 4;
  while (targetRam <= ns.cloud.getRamLimit()) {
    const maxNumberOfServers = ns.cloud.getServerLimit();
    const availableMoney = ns.getServerMoneyAvailable('home');
    const serverCost = ns.cloud.getServerCost(targetRam);

    if (availableMoney < maxNumberOfServers * serverCost) {
      targetRam /= 2;
      break;
    }

    targetRam *= 2;
  }

  if (targetRam < 8) {
    targetRam = 8;
  }

  if (targetRam > ns.cloud.getRamLimit()) {
    targetRam = 0.5 * ns.cloud.getRamLimit();
  }

  ns.print(`Starting target ram: ${targetRam}`);

  // Purchase missing servers
  while (true) {
    // List current servers
    const serverList = scanAllNetwork(ns);
    let purchasedServers = serverList.filter(name => name.startsWith('neighbor-'));

    // Stopping criteria
    if (purchasedServers.length == ns.cloud.getServerLimit()) {
      break;
    }

    // If limit is not reached, buy server at current targetRam
    if (ns.cloud.getServerCost(targetRam) < ns.getServerMoneyAvailable(HOME_SERVER)) {
      const name = `neighbor-${purchasedServers.length}`;
      ns.print(`Purchasing server ${name}`);
      ns.purchaseServer(name, targetRam);
      launchScript(ns, 'hack-remote.js', name);

      purchasedServers.push(name);
    }

    await ns.sleep(BUYING_DELAY);
  }

  const purchasedServers = scanAllNetwork(ns).filter(name => name.startsWith('neighbor-'));

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

    if (countServerWithTargetRam == ns.cloud.getServerLimit()) {
      if (targetRam >= ns.cloud.getRamLimit()) {
        break;
      }

      targetRam *= 2;
      ns.print(`New RAM target: ${targetRam}`);
      await ns.sleep(FOLLOWING_BATCH_DELAY);
    }

    for (const purchasedServer of purchasedServers) {
      const purchasedServerRam = ns.getServer(purchasedServer).maxRam;
      if (purchasedServerRam < targetRam) {
        const moneyAvailable = ns.getServerMoneyAvailable('home');
        const upgradeCost = ns.cloud.getServerUpgradeCost(purchasedServer, targetRam);
        if (upgradeCost < moneyAvailable) {
          if (ns.cloud.upgradeServer(purchasedServer, targetRam)) {
            ns.print(`Upgraded ${purchasedServer} to ${ns.format.ram(targetRam)} with cost of ${ns.format.number(upgradeCost)}\$`);
            launchScript(ns, 'hack-remote.js', purchasedServer);
          } else {
            ns.print(`Error while upgrading purchased server ${purchasedServer} to ${ns.format.ram(targetRam)}`);
          }
        }
      }
    }

    await ns.sleep(UPGRADING_DELAY);
  }
}
