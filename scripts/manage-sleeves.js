/** @param {NS} ns */
async function setSleevesTask(ns) {
    for (var i = 0; i < ns.sleeve.getNumSleeves(); i++) {
        const sleeve = ns.sleeve.getSleeve(i);
        ns.print(`Sleeve ${i} has:`);
        ns.print(`- sync=${sleeve.sync}`);
        ns.print(`- shock=${sleeve.shock}`);
        ns.print(`--------------------------------------------`);

        if (sleeve.sync < 95) {
            ns.sleeve.setToSynchronize(i);
        } else if (sleeve.shock > 50) {
            ns.sleeve.setToShockRecovery(i);
        } else {
            // ns.sleeve.setToCommitCrime(i, 'Assassination');
            // ns.sleeve.setToCommitCrime(i, 'Heist');
            ns.sleeve.setToCommitCrime(i, 'Mug');
        }
    }
}

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('sleep');

    while (true) {
        setSleevesTask(ns);

        await ns.sleep(1000*15);
    }
}
