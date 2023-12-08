import { scanAllNetwork } from "./scan.js";

/** @param {NS} ns */
export async function main(ns) {
	const fullServerList = scanAllNetwork(ns);
	const serverList = fullServerList.filter(name => !name.startsWith('neighbor-'));

	for (let server of serverList) {
		const moneyAvailable = ns.getServerMoneyAvailable(server);
		const maxMoneyAvailable = ns.getServerMaxMoney(server);

		ns.tprint(`Server: ${server} --> ${ns.formatNumber(moneyAvailable)}\$ / ${ns.formatNumber(maxMoneyAvailable)}\$`);
	}
}
