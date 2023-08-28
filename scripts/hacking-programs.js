/** @param {NS} ns */
export function buildHackingProgramList(ns) {
    return [
        {name: 'brute-ssh', functionName: ns.brutessh, executableName: "BruteSSH.exe"},
        {name: 'ftp-crack', functionName: ns.ftpcrack, executableName: "FTPCrack.exe"},
        {name: 'relay-smtp', functionName: ns.relaysmtp, executableName: "relaySMTP.exe"},
        {name: 'http-worm', functionName: ns.httpworm, executableName: "HTTPWorm.exe"},
        {name: 'sql-inject', functionName: ns.sqlinject, executableName: "SQLInject.exe"}
    ];
}

/** @param {NS} ns */
export function listAvailablePrograms(ns, hackingPrograms) {
    let availablePrograms = [];
    for (const program of hackingPrograms) {
        if (ns.fileExists(program.executableName, "home")) {
            // ns.print(program.executableName + ' is available');
            availablePrograms.push(program);
        }
    }
    return availablePrograms;
}

/** @param {NS} ns */
export function countAvailablePrograms(ns, hackingPrograms) {
    const availablePrograms = listAvailablePrograms(ns, hackingPrograms);

    const numberAvailablePrograms = availablePrograms.length;
    ns.tprint("There are " + numberAvailablePrograms + " existing programs");

    return numberAvailablePrograms;
}
