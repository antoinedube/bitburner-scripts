/** @param {NS} ns */
export async function main(ns) {
    if (ns.getHostname() !== "home") {
        throw new Exception("Run the script from home");
    }

    const scripts = [
        'bootstrap.js', 'buy-hacknet-nodes.js', 'buy-servers.js',
        'delete-servers.js', 'fetch-scripts.js', 'format-numbers.js',
        'grow-remote.js', 'hack-server.js', 'hack-remote.js', 'hacking-programs.js',
        'launch-hacking.js', 'list-server-prices.js', 'list-server-money.js', 'list-server-security-level.js',
        'scan.js', 'weaken-remote.js', 'list-player-karma.js', 'weaken-remote.js'
    ];

    for (const scriptName of scripts) {
        ns.tprint(`Fetching: ${scriptName}`);
        await ns.wget(
            `https://raw.githubusercontent.com/antoinedube/bitburner-scripts/main/scripts/${scriptName}`,
            `${scriptName}`
        );
    }
}
