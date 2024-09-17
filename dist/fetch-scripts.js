/** @param {NS} ns */
export async function main(ns) {
    if (ns.getHostname() !== "home") {
        throw new Exception("Run the script from home");
    }
    const scripts = [
        'bootstrap.js',
        'buy-darkweb-programs.js',
        'buy-hacknet-servers.js',
        'buy-servers.js',
        'delete-servers.js',
        'fetch-scripts.js',
        'hack-remote.js',
        'hack-server.js',
        'hacking-programs.js',
        'launch-hacking.js',
        'list-player-karma.js',
        'list-server-money.js',
        'list-server-prices.js',
        'list-server-security-level.js',
        'manage-bladeburner.js',
        'manage-corporation.js',
        'manage-gang.js',
        'manage-sleeves.js',
        'scan.js',
        'spend-hashes.js'
    ];
    for (const scriptName of scripts) {
        ns.tprint(`Fetching: ${scriptName}`);
        await ns.wget(`https://raw.githubusercontent.com/antoinedube/bitburner-scripts/main/scripts/${scriptName}`, `${scriptName}`);
        await ns.sleep(250);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2gtc2NyaXB0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NjcmlwdHMvZmV0Y2gtc2NyaXB0cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQkFBcUI7QUFDckIsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBRTtJQUN6QixJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLEVBQUU7UUFDN0IsTUFBTSxJQUFJLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0tBQ25EO0lBRUQsTUFBTSxPQUFPLEdBQUc7UUFDWixjQUFjO1FBQ2QseUJBQXlCO1FBQ3pCLHdCQUF3QjtRQUN4QixnQkFBZ0I7UUFDaEIsbUJBQW1CO1FBQ25CLGtCQUFrQjtRQUNsQixnQkFBZ0I7UUFDaEIsZ0JBQWdCO1FBQ2hCLHFCQUFxQjtRQUNyQixtQkFBbUI7UUFDbkIsc0JBQXNCO1FBQ3RCLHNCQUFzQjtRQUN0Qix1QkFBdUI7UUFDdkIsK0JBQStCO1FBQy9CLHVCQUF1QjtRQUN2Qix1QkFBdUI7UUFDdkIsZ0JBQWdCO1FBQ2hCLG1CQUFtQjtRQUNuQixTQUFTO1FBQ1QsaUJBQWlCO0tBQ3BCLENBQUM7SUFFRixLQUFLLE1BQU0sVUFBVSxJQUFJLE9BQU8sRUFBRTtRQUM5QixFQUFFLENBQUMsTUFBTSxDQUFDLGFBQWEsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUNyQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQ1QsZ0ZBQWdGLFVBQVUsRUFBRSxFQUM1RixHQUFHLFVBQVUsRUFBRSxDQUNsQixDQUFDO1FBRUYsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZCO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAcGFyYW0ge05TfSBucyAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnMpIHtcbiAgICBpZiAobnMuZ2V0SG9zdG5hbWUoKSAhPT0gXCJob21lXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcIlJ1biB0aGUgc2NyaXB0IGZyb20gaG9tZVwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JpcHRzID0gW1xuICAgICAgICAnYm9vdHN0cmFwLmpzJyxcbiAgICAgICAgJ2J1eS1kYXJrd2ViLXByb2dyYW1zLmpzJyxcbiAgICAgICAgJ2J1eS1oYWNrbmV0LXNlcnZlcnMuanMnLFxuICAgICAgICAnYnV5LXNlcnZlcnMuanMnLFxuICAgICAgICAnZGVsZXRlLXNlcnZlcnMuanMnLFxuICAgICAgICAnZmV0Y2gtc2NyaXB0cy5qcycsXG4gICAgICAgICdoYWNrLXJlbW90ZS5qcycsXG4gICAgICAgICdoYWNrLXNlcnZlci5qcycsXG4gICAgICAgICdoYWNraW5nLXByb2dyYW1zLmpzJyxcbiAgICAgICAgJ2xhdW5jaC1oYWNraW5nLmpzJyxcbiAgICAgICAgJ2xpc3QtcGxheWVyLWthcm1hLmpzJyxcbiAgICAgICAgJ2xpc3Qtc2VydmVyLW1vbmV5LmpzJyxcbiAgICAgICAgJ2xpc3Qtc2VydmVyLXByaWNlcy5qcycsXG4gICAgICAgICdsaXN0LXNlcnZlci1zZWN1cml0eS1sZXZlbC5qcycsXG4gICAgICAgICdtYW5hZ2UtYmxhZGVidXJuZXIuanMnLFxuICAgICAgICAnbWFuYWdlLWNvcnBvcmF0aW9uLmpzJyxcbiAgICAgICAgJ21hbmFnZS1nYW5nLmpzJyxcbiAgICAgICAgJ21hbmFnZS1zbGVldmVzLmpzJyxcbiAgICAgICAgJ3NjYW4uanMnLFxuICAgICAgICAnc3BlbmQtaGFzaGVzLmpzJ1xuICAgIF07XG5cbiAgICBmb3IgKGNvbnN0IHNjcmlwdE5hbWUgb2Ygc2NyaXB0cykge1xuICAgICAgICBucy50cHJpbnQoYEZldGNoaW5nOiAke3NjcmlwdE5hbWV9YCk7XG4gICAgICAgIGF3YWl0IG5zLndnZXQoXG4gICAgICAgICAgICBgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2FudG9pbmVkdWJlL2JpdGJ1cm5lci1zY3JpcHRzL21haW4vc2NyaXB0cy8ke3NjcmlwdE5hbWV9YCxcbiAgICAgICAgICAgIGAke3NjcmlwdE5hbWV9YFxuICAgICAgICApO1xuXG4gICAgICAgIGF3YWl0IG5zLnNsZWVwKDI1MCk7XG4gICAgfVxufVxuIl19