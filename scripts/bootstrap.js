/** @param {NS} ns */
export async function main(ns) {
    const scripts = ['launch-hacking.js', 'buy-hacknet-nodes.js', 'buy-servers.js',
                     /*'manage-sleeves.js'*/, 'manage-gang.js'];

    for (let script of scripts) {
        if (!ns.isRunning(script)) {
            ns.tprint(`Launching script: ${script}`);
            ns.run(script);

            await ns.sleep(250);
        }
    }

    ns.tprint('Sleeping for 5 sec');
    await ns.sleep(5000);

    const hackingScript = 'hack-remote.js';
    const scriptRam = ns.getScriptRam(hackingScript);
    const availableRam = ns.getServerMaxRam('home') - ns.getServerUsedRam('home');
    const scriptNumThreads = ~~(availableRam / scriptRam);

    if (scriptNumThreads>0) {
        ns.tprint(`Launching hack-remote.js with ${scriptNumThreads}`);
        ns.exec(hackingScript, 'home', scriptNumThreads);
    }
}