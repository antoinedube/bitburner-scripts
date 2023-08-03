/** @param {NS} ns */
function displayMembersInformation(ns, memberName) {
    const memberInfo = ns.gang.getMemberInformation(memberName);
    const hackingLevel = memberInfo['hack'];
    const currentTask = memberInfo['task'];
    ns.print(`Member: ${memberName}\thacking level: ${hackingLevel}\ttask: ${currentTask}`);
}

/** @param {NS} ns */
function assignMember(ns, name, task = '') {
    const memberInfo = ns.gang.getMemberInformation(name);
    const hackingLevel = memberInfo['hack'];
    const currentTask = memberInfo['task'];

    /*
    Task names:
        - Unassigned
        - Ransomware
        - Phishing
        - Identity Theft
        - DDoS Attacks
        - Plant Virus
        - Fraud & Counterfeiting,
        - Money Laundering
        - Cyberterrorism
        - Ethical Hacking
        - Vigilante Justice
        - Train Combat
        - Train Hacking
        - Train Charisma
        - Territory Warfare
    */
    if (task!='') {
        if (currentTask!=task) {
            ns.gang.setMemberTask(name, task);
        }
    } else if (hackingLevel<120) {
        if (currentTask!='Cyberterrorism') {
            ns.gang.setMemberTask(name, 'Cyberterrorism');
        }
    } else {
        if (currentTask!='Money Laundering') {
            ns.gang.setMemberTask(name, 'Money Laundering');
        }
    }
}

/** @param {NS} ns */
function recruitIfPossible(ns) {
    if (!ns.gang.canRecruitMember()) {
        return;
    }

    const gangMembers = ns.gang.getMemberNames();
    const newGangMemberName = `audrey-${gangMembers.length+1}`;
    ns.gang.recruitMember(newGangMemberName);
    assignMember(ns, newGangMemberName);
}

/** @param {NS} ns */
function reassignMembersAccordingToWantedLevelPenalty(ns) {
    const gangInformation = ns.gang.getGangInformation();
    /*
    Gang information structure:
    {
        "faction":"NiteSec",
        "isHacking":true,
        "moneyGainRate":213.18959642323077,
        "power":1,
        "respect":846.631799960249,
        "respectGainRate":0,
        "territory":0.14285714285714293,
        "territoryClashChance":0,
        "territoryWarfareEngaged":false,
        "wantedLevel":310.2473419438491,
        "wantedLevelGainRate":-0.025302857142857158,
        "wantedPenalty":0.7318238952487159
    }
    */

    const wantedLevelPenalty = 1.0 - gangInformation['wantedPenalty'];
    const gangRespect = gangInformation['respect'];
    if (wantedLevelPenalty > 0.25 && gangRespect > 50) {
        ns.gang.getMemberNames().map(memberName => {
            assignMember(ns, memberName, 'Ethical Hacking');
        });
    } else {
        ns.gang.getMemberNames().map(memberName => {
            assignMember(ns, memberName);
        });
    }
}

function ascendIfGainIsWorth(ns) {
    ns.gang.getMemberNames().map(memberName => {
        const results = ns.gang.getAscensionResult(memberName);

        if (results===undefined) {
            return;
        }

        const hackingMultWithAscension = results['hack'];

        if (hackingMultWithAscension>2.0) {
            ns.gang.ascendMember(memberName);
            assignMember(ns, memberName);
        }
    });
}

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('sleep');
    let counter = 0;

    while (true) {
        if (!ns.gang.inGang()) {
            ns.print(`Not in gang. Waiting.`);
            await ns.sleep(1000*60*5);
            continue;
        }

        ns.gang.getMemberNames().map(memberName => displayMembersInformation(ns, memberName));
        recruitIfPossible(ns);
        ascendIfGainIsWorth(ns);
        reassignMembersAccordingToWantedLevelPenalty(ns);

        if (counter>=25) {
            ns.gang.getMemberNames().map(memberName => assignMember(ns, memberName));
            counter = 0;
        } else if (counter>=23) {
            ns.gang.getMemberNames().map(memberName => assignMember(ns, memberName, 'Ethical Hacking'));
        }

        counter++;
        await ns.sleep(1000*30);
    }
}
