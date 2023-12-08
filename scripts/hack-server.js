function computeTargetLevel(currentLevel, targetLevel, a, b) {
	return (a * currentLevel + b * targetLevel) / (a + b);
}

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('getServerSecurityLevel');
	ns.disableLog('getServerMinSecurityLevel');
	ns.disableLog('getServerMoneyAvailable');
	ns.disableLog('getServerMaxMoney');

	const decimalPlaces = 3;
	let a = 10;
	let b = 1;

	const targetHost = ns.getHostname();

	while (true) {
		const currentLevel = ns.getServerSecurityLevel(targetHost);
		const minLevel = ns.getServerMinSecurityLevel(targetHost);
		const targetSecurityLevel = computeTargetLevel(currentLevel, minLevel, a, b);
		const currentMoney = ns.getServerMoneyAvailable(targetHost);
		const maxMoney = ns.getServerMaxMoney(targetHost);
		const targetMoneyAmount = computeTargetLevel(currentMoney, maxMoney, a, b);

		ns.print(`a: ${a}, b: ${b}`);
		ns.print('Security\tcurrent: ' + currentLevel.toFixed(decimalPlaces)
			+ ', minimum: ' + minLevel.toFixed(decimalPlaces)
			+ ', target: ' + targetSecurityLevel.toFixed(decimalPlaces));
		ns.print('Money\tcurrent: ' + currentMoney.toFixed(decimalPlaces)
			+ ', maximum: ' + maxMoney.toFixed(decimalPlaces)
			+ ', target: ' + targetMoneyAmount.toFixed(decimalPlaces));

		for (let i = 0; i < 25; i++) {
			while (ns.getServerSecurityLevel(targetHost) > 1.05 * targetSecurityLevel) {
				ns.print('--> Security level: ' + ns.getServerSecurityLevel(targetHost).toFixed(decimalPlaces)
					+ ' > ' + targetSecurityLevel.toFixed(decimalPlaces));
				await ns.weaken(targetHost);
			}

			while (ns.getServerMoneyAvailable(targetHost) < 0.95 * targetMoneyAmount) {
				ns.print('--> Money: ' + ns.getServerMoneyAvailable(targetHost).toFixed(decimalPlaces)
					+ ' < ' + targetMoneyAmount.toFixed(decimalPlaces));
				await ns.grow(targetHost);
			}

			await ns.hack(targetHost);
		}

		if (a > 1) {
			a--;
		} else if (b < 100) {
			b++;
		}
	}
}
