/** @param {NS} ns */
export async function main(ns) {
    const scripts = ['launch-hacking.js',
                     'spend-hashes.js', /*'buy-servers.js',*/
                     'manage-sleeves.js', 'manage-gang.js',
                     'launch-on-servers.js'];

    for (let script of scripts) {
        if (!ns.isRunning(script)) {
            ns.tprint(`Launching script: ${script}`);
            ns.run(script);

            await ns.sleep(250);
        }
    }

    ns.tprint('Sleeping for 2 sec');
    await ns.sleep(2*1000);

    const hackingScript = 'hack-remote.js';
    const scriptRam = ns.getScriptRam(hackingScript);
    const availableRam = ns.getServerMaxRam('home') - ns.getServerUsedRam('home');
    const scriptNumThreads = ~~(availableRam / scriptRam);

    if (scriptNumThreads>0) {
        ns.tprint(`Launching hack-remote.js with ${scriptNumThreads}`);
        ns.exec(hackingScript, 'home', scriptNumThreads);
    }
}
