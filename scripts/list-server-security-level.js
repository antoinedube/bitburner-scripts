import { scan } from "./scan.js";
import { formatNumber } from "./format-numbers.js";

/** @param {NS} ns */
export async function main(ns) {
	const fullServerList = await scan(ns);
	const serverList = fullServerList.filter(name => !name.startsWith('neighbor-'));

	for (let server of serverList) {
		const currentSecurityLevel = ns.getServerSecurityLevel(server);
		const minSecurityLevel = ns.getServerMinSecurityLevel(server)

		ns.tprint(`Server: ${server} --> ${formatNumber(currentSecurityLevel, '')} / ${formatNumber(minSecurityLevel, '')}`);
	}
}