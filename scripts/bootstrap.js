/** @param {NS} ns */
export async function main(ns) {
  const scripts = [
    'launch-hacking.js',
    'spend-hashes.js',
    /* 'buy-hacknet-servers.js', */
    'buy-servers.js',
    'manage-sleeves.js',
    'manage-gang.js',
    'buy-darkweb-programs.js',
    /* 'manage-bladeburner.js' */
  ];

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

  await ns.sleep(2 * 1000);

  const hackingScript = 'hack-remote.js';
  const scriptRam = ns.getScriptRam(hackingScript);
  const serverMaxRam = ns.getServerMaxRam('home');
  const serverUsedRam = ns.getServerUsedRam('home');
  const availableRam = serverMaxRam - serverUsedRam;
  const scriptNumThreads = ~~(availableRam / scriptRam);

  if (scriptNumThreads > 0) {
    ns.tprint(`Launching script: ${hackingScript} with ${scriptNumThreads} threads`);
    ns.exec(hackingScript, 'home', scriptNumThreads);
  }

  if (!ns.bladeburner.inBladeburner()) {
    ns.singularity.universityCourse('Rothman University', 'Computer Science');
  }
}
