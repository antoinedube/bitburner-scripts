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
async function getNextFaction(ns) {
    const factionsOfInterest = [
        'Netburners', 'CyberSec', 'NiteSec', 'The Black Hand', 'BitRunners',
        'Sector-12', 'Slum Snakes', 'Volhaven', 'Chongqing',
        'The Covenant', 'Illuminati', 'Daedalus'
    ];
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
async function waitForReputation(ns, faction, augmentation) {
    while (ns.singularity.getAugmentationRepReq(augmentation) > ns.singularity.getFactionRep(faction)) {
        ns.print(`Augmentation reputation: ${ns.formatNumber(ns.singularity.getAugmentationRepReq(augmentation))}, current reputation: ${ns.formatNumber(ns.singularity.getFactionRep(faction))}`);
        await ns.sleep(5000);
    }
}
async function waitForMoney(ns, augmentation) {
    while (ns.singularity.getAugmentationPrice(augmentation) > ns.getServerMoneyAvailable('home')) {
        ns.print(`Augmentation price: ${ns.formatNumber(ns.singularity.getAugmentationPrice(augmentation))}\$, money available: ${ns.formatNumber(ns.getServerMoneyAvailable('home'))}\$`);
        await ns.sleep(5000);
    }
}
async function purchaseAugmentations(ns, faction) {
    while (true) {
        const ownedAugmentations = ns.singularity.getOwnedAugmentations(true);
        const notOwnedAugmentations = await buildNotOwnedAugmentationsList(ns, faction, ownedAugmentations);
        if (notOwnedAugmentations.length == 0) {
            break;
        }
        const augmentationPriceList = notOwnedAugmentations.map((a) => {
            const price = ns.singularity.getAugmentationPrice(a);
            const augmentation = {
                name: a,
                price: price
            };
            ns.print(`Augmentation: ${a} has price of ${ns.formatNumber(price)}\$`);
            return augmentation;
        });
        const availableAugmentations = augmentationPriceList.filter((a) => {
            const preRequisites = ns.singularity.getAugmentationPrereq(a.name);
            const hasNoPrerequisites = preRequisites.length == 0;
            const allPrerequisitesAreOwned = preRequisites.every((b) => ownedAugmentations.some((c) => b == c));
            if (hasNoPrerequisites || allPrerequisitesAreOwned) {
                return true;
            }
            return false;
        });
        const sortedAugmentations = availableAugmentations.sort((a, b) => b.price - a.price);
        const mostExpensiveAugmentation = sortedAugmentations[0];
        ns.print(`Most expensive augmentation is ${mostExpensiveAugmentation.name} with a price of ${ns.formatNumber(mostExpensiveAugmentation.price)}\$`);
        await waitForReputation(ns, faction, mostExpensiveAugmentation.name);
        await waitForMoney(ns, mostExpensiveAugmentation.name);
        ns.singularity.purchaseAugmentation(faction, mostExpensiveAugmentation.name);
        await ns.sleep(1000);
    }
}
async function joinAndWorkForFaction(ns, faction) {
    ns.print(`Next faction: ${JSON.stringify(faction, null, 4)}`);
    ns.singularity.joinFaction(faction);
    if (['Sector-12', 'Slum Snakes'].includes(faction)) {
        ns.singularity.workForFaction(faction, 'field');
    }
    else {
        ns.singularity.workForFaction(faction, 'hacking');
    }
}
async function waitAndDestroyWorldDaemon(ns) {
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
export async function main(ns) {
    ns.disableLog('ALL');
    const nextFaction = await getNextFaction(ns);
    if (nextFaction === 'NO-FACTION-LEFT') {
        await waitAndDestroyWorldDaemon(ns);
    }
    await joinAndWorkForFaction(ns, nextFaction);
    await purchaseAugmentations(ns, nextFaction);
    ns.singularity.installAugmentations('bootstrap.js');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlLWZhY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc2NyaXB0cy9tYW5hZ2UtZmFjdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsS0FBSyxVQUFVLDhCQUE4QixDQUFDLEVBQU0sRUFBRSxPQUFlLEVBQUUsa0JBQTRCO0lBQy9GLE1BQU0sYUFBYSxHQUFhLEVBQUUsQ0FBQyxXQUFXLENBQUMsMkJBQTJCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEYsTUFBTSxxQkFBcUIsR0FBYSxFQUFFLENBQUM7SUFDM0MsS0FBSyxNQUFNLFlBQVksSUFBSSxhQUFhLEVBQUU7UUFDdEMsSUFBSSxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDM0MsU0FBUztTQUNaO1FBRUQscUJBQXFCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQzVDO0lBRUQsT0FBTyxxQkFBcUIsQ0FBQztBQUNqQyxDQUFDO0FBRUQsS0FBSyxVQUFVLGNBQWMsQ0FBQyxFQUFNO0lBQ2hDLE1BQU0sa0JBQWtCLEdBQWE7UUFDakMsWUFBWSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWTtRQUNuRSxXQUFXLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxXQUFXO1FBQ25ELGNBQWMsRUFBRSxZQUFZLEVBQUUsVUFBVTtLQUFDLENBQUM7SUFDOUMsTUFBTSxrQkFBa0IsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXRFLEtBQUssTUFBTSxPQUFPLElBQUksa0JBQWtCLEVBQUU7UUFDdEMsRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUN0QyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDbEIsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFB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QWMsQ0FBQztJQUNuQyxFQUFFLENBQUMsS0FBSyxDQUFDLDhCQUE4QixXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQ25DLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4QjtJQUVELEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxXQUFXLHFCQUFxQixDQUFDLENBQUM7SUFDOUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFdBQVcscUJBQXFCLENBQUMsQ0FBQztJQUMvQyxFQUFFLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRUQsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBTTtJQUM3QixFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXJCLE1BQU0sV0FBVyxHQUFHLE1BQU0sY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRTdDLElBQUksV0FBVyxLQUFLLGlCQUFpQixFQUFFO1FBQ25DLE1BQU0seUJBQXlCLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDdkM7SUFFRCxNQUFNLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUU3QyxNQUFNLHFCQUFxQixDQUFDLEVBQUUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUU3QyxFQUFFLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3hELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOUyB9IGZyb20gJ0Bucyc7XG5cbmludGVyZmFjZSBhdWdtZW50YXRpb24ge1xuICAgIG5hbWU6IHN0cmluZyxcbiAgICBwcmljZTogbnVtYmVyXG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJ1aWxkTm90T3duZWRBdWdtZW50YXRpb25zTGlzdChuczogTlMsIGZhY3Rpb246IHN0cmluZywgb3duZWRBdWdtZW50YXRpb25zOiBzdHJpbmdbXSk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCBhdWdtZW50YXRpb25zOiBzdHJpbmdbXSA9IG5zLnNpbmd1bGFyaXR5LmdldEF1Z21lbnRhdGlvbnNGcm9tRmFjdGlvbihmYWN0aW9uKTtcbiAgICBjb25zdCBub3RPd25lZEF1Z21lbnRhdGlvbnM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChjb25zdCBhdWdtZW50YXRpb24gb2YgYXVnbWVudGF0aW9ucykge1xuICAgICAgICBpZiAob3duZWRBdWdtZW50YXRpb25zLmluY2x1ZGVzKGF1Z21lbnRhdGlvbikpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbm90T3duZWRBdWdtZW50YXRpb25zLnB1c2goYXVnbWVudGF0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbm90T3duZWRBdWdtZW50YXRpb25zO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXROZXh0RmFjdGlvbihuczogTlMpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGZhY3Rpb25zT2ZJbnRlcmVzdDogc3RyaW5nW10gPSBbXG4gICAgICAgICdOZXRidXJuZXJzJywgJ0N5YmVyU2VjJywgJ05pdGVTZWMnLCAnVGhlIEJsYWNrIEhhbmQnLCAnQml0UnVubmVycycsXG4gICAgICAgICdTZWN0b3ItMTInLCAnU2x1bSBTbmFrZXMnLCAnVm9saGF2ZW4nLCAnQ2hvbmdxaW5nJyxcbiAgICAgICAgJ1RoZSBDb3ZlbmFudCcsICdJbGx1bWluYXRpJywgJ0RhZWRhbHVzJ107XG4gICAgY29uc3Qgb3duZWRBdWdtZW50YXRpb25zID0gbnMuc2luZ3VsYXJpdHkuZ2V0T3duZWRBdWdtZW50YXRpb25zKHRydWUpO1xuXG4gICAgZm9yIChjb25zdCBmYWN0aW9uIG9mIGZhY3Rpb25zT2ZJbnRlcmVzdCkge1xuICAgICAgICBucy5wcmludChgVHJ5aW5nIHRvIGpvaW4gJHtmYWN0aW9ufWApO1xuICAgICAgICBpZiAobnMuZ2FuZy5pbkdhbmcoKSkge1xuICAgICAgICAgICAgY29uc3QgZ2FuZ0luZm9ybWF0aW9uID0gbnMuZ2FuZy5nZXRHYW5nSW5mb3JtYXRpb24oKTtcbiAgICAgICAgICAgIGlmIChnYW5nSW5mb3JtYXRpb25bJ2ZhY3Rpb24nXSA9PSBmYWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgbnMucHJpbnQoYFNraXBwaW5nIGdhbmcgZmFjdGlvbjogJHtmYWN0aW9ufWApO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZhY3Rpb249PSAnVm9saGF2ZW4nKSB7ICAvLyBGb3IgJ2NvbWJhdCByaWIgSUknXG4gICAgICAgICAgICB3aGlsZSAobnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoJ2hvbWUnKSA8IDIwMDAwMCkge1xuICAgICAgICAgICAgICAgIG5zLnByaW50KCdXYWl0aW5nIGZvciBtb25leSBmb3IgVm9saGF2ZW4nKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBucy5zbGVlcCg1MDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbnMuc2luZ3VsYXJpdHkudHJhdmVsVG9DaXR5KCdWb2xoYXZlbicpO1xuICAgICAgICB9IGVsc2UgaWYgKGZhY3Rpb24gPT0gJ0Nob25ncWluZycpIHsgLy8gRm9yICdOZXVyZWdlbiBHZW5lIE1vZGlmaWNhdGlvbidcbiAgICAgICAgICAgIHdoaWxlIChucy5nZXRTZXJ2ZXJNb25leUF2YWlsYWJsZSgnaG9tZScpIDwgMjAwMDAwKSB7XG4gICAgICAgICAgICAgICAgbnMucHJpbnQoJ1dhaXRpbmcgZm9yIG1vbmV5IGZvciBDaG9uZ3FpbmcnKTtcbiAgICAgICAgICAgICAgICBhd2FpdCBucy5zbGVlcCg1MDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbnMuc2luZ3VsYXJpdHkudHJhdmVsVG9DaXR5KCdDaG9uZ3FpbmcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZvciByZXF1aXJlZCBza2lsbHMgb3RoZXIgdGhhbiBoYWNraW5nXG4gICAgICAgIGlmIChbJ1RoZSBDb3ZlbmFudCcsICdJbGx1bWluYXRpJywgJ0RhZWRhbHVzJ10uaW5jbHVkZXMoZmFjdGlvbikpIHsgIC8vIFRvIGluY3JlYXNlIGNvbWJhdCBzdGF0XG4gICAgICAgICAgICBucy5zaW5ndWxhcml0eS5qb2luRmFjdGlvbignVGhlIEJsYWNrIEhhbmQnKTtcbiAgICAgICAgICAgIG5zLnNpbmd1bGFyaXR5LndvcmtGb3JGYWN0aW9uKCdUaGUgQmxhY2sgSGFuZCcsICdmaWVsZCcpO1xuICAgICAgICB9IGVsc2UgaWYgKFsnU2x1bSBTbmFrZXMnXS5pbmNsdWRlcyhmYWN0aW9uKSkgeyAgLy8gVG8gbG93ZXIgcGxheWVyIGthcm1hXG4gICAgICAgICAgICBucy5zaW5ndWxhcml0eS5jb21taXRDcmltZShcIk11Z1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlICghbnMuc2luZ3VsYXJpdHkuY2hlY2tGYWN0aW9uSW52aXRhdGlvbnMoKS5pbmNsdWRlcyhmYWN0aW9uKSAmJiAhbnMuZ2V0UGxheWVyKCkuZmFjdGlvbnMuaW5jbHVkZXMoZmFjdGlvbikpIHtcbiAgICAgICAgICAgIGF3YWl0IG5zLnNsZWVwKDUwMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgbm90T3duZWRBdWdtZW50YXRpb25zID0gYXdhaXQgYnVpbGROb3RPd25lZEF1Z21lbnRhdGlvbnNMaXN0KG5zLCBmYWN0aW9uLCBvd25lZEF1Z21lbnRhdGlvbnMpO1xuICAgICAgICBucy5wcmludChgRmFjdGlvbjogJHtmYWN0aW9ufSwgbnVtIG9mIG5vdCBvd25lZCBhdWc6ICR7bm90T3duZWRBdWdtZW50YXRpb25zLmxlbmd0aH1gKTtcblxuICAgICAgICBpZiAobm90T3duZWRBdWdtZW50YXRpb25zLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWN0aW9uO1xuICAgIH1cblxuICAgIHJldHVybiAnTk8tRkFDVElPTi1MRUZUJztcbn1cblxuYXN5bmMgZnVuY3Rpb24gd2FpdEZvclJlcHV0YXRpb24obnM6IE5TLCBmYWN0aW9uOiBzdHJpbmcsIGF1Z21lbnRhdGlvbjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgd2hpbGUgKG5zLnNpbmd1bGFyaXR5LmdldEF1Z21lbnRhdGlvblJlcFJlcShhdWdtZW50YXRpb24pID4gbnMuc2luZ3VsYXJpdHkuZ2V0RmFjdGlvblJlcChmYWN0aW9uKSkge1xuICAgICAgICBucy5wcmludChgQXVnbWVudGF0aW9uIHJlcHV0YXRpb246ICR7bnMuZm9ybWF0TnVtYmVyKG5zLnNpbmd1bGFyaXR5LmdldEF1Z21lbnRhdGlvblJlcFJlcShhdWdtZW50YXRpb24pKX0sIGN1cnJlbnQgcmVwdXRhdGlvbjogJHtucy5mb3JtYXROdW1iZXIobnMuc2luZ3VsYXJpdHkuZ2V0RmFjdGlvblJlcChmYWN0aW9uKSl9YCk7XG4gICAgICAgIGF3YWl0IG5zLnNsZWVwKDUwMDApO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gd2FpdEZvck1vbmV5KG5zOiBOUywgYXVnbWVudGF0aW9uOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB3aGlsZSAobnMuc2luZ3VsYXJpdHkuZ2V0QXVnbWVudGF0aW9uUHJpY2UoYXVnbWVudGF0aW9uKSA+IG5zLmdldFNlcnZlck1vbmV5QXZhaWxhYmxlKCdob21lJykpIHtcbiAgICAgICAgbnMucHJpbnQoYEF1Z21lbnRhdGlvbiBwcmljZTogJHtucy5mb3JtYXROdW1iZXIobnMuc2luZ3VsYXJpdHkuZ2V0QXVnbWVudGF0aW9uUHJpY2UoYXVnbWVudGF0aW9uKSl9XFwkLCBtb25leSBhdmFpbGFibGU6ICR7bnMuZm9ybWF0TnVtYmVyKG5zLmdldFNlcnZlck1vbmV5QXZhaWxhYmxlKCdob21lJykpfVxcJGApO1xuICAgICAgICBhd2FpdCBucy5zbGVlcCg1MDAwKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHB1cmNoYXNlQXVnbWVudGF0aW9ucyhuczogTlMsIGZhY3Rpb246IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGNvbnN0IG93bmVkQXVnbWVudGF0aW9ucyA9IG5zLnNpbmd1bGFyaXR5LmdldE93bmVkQXVnbWVudGF0aW9ucyh0cnVlKTtcbiAgICAgICAgY29uc3Qgbm90T3duZWRBdWdtZW50YXRpb25zID0gYXdhaXQgYnVpbGROb3RPd25lZEF1Z21lbnRhdGlvbnNMaXN0KG5zLCBmYWN0aW9uLCBvd25lZEF1Z21lbnRhdGlvbnMpO1xuICAgICAgICBpZiAobm90T3duZWRBdWdtZW50YXRpb25zLmxlbmd0aD09MCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhdWdtZW50YXRpb25QcmljZUxpc3QgPSBub3RPd25lZEF1Z21lbnRhdGlvbnMubWFwKChhOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByaWNlID0gbnMuc2luZ3VsYXJpdHkuZ2V0QXVnbWVudGF0aW9uUHJpY2UoYSk7XG4gICAgICAgICAgICBjb25zdCBhdWdtZW50YXRpb246IGF1Z21lbnRhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBhLFxuICAgICAgICAgICAgICAgIHByaWNlOiBwcmljZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbnMucHJpbnQoYEF1Z21lbnRhdGlvbjogJHthfSBoYXMgcHJpY2Ugb2YgJHtucy5mb3JtYXROdW1iZXIocHJpY2UpfVxcJGApO1xuXG4gICAgICAgICAgICByZXR1cm4gYXVnbWVudGF0aW9uO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBhdmFpbGFibGVBdWdtZW50YXRpb25zID0gYXVnbWVudGF0aW9uUHJpY2VMaXN0LmZpbHRlcigoYTogYXVnbWVudGF0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcmVSZXF1aXNpdGVzID0gbnMuc2luZ3VsYXJpdHkuZ2V0QXVnbWVudGF0aW9uUHJlcmVxKGEubmFtZSk7XG4gICAgICAgICAgICBjb25zdCBoYXNOb1ByZXJlcXVpc2l0ZXMgPSBwcmVSZXF1aXNpdGVzLmxlbmd0aD09MDtcbiAgICAgICAgICAgIGNvbnN0IGFsbFByZXJlcXVpc2l0ZXNBcmVPd25lZCA9IHByZVJlcXVpc2l0ZXMuZXZlcnkoKGI6IHN0cmluZykgPT4gb3duZWRBdWdtZW50YXRpb25zLnNvbWUoKGM6IHN0cmluZykgPT4gYj09YykpO1xuXG4gICAgICAgICAgICBpZiAoaGFzTm9QcmVyZXF1aXNpdGVzIHx8IGFsbFByZXJlcXVpc2l0ZXNBcmVPd25lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHNvcnRlZEF1Z21lbnRhdGlvbnMgPSBhdmFpbGFibGVBdWdtZW50YXRpb25zLnNvcnQoKGE6IGF1Z21lbnRhdGlvbiwgYjogYXVnbWVudGF0aW9uKSA9PiBiLnByaWNlIC0gYS5wcmljZSk7XG4gICAgICAgIGNvbnN0IG1vc3RFeHBlbnNpdmVBdWdtZW50YXRpb246IGF1Z21lbnRhdGlvbiA9IHNvcnRlZEF1Z21lbnRhdGlvbnNbMF07XG5cbiAgICAgICAgbnMucHJpbnQoYE1vc3QgZXhwZW5zaXZlIGF1Z21lbnRhdGlvbiBpcyAke21vc3RFeHBlbnNpdmVBdWdtZW50YXRpb24ubmFtZX0gd2l0aCBhIHByaWNlIG9mICR7bnMuZm9ybWF0TnVtYmVyKG1vc3RFeHBlbnNpdmVBdWdtZW50YXRpb24ucHJpY2UpfVxcJGApO1xuICAgICAgICBhd2FpdCB3YWl0Rm9yUmVwdXRhdGlvbihucywgZmFjdGlvbiwgbW9zdEV4cGVuc2l2ZUF1Z21lbnRhdGlvbi5uYW1lKTtcbiAgICAgICAgYXdhaXQgd2FpdEZvck1vbmV5KG5zLCBtb3N0RXhwZW5zaXZlQXVnbWVudGF0aW9uLm5hbWUpO1xuICAgICAgICBucy5zaW5ndWxhcml0eS5wdXJjaGFzZUF1Z21lbnRhdGlvbihmYWN0aW9uLCBtb3N0RXhwZW5zaXZlQXVnbWVudGF0aW9uLm5hbWUpO1xuXG4gICAgICAgIGF3YWl0IG5zLnNsZWVwKDEwMDApO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gam9pbkFuZFdvcmtGb3JGYWN0aW9uKG5zOiBOUywgZmFjdGlvbjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbnMucHJpbnQoYE5leHQgZmFjdGlvbjogJHtKU09OLnN0cmluZ2lmeShmYWN0aW9uLCBudWxsLCA0KX1gKTtcbiAgICBucy5zaW5ndWxhcml0eS5qb2luRmFjdGlvbihmYWN0aW9uKTtcblxuICAgIGlmIChbJ1NlY3Rvci0xMicsICdTbHVtIFNuYWtlcyddLmluY2x1ZGVzKGZhY3Rpb24pKSB7XG4gICAgICAgIG5zLnNpbmd1bGFyaXR5LndvcmtGb3JGYWN0aW9uKGZhY3Rpb24sICdmaWVsZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG5zLnNpbmd1bGFyaXR5LndvcmtGb3JGYWN0aW9uKGZhY3Rpb24sICdoYWNraW5nJyk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiB3YWl0QW5kRGVzdHJveVdvcmxkRGFlbW9uKG5zOiBOUyk6IFByb21pc2U8dm9pZD4ge1xuICAgIG5zLnByaW50KCdObyBmYWN0aW9uIGxlZnQnKTtcblxuICAgIGF3YWl0IG5zLnNsZWVwKDUwMDApO1xuICAgIG5zLnNpbmd1bGFyaXR5LnRyYXZlbFRvQ2l0eSgnU2VjdG9yLTEyJyk7XG4gICAgbnMuc2luZ3VsYXJpdHkudW5pdmVyc2l0eUNvdXJzZSgnUm90aG1hbiBVbml2ZXJzaXR5JywgJ0FsZ29yaXRobXMnKTtcblxuICAgIGNvbnN0IHdvcmxkRGFlbW9uID0gJ3cwcjFkX2Q0M20wbic7XG4gICAgbnMucHJpbnQoYFdhaXRpbmcgZm9yIHJvb3QgYWNjZXNzIG9uICR7d29ybGREYWVtb259YCk7XG4gICAgd2hpbGUgKCFucy5oYXNSb290QWNjZXNzKHdvcmxkRGFlbW9uKSkge1xuICAgICAgICBhd2FpdCBucy5zbGVlcCg1MDAwKTtcbiAgICB9XG5cbiAgICBucy5wcmludChgJHt3b3JsZERhZW1vbn0gaXMgcm9vdCBhY2Nlc3NpYmxlYCk7XG4gICAgbnMudHByaW50KGAke3dvcmxkRGFlbW9ufSBpcyByb290IGFjY2Vzc2libGVgKTtcbiAgICBucy5zaW5ndWxhcml0eS5kZXN0cm95VzByMWRENDNtMG4oMTIsICdib290c3RyYXAuanMnKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnM6IE5TKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbnMuZGlzYWJsZUxvZygnQUxMJyk7XG5cbiAgICBjb25zdCBuZXh0RmFjdGlvbiA9IGF3YWl0IGdldE5leHRGYWN0aW9uKG5zKTtcblxuICAgIGlmIChuZXh0RmFjdGlvbiA9PT0gJ05PLUZBQ1RJT04tTEVGVCcpIHtcbiAgICAgICAgYXdhaXQgd2FpdEFuZERlc3Ryb3lXb3JsZERhZW1vbihucyk7XG4gICAgfVxuXG4gICAgYXdhaXQgam9pbkFuZFdvcmtGb3JGYWN0aW9uKG5zLCBuZXh0RmFjdGlvbik7XG5cbiAgICBhd2FpdCBwdXJjaGFzZUF1Z21lbnRhdGlvbnMobnMsIG5leHRGYWN0aW9uKTtcblxuICAgIG5zLnNpbmd1bGFyaXR5Lmluc3RhbGxBdWdtZW50YXRpb25zKCdib290c3RyYXAuanMnKTtcbn1cblxuIl19