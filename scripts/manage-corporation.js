/** @param {NS} ns */
export async function main(ns) {
	// Ref: https://github.com/danielyxie/bitburner/blob/dev/markdown/bitburner.corporation.md
	if (ns.corporation.hasCorporation()) {
		ns.tprint('Player has corporation');
	} else {
		ns.tprint('Player does not have corporation');
	}

	const corporation = ns.corporation.getCorporation();
	ns.tprint(`Corporation data:\n${corporation}`);
}