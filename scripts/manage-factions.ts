import { NS } from '@ns';

interface augmentation {
    name: string,
    price: number
}

async function buildNotOwnedAugmentationsList(ns: NS, faction: string, ownedAugmentations: string[]): Promise<string[]> {
    const augmentations: string[] = ns.singularity.getAugmentationsFromFaction(faction);
    const notOwnedAugmentations: string[] = [];
    for (const augmentation of augmentations) {
        if (ownedAugmentations.includes(augmentation)) {
            continue;
        }

        notOwnedAugmentations.push(augmentation);
    }

    return notOwnedAugmentations;
}

async function getNextFaction(ns: NS): Promise<string> {
    const factionsOfInterest: string[] = [
        'Netburners', 'CyberSec', 'NiteSec', 'The Black Hand', 'BitRunners',
        'Sector-12', 'Slum Snakes', 'Volhaven', 'Chongqing',
        'The Covenant', 'Illuminati', 'Daedalus'];
    const ownedAugmentations = ns.singularity.getOwnedAugmentations(true);

    for (const faction of factionsOfInterest) {
        ns.print(`Trying to join ${faction}`);
        if (ns.gang.inGang()) {
            const gangInformation = ns.gang.getGangInformation();
            if (gangInformation['faction'] == faction) {
                ns.print(`Skipping gang faction: ${faction}`);
                continue;
            }
        }

        if (faction== 'Volhaven') {  // For 'combat rib II'
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
            await ns.sleep(5000);
        }

        const notOwnedAugmentations = await buildNotOwnedAugmentationsList(ns, faction, ownedAugmentations);
        ns.print(`Faction: ${faction}, num of not owned aug: ${notOwnedAugmentations.length}`);

        if (notOwnedAugmentations.length == 0) {
            continue;
        }

        return faction;
    }

    return 'NO-FACTION-LEFT';
}

async function waitForReputation(ns: NS, faction: string, augmentation: string): Promise<void> {
    while (ns.singularity.getAugmentationRepReq(augmentation) > ns.singularity.getFactionRep(faction)) {
        ns.print(`Augmentation reputation: ${ns.formatNumber(ns.singularity.getAugmentationRepReq(augmentation))}, current reputation: ${ns.formatNumber(ns.singularity.getFactionRep(faction))}`);
        await ns.sleep(5000);
    }
}

async function waitForMoney(ns: NS, augmentation: string): Promise<void> {
    while (ns.singularity.getAugmentationPrice(augmentation) > ns.getServerMoneyAvailable('home')) {
        ns.print(`Augmentation price: ${ns.formatNumber(ns.singularity.getAugmentationPrice(augmentation))}\$, money available: ${ns.formatNumber(ns.getServerMoneyAvailable('home'))}\$`);
        await ns.sleep(5000);
    }
}

async function purchaseAugmentations(ns: NS, faction: string): Promise<void> {
    while (true) {
        const ownedAugmentations = ns.singularity.getOwnedAugmentations(true);
        const notOwnedAugmentations = await buildNotOwnedAugmentationsList(ns, faction, ownedAugmentations);
        if (notOwnedAugmentations.length==0) {
            break;
        }

        const augmentationPriceList = notOwnedAugmentations.map((a: string) => {
            const price = ns.singularity.getAugmentationPrice(a);
            const augmentation: augmentation = {
                name: a,
                price: price
            };

            ns.print(`Augmentation: ${a} has price of ${ns.formatNumber(price)}\$`);

            return augmentation;
        });

        const availableAugmentations = augmentationPriceList.filter((a: augmentation) => {
            const preRequisites = ns.singularity.getAugmentationPrereq(a.name);
            const hasNoPrerequisites = preRequisites.length==0;
            const allPrerequisitesAreOwned = preRequisites.every((b: string) => ownedAugmentations.some((c: string) => b==c));

            if (hasNoPrerequisites || allPrerequisitesAreOwned) {
                return true;
            }

            return false;
        });

        const sortedAugmentations = availableAugmentations.sort((a: augmentation, b: augmentation) => b.price - a.price);
        const mostExpensiveAugmentation: augmentation = sortedAugmentations[0];

        ns.print(`Most expensive augmentation is ${mostExpensiveAugmentation.name} with a price of ${ns.formatNumber(mostExpensiveAugmentation.price)}\$`);
        await waitForReputation(ns, faction, mostExpensiveAugmentation.name);
        await waitForMoney(ns, mostExpensiveAugmentation.name);
        ns.singularity.purchaseAugmentation(faction, mostExpensiveAugmentation.name);

        await ns.sleep(1000);
    }
}

async function joinAndWorkForFaction(ns: NS, faction: string): Promise<void> {
    ns.print(`Next faction: ${JSON.stringify(faction, null, 4)}`);
    ns.singularity.joinFaction(faction);

    if (['Sector-12', 'Slum Snakes'].includes(faction)) {
        ns.singularity.workForFaction(faction, 'field');
    } else {
        ns.singularity.workForFaction(faction, 'hacking');
    }
}

async function waitAndDestroyWorldDaemon(ns: NS): Promise<void> {
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
    ns.singularity.destroyW0r1dD43m0n(12, 'bootstrap.js');
}

export async function main(ns: NS): Promise<void> {
    ns.disableLog('ALL');

    const nextFaction = await getNextFaction(ns);

    if (nextFaction === 'NO-FACTION-LEFT') {
        await waitAndDestroyWorldDaemon(ns);
    }

    await joinAndWorkForFaction(ns, nextFaction);

    await purchaseAugmentations(ns, nextFaction);

    ns.singularity.installAugmentations('bootstrap.js');
}

