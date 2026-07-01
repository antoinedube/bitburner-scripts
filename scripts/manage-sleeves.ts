import { NS } from "@ns";

async function setSleevesTask(ns: NS): Promise<void> {
  for (var i = 0; i < ns.sleeve.getNumSleeves(); i++) {
    const sleeve = ns.sleeve.getSleeve(i);
    ns.print(`Sleeve ${i + 1} has:`);
    ns.print(`- sync=${sleeve.sync}`);
    ns.print(`- shock=${sleeve.shock}`);

    if (sleeve.sync < 100) {
      ns.print('\n--> Assigning to Synchronize');
      ns.sleeve.setToSynchronize(i);
    } else if (sleeve.shock > 0) {
      ns.print('\n--> Assigning to Shock recovery');
      ns.sleeve.setToShockRecovery(i);
    } else {
      // Ref: https://github.com/danielyxie/bitburner/blob/dev/src/Enums.ts
      // ns.sleeve.setToCommitCrime(i, 'Assassination');
      // ns.sleeve.setToCommitCrime(i, 'Heist');
      // ns.sleeve.setToCommitCrime(i, 'Mug');
      // ns.sleeve.setToCommitCrime(i, 'Homicide');
      // ns.sleeve.setToUniversityCourse(i, 'Rothman University', 'Computer Science');
      ns.print('\n--> Assigning to Study Algorithms');
      ns.sleeve.setToUniversityCourse(i, 'Rothman University', 'Algorithms');
    }

    ns.print('--------------------------------------------\n');
  }
}

export async function main(ns: NS): Promise<void> {
  ns.disableLog('sleep');

  while (true) {
    await setSleevesTask(ns);

    await ns.sleep(1000 * 15);
  }
}
