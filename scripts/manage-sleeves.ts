import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.disableLog('sleep');

  // Synchronization and shock recovery
  while (true) {
    let sync_shock_status_list = [];

    for (var i = 0; i < ns.sleeve.getNumSleeves(); i++) {
      const sleeve = ns.sleeve.getSleeve(i);

      if (sleeve.sync < 100) {
        ns.print(`Sleeve ${i + 1} has: sync=${sleeve.sync} and shock=${sleeve.shock} --> Assigning to Synchronize`);
        ns.sleeve.setToSynchronize(i);
        sync_shock_status_list.push(false);
      } else if (sleeve.shock > 0) {
        ns.print(`Sleeve ${i + 1} has: sync=${sleeve.sync} and shock=${sleeve.shock} --> Assigning to Shock Recovery`);
        ns.sleeve.setToShockRecovery(i);
        sync_shock_status_list.push(false);
      } else {
        ns.print(`Sleeve ${i + 1} is ready for next task`);
        sync_shock_status_list.push(true);
      }
    }

    if (sync_shock_status_list.filter((item) => item).length == ns.sleeve.getNumSleeves()) {
      break;
    }

    await ns.sleep(1000 * 15);
  }

  // Hacking
  const HACKING_STAT_TARGET = 250;
  while (true) {
    const player = ns.getPlayer();
    const skills = player['skills'];
    const hacking = skills['hacking'];
    ns.print(`Hacking level: ${hacking} vs ${HACKING_STAT_TARGET}`);

    if (HACKING_STAT_TARGET <= hacking) {
      break;
    }

    for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
      ns.sleeve.setToUniversityCourse(i, 'Rothman University', 'Computer Science');
    }

    await ns.sleep(1000 * 15);
  };

  const COMBAT_STATS_TARGETS = [30, 75, 200, 850, 1200, 1500];

  for (let combat_stats_target of COMBAT_STATS_TARGETS) {

    // Strength
    while (true) {
      const player = ns.getPlayer();
      const skills = player['skills'];

      const skill_value = skills['strength'];
      if (combat_stats_target <= skill_value) {
        break;
      }

      ns.print(`Strength is ${skill_value}, training until: ${combat_stats_target}`);
      for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
        ns.sleeve.setToGymWorkout(i, 'Powerhouse Gym', 'str');
      }

      await ns.sleep(1000 * 15);
    }

    // Defense
    while (true) {
      const player = ns.getPlayer();
      const skills = player['skills'];

      const skill_value = skills['defense'];
      if (combat_stats_target <= skill_value) {
        break;
      }

      ns.print(`Defense is ${skill_value}, training until: ${combat_stats_target}`);
      for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
        ns.sleeve.setToGymWorkout(i, 'Powerhouse Gym', 'def');
      }

      await ns.sleep(1000 * 15);
    }

    // Dexterity
    while (true) {
      const player = ns.getPlayer();
      const skills = player['skills'];

      const skill_value = skills['dexterity'];
      if (combat_stats_target <= skill_value) {
        break;
      }

      ns.print(`Dexterity is ${skill_value}, training until: ${combat_stats_target}`);
      for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
        ns.sleeve.setToGymWorkout(i, 'Powerhouse Gym', 'dex');
      }

      await ns.sleep(1000 * 15);
    }

    // Agility
    while (true) {
      const player = ns.getPlayer();
      const skills = player['skills'];

      const skill_value = skills['agility'];
      if (combat_stats_target <= skill_value) {
        break;
      }

      ns.print(`Agility is ${skill_value}, training until: ${combat_stats_target}`);
      for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
        ns.sleeve.setToGymWorkout(i, 'Powerhouse Gym', 'agi');
      }

      await ns.sleep(1000 * 15);
    }
  }

  // Hacking, part 2
  while (true) {
    const player = ns.getPlayer();
    const skills = player['skills'];
    const hacking = skills['hacking'];
    ns.print(`Hacking level is ${hacking}`);

    for (let i = 0; i < ns.sleeve.getNumSleeves(); i++) {
      ns.sleeve.setToUniversityCourse(i, 'Rothman University', 'Algorithms');
    }

    await ns.sleep(1000 * 15);
  };
}
