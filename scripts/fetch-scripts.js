/** @param {NS} ns */
export async function main(ns) {
	if (ns.getHostname() !== "home") {
		throw new Exception("Run the script from home");
	}

	const scripts = [
		'buy-hacknet-nodes.js', 'buy-servers.js', 'delete-servers.js',
		'grow-remote.js', 'hack-server.js', 'hacking-programs.js',
		'launch-hacking.js', 'launch-on-servers.js', 'list-server-prices.js',
		'scan.js', 'weaken-remote.js'];

	for (const scriptName of scripts) {
		await ns.wget(
			`https://raw.githubusercontent.com/antoinedube/bitburner-scripts/main/scripts/${scriptName}`,
			`${scriptName}`
		);
	}
}