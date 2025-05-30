import { NS } from "@ns";

interface Action {
  type: string,
  name: string
}

interface TaskTypes {
  General: string[],
  Contract: string[],
  Operation: string[]
}

function findNextAction(ns: NS): Action {
  const orderOfTypes = ['Operation', 'Contract', 'General'];
  const targetedTasks: TaskTypes = {
    General: ['Training'],
    Contract: ['Tracking', 'Bounty Hunter', 'Retirement'],
    Operation: ['Investigation', 'Stealth Retirement Operation', 'Assassination']
  }

  const lowStaminaTask = 'Hyperbolic Regeneration Chamber';

  const [currentStamina, maxStamina] = ns.bladeburner.getStamina();
  const playerRank = ns.bladeburner.getRank();

  if (currentStamina < 0.80 * maxStamina) {
    return {
      type: 'General',
      name: lowStaminaTask
    };
  }

  // BlackOps have a special structure
  const nextBlackOp = ns.bladeburner.getNextBlackOp();
  if (nextBlackOp != undefined) {

    const [lowerBound, _] = ns.bladeburner.getActionEstimatedSuccessChance('BlackOp', nextBlackOp['name']);
    if (0.9 < lowerBound && nextBlackOp['rank'] <= playerRank) {
      return {
        'type': 'BlackOp',
        'name': nextBlackOp['name']
      };
    }
  }

  for (let actionType of orderOfTypes) {
    const actionNames = targetedTasks[actionType].reverse();
    for (let actionName of actionNames) {
      const [lowerBound, _] = ns.bladeburner.getActionEstimatedSuccessChance(actionType, actionName);
      const countRemaining = ns.bladeburner.getActionCountRemaining(actionType, actionName);
      if (0.8 < lowerBound && 0 < countRemaining) {
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

function upgradeBladeburnerSkills(ns: NS): void {
  const targetedSkills = [
    "Blade's Intuition",
    "Cloak",
    "Short-Circuit",
    "Digital Observer",
    "Tracer",
    "Hyperdrive",
    "Hands of Midas"
  ];

  for (let skill of targetedSkills) {
    const skillCost = ns.bladeburner.getSkillUpgradeCost(skill);
    const numberSkillPoints = ns.bladeburner.getSkillPoints();
    if (skillCost < numberSkillPoints) {
      ns.bladeburner.upgradeSkill(skill);
    }
  }
}

export async function main(ns: NS): Promise<void> {
  ns.disableLog('sleep');
  const ten_seconds = 10 * 1000;

  while (!ns.bladeburner.inBladeburner()) {
    ns.print('Not in BladeBurner');
    await ns.sleep(ten_seconds);
  }

  ns.print('Managing bladeburner');

  while (true) {
    const currentAction = ns.bladeburner.getCurrentAction();

    if (currentAction == null) {
      await ns.sleep(ten_seconds);
      continue;
    }

    const newAction = findNextAction(ns);
    if (currentAction['type'] != newAction['type'] || currentAction['name'] != newAction['name']) {
      const result = ns.bladeburner.startAction(newAction['type'], newAction['name']);
      if (!result) {
        ns.print(`Unable to start action: ${JSON.stringify(newAction)}`);
      }
    }

    upgradeBladeburnerSkills(ns);
    await ns.sleep(ten_seconds);
  }
}
