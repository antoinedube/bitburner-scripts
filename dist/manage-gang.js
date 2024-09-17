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
    if (task != '') {
        if (currentTask != task) {
            ns.gang.setMemberTask(name, task);
        }
    }
    else if (hackingLevel < 120) {
        if (currentTask != 'Cyberterrorism') {
            ns.gang.setMemberTask(name, 'Cyberterrorism');
        }
    }
    else {
        if (currentTask != 'Money Laundering') {
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
    const newGangMemberName = `audrey-${gangMembers.length + 1}`;
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
    }
    else {
        ns.gang.getMemberNames().map(memberName => {
            assignMember(ns, memberName);
        });
    }
}
function ascendIfGainIsWorth(ns) {
    ns.gang.getMemberNames().map(memberName => {
        const results = ns.gang.getAscensionResult(memberName);
        if (results === undefined) {
            return;
        }
        const hackingMultWithAscension = results['hack'];
        if (hackingMultWithAscension > 2.0) {
            ns.gang.ascendMember(memberName);
            assignMember(ns, memberName);
        }
    });
}
function buyEquipment(ns) {
    /*
        [
            "Baseball Bat",
            "Katana",
            "Glock 18C",
            "P90C",
            "Steyr AUG",
            "AK-47",
            "M15A10 Assault Rifle",
            "AWM Sniper Rifle",
            "Bulletproof Vest",
            "Full Body Armor",
            "Liquid Body Armor",
            "Graphene Plating Armor",
            "Ford Flex V20",
            "ATX1070 Superbike",
            "Mercedes-Benz S9001",
            "White Ferrari",
            "NUKE Rootkit",
            "Soulstealer Rootkit",
            "Demon Rootkit",
            "Hmap Node",
            "Jack the Ripper",
            "Bionic Arms",
            "Bionic Legs",
            "Bionic Spine",
            "BrachiBlades",
            "Nanofiber Weave",
            "Synthetic Heart",
            "Synfibril Muscle",
            "BitWire",
            "Neuralstimulator",
            "DataJack",
            "Graphene Bone Lacings"
            ]
    */
    const hackingUpgrades = ['NUKE Rootkit', 'Soulstealer Rootkit', 'Demon Rootkit', 'Hmap Node', 'Jack the Ripper'];
    const hackingAugmentations = ['BitWire', 'Neuralstimulator', 'DataJack'];
    ns.gang.getMemberNames().map(memberName => {
        const memberInfo = ns.gang.getMemberInformation(memberName);
        const memberHackingUpgrade = memberInfo['upgrades'];
        const memberHackingAugmentations = memberInfo['augmentations'];
        hackingUpgrades.map(upgrade => {
            if (!memberHackingUpgrade.includes(upgrade) && ns.gang.getEquipmentCost(upgrade) < ns.getServerMoneyAvailable('home')) {
                ns.gang.purchaseEquipment(memberName, upgrade);
            }
        });
        hackingAugmentations.map(augmentation => {
            if (!memberHackingAugmentations.includes(augmentation) && ns.gang.getEquipmentCost(augmentation) < ns.getServerMoneyAvailable('home')) {
                ns.gang.purchaseEquipment(memberName, augmentation);
            }
        });
    });
}
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('sleep');
    ns.disableLog('getServerMoneyAvailable');
    let counter = 0;
    while (true) {
        if (!ns.gang.inGang()) {
            ns.print(`Not in gang. Waiting.`);
            await ns.sleep(1000 * 60);
            continue;
        }
        ns.gang.getMemberNames().map(memberName => displayMembersInformation(ns, memberName));
        recruitIfPossible(ns);
        ascendIfGainIsWorth(ns);
        reassignMembersAccordingToWantedLevelPenalty(ns);
        buyEquipment(ns);
        if (counter >= 25) {
            ns.gang.getMemberNames().map(memberName => assignMember(ns, memberName));
            counter = 0;
        }
        else if (counter >= 23) {
            ns.gang.getMemberNames().map(memberName => assignMember(ns, memberName, 'Ethical Hacking'));
        }
        counter++;
        await ns.sleep(1000 * 30);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlLWdhbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zY3JpcHRzL21hbmFnZS1nYW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFCQUFxQjtBQUNyQixTQUFTLHlCQUF5QixDQUFDLEVBQUUsRUFBRSxVQUFVO0lBQy9DLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUQsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsVUFBVSxvQkFBb0IsWUFBWSxXQUFXLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDMUYsQ0FBQztBQUVELHFCQUFxQjtBQUNyQixTQUFTLFlBQVksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksR0FBRyxFQUFFO0lBQ3ZDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEQsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV2Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFpQkU7SUFDRixJQUFJLElBQUksSUFBSSxFQUFFLEVBQUU7UUFDZCxJQUFJLFdBQVcsSUFBSSxJQUFJLEVBQUU7WUFDdkIsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ25DO0tBQ0Y7U0FBTSxJQUFJLFlBQVksR0FBRyxHQUFHLEVBQUU7UUFDN0IsSUFBSSxXQUFXLElBQUksZ0JBQWdCLEVBQUU7WUFDbkMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFB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RUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNyQixFQUFFLENBQUMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDbEMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztZQUMxQixTQUFTO1NBQ1Y7UUFFRCxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLHlCQUF5QixDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBRXRGLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RCLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hCLDRDQUE0QyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLE9BQU8sSUFBSSxFQUFFLEVBQUU7WUFDakIsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDekUsT0FBTyxHQUFHLENBQUMsQ0FBQztTQUNiO2FBQU0sSUFBSSxPQUFPLElBQUksRUFBRSxFQUFFO1lBQ3hCLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1NBQzdGO1FBRUQsT0FBTyxFQUFFLENBQUM7UUFDVixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQzNCO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAcGFyYW0ge05TfSBucyAqL1xuZnVuY3Rpb24gZGlzcGxheU1lbWJlcnNJbmZvcm1hdGlvbihucywgbWVtYmVyTmFtZSkge1xuICBjb25zdCBtZW1iZXJJbmZvID0gbnMuZ2FuZy5nZXRNZW1iZXJJbmZvcm1hdGlvbihtZW1iZXJOYW1lKTtcbiAgY29uc3QgaGFja2luZ0xldmVsID0gbWVtYmVySW5mb1snaGFjayddO1xuICBjb25zdCBjdXJyZW50VGFzayA9IG1lbWJlckluZm9bJ3Rhc2snXTtcbiAgbnMucHJpbnQoYE1lbWJlcjogJHttZW1iZXJOYW1lfVxcdGhhY2tpbmcgbGV2ZWw6ICR7aGFja2luZ0xldmVsfVxcdHRhc2s6ICR7Y3VycmVudFRhc2t9YCk7XG59XG5cbi8qKiBAcGFyYW0ge05TfSBucyAqL1xuZnVuY3Rpb24gYXNzaWduTWVtYmVyKG5zLCBuYW1lLCB0YXNrID0gJycpIHtcbiAgY29uc3QgbWVtYmVySW5mbyA9IG5zLmdhbmcuZ2V0TWVtYmVySW5mb3JtYXRpb24obmFtZSk7XG4gIGNvbnN0IGhhY2tpbmdMZXZlbCA9IG1lbWJlckluZm9bJ2hhY2snXTtcbiAgY29uc3QgY3VycmVudFRhc2sgPSBtZW1iZXJJbmZvWyd0YXNrJ107XG5cbiAgLypcbiAgVGFzayBuYW1lczpcbiAgICAgIC0gVW5hc3NpZ25lZFxuICAgICAgLSBSYW5zb213YXJlXG4gICAgICAtIFBoaXNoaW5nXG4gICAgICAtIElkZW50aXR5IFRoZWZ0XG4gICAgICAtIEREb1MgQXR0YWNrc1xuICAgICAgLSBQbGFudCBWaXJ1c1xuICAgICAgLSBGcmF1ZCAmIENvdW50ZXJmZWl0aW5nLFxuICAgICAgLSBNb25leSBMYXVuZGVyaW5nXG4gICAgICAtIEN5YmVydGVycm9yaXNtXG4gICAgICAtIEV0aGljYWwgSGFja2luZ1xuICAgICAgLSBWaWdpbGFudGUgSnVzdGljZVxuICAgICAgLSBUcmFpbiBDb21iYXRcbiAgICAgIC0gVHJhaW4gSGFja2luZ1xuICAgICAgLSBUcmFpbiBDaGFyaXNtYVxuICAgICAgLSBUZXJyaXRvcnkgV2FyZmFyZVxuICAqL1xuICBpZiAodGFzayAhPSAnJykge1xuICAgIGlmIChjdXJyZW50VGFzayAhPSB0YXNrKSB7XG4gICAgICBucy5nYW5nLnNldE1lbWJlclRhc2sobmFtZSwgdGFzayk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGhhY2tpbmdMZXZlbCA8IDEyMCkge1xuICAgIGlmIChjdXJyZW50VGFzayAhPSAnQ3liZXJ0ZXJyb3Jpc20nKSB7XG4gICAgICBucy5nYW5nLnNldE1lbWJlclRhc2sobmFtZSwgJ0N5YmVydGVycm9yaXNtJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChjdXJyZW50VGFzayAhPSAnTW9uZXkgTGF1bmRlcmluZycpIHtcbiAgICAgIG5zLmdhbmcuc2V0TWVtYmVyVGFzayhuYW1lLCAnTW9uZXkgTGF1bmRlcmluZycpO1xuICAgIH1cbiAgfVxufVxuXG4vKiogQHBhcmFtIHtOU30gbnMgKi9cbmZ1bmN0aW9uIHJlY3J1aXRJZlBvc3NpYmxlKG5zKSB7XG4gIGlmICghbnMuZ2FuZy5jYW5SZWNydWl0TWVtYmVyKCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBnYW5nTWVtYmVycyA9IG5zLmdhbmcuZ2V0TWVtYmVyTmFtZXMoKTtcbiAgY29uc3QgbmV3R2FuZ01lbWJlck5hbWUgPSBgYXVkcmV5LSR7Z2FuZ01lbWJlcnMubGVuZ3RoICsgMX1gO1xuICBucy5nYW5nLnJlY3J1aXRNZW1iZXIobmV3R2FuZ01lbWJlck5hbWUpO1xuICBhc3NpZ25NZW1iZXIobnMsIG5ld0dhbmdNZW1iZXJOYW1lKTtcbn1cblxuLyoqIEBwYXJhbSB7TlN9IG5zICovXG5mdW5jdGlvbiByZWFzc2lnbk1lbWJlcnNBY2NvcmRpbmdUb1dhbnRlZExldmVsUGVuYWx0eShucykge1xuICBjb25zdCBnYW5nSW5mb3JtYXRpb24gPSBucy5nYW5nLmdldEdhbmdJbmZvcm1hdGlvbigpO1xuICAvKlxuICBHYW5nIGluZm9ybWF0aW9uIHN0cnVjdHVyZTpcbiAge1xuICAgICAgXCJmYWN0aW9uXCI6XCJOaXRlU2VjXCIsXG4gICAgICBcImlzSGFja2luZ1wiOnRydWUsXG4gICAgICBcIm1vbmV5R2FpblJhdGVcIjoyMTMuMTg5NTk2NDIzMjMwNzcsXG4gICAgICBcInBvd2VyXCI6MSxcbiAgICAgIFwicmVzcGVjdFwiOjg0Ni42MzE3OTk5NjAyNDksXG4gICAgICBcInJlc3BlY3RHYWluUmF0ZVwiOjAsXG4gICAgICBcInRlcnJpdG9yeVwiOjAuMTQyODU3MTQyODU3MTQyOTMsXG4gICAgICBcInRlcnJpdG9yeUNsYXNoQ2hhbmNlXCI6MCxcbiAgICAgIFwidGVycml0b3J5V2FyZmFyZUVuZ2FnZWRcIjpmYWxzZSxcbiAgICAgIFwid2FudGVkTGV2ZWxcIjozMTAuMjQ3MzQxOTQzODQ5MSxcbiAgICAgIFwid2FudGVkTGV2ZWxHYWluUmF0ZVwiOi0wLjAyNTMwMjg1NzE0Mjg1NzE1OCxcbiAgICAgIFwid2FudGVkUGVuYWx0eVwiOjAuNzMxODIzODk1MjQ4NzE1OVxuICB9XG4gICovXG5cbiAgY29uc3Qgd2FudGVkTGV2ZWxQZW5hbHR5ID0gMS4wIC0gZ2FuZ0luZm9ybWF0aW9uWyd3YW50ZWRQZW5hbHR5J107XG4gIGNvbnN0IGdhbmdSZXNwZWN0ID0gZ2FuZ0luZm9ybWF0aW9uWydyZXNwZWN0J107XG4gIGlmICh3YW50ZWRMZXZlbFBlbmFsdHkgPiAwLjI1ICYmIGdhbmdSZXNwZWN0ID4gNTApIHtcbiAgICBucy5nYW5nLmdldE1lbWJlck5hbWVzKCkubWFwKG1lbWJlck5hbWUgPT4ge1xuICAgICAgYXNzaWduTWVtYmVyKG5zLCBtZW1iZXJOYW1lLCAnRXRoaWNhbCBIYWNraW5nJyk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgbnMuZ2FuZy5nZXRNZW1iZXJOYW1lcygpLm1hcChtZW1iZXJOYW1lID0+IHtcbiAgICAgIGFzc2lnbk1lbWJlcihucywgbWVtYmVyTmFtZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYXNjZW5kSWZHYWluSXNXb3J0aChucykge1xuICBucy5nYW5nLmdldE1lbWJlck5hbWVzKCkubWFwKG1lbWJlck5hbWUgPT4ge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBucy5nYW5nLmdldEFzY2Vuc2lvblJlc3VsdChtZW1iZXJOYW1lKTtcblxuICAgIGlmIChyZXN1bHRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBoYWNraW5nTXVsdFdpdGhBc2NlbnNpb24gPSByZXN1bHRzWydoYWNrJ107XG5cbiAgICBpZiAoaGFja2luZ011bHRXaXRoQXNjZW5zaW9uID4gMi4wKSB7XG4gICAgICBucy5nYW5nLmFzY2VuZE1lbWJlcihtZW1iZXJOYW1lKTtcbiAgICAgIGFzc2lnbk1lbWJlcihucywgbWVtYmVyTmFtZSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gYnV5RXF1aXBtZW50KG5zKSB7XG4gIC8qXG4gICAgICBbXG4gICAgICAgICAgXCJCYXNlYmFsbCBCYXRcIixcbiAgICAgICAgICBcIkthdGFuYVwiLFxuICAgICAgICAgIFwiR2xvY2sgMThDXCIsXG4gICAgICAgICAgXCJQOTBDXCIsXG4gICAgICAgICAgXCJTdGV5ciBBVUdcIixcbiAgICAgICAgICBcIkFLLTQ3XCIsXG4gICAgICAgICAgXCJNMTVBMTAgQXNzYXVsdCBSaWZsZVwiLFxuICAgICAgICAgIFwiQVdNIFNuaXBlciBSaWZsZVwiLFxuICAgICAgICAgIFwiQnVsbGV0cHJvb2YgVmVzdFwiLFxuICAgICAgICAgIFwiRnVsbCBCb2R5IEFybW9yXCIsXG4gICAgICAgICAgXCJMaXF1aWQgQm9keSBBcm1vclwiLFxuICAgICAgICAgIFwiR3JhcGhlbmUgUGxhdGluZyBBcm1vclwiLFxuICAgICAgICAgIFwiRm9yZCBGbGV4IFYyMFwiLFxuICAgICAgICAgIFwiQVRYMTA3MCBTdXBlcmJpa2VcIixcbiAgICAgICAgICBcIk1lcmNlZGVzLUJlbnogUzkwMDFcIixcbiAgICAgICAgICBcIldoaXRlIEZlcnJhcmlcIixcbiAgICAgICAgICBcIk5VS0UgUm9vdGtpdFwiLFxuICAgICAgICAgIFwiU291bHN0ZWFsZXIgUm9vdGtpdFwiLFxuICAgICAgICAgIFwiRGVtb24gUm9vdGtpdFwiLFxuICAgICAgICAgIFwiSG1hcCBOb2RlXCIsXG4gICAgICAgICAgXCJKYWNrIHRoZSBSaXBwZXJcIixcbiAgICAgICAgICBcIkJpb25pYyBBcm1zXCIsXG4gICAgICAgICAgXCJCaW9uaWMgTGVnc1wiLFxuICAgICAgICAgIFwiQmlvbmljIFNwaW5lXCIsXG4gICAgICAgICAgXCJCcmFjaGlCbGFkZXNcIixcbiAgICAgICAgICBcIk5hbm9maWJlciBXZWF2ZVwiLFxuICAgICAgICAgIFwiU3ludGhldGljIEhlYXJ0XCIsXG4gICAgICAgICAgXCJTeW5maWJyaWwgTXVzY2xlXCIsXG4gICAgICAgICAgXCJCaXRXaXJlXCIsXG4gICAgICAgICAgXCJOZXVyYWxzdGltdWxhdG9yXCIsXG4gICAgICAgICAgXCJEYXRhSmFja1wiLFxuICAgICAgICAgIFwiR3JhcGhlbmUgQm9uZSBMYWNpbmdzXCJcbiAgICAgICAgICBdXG4gICovXG4gIGNvbnN0IGhhY2tpbmdVcGdyYWRlcyA9IFsnTlVLRSBSb290a2l0JywgJ1NvdWxzdGVhbGVyIFJvb3RraXQnLCAnRGVtb24gUm9vdGtpdCcsICdIbWFwIE5vZGUnLCAnSmFjayB0aGUgUmlwcGVyJ107XG4gIGNvbnN0IGhhY2tpbmdBdWdtZW50YXRpb25zID0gWydCaXRXaXJlJywgJ05ldXJhbHN0aW11bGF0b3InLCAnRGF0YUphY2snXTtcblxuICBucy5nYW5nLmdldE1lbWJlck5hbWVzKCkubWFwKG1lbWJlck5hbWUgPT4ge1xuICAgIGNvbnN0IG1lbWJlckluZm8gPSBucy5nYW5nLmdldE1lbWJlckluZm9ybWF0aW9uKG1lbWJlck5hbWUpO1xuICAgIGNvbnN0IG1lbWJlckhhY2tpbmdVcGdyYWRlID0gbWVtYmVySW5mb1sndXBncmFkZXMnXTtcbiAgICBjb25zdCBtZW1iZXJIYWNraW5nQXVnbWVudGF0aW9ucyA9IG1lbWJlckluZm9bJ2F1Z21lbnRhdGlvbnMnXTtcblxuICAgIGhhY2tpbmdVcGdyYWRlcy5tYXAodXBncmFkZSA9PiB7XG4gICAgICBpZiAoIW1lbWJlckhhY2tpbmdVcGdyYWRlLmluY2x1ZGVzKHVwZ3JhZGUpICYmIG5zLmdhbmcuZ2V0RXF1aXBtZW50Q29zdCh1cGdyYWRlKSA8IG5zLmdldFNlcnZlck1vbmV5QXZhaWxhYmxlKCdob21lJykpIHtcbiAgICAgICAgbnMuZ2FuZy5wdXJjaGFzZUVxdWlwbWVudChtZW1iZXJOYW1lLCB1cGdyYWRlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGhhY2tpbmdBdWdtZW50YXRpb25zLm1hcChhdWdtZW50YXRpb24gPT4ge1xuICAgICAgaWYgKCFtZW1iZXJIYWNraW5nQXVnbWVudGF0aW9ucy5pbmNsdWRlcyhhdWdtZW50YXRpb24pICYmIG5zLmdhbmcuZ2V0RXF1aXBtZW50Q29zdChhdWdtZW50YXRpb24pIDwgbnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoJ2hvbWUnKSkge1xuICAgICAgICBucy5nYW5nLnB1cmNoYXNlRXF1aXBtZW50KG1lbWJlck5hbWUsIGF1Z21lbnRhdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vKiogQHBhcmFtIHtOU30gbnMgKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKG5zKSB7XG4gIG5zLmRpc2FibGVMb2coJ3NsZWVwJyk7XG4gIG5zLmRpc2FibGVMb2coJ2dldFNlcnZlck1vbmV5QXZhaWxhYmxlJyk7XG4gIGxldCBjb3VudGVyID0gMDtcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIGlmICghbnMuZ2FuZy5pbkdhbmcoKSkge1xuICAgICAgbnMucHJpbnQoYE5vdCBpbiBnYW5nLiBXYWl0aW5nLmApO1xuICAgICAgYXdhaXQgbnMuc2xlZXAoMTAwMCAqIDYwKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIG5zLmdhbmcuZ2V0TWVtYmVyTmFtZXMoKS5tYXAobWVtYmVyTmFtZSA9PiBkaXNwbGF5TWVtYmVyc0luZm9ybWF0aW9uKG5zLCBtZW1iZXJOYW1lKSk7XG5cbiAgICByZWNydWl0SWZQb3NzaWJsZShucyk7XG4gICAgYXNjZW5kSWZHYWluSXNXb3J0aChucyk7XG4gICAgcmVhc3NpZ25NZW1iZXJzQWNjb3JkaW5nVG9XYW50ZWRMZXZlbFBlbmFsdHkobnMpO1xuICAgIGJ1eUVxdWlwbWVudChucyk7XG5cbiAgICBpZiAoY291bnRlciA+PSAyNSkge1xuICAgICAgbnMuZ2FuZy5nZXRNZW1iZXJOYW1lcygpLm1hcChtZW1iZXJOYW1lID0+IGFzc2lnbk1lbWJlcihucywgbWVtYmVyTmFtZSkpO1xuICAgICAgY291bnRlciA9IDA7XG4gICAgfSBlbHNlIGlmIChjb3VudGVyID49IDIzKSB7XG4gICAgICBucy5nYW5nLmdldE1lbWJlck5hbWVzKCkubWFwKG1lbWJlck5hbWUgPT4gYXNzaWduTWVtYmVyKG5zLCBtZW1iZXJOYW1lLCAnRXRoaWNhbCBIYWNraW5nJykpO1xuICAgIH1cblxuICAgIGNvdW50ZXIrKztcbiAgICBhd2FpdCBucy5zbGVlcCgxMDAwICogMzApO1xuICB9XG59XG4iXX0=