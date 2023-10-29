/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('sleep');

    ns.tprint('Managing bladeburner');

    const currentStamina = ns.bladeburner.getStamina();

    const targetedTasks = [];
}
