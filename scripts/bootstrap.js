/** @param {NS} ns */
export async function main(ns) {
	const scripts = ['launch-hacking.js', 'buy-hacknet-nodes.js', 'buy-servers.js'];

	for (let script of scripts) {
		if (!ns.isRunning(script)) {
			ns.run(script);
		}
	}
}