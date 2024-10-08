/** @param {NS} ns */
export async function main(ns) {
    for (let i = 2; i < 21; i++) {
        const serverRam = Math.pow(2.0, i);
        const serverCost = ns.getPurchasedServerCost(serverRam);
        ns.tprint(`Server ram: ${serverRam}`);
        ns.tprint(`Server cost: ${formatNumber(serverCost)}\$`);
        ns.tprint("\n");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1zZXJ2ZXItcHJpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc2NyaXB0cy9saXN0LXNlcnZlci1wcmljZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUJBQXFCO0FBQ3JCLE1BQU0sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEVBQUU7SUFDM0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMzQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuQyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxlQUFlLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDdEMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2pCO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAcGFyYW0ge05TfSBucyAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnMpIHtcbiAgZm9yIChsZXQgaSA9IDI7IGkgPCAyMTsgaSsrKSB7XG4gICAgY29uc3Qgc2VydmVyUmFtID0gTWF0aC5wb3coMi4wLCBpKTtcbiAgICBjb25zdCBzZXJ2ZXJDb3N0ID0gbnMuZ2V0UHVyY2hhc2VkU2VydmVyQ29zdChzZXJ2ZXJSYW0pO1xuICAgIG5zLnRwcmludChgU2VydmVyIHJhbTogJHtzZXJ2ZXJSYW19YCk7XG4gICAgbnMudHByaW50KGBTZXJ2ZXIgY29zdDogJHtmb3JtYXROdW1iZXIoc2VydmVyQ29zdCl9XFwkYCk7XG4gICAgbnMudHByaW50KFwiXFxuXCIpO1xuICB9XG59XG4iXX0=