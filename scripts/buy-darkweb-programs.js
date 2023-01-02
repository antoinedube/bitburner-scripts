/** @param {NS} ns */
export async function main(ns) {
	ns.print('Starting buy-darkweb-programs');
	
	while (!ns.singularity.purchaseTor()) {  // https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.singularity.purchasetor.md
		await ns.sleep(1000*30);
	}

	const programList = ns.singularity.getDarkwebPrograms(); // https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.singularity.getdarkwebprograms.md
	ns.print(`Program list: ${programList}`);
	/*
	for (let program of programList) {
		if (ns.fileExists(program, 'home')) {
			ns.print(`${program} exists on 'home'`);
			continue;
		}

		const availableMoney = ns.getServerMoneyAvailable('home');
		const programCost = ns.singularity.getDarkwebProgramCost(program);
		ns.print(`Available money: ${availableMoney}, cost of ${program}: ${programCost}`);
		if (programCost<=availableMoney) {
			ns.print(`Buying: ${program}`);
			ns.singularity.purchaseProgram(program);
		}
	}*/
}