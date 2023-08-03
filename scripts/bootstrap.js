/** @param {NS} ns */
export async function main(ns) {
    const scripts = ['launch-hacking.js', 'spend-hashes.js',
                     /*'buy-hacknet-nodes.js', 'buy-servers.js',*/
                     'manage-sleeves.js', 'manage-gang.js'];

    if (ns.isRunning('hack-remote.js')) {
        ns.kill('hack-remote.js', 'home');
    }

    for (let script of scripts) {
        if (!ns.isRunning(script)) {
            ns.tprint(`Launching script: ${script}`);
            ns.run(script);

            await ns.sleep(250);
        }
    }

    ns.tprint('Sleeping for 2 sec');
    await ns.sleep(2*1000);
    ns.tprint('Done sleeping');

    const hackingScript = 'hack-remote.js';
    ns.tprint(`Script to launch: ${hackingScript}`);

    const scriptRam = ns.getScriptRam(hackingScript);
    ns.tprint(`Script required RAM: ${scriptRam}`);

    const serverMaxRam = ns.getServerMaxRam('home');
    ns.tprint(`Max RAM: ${serverMaxRam}`);

    const serverUsedRam = ns.getServerUsedRam('home');
    ns.tprint(`Used RAM: ${serverUsedRam}`);

    const availableRam = serverMaxRam - serverUsedRam;
    ns.tprint(`Available RAM: ${availableRam}`);

    const scriptNumThreads = ~~(availableRam / scriptRam);
    ns.tprint(`Number of threads for script: ${scriptNumThreads}`);

    if (scriptNumThreads>0) {
        ns.tprint(`Launching hack-remote.js with ${scriptNumThreads}`);
        ns.exec(hackingScript, 'home', scriptNumThreads);
    }
}
