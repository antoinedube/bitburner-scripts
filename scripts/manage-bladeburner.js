/** @param {NS} ns */
function findNextAction(ns) {
    const orderOfTypes = ['Operation', 'Contract', 'General'];
    const targetedTasks = {
        'General': ['Training'],
        'Contract': ['Tracking', 'Bounty Hunter', 'Retirement'],
        'Operation': ['Investigation', 'Stealth Retirement Operation', 'Assassination']
    }

    const lowStaminaTask = 'Hyperbolic Regeneration Chamber';

    const [currentStamina, maxStamina] = ns.bladeburner.getStamina();
    const playerRank = ns.bladeburner.getRank();

    if (currentStamina < 0.75*maxStamina) {
        return {
            'type': 'General',
            'name': lowStaminaTask
        };
    }

    // BlackOps have a special structure
    const { nextBlackOp, nextBlackOpRank } = ns.bladeburner.getNextBlackOp();
    if (nextBlackOp!=undefined) {

        const [lowerBound, _] = ns.bladeburner.getActionEstimatedSuccessChance('BlackOp', nextBlackOp);
        if (0.8 < lowerBound && nextBlackOpRank <= playerRank && nextBlackOp!='Operation Daedalus') {
            return {
                'type': 'BlackOp',
                'name': nextBlackOp
            };
        }
    }

    for (let actionType of orderOfTypes) {
        const actionNames = targetedTasks[actionType].reverse();
        for (let actionName of actionNames) {
            const [lowerBound, _] = ns.bladeburner.getActionEstimatedSuccessChance(actionType, actionName);
            const countRemaining = ns.bladeburner.getActionCountRemaining(actionType, actionName);
            if (0.8 < lowerBound && 0< countRemaining) {
                return {
                    'type': actionType,
                    'name': actionName
                };
            }
        }
    }

    return {
        'type': 'General',
        'name': 'Training'
    };
}

/** @param {NS} ns */
function upgradeBladeburnerSkills(ns) {
    const targetedSkills = ["Blade's Intuition", "Cloak", "Short-Circuit"];

    for (let skill of targetedSkills) {
        const skillCost = ns.bladeburner.getSkillUpgradeCost(skill);
        const numberSkillPoints = ns.bladeburner.getSkillPoints();
        if (skillCost < numberSkillPoints) {
            ns.bladeburner.upgradeSkill(skill);
        }
    }
}

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('sleep');
        const thirty_seconds = 30*1000;

        if (!ns.bladeburner.inBladeburner()) {
            ns.print('Not in BladeBurner');
            await ns.sleep(thirty_seconds);
        }

        ns.print('Managing bladeburner');

        while (true) {
            const currentAction = ns.bladeburner.getCurrentAction();

            if (currentAction['type']=='BlackOp') {  // Do not interrupt a BlackOp
                await ns.sleep(thirty_seconds);
                continue;
            }

            const newAction = findNextAction(ns);
            if (currentAction['type']!=newAction['type'] || currentAction['name']!=newAction['name']) {
                const result = ns.bladeburner.startAction(newAction['type'], newAction['name']);
                if (!result) {
                    ns.print(`Unable to start action: ${JSON.stringify(newAction)}`);
                }
            }

            upgradeBladeburnerSkills(ns);
            await ns.sleep(thirty_seconds);
        }
}
