/** @param {NS} ns */

function computeTarget(a, b, expon_a, expon_b) {
    const firstTerm = Math.pow(a, expon_a);
    const secondTerm = Math.pow(b, expon_b);
    return Math.pow(firstTerm*secondTerm, 1.0/(expon_a + expon_b));
}

export async function main(ns) {
    ns.disableLog('getServerSecurityLevel');
    ns.disableLog('getServerMinSecurityLevel');
    ns.disableLog('getServerMoneyAvailable');
    ns.disableLog('getServerMaxMoney');
    const decimalPlaces = 10;
    let expon_a = 100;
    let expon_b = 1;

    const target = ns.getHostname();

    while (true) {

        ns.print('Security\tcurrent: ' + ns.getServerSecurityLevel(target).toFixed(decimalPlaces)
                 + ', minimum: ' + ns.getServerMinSecurityLevel(target).toFixed(decimalPlaces));

        const targetSecurityLevel = 1.01*computeTarget(ns.getServerSecurityLevel(target), ns.getServerMinSecurityLevel(target), expon_a, expon_b);
        while (ns.getServerSecurityLevel(target) > targetSecurityLevel) {
            ns.print('--> Security Level: ' + ns.getServerSecurityLevel(target).toFixed(decimalPlaces)
                     + ' > ' + targetSecurityLevel.toFixed(decimalPlaces));
            await ns.weaken(target);
        }

        ns.print('Money\tcurrent: ' + ns.getServerMoneyAvailable(target).toFixed(decimalPlaces)
                 + ', maximum: ' + ns.getServerMaxMoney(target).toFixed(decimalPlaces));
        const targetMoneyAmount = 0.99*computeTarget(ns.getServerMoneyAvailable(target), ns.getServerMaxMoney(target), expon_a, expon_b);
        while (ns.getServerMoneyAvailable(target) < targetMoneyAmount) {
            ns.print('--> Money: ' + ns.getServerMoneyAvailable(target).toFixed(decimalPlaces)
                     + ' < ' + targetMoneyAmount.toFixed(decimalPlaces));
            await ns.grow(target);
        }

        await ns.hack(target);

        if (expon_a>1) {
            expon_a -= 1;
        } else if (expon_a==1 && expon_b<100) {
            expon_b += 1;
        }

        ns.print('expon a, expon b: ' + expon_a + ', ' + expon_b);
    }
}
