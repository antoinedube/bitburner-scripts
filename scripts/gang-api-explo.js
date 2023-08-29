/** @param {NS} ns */
export async function main(ns) {
    const hackingUpgrades = ['NUKE Rootkit', 'Soulstealer Rootkit', 'Demon Rootkit', 'Hmap Node', 'Jack the Ripper'];
    const hackingAugmentations = ['BitWire', 'Neuralstimulator', 'DataJack'];

    const equipmentNames = ns.gang.getEquipmentNames();

    for (const equipmentName of equipmentNames) {
        ns.tprint(`Equipment: ${equipmentName}, price: ${ns.gang.getEquipmentCost(equipmentName)}`);
    }


    ns.gang.getMemberNames().map(memberName => {
        const memberInfo = ns.gang.getMemberInformation(memberName);
        /*
            gang-api-explo.js: Member info: {
                "name":"audrey-7",
                "task":"Ethical Hacking",
                "earnedRespect":4.7029526279208715,
                "hack":152,
                "str":1,
                "def":1,
                "dex":1,
                "agi":1,
                "cha":30,
                "hack_exp":3712.336429832956,
                "str_exp":0,
                "def_exp":0,
                "dex_exp":0,
                "agi_exp":0,
                "cha_exp":823.0497980349721,
                "hack_mult":2.2723515045000005,
                "str_mult":1.9500000000000002,
                "def_mult":1.3,
                "dex_mult":1,
                "agi_mult":1.5,
                "cha_mult":1,
                "hack_asc_mult":1,
                "str_asc_mult":1,
                "def_asc_mult":1,
                "dex_asc_mult":1,
                "agi_asc_mult":1,
                "cha_asc_mult":1,
                "hack_asc_points":0,
                "str_asc_points":0,
                "def_asc_points":0,
                "dex_asc_points":0,
                "agi_asc_points":0,
                "cha_asc_points":0,
                "upgrades":["NUKE Rootkit","Soulstealer Rootkit","Demon Rootkit","Hmap Node","Jack the Ripper"],
                "augmentations":["BitWire","Synthetic Heart","Synfibril Muscle","Neuralstimulator","DataJack"],
                "respectGain":0,
                "wantedLevelGain":-0.007788571428571429,
                "moneyGain":21.188817995605653
            }

        */
        ns.tprint(`Member info: ${JSON.stringify(memberInfo)}`);
    });
}