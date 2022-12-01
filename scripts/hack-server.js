/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('getServerSecurityLevel');
    ns.disableLog('getServerMinSecurityLevel');
    ns.disableLog('getServerMoneyAvailable');
    ns.disableLog('getServerMaxMoney');
    const decimalPlaces = 3;

    const target = ns.getHostname();

    while (true) {
        ns.print('Security\tcurrent: ' + ns.getServerSecurityLevel(target).toFixed(decimalPlaces)
                + ', minimum: ' + ns.getServerMinSecurityLevel(target).toFixed(decimalPlaces));

        const targetSecurityLevel = 1.05*ns.getServerMinSecurityLevel(target);
        while (ns.getServerSecurityLevel(target) > targetSecurityLevel) {
            ns.print('--> Security Level: ' + ns.getServerSecurityLevel(target).toFixed(decimalPlaces)
                    + ' > ' + targetSecurityLevel.toFixed(decimalPlaces));
            await ns.weaken(target);
        }

        ns.print('Money\tcurrent: ' + ns.getServerMoneyAvailable(target).toFixed(decimalPlaces)
                + ', maximum: ' + ns.getServerMaxMoney(target).toFixed(decimalPlaces));
        const targetMoneyAmount = 0.95*ns.getServerMaxMoney(target);
        while (ns.getServerMoneyAvailable(target) < targetMoneyAmount) {
            ns.print('--> Money: ' + ns.getServerMoneyAvailable(target).toFixed(decimalPlaces)
                    + ' < ' + targetMoneyAmount.toFixed(decimalPlaces));
            await ns.grow(target);
        }

        await ns.hack(target);
    }
}