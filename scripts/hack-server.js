/** @param {NS} ns */

export async function main(ns) {
    ns.disableLog('getServerSecurityLevel');
    ns.disableLog('getServerMinSecurityLevel');
    ns.disableLog('getServerMoneyAvailable');
    ns.disableLog('getServerMaxMoney');

    const target = ns.getHostname();

    while (true) {
        const targetSecurityLevel = Math.sqrt(ns.getServerSecurityLevel(target)*ns.getServerMinSecurityLevel(target));
        while (ns.getServerSecurityLevel(target)>=targetSecurityLevel) {
            ns.print('--> Security Level: ' + ns.getServerSecurityLevel(target).toFixed(3) 
                     + ' >= ' + targetSecurityLevel.toFixed(3));
            await ns.weaken(target);
        }

        const targetMoneyAmount = Math.sqrt(ns.getServerMoneyAvailable(target)*ns.getServerMaxMoney(target));
        while (ns.getServerMoneyAvailable(target)<=targetMoneyAmount) {
            ns.print('--> Money: ' + ns.getServerMoneyAvailable(target).toFixed(3) 
                     + ' <= ' + targetMoneyAmount.toFixed(3));
            await ns.grow(target);
        }

        for (let i=0; i<250; i++) {
            await ns.hack(target);
        }
    }
}