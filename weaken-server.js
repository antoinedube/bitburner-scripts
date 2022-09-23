function buildHackingProgramList(ns) {
    return [
        {name: 'brute-ssh', functionName: ns.brutessh, executableName: "BruteSSH.exe"},
        {name: 'ftp-crack', functionName: ns.ftpcrack, executableName: "FTPCrack.exe"},
        {name: 'relay-smtp', functionName: ns.relaysmtp, executableName: "relaySMTP.exe"},
        {name: 'http-worm', functionName: ns.httpworm, executableName: "HTTPWorm.exe"},
        {name: 'sql-inject', functionName: ns.sqlinject, executableName: "SQLInject.exe"}
    ];
}

function countAvailablePrograms(ns, hackingPrograms) {
    var count = 0;

    for (const program of hackingPrograms) {
        if (ns.fileExists(program.executableName, "home")) {
            ns.print(program.executableName + ' is available');
            count++;
        }        
    }

    ns.print("There are " + count + " existing programs");

    return count;
}

export async function main(ns) {
    // ns.print("arguments: " + JSON.stringify(arguments));
    // arguments: {
    //    "0":{
    //        "args":["n00dles"],
    //        "enums":{
    //            "toast":{
    //                "SUCCESS":"success",
    //                "WARNING":"warning",
    //                "ERROR":"error",
    //                "INFO":"info"
    //            }
    //        },
    //        "singularity":{},
    //        "gang":{},
    //        "bladeburner":{},
    //        "codingcontract":{},
    //        "sleeve":{},
    //        "corporation":{},
    //        "stanek":{},
    //        "infiltration":{},
    //        "ui":{},
    //        "formulas":{
    //            "reputation":{},
    //            "skills":{},
    //            "hacking":{},
    //            "hacknetNodes":{},
    //            "hacknetServers":{},
    //            "gang":{},
    //            "work":{}
    //        },
    //        "stock":{},
    //        "grafting":{},
    //        "hacknet":{},
    //        "heart":{}
    //    }
    //  }
    const args = arguments["0"].args;
    var target = args[0];
    ns.print('hacking server: ' + target);

    const hackingPrograms = buildHackingProgramList(ns);

    while (true) {
        var playerHackingLevel = ns.getHackingLevel();
        var machineHackingLevel = ns.getServerRequiredHackingLevel(target);
        ns.print('Level player, level machine: ' + playerHackingLevel + ', ' + machineHackingLevel);

        var requiredNumberOfPorts = ns.getServerNumPortsRequired(target);
        var currentNumberOfPorts = countAvailablePrograms(ns, hackingPrograms);
        ns.print('Required num ports, current num ports: ' + requiredNumberOfPorts + ', ' + currentNumberOfPorts);
        
        if (playerHackingLevel>=machineHackingLevel && currentNumberOfPorts>=requiredNumberOfPorts) {
            break;
        }

        await ns.sleep(1000*60*2);  // 1000 * 60 * 2 = 2 min
    }

    for (const program of hackingPrograms) {
        if (ns.fileExists(program.executableName, "home")) {
            program.functionName(target);
        }        
    }

    if (ns.hasRootAccess(target) == false) {
        ns.nuke(target);
    }

    while (true) {
        await ns.weaken(target);
    }
}