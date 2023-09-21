/** @param {NS} ns */
export async function main(ns) {
    if (ns.getHostname() !== "home") {
        throw new Exception("Run the script from home");
    }

    const scripts = [
        'bootstrap.js',
        'build-hacking-programs.js',
        'buy-darkweb-programs.js',
        'buy-hacknet-nodes.js',
        'buy-servers.js',
        'delete-servers.js',
        'fetch-scripts.js',
        'format-numbers.js',
        'gang-api-explo.js',
        'grow-remote.js',
        'hack-remote.js',
        'hack-server.js',
        'hacking-programs.js',
        'launch-hacking.js',
        'launch-on-servers.js',
        'list-player-karma.js',
        'list-server-money.js',
        'list-server-prices.js',
        'list-server-security-level.js',
        'manage-corporation.js',
        'manage-gang.js',
        'manage-sleeves.js',
        'scan.js',
        'spend-hashes.js',
        'test-gang-existence.js',
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
