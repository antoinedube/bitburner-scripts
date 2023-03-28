/** @param {NS} ns */
export async function main(ns) {
    if (ns.getHostname() !== "home") {
        throw new Exception("Run the script from home");
    }

    const scripts = [
        'bootstrap.js',
        'buy-hacknet-nodes.js',
        'buy-servers.js',
        'delete-servers.js',
        'fetch-scripts.js',
        'format-numbers.js',
        'grow-remote.js',
        'hack-remote.js',
        'hack-server.js',
        'hacking-programs.js',
        'launch-hacking.js',
        'list-player-karma.js',
        'list-server-money.js',
        'list-server-prices.js',
        'list-server-security-level.js',
        'manage-gang.js',
        'scan.js',
        'weaken-remote.js'
    ];

    for (const scriptName of scripts) {
        ns.tprint(`Fetching: ${scriptName}`);
        await ns.wget(
            `https://raw.githubusercontent.com/antoinedube/bitburner-scripts/main/scripts/${scriptName}`,
            `${scriptName}`
        );
    }
}
