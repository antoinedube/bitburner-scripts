/** @param {NS} ns */
async function buildNotOwnedAugmentationsList(ns, faction, ownedAugmentations) {
	const augmentations = ns.singularity.getAugmentationsFromFaction(faction);
	const notOwnedAugmentations = [];
	for (const augmentation of augmentations) {
		if (ownedAugmentations.includes(augmentation)) {
			continue;
		}

		notOwnedAugmentations.push(augmentation);
	}

	return notOwnedAugmentations;
}

/** @param {NS} ns */
async function getNextFaction(ns) {
	const factionsOfInterest = [
		'Netburners', 'CyberSec', 'NiteSec',
		'The Black Hand', 'BitRunners',
		'Sector-12', 'Slum Snakes', 'Volhaven', 'Chongqing',
		'The Covenant', 'Illuminati', 'Daedalus'];
	const ownedAugmentations = ns.singularity.getOwnedAugmentations(true);

	for (const faction of factionsOfInterest) {
		ns.print(`Trying to join ${faction}`);
		if (ns.gang.inGang() && ns.gang.getGangInformation()['faction'] == faction) {
			ns.print(`Skipping gang faction: ${faction}`);
			continue;
		}

		if (faction == 'Volhaven') {  // For 'combat rib II'
			while (ns.getServerMoneyAvailable('home') < 200000) {
				ns.print('Waiting for money for Volhaven');
				await ns.sleep(500);
			}
			ns.singularity.travelToCity('Volhaven');
		} else if (faction == 'Chongqing') { // For 'Neuregen Gene Modification'
			while (ns.getServerMoneyAvailable('home') < 200000) {
				ns.print('Waiting for money for Chongqing');
				await ns.sleep(500);
			}
			ns.singularity.travelToCity('Chongqing');
		}

		// For required skills other than hacking
		if (['The Covenant', 'Illuminati', 'Daedalus'].includes(faction)) {  // To increase combat stat
			ns.singularity.joinFaction('The Black Hand');
			ns.singularity.workForFaction('The Black Hand', 'field');
		} else if (['Slum Snakes'].includes(faction)) {  // To lower player karma
			ns.singularity.commitCrime("Mug");
		}

		while (!ns.singularity.checkFactionInvitations().includes(faction) && !ns.getPlayer().factions.includes(faction)) {
			// ns.print(`Faction invitations: ${ns.singularity.checkFactionInvitations()}`);
			await ns.sleep(30000);
		}

		const notOwnedAugmentations = await buildNotOwnedAugmentationsList(ns, faction, ownedAugmentations);
		ns.print(`Faction: ${faction}, num of not owned aug: ${notOwnedAugmentations.length}`);

		if (notOwnedAugmentations.length == 0) {
			continue;
		}

		return {
			'faction-name': faction,
			'available-augmentations': notOwnedAugmentations
		};
	}

	return 'NO-FACTION-LEFT';
}

/** @param {NS} ns */
async function getAugmentationWithHighestRequiredReputation(ns, nextFaction) {
	const augmentationHighestRequiredReputation = nextFaction['available-augmentations']
		.sort((a, b) => ns.singularity.getAugmentationRepReq(b) - ns.singularity.getAugmentationRepReq(a))
		.map(a => ns.singularity.getAugmentationRepReq(a))
	[0];

	// ns.print(`Augmentation with highest required reputation: ${augmentationHighestRequiredReputation}`);

	return augmentationHighestRequiredReputation;
}

/** @param {NS} ns */
async function waitForReputationLevel(ns, nextFaction) {
	ns.print(`Working for ${nextFaction['faction-name']}`);
	// ns.print(`--> ${await getAugmentationWithHighestRequiredReputation(ns, nextFaction)} > ${ns.singularity.getFactionRep(nextFaction['faction-name'])}`);
	while (await getAugmentationWithHighestRequiredReputation(ns, nextFaction) > ns.singularity.getFactionRep(nextFaction['faction-name'])) {
		ns.print(`Required reputation: ${ns.formatNumber(await getAugmentationWithHighestRequiredReputation(ns, nextFaction))}, current reputation: ${ns.formatNumber(ns.singularity.getFactionRep(nextFaction['faction-name']))}`);
		await ns.sleep(30000);
	}
}

/** @param {NS} ns */
async function waitForMoney(ns, augmentation) {
	ns.print(`Buying: ${augmentation}`);
	while (ns.singularity.getAugmentationPrice(augmentation) > ns.getServerMoneyAvailable('home')) {
		ns.print(`Augmentation price: ${ns.formatNumber(ns.singularity.getAugmentationPrice(augmentation))}\$, money available: ${ns.formatNumber(ns.getServerMoneyAvailable('home'))}\$`);
		await ns.sleep(30000);
	}
}

/** @param {NS} ns */
export async function main(ns) {
	ns.disableLog('ALL');

	const nextFaction = await getNextFaction(ns);

	if (nextFaction === 'NO-FACTION-LEFT') {
		ns.print('No faction left');

		await ns.sleep(5000);
		ns.singularity.travelToCity('Sector-12');
		ns.singularity.universityCourse('Rothman University', 'Algorithms');

		const worldDaemon = 'w0r1d_d43m0n';
		ns.print(`Waiting for root access on ${worldDaemon}`);
		while (!ns.hasRootAccess(worldDaemon)) {
			await ns.sleep(5000);
		}

		ns.print(`${worldDaemon} is root accessible`);
		ns.tprint(`${worldDaemon} is root accessible`);
		// ns.singularity.destroyW0r1dD43m0n(12, 'bootstrap.js');
		return;
	}

	ns.print(`Next faction: ${JSON.stringify(nextFaction, null, 4)}`);
	ns.singularity.joinFaction(nextFaction['faction-name']);

	if (['Sector-12', 'Slum Snakes'].includes(nextFaction['faction-name'])) {
		ns.singularity.workForFaction(nextFaction['faction-name'], 'field');
	} else {
		ns.singularity.workForFaction(nextFaction['faction-name'], 'hacking');
	}

	await waitForReputationLevel(ns, nextFaction);

	const augmentationsToBuy = nextFaction['available-augmentations'].sort((a, b) => b['price'] - a['price']);
	for (const augmentation of augmentationsToBuy) {
		await waitForMoney(ns, augmentation);
		ns.singularity.purchaseAugmentation(nextFaction['faction-name'], augmentation);
	}

	ns.singularity.installAugmentations('bootstrap.js');
}