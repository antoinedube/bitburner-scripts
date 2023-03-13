/** @param {NS} ns */
export async function main(ns) {
	const scripts = ['launch-hacking.js', 'buy-hacknet-nodes.js', 'buy-servers.js'];

	for (let script of scripts) {
		if (!ns.isRunning(script)) {
			ns.run(script);
		}
	}

	await ns.sleep(5000);

	const hackingScript = 'hack-remote.js';
	const scriptRam = ns.getScriptRam(hackingScript);
    const availableRam = ns.getServerMaxRam('home') - ns.getServerUsedRam('home');
    ns.print(`Available ram: ${availableRam}`);

    const scriptNumThreads = ~~(availableRam / scriptRam);

    ns.print(`Script num threads: ${scriptNumThreads}`);

    if (scriptNumThreads>0) {
        ns.exec(hackingScript, 'home', scriptNumThreads);
    }
}