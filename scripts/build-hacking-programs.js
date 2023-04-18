/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('getHackingLevel');
    ns.disableLog('fileExists');
    ns.disableLog('sleep');

    const programsRequiredLevel = [
        { "name": "BruteSSH.exe", "requiredLevel": 50 },
        { "name": "FTPCrack.exe", "requiredLevel": 100 },
        { "name": "relaySMTP.exe", "requiredLevel": 250 },
        { "name": "HTTPWorm.exe", "requiredLevel": 500 },
        { "name": "SQLInject.exe", "requiredLevel": 750 },
        // { "name": "DeepscanV1.exe", "requiredLevel": 75 },
        // { "name": "DeepscanV2.exe", "requiredLevel": 400 },
        // { "name": "ServerProfiler.exe", "requiredLevel": 75 },
        // { "name": "AutoLink.exe", "requiredLevel": 25 }
    ];

    while (!ns.fileExists("SQLInject.exe", "home")) {  // SQLInject is the most "expensive", so the last to be built
        for (let program of programsRequiredLevel) {
            const playerLevel = ns.getHackingLevel();
            const requiredLevel = program.requiredLevel;

            if (ns.fileExists(program.name, "home")) {
                ns.print(`${program.name} already exists. Skipping`);
                continue;
            }

            ns.print(`[${program.name}] -> Player level: ${playerLevel}, required level: ${requiredLevel}`);

            if (playerLevel>=requiredLevel) {
                ns.singularity.createProgram(program.name, true);

                while (!ns.fileExists(program.name, "home")) {
                    await ns.sleep(1000*60*2);
                }
            }
        }

        // If money available > cost of SQLInject.exe, break
        // OR: buy tor router and buy missing programs

        await ns.sleep(1000*30);
    }
}
