import { scanAllNetwork } from "./scan.js";
import { formatNumber } from "./format-numbers.js";

/** @param {NS} ns */
export async function main(ns) {
    const fullServerList = scanAllNetwork(ns);
    const serverList = fullServerList.filter(name => !name.startsWith('neighbor-'));

    for (let server of serverList) {
        const moneyAvailable = ns.getServerMoneyAvailable(server);
        const maxMoneyAvailable = ns.getServerMaxMoney(server);

        ns.tprint(`Server: ${server} --> ${formatNumber(moneyAvailable, '$')} / ${formatNumber(maxMoneyAvailable, '$')}`);
    }
}
