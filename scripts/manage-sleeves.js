/** @param {NS} ns */
async function setSleevesTask(ns) {
    for (var i = 0; i < ns.sleeve.getNumSleeves(); i++) {
        const sleeve = ns.sleeve.getSleeve(i);
        ns.print(`Sleeve ${i} has:`);
        ns.print(`- sync=${sleeve.sync}`);
        ns.print(`- shock=${sleeve.shock}`);
        ns.print(`--------------------------------------------`);

        if (sleeve.sync < 100) {
            ns.print('Synchronize');
            ns.sleeve.setToSynchronize(i);
        } else if (sleeve.shock > 0) {
            ns.print('Shock recovery');
            ns.sleeve.setToShockRecovery(i);
        } else {
            ns.print('Manual task');
            // Ref: https://github.com/danielyxie/bitburner/blob/dev/src/Enums.ts
            // ns.sleeve.setToCommitCrime(i, 'Assassination');
            // ns.sleeve.setToCommitCrime(i, 'Heist');
            // ns.sleeve.setToCommitCrime(i, 'Mug');
            ns.sleeve.setToCommitCrime(i, 'Homicide');
            // ns.sleeve.setToUniversityCourse(i, 'Rothman University', 'Computer Science');
            // ns.sleeve.setToUniversityCourse(i, 'Rothman University', 'Algorithms');
        }
    }
}

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('sleep');

    while (true) {
        await setSleevesTask(ns);

        await ns.sleep(1000*15);
    }
}
