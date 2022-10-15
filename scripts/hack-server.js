/** @param {NS} ns */

function computeTarget(a, b) {
    const expon = 2;  // User-defined value, higher value: target is closer to a.
    const firstTerm = Math.pow(a, expon);
    const secondTerm = b;
    return Math.pow(firstTerm*secondTerm, 1.0/(expon+1));
}

export async function main(ns) {
    ns.disableLog('getServerSecurityLevel');
    ns.disableLog('getServerMinSecurityLevel');
    ns.disableLog('getServerMoneyAvailable');
    ns.disableLog('getServerMaxMoney');
    const decimalPlaces = 10;

    const target = ns.getHostname();

    while (true) {

        ns.print('Security\tcurrent: ' + ns.getServerSecurityLevel(target).toFixed(decimalPlaces)
                 + ', minimum: ' + ns.getServerMinSecurityLevel(target).toFixed(decimalPlaces));

        const targetSecurityLevel = 1.01*computeTarget(ns.getServerSecurityLevel(target), ns.getServerMinSecurityLevel(target));
        while (ns.getServerSecurityLevel(target) > targetSecurityLevel) {
            ns.print('--> Security Level: ' + ns.getServerSecurityLevel(target).toFixed(decimalPlaces)
                     + ' > ' + targetSecurityLevel.toFixed(decimalPlaces));
            await ns.weaken(target);
        }

        ns.print('Money\tcurrent: ' + ns.getServerMoneyAvailable(target).toFixed(decimalPlaces)
                 + ', maximum: ' + ns.getServerMaxMoney(target).toFixed(decimalPlaces));
        const targetMoneyAmount = 0.99*computeTarget(ns.getServerMoneyAvailable(target), ns.getServerMaxMoney(target));
        while (ns.getServerMoneyAvailable(target) < targetMoneyAmount) {
            ns.print('--> Money: ' + ns.getServerMoneyAvailable(target).toFixed(decimalPlaces)
                     + ' < ' + targetMoneyAmount.toFixed(decimalPlaces));
            await ns.grow(target);
        }

        for (let i=0; i<10; i++) {
            await ns.hack(target);
        }
    }
}