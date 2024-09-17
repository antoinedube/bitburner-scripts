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
        'The Covenant', 'Illuminati', 'Daedalus'
    ];
    const ownedAugmentations = ns.singularity.getOwnedAugmentations(true);
    for (const faction of factionsOfInterest) {
        ns.print(`Trying to join ${faction}`);
        if (ns.gang.inGang() && ns.gang.getGangInformation()['faction'] == faction) {
            ns.print(`Skipping gang faction: ${faction}`);
            continue;
        }
        if (faction == 'Volhaven') { // For 'combat rib II'
            while (ns.getServerMoneyAvailable('home') < 200000) {
                ns.print('Waiting for money for Volhaven');
                await ns.sleep(500);
            }
            ns.singularity.travelToCity('Volhaven');
        }
        else if (faction == 'Chongqing') { // For 'Neuregen Gene Modification'
            while (ns.getServerMoneyAvailable('home') < 200000) {
                ns.print('Waiting for money for Chongqing');
                await ns.sleep(500);
            }
            ns.singularity.travelToCity('Chongqing');
        }
        // For required skills other than hacking
        if (['The Covenant', 'Illuminati', 'Daedalus'].includes(faction)) { // To increase combat stat
            ns.singularity.joinFaction('The Black Hand');
            ns.singularity.workForFaction('The Black Hand', 'field');
        }
        else if (['Slum Snakes'].includes(faction)) { // To lower player karma
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
        .map(a => ns.singularity.getAugmentationRepReq(a))[0];
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
    }
    else {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlLWZhY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc2NyaXB0cy9tYW5hZ2UtZmFjdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUJBQXFCO0FBQ3JCLEtBQUssVUFBVSw4QkFBOEIsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLGtCQUFrQjtJQUM1RSxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLDJCQUEyQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFFLE1BQU0scUJBQXFCLEdBQUcsRUFBRSxDQUFDO0lBQ2pDLEtBQUssTUFBTSxZQUFZLElBQUksYUFBYSxFQUFFO1FBQ3pDLElBQUksa0JBQWtCLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQzlDLFNBQVM7U0FDVDtRQUVELHFCQUFxQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUN6QztJQUVELE9BQU8scUJBQXFCLENBQUM7QUFDOUIsQ0FBQztBQUVELHFCQUFxQjtBQUNyQixLQUFLLFVBQVUsY0FBYyxDQUFDLEVBQUU7SUFDL0IsTUFBTSxrQkFBa0IsR0FBRztRQUMxQixZQUFZLEVBQUUsVUFBVSxFQUFFLFNBQVM7UUFDbkMsZ0JBQWdCLEVBQUUsWUFBWTtRQUM5QixXQUFXLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxXQUFXO1FBQ25ELGNBQWMsRUFBRSxZQUFZLEVBQUUsVUFBVTtLQUFDLENBQUM7SUFDM0MsTUFBTSxrQkFBa0IsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXRFLEtBQUssTUFBTSxPQUFPLElBQUksa0JBQWtCLEVBQUU7UUFDekMsRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FB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QUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xFLEVBQUUsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBRXhELElBQUksQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxFQUFFO1FBQ3ZFLEVBQUUsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNwRTtTQUFNO1FBQ04sRUFBRSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ3RFO0lBRUQsTUFBTSxzQkFBc0IsQ0FBQyxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFOUMsTUFBTSxrQkFBa0IsR0FBRyxXQUFXLENBQUMseUJBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDMUcsS0FBSyxNQUFNLFlBQVksSUFBSSxrQkFBa0IsRUFBRTtRQUM5QyxNQUFNLFlBQVksQ0FBQyxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDckMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7S0FDL0U7SUFFRCxFQUFFLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3JELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQHBhcmFtIHtOU30gbnMgKi9cbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkTm90T3duZWRBdWdtZW50YXRpb25zTGlzdChucywgZmFjdGlvbiwgb3duZWRBdWdtZW50YXRpb25zKSB7XG5cdGNvbnN0IGF1Z21lbnRhdGlvbnMgPSBucy5zaW5ndWxhcml0eS5nZXRBdWdtZW50YXRpb25zRnJvbUZhY3Rpb24oZmFjdGlvbik7XG5cdGNvbnN0IG5vdE93bmVkQXVnbWVudGF0aW9ucyA9IFtdO1xuXHRmb3IgKGNvbnN0IGF1Z21lbnRhdGlvbiBvZiBhdWdtZW50YXRpb25zKSB7XG5cdFx0aWYgKG93bmVkQXVnbWVudGF0aW9ucy5pbmNsdWRlcyhhdWdtZW50YXRpb24pKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRub3RPd25lZEF1Z21lbnRhdGlvbnMucHVzaChhdWdtZW50YXRpb24pO1xuXHR9XG5cblx0cmV0dXJuIG5vdE93bmVkQXVnbWVudGF0aW9ucztcbn1cblxuLyoqIEBwYXJhbSB7TlN9IG5zICovXG5hc3luYyBmdW5jdGlvbiBnZXROZXh0RmFjdGlvbihucykge1xuXHRjb25zdCBmYWN0aW9uc09mSW50ZXJlc3QgPSBbXG5cdFx0J05ldGJ1cm5lcnMnLCAnQ3liZXJTZWMnLCAnTml0ZVNlYycsXG5cdFx0J1RoZSBCbGFjayBIYW5kJywgJ0JpdFJ1bm5lcnMnLFxuXHRcdCdTZWN0b3ItMTInLCAnU2x1bSBTbmFrZXMnLCAnVm9saGF2ZW4nLCAnQ2hvbmdxaW5nJyxcblx0XHQnVGhlIENvdmVuYW50JywgJ0lsbHVtaW5hdGknLCAnRGFlZGFsdXMnXTtcblx0Y29uc3Qgb3duZWRBdWdtZW50YXRpb25zID0gbnMuc2luZ3VsYXJpdHkuZ2V0T3duZWRBdWdtZW50YXRpb25zKHRydWUpO1xuXG5cdGZvciAoY29uc3QgZmFjdGlvbiBvZiBmYWN0aW9uc09mSW50ZXJlc3QpIHtcblx0XHRucy5wcmludChgVHJ5aW5nIHRvIGpvaW4gJHtmYWN0aW9ufWApO1xuXHRcdGlmIChucy5nYW5nLmluR2FuZygpICYmIG5zLmdhbmcuZ2V0R2FuZ0luZm9ybWF0aW9uKClbJ2ZhY3Rpb24nXSA9PSBmYWN0aW9uKSB7XG5cdFx0XHRucy5wcmludChgU2tpcHBpbmcgZ2FuZyBmYWN0aW9uOiAke2ZhY3Rpb259YCk7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRpZiAoZmFjdGlvbiA9PSAnVm9saGF2ZW4nKSB7ICAvLyBGb3IgJ2NvbWJhdCByaWIgSUknXG5cdFx0XHR3aGlsZSAobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoJ2hvbWUnKSA8IDIwMDAwMCkge1xuXHRcdFx0XHRucy5wcmludCgnV2FpdGluZyBmb3IgbW9uZXkgZm9yIFZvbGhhdmVuJyk7XG5cdFx0XHRcdGF3YWl0IG5zLnNsZWVwKDUwMCk7XG5cdFx0XHR9XG5cdFx0XHRucy5zaW5ndWxhcml0eS50cmF2ZWxUb0NpdHkoJ1ZvbGhhdmVuJyk7XG5cdFx0fSBlbHNlIGlmIChmYWN0aW9uID09ICdDaG9uZ3FpbmcnKSB7IC8vIEZvciAnTmV1cmVnZW4gR2VuZSBNb2RpZmljYXRpb24nXG5cdFx0XHR3aGlsZSAobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoJ2hvbWUnKSA8IDIwMDAwMCkge1xuXHRcdFx0XHRucy5wcmludCgnV2FpdGluZyBmb3IgbW9uZXkgZm9yIENob25ncWluZycpO1xuXHRcdFx0XHRhd2FpdCBucy5zbGVlcCg1MDApO1xuXHRcdFx0fVxuXHRcdFx0bnMuc2luZ3VsYXJpdHkudHJhdmVsVG9DaXR5KCdDaG9uZ3FpbmcnKTtcblx0XHR9XG5cblx0XHQvLyBGb3IgcmVxdWlyZWQgc2tpbGxzIG90aGVyIHRoYW4gaGFja2luZ1xuXHRcdGlmIChbJ1RoZSBDb3ZlbmFudCcsICdJbGx1bWluYXRpJywgJ0RhZWRhbHVzJ10uaW5jbHVkZXMoZmFjdGlvbikpIHsgIC8vIFRvIGluY3JlYXNlIGNvbWJhdCBzdGF0XG5cdFx0XHRucy5zaW5ndWxhcml0eS5qb2luRmFjdGlvbignVGhlIEJsYWNrIEhhbmQnKTtcblx0XHRcdG5zLnNpbmd1bGFyaXR5LndvcmtGb3JGYWN0aW9uKCdUaGUgQmxhY2sgSGFuZCcsICdmaWVsZCcpO1xuXHRcdH0gZWxzZSBpZiAoWydTbHVtIFNuYWtlcyddLmluY2x1ZGVzKGZhY3Rpb24pKSB7ICAvLyBUbyBsb3dlciBwbGF5ZXIga2FybWFcblx0XHRcdG5zLnNpbmd1bGFyaXR5LmNvbW1pdENyaW1lKFwiTXVnXCIpO1xuXHRcdH1cblxuXHRcdHdoaWxlICghbnMuc2luZ3VsYXJpdHkuY2hlY2tGYWN0aW9uSW52aXRhdGlvbnMoKS5pbmNsdWRlcyhmYWN0aW9uKSAmJiAhbnMuZ2V0UGxheWVyKCkuZmFjdGlvbnMuaW5jbHVkZXMoZmFjdGlvbikpIHtcblx0XHRcdC8vIG5zLnByaW50KGBGYWN0aW9uIGludml0YXRpb25zOiAke25zLnNpbmd1bGFyaXR5LmNoZWNrRmFjdGlvbkludml0YXRpb25zKCl9YCk7XG5cdFx0XHRhd2FpdCBucy5zbGVlcCgzMDAwMCk7XG5cdFx0fVxuXG5cdFx0Y29uc3Qgbm90T3duZWRBdWdtZW50YXRpb25zID0gYXdhaXQgYnVpbGROb3RPd25lZEF1Z21lbnRhdGlvbnNMaXN0KG5zLCBmYWN0aW9uLCBvd25lZEF1Z21lbnRhdGlvbnMpO1xuXHRcdG5zLnByaW50KGBGYWN0aW9uOiAke2ZhY3Rpb259LCBudW0gb2Ygbm90IG93bmVkIGF1ZzogJHtub3RPd25lZEF1Z21lbnRhdGlvbnMubGVuZ3RofWApO1xuXG5cdFx0aWYgKG5vdE93bmVkQXVnbWVudGF0aW9ucy5sZW5ndGggPT0gMCkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdCdmYWN0aW9uLW5hbWUnOiBmYWN0aW9uLFxuXHRcdFx0J2F2YWlsYWJsZS1hdWdtZW50YXRpb25zJzogbm90T3duZWRBdWdtZW50YXRpb25zXG5cdFx0fTtcblx0fVxuXG5cdHJldHVybiAnTk8tRkFDVElPTi1MRUZUJztcbn1cblxuLyoqIEBwYXJhbSB7TlN9IG5zICovXG5hc3luYyBmdW5jdGlvbiBnZXRBdWdtZW50YXRpb25XaXRoSGlnaGVzdFJlcXVpcmVkUmVwdXRhdGlvbihucywgbmV4dEZhY3Rpb24pIHtcblx0Y29uc3QgYXVnbWVudGF0aW9uSGlnaGVzdFJlcXVpcmVkUmVwdXRhdGlvbiA9IG5leHRGYWN0aW9uWydhdmFpbGFibGUtYXVnbWVudGF0aW9ucyddXG5cdFx0LnNvcnQoKGEsIGIpID0+IG5zLnNpbmd1bGFyaXR5LmdldEF1Z21lbnRhdGlvblJlcFJlcShiKSAtIG5zLnNpbmd1bGFyaXR5LmdldEF1Z21lbnRhdGlvblJlcFJlcShhKSlcblx0XHQubWFwKGEgPT4gbnMuc2luZ3VsYXJpdHkuZ2V0QXVnbWVudGF0aW9uUmVwUmVxKGEpKVxuXHRbMF07XG5cblx0Ly8gbnMucHJpbnQoYEF1Z21lbnRhdGlvbiB3aXRoIGhpZ2hlc3QgcmVxdWlyZWQgcmVwdXRhdGlvbjogJHthdWdtZW50YXRpb25IaWdoZXN0UmVxdWlyZWRSZXB1dGF0aW9ufWApO1xuXG5cdHJldHVybiBhdWdtZW50YXRpb25IaWdoZXN0UmVxdWlyZWRSZXB1dGF0aW9uO1xufVxuXG4vKiogQHBhcmFtIHtOU30gbnMgKi9cbmFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JSZXB1dGF0aW9uTGV2ZWwobnMsIG5leHRGYWN0aW9uKSB7XG5cdG5zLnByaW50KGBXb3JraW5nIGZvciAke25leHRGYWN0aW9uWydmYWN0aW9uLW5hbWUnXX1gKTtcblx0Ly8gbnMucHJpbnQoYC0tPiAke2F3YWl0IGdldEF1Z21lbnRhdGlvbldpdGhIaWdoZXN0UmVxdWlyZWRSZXB1dGF0aW9uKG5zLCBuZXh0RmFjdGlvbil9ID4gJHtucy5zaW5ndWxhcml0eS5nZXRGYWN0aW9uUmVwKG5leHRGYWN0aW9uWydmYWN0aW9uLW5hbWUnXSl9YCk7XG5cdHdoaWxlIChhd2FpdCBnZXRBdWdtZW50YXRpb25XaXRoSGlnaGVzdFJlcXVpcmVkUmVwdXRhdGlvbihucywgbmV4dEZhY3Rpb24pID4gbnMuc2luZ3VsYXJpdHkuZ2V0RmFjdGlvblJlcChuZXh0RmFjdGlvblsnZmFjdGlvbi1uYW1lJ10pKSB7XG5cdFx0bnMucHJpbnQoYFJlcXVpcmVkIHJlcHV0YXRpb246ICR7bnMuZm9ybWF0TnVtYmVyKGF3YWl0IGdldEF1Z21lbnRhdGlvbldpdGhIaWdoZXN0UmVxdWlyZWRSZXB1dGF0aW9uKG5zLCBuZXh0RmFjdGlvbikpfSwgY3VycmVudCByZXB1dGF0aW9uOiAke25zLmZvcm1hdE51bWJlcihucy5zaW5ndWxhcml0eS5nZXRGYWN0aW9uUmVwKG5leHRGYWN0aW9uWydmYWN0aW9uLW5hbWUnXSkpfWApO1xuXHRcdGF3YWl0IG5zLnNsZWVwKDMwMDAwKTtcblx0fVxufVxuXG4vKiogQHBhcmFtIHtOU30gbnMgKi9cbmFzeW5jIGZ1bmN0aW9uIHdhaXRGb3JNb25leShucywgYXVnbWVudGF0aW9uKSB7XG5cdG5zLnByaW50KGBCdXlpbmc6ICR7YXVnbWVudGF0aW9ufWApO1xuXHR3aGlsZSAobnMuc2luZ3VsYXJpdHkuZ2V0QXVnbWVudGF0aW9uUHJpY2UoYXVnbWVudGF0aW9uKSA+IG5zLmdldFNlcnZlck1vbmV5QXZhaWxhYmxlKCdob21lJykpIHtcblx0XHRucy5wcmludChgQXVnbWVudGF0aW9uIHByaWNlOiAke25zLmZvcm1hdE51bWJlcihucy5zaW5ndWxhcml0eS5nZXRBdWdtZW50YXRpb25QcmljZShhdWdtZW50YXRpb24pKX1cXCQsIG1vbmV5IGF2YWlsYWJsZTogJHtucy5mb3JtYXROdW1iZXIobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoJ2hvbWUnKSl9XFwkYCk7XG5cdFx0YXdhaXQgbnMuc2xlZXAoMzAwMDApO1xuXHR9XG59XG5cbi8qKiBAcGFyYW0ge05TfSBucyAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnMpIHtcblx0bnMuZGlzYWJsZUxvZygnQUxMJyk7XG5cblx0Y29uc3QgbmV4dEZhY3Rpb24gPSBhd2FpdCBnZXROZXh0RmFjdGlvbihucyk7XG5cblx0aWYgKG5leHRGYWN0aW9uID09PSAnTk8tRkFDVElPTi1MRUZUJykge1xuXHRcdG5zLnByaW50KCdObyBmYWN0aW9uIGxlZnQnKTtcblxuXHRcdGF3YWl0IG5zLnNsZWVwKDUwMDApO1xuXHRcdG5zLnNpbmd1bGFyaXR5LnRyYXZlbFRvQ2l0eSgnU2VjdG9yLTEyJyk7XG5cdFx0bnMuc2luZ3VsYXJpdHkudW5pdmVyc2l0eUNvdXJzZSgnUm90aG1hbiBVbml2ZXJzaXR5JywgJ0FsZ29yaXRobXMnKTtcblxuXHRcdGNvbnN0IHdvcmxkRGFlbW9uID0gJ3cwcjFkX2Q0M20wbic7XG5cdFx0bnMucHJpbnQoYFdhaXRpbmcgZm9yIHJvb3QgYWNjZXNzIG9uICR7d29ybGREYWVtb259YCk7XG5cdFx0d2hpbGUgKCFucy5oYXNSb290QWNjZXNzKHdvcmxkRGFlbW9uKSkge1xuXHRcdFx0YXdhaXQgbnMuc2xlZXAoNTAwMCk7XG5cdFx0fVxuXG5cdFx0bnMucHJpbnQoYCR7d29ybGREYWVtb259IGlzIHJvb3QgYWNjZXNzaWJsZWApO1xuXHRcdG5zLnRwcmludChgJHt3b3JsZERhZW1vbn0gaXMgcm9vdCBhY2Nlc3NpYmxlYCk7XG5cdFx0Ly8gbnMuc2luZ3VsYXJpdHkuZGVzdHJveVcwcjFkRDQzbTBuKDEyLCAnYm9vdHN0cmFwLmpzJyk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bnMucHJpbnQoYE5leHQgZmFjdGlvbjogJHtKU09OLnN0cmluZ2lmeShuZXh0RmFjdGlvbiwgbnVsbCwgNCl9YCk7XG5cdG5zLnNpbmd1bGFyaXR5LmpvaW5GYWN0aW9uKG5leHRGYWN0aW9uWydmYWN0aW9uLW5hbWUnXSk7XG5cblx0aWYgKFsnU2VjdG9yLTEyJywgJ1NsdW0gU25ha2VzJ10uaW5jbHVkZXMobmV4dEZhY3Rpb25bJ2ZhY3Rpb24tbmFtZSddKSkge1xuXHRcdG5zLnNpbmd1bGFyaXR5LndvcmtGb3JGYWN0aW9uKG5leHRGYWN0aW9uWydmYWN0aW9uLW5hbWUnXSwgJ2ZpZWxkJyk7XG5cdH0gZWxzZSB7XG5cdFx0bnMuc2luZ3VsYXJpdHkud29ya0ZvckZhY3Rpb24obmV4dEZhY3Rpb25bJ2ZhY3Rpb24tbmFtZSddLCAnaGFja2luZycpO1xuXHR9XG5cblx0YXdhaXQgd2FpdEZvclJlcHV0YXRpb25MZXZlbChucywgbmV4dEZhY3Rpb24pO1xuXG5cdGNvbnN0IGF1Z21lbnRhdGlvbnNUb0J1eSA9IG5leHRGYWN0aW9uWydhdmFpbGFibGUtYXVnbWVudGF0aW9ucyddLnNvcnQoKGEsIGIpID0+IGJbJ3ByaWNlJ10gLSBhWydwcmljZSddKTtcblx0Zm9yIChjb25zdCBhdWdtZW50YXRpb24gb2YgYXVnbWVudGF0aW9uc1RvQnV5KSB7XG5cdFx0YXdhaXQgd2FpdEZvck1vbmV5KG5zLCBhdWdtZW50YXRpb24pO1xuXHRcdG5zLnNpbmd1bGFyaXR5LnB1cmNoYXNlQXVnbWVudGF0aW9uKG5leHRGYWN0aW9uWydmYWN0aW9uLW5hbWUnXSwgYXVnbWVudGF0aW9uKTtcblx0fVxuXG5cdG5zLnNpbmd1bGFyaXR5Lmluc3RhbGxBdWdtZW50YXRpb25zKCdib290c3RyYXAuanMnKTtcbn0iXX0=