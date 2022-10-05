/** @param {NS} ns */

function computeTarget(a, b) {
    const expon = 20;  // User-defined value, higher value: target is closer to a.
    const firstTerm = Math.pow(a, expon);
    const secondTerm = b;
    return Math.pow(firstTerm*secondTerm, 1.0/(expon+1));
}

export async function main(ns) {
    ns.disableLog('getServerSecurityLevel');
    ns.disableLog('getServerMinSecurityLevel');
    ns.disableLog('getServerMoneyAvailable');
    ns.disableLog('getServerMaxMoney');

    const target = ns.getHostname();

    while (true) {

        ns.print('Security\tcurrent: ' + ns.getServerSecurityLevel(target).toFixed(3)
                 + ', minimum: ' + ns.getServerMinSecurityLevel(target).toFixed(3));

        const targetSecurityLevel = computeTarget(ns.getServerSecurityLevel(target), ns.getServerMinSecurityLevel(target));
        while (ns.getServerSecurityLevel(target) > targetSecurityLevel) {
            ns.print('--> Security Level: ' + ns.getServerSecurityLevel(target).toFixed(3)
                     + ' > ' + targetSecurityLevel.toFixed(3));
            await ns.weaken(target);
        }

        ns.print('Money\tcurrent: ' + ns.getServerMoneyAvailable(target).toFixed(3)
                 + ', maximum: ' + ns.getServerMaxMoney(target).toFixed(3));
        const targetMoneyAmount = computeTarget(ns.getServerMoneyAvailable(target), ns.getServerMaxMoney(target));
        while (ns.getServerMoneyAvailable(target) < targetMoneyAmount) {
            ns.print('--> Money: ' + ns.getServerMoneyAvailable(target).toFixed(3)
                     + ' < ' + targetMoneyAmount.toFixed(3));
            await ns.grow(target);
        }

        for (let i=0; i<50; i++) {
            await ns.hack(target);
        }
    }
}
