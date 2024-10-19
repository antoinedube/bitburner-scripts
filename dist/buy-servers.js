import { scanAllNetwork } from "./scan";
// function generateUUID() {
// https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
// crypto.randomUUID();
// crypto.getRandomValues();
// }
function launchScript(ns, scriptName, server) {
    const scpStatus = ns.scp(scriptName, server, 'home');
    if (!scpStatus) {
        ns.print('Failed to copy ' + scriptName + ' on ' + server);
    }
    ns.killall(server);
    const maxRam = ns.getServerMaxRam(server);
    const usedRam = ns.getServerUsedRam(server);
    const availableRam = maxRam - usedRam;
    const scriptRam = ns.getScriptRam(scriptName, server);
    const numThreads = Math.floor(availableRam / scriptRam);
    if (numThreads > 0) {
        if (ns.exec(scriptName, server, numThreads) == 0) {
            ns.print('Error launching script');
        }
    }
}
export async function main(ns) {
    ns.disableLog('ALL');
    const BUYING_DELAY = 250;
    const UPGRADING_DELAY = 5 * 1000;
    const FOLLOWING_BATCH_DELAY = 1000 * 30;
    const HOME_SERVER = 'home';
    let targetRam = 4;
    while (targetRam <= ns.getPurchasedServerMaxRam()) {
        const maxNumberOfServers = ns.getPurchasedServerLimit();
        const availableMoney = ns.getServerMoneyAvailable('home');
        const serverCost = ns.getPurchasedServerCost(targetRam);
        if (availableMoney < maxNumberOfServers * serverCost) {
            targetRam /= 2;
            break;
        }
        targetRam *= 2;
    }
    if (targetRam < 8) {
        targetRam = 8;
    }
    if (targetRam > ns.getPurchasedServerMaxRam()) {
        targetRam = 0.5 * ns.getPurchasedServerMaxRam();
    }
    ns.print(`Starting target ram: ${targetRam}`);
    // Purchase missing servers
    while (true) {
        // List current servers
        const serverList = scanAllNetwork(ns);
        let purchasedServers = serverList.filter(name => name.startsWith('neighbor-'));
        // Stopping criteria
        if (purchasedServers.length == ns.getPurchasedServerLimit()) {
            break;
        }
        // If limit is not reached, buy server at current targetRam
        if (ns.getPurchasedServerCost(targetRam) < ns.getServerMoneyAvailable(HOME_SERVER)) {
            const name = `neighbor-${purchasedServers.length}`;
            ns.print(`Purchasing server ${name}`);
            ns.purchaseServer(name, targetRam);
            launchScript(ns, 'hack-remote.js', name);
            purchasedServers.push(name);
        }
        await ns.sleep(BUYING_DELAY);
    }
    const purchasedServers = scanAllNetwork(ns).filter(name => name.startsWith('neighbor-'));
    targetRam *= 2;
    while (true) {
        // Stopping criteria
        let countServerWithTargetRam = 0;
        for (const purchasedServer of purchasedServers) {
            const purchasedServerRam = ns.getServer(purchasedServer).maxRam;
            if (purchasedServerRam >= targetRam) {
                countServerWithTargetRam++;
            }
        }
        if (countServerWithTargetRam == ns.getPurchasedServerLimit()) {
            if (targetRam >= ns.getPurchasedServerMaxRam()) {
                break;
            }
            targetRam *= 2;
            ns.print(`New RAM target: ${targetRam}`);
            await ns.sleep(FOLLOWING_BATCH_DELAY);
        }
        for (const purchasedServer of purchasedServers) {
            const purchasedServerRam = ns.getServer(purchasedServer).maxRam;
            if (purchasedServerRam < targetRam) {
                const moneyAvailable = ns.getServerMoneyAvailable('home');
                const upgradeCost = ns.getPurchasedServerUpgradeCost(purchasedServer, targetRam);
                if (upgradeCost < moneyAvailable) {
                    if (ns.upgradePurchasedServer(purchasedServer, targetRam)) {
                        ns.print(`Upgraded ${purchasedServer} to ${ns.formatRam(targetRam)} with cost of ${ns.formatNumber(upgradeCost)}\$`);
                        launchScript(ns, 'hack-remote.js', purchasedServer);
                    }
                    else {
                        ns.print(`Error while upgrading purchased server ${purchasedServer} to ${ns.formatRam(targetRam)}`);
                    }
                }
            }
        }
        await ns.sleep(UPGRADING_DELAY);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV5LXNlcnZlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zY3JpcHRzL2J1eS1zZXJ2ZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFFeEMsNEJBQTRCO0FBQ3hCLHlFQUF5RTtBQUN6RSx1QkFBdUI7QUFDdkIsNEJBQTRCO0FBQ2hDLElBQUk7QUFFSixTQUFTLFlBQVksQ0FBQyxFQUFNLEVBQUUsVUFBa0IsRUFBRSxNQUFjO0lBQzVELE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyRCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ1osRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0tBQzlEO0lBRUQsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVuQixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QyxNQUFNLFlBQVksR0FBRyxNQUFNLEdBQUcsT0FBTyxDQUFDO0lBQ3RDLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3RELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0lBQ3hELElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtRQUNoQixJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDOUMsRUFBRSxDQUFDLEtBQUss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QztxQkFDdkQ7eUJBQU07d0JBQ0gsRUFBRSxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsZUFBZSxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUN2RztpQkFDSjthQUNKO1NBQ0o7UUFFRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDbkM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTlMgfSBmcm9tICdAbnMnO1xuaW1wb3J0IHsgc2NhbkFsbE5ldHdvcmsgfSBmcm9tIFwiLi9zY2FuXCI7XG5cbi8vIGZ1bmN0aW9uIGdlbmVyYXRlVVVJRCgpIHtcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvaG93LWRvLWktY3JlYXRlLWEtZ3VpZC11dWlkXG4gICAgLy8gY3J5cHRvLnJhbmRvbVVVSUQoKTtcbiAgICAvLyBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKCk7XG4vLyB9XG5cbmZ1bmN0aW9uIGxhdW5jaFNjcmlwdChuczogTlMsIHNjcmlwdE5hbWU6IHN0cmluZywgc2VydmVyOiBzdHJpbmcpIHtcbiAgICBjb25zdCBzY3BTdGF0dXMgPSBucy5zY3Aoc2NyaXB0TmFtZSwgc2VydmVyLCAnaG9tZScpO1xuICAgIGlmICghc2NwU3RhdHVzKSB7XG4gICAgICAgIG5zLnByaW50KCdGYWlsZWQgdG8gY29weSAnICsgc2NyaXB0TmFtZSArICcgb24gJyArIHNlcnZlcik7XG4gICAgfVxuXG4gICAgbnMua2lsbGFsbChzZXJ2ZXIpO1xuXG4gICAgY29uc3QgbWF4UmFtID0gbnMuZ2V0U2VydmVyTWF4UmFtKHNlcnZlcik7XG4gICAgY29uc3QgdXNlZFJhbSA9IG5zLmdldFNlcnZlclVzZWRSYW0oc2VydmVyKTtcbiAgICBjb25zdCBhdmFpbGFibGVSYW0gPSBtYXhSYW0gLSB1c2VkUmFtO1xuICAgIGNvbnN0IHNjcmlwdFJhbSA9IG5zLmdldFNjcmlwdFJhbShzY3JpcHROYW1lLCBzZXJ2ZXIpO1xuICAgIGNvbnN0IG51bVRocmVhZHMgPSBNYXRoLmZsb29yKGF2YWlsYWJsZVJhbSAvIHNjcmlwdFJhbSk7XG4gICAgaWYgKG51bVRocmVhZHMgPiAwKSB7XG4gICAgICAgIGlmIChucy5leGVjKHNjcmlwdE5hbWUsIHNlcnZlciwgbnVtVGhyZWFkcykgPT0gMCkge1xuICAgICAgICAgICAgbnMucHJpbnQoJ0Vycm9yIGxhdW5jaGluZyBzY3JpcHQnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnM6IE5TKSB7XG4gICAgbnMuZGlzYWJsZUxvZygnQUxMJyk7XG4gICAgY29uc3QgQlVZSU5HX0RFTEFZID0gMjUwO1xuICAgIGNvbnN0IFVQR1JBRElOR19ERUxBWSA9IDUgKiAxMDAwO1xuICAgIGNvbnN0IEZPTExPV0lOR19CQVRDSF9ERUxBWSA9IDEwMDAgKiAzMDtcbiAgICBjb25zdCBIT01FX1NFUlZFUiA9ICdob21lJztcblxuICAgIGxldCB0YXJnZXRSYW0gPSA0O1xuICAgIHdoaWxlICh0YXJnZXRSYW0gPD0gbnMuZ2V0UHVyY2hhc2VkU2VydmVyTWF4UmFtKCkpIHtcbiAgICAgICAgY29uc3QgbWF4TnVtYmVyT2ZTZXJ2ZXJzID0gbnMuZ2V0UHVyY2hhc2VkU2VydmVyTGltaXQoKTtcbiAgICAgICAgY29uc3QgYXZhaWxhYmxlTW9uZXkgPSBucy5nZXRTZXJ2ZXJNb25leUF2YWlsYWJsZSgnaG9tZScpO1xuICAgICAgICBjb25zdCBzZXJ2ZXJDb3N0ID0gbnMuZ2V0UHVyY2hhc2VkU2VydmVyQ29zdCh0YXJnZXRSYW0pO1xuXG4gICAgICAgIGlmIChhdmFpbGFibGVNb25leSA8IG1heE51bWJlck9mU2VydmVycyAqIHNlcnZlckNvc3QpIHtcbiAgICAgICAgICAgIHRhcmdldFJhbSAvPSAyO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB0YXJnZXRSYW0gKj0gMjtcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0UmFtIDwgOCkge1xuICAgICAgICB0YXJnZXRSYW0gPSA4O1xuICAgIH1cblxuICAgIGlmICh0YXJnZXRSYW0+bnMuZ2V0UHVyY2hhc2VkU2VydmVyTWF4UmFtKCkpIHtcbiAgICAgICAgdGFyZ2V0UmFtID0gMC41Km5zLmdldFB1cmNoYXNlZFNlcnZlck1heFJhbSgpO1xuICAgIH1cblxuICAgIG5zLnByaW50KGBTdGFydGluZyB0YXJnZXQgcmFtOiAke3RhcmdldFJhbX1gKTtcblxuICAgIC8vIFB1cmNoYXNlIG1pc3Npbmcgc2VydmVyc1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIC8vIExpc3QgY3VycmVudCBzZXJ2ZXJzXG4gICAgICAgIGNvbnN0IHNlcnZlckxpc3QgPSBzY2FuQWxsTmV0d29yayhucyk7XG4gICAgICAgIGxldCBwdXJjaGFzZWRTZXJ2ZXJzID0gc2VydmVyTGlzdC5maWx0ZXIobmFtZSA9PiBuYW1lLnN0YXJ0c1dpdGgoJ25laWdoYm9yLScpKTtcblxuICAgICAgICAvLyBTdG9wcGluZyBjcml0ZXJpYVxuICAgICAgICBpZiAocHVyY2hhc2VkU2VydmVycy5sZW5ndGggPT0gbnMuZ2V0UHVyY2hhc2VkU2VydmVyTGltaXQoKSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBsaW1pdCBpcyBub3QgcmVhY2hlZCwgYnV5IHNlcnZlciBhdCBjdXJyZW50IHRhcmdldFJhbVxuICAgICAgICBpZiAobnMuZ2V0UHVyY2hhc2VkU2VydmVyQ29zdCh0YXJnZXRSYW0pIDwgbnMuZ2V0U2VydmVyTW9uZXlBdmFpbGFibGUoSE9NRV9TRVJWRVIpKSB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gYG5laWdoYm9yLSR7cHVyY2hhc2VkU2VydmVycy5sZW5ndGh9YDtcbiAgICAgICAgICAgIG5zLnByaW50KGBQdXJjaGFzaW5nIHNlcnZlciAke25hbWV9YCk7XG4gICAgICAgICAgICBucy5wdXJjaGFzZVNlcnZlcihuYW1lLCB0YXJnZXRSYW0pO1xuICAgICAgICAgICAgbGF1bmNoU2NyaXB0KG5zLCAnaGFjay1yZW1vdGUuanMnLCBuYW1lKTtcblxuICAgICAgICAgICAgcHVyY2hhc2VkU2VydmVycy5wdXNoKG5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgbnMuc2xlZXAoQlVZSU5HX0RFTEFZKTtcbiAgICB9XG5cbiAgICBjb25zdCBwdXJjaGFzZWRTZXJ2ZXJzID0gc2NhbkFsbE5ldHdvcmsobnMpLmZpbHRlcihuYW1lID0+IG5hbWUuc3RhcnRzV2l0aCgnbmVpZ2hib3ItJykpO1xuXG4gICAgdGFyZ2V0UmFtICo9IDI7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgLy8gU3RvcHBpbmcgY3JpdGVyaWFcbiAgICAgICAgbGV0IGNvdW50U2VydmVyV2l0aFRhcmdldFJhbSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgcHVyY2hhc2VkU2VydmVyIG9mIHB1cmNoYXNlZFNlcnZlcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHB1cmNoYXNlZFNlcnZlclJhbSA9IG5zLmdldFNlcnZlcihwdXJjaGFzZWRTZXJ2ZXIpLm1heFJhbTtcbiAgICAgICAgICAgIGlmIChwdXJjaGFzZWRTZXJ2ZXJSYW0gPj0gdGFyZ2V0UmFtKSB7XG4gICAgICAgICAgICAgICAgY291bnRTZXJ2ZXJXaXRoVGFyZ2V0UmFtKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY291bnRTZXJ2ZXJXaXRoVGFyZ2V0UmFtID09IG5zLmdldFB1cmNoYXNlZFNlcnZlckxpbWl0KCkpIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXRSYW0gPj0gbnMuZ2V0UHVyY2hhc2VkU2VydmVyTWF4UmFtKCkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFyZ2V0UmFtICo9IDI7XG4gICAgICAgICAgICBucy5wcmludChgTmV3IFJBTSB0YXJnZXQ6ICR7dGFyZ2V0UmFtfWApO1xuICAgICAgICAgICAgYXdhaXQgbnMuc2xlZXAoRk9MTE9XSU5HX0JBVENIX0RFTEFZKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgcHVyY2hhc2VkU2VydmVyIG9mIHB1cmNoYXNlZFNlcnZlcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHB1cmNoYXNlZFNlcnZlclJhbSA9IG5zLmdldFNlcnZlcihwdXJjaGFzZWRTZXJ2ZXIpLm1heFJhbTtcbiAgICAgICAgICAgIGlmIChwdXJjaGFzZWRTZXJ2ZXJSYW0gPCB0YXJnZXRSYW0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb25leUF2YWlsYWJsZSA9IG5zLmdldFNlcnZlck1vbmV5QXZhaWxhYmxlKCdob21lJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgdXBncmFkZUNvc3QgPSBucy5nZXRQdXJjaGFzZWRTZXJ2ZXJVcGdyYWRlQ29zdChwdXJjaGFzZWRTZXJ2ZXIsIHRhcmdldFJhbSk7XG4gICAgICAgICAgICAgICAgaWYgKHVwZ3JhZGVDb3N0IDwgbW9uZXlBdmFpbGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5zLnVwZ3JhZGVQdXJjaGFzZWRTZXJ2ZXIocHVyY2hhc2VkU2VydmVyLCB0YXJnZXRSYW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBucy5wcmludChgVXBncmFkZWQgJHtwdXJjaGFzZWRTZXJ2ZXJ9IHRvICR7bnMuZm9ybWF0UmFtKHRhcmdldFJhbSl9IHdpdGggY29zdCBvZiAke25zLmZvcm1hdE51bWJlcih1cGdyYWRlQ29zdCl9XFwkYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXVuY2hTY3JpcHQobnMsICdoYWNrLXJlbW90ZS5qcycsIHB1cmNoYXNlZFNlcnZlcik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBucy5wcmludChgRXJyb3Igd2hpbGUgdXBncmFkaW5nIHB1cmNoYXNlZCBzZXJ2ZXIgJHtwdXJjaGFzZWRTZXJ2ZXJ9IHRvICR7bnMuZm9ybWF0UmFtKHRhcmdldFJhbSl9YCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBucy5zbGVlcChVUEdSQURJTkdfREVMQVkpO1xuICAgIH1cbn1cbiJdfQ==