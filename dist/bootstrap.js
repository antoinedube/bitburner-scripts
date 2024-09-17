export async function main(ns) {
    const scripts = [
        'launch-hacking.js',
        'spend-hashes.js',
        'buy-hacknet-servers.js',
        'buy-servers.js',
        'manage-sleeves.js',
        'manage-gang.js',
        'manage-factions.js',
        'buy-darkweb-programs.js',
        /* 'manage-bladeburner.js' */
    ];
    if (ns.isRunning('hack-remote.js')) {
        ns.kill('hack-remote.js', 'home');
    }
    for (let script of scripts) {
        if (ns.isRunning(script)) {
            continue;
        }
        ns.tprint(`Launching script: ${script}`);
        ns.run(script);
        await ns.sleep(250);
    }
    await ns.sleep(2 * 1000);
    const hackingScript = 'hack-remote.js';
    const scriptRam = ns.getScriptRam(hackingScript);
    const serverMaxRam = ns.getServerMaxRam('home');
    const serverUsedRam = ns.getServerUsedRam('home');
    const availableRam = serverMaxRam - serverUsedRam;
    const scriptNumThreads = (~~(availableRam / scriptRam));
    if (scriptNumThreads > 0) {
        ns.tprint(`Launching script: ${hackingScript} with ${scriptNumThreads} threads`);
        ns.exec(hackingScript, 'home', scriptNumThreads);
    }
    ns.singularity.universityCourse('Rothman University', 'Computer Science');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc2NyaXB0cy9ib290c3RyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBTTtJQUM3QixNQUFNLE9BQU8sR0FBRztRQUNaLG1CQUFtQjtRQUNuQixpQkFBaUI7UUFDakIsd0JBQXdCO1FBQ3hCLGdCQUFnQjtRQUNoQixtQkFBbUI7UUFDbkIsZ0JBQWdCO1FBQ2hCLG9CQUFvQjtRQUNwQix5QkFBeUI7UUFDekIsNkJBQTZCO0tBQ2hDLENBQUM7SUFFRixJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtRQUNoQyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3JDO0lBRUQsS0FBSyxJQUFJLE1BQU0sSUFBSSxPQUFPLEVBQUU7UUFDeEIsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3RCLFNBQVM7U0FDWjtRQUVELEVBQUUsQ0FBQyxNQUFNLENBQUMscUJBQXFCLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDekMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVmLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN2QjtJQUVELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFFekIsTUFBTSxhQUFhLEdBQUcsZ0JBQWdCLENBQUM7SUFDdkMsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqRCxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hELE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsRCxNQUFNLFlBQVksR0FBRyxZQUFZLEdBQUcsYUFBYSxDQUFDO0lBQ2xELE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUV4RCxJQUFJLGdCQUFnQixHQUFHLENBQUMsRUFBRTtRQUN0QixFQUFFLENBQUMsTUFBTSxDQUFDLHFCQUFxQixhQUFhLFNBQVMsZ0JBQWdCLFVBQVUsQ0FBQyxDQUFDO1FBQ2pGLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ3BEO0lBRUQsRUFBRSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQzlFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOUyB9IGZyb20gJ0Bucyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKG5zOiBOUyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHNjcmlwdHMgPSBbXG4gICAgICAgICdsYXVuY2gtaGFja2luZy5qcycsXG4gICAgICAgICdzcGVuZC1oYXNoZXMuanMnLFxuICAgICAgICAnYnV5LWhhY2tuZXQtc2VydmVycy5qcycsXG4gICAgICAgICdidXktc2VydmVycy5qcycsXG4gICAgICAgICdtYW5hZ2Utc2xlZXZlcy5qcycsXG4gICAgICAgICdtYW5hZ2UtZ2FuZy5qcycsXG4gICAgICAgICdtYW5hZ2UtZmFjdGlvbnMuanMnLFxuICAgICAgICAnYnV5LWRhcmt3ZWItcHJvZ3JhbXMuanMnLFxuICAgICAgICAvKiAnbWFuYWdlLWJsYWRlYnVybmVyLmpzJyAqL1xuICAgIF07XG5cbiAgICBpZiAobnMuaXNSdW5uaW5nKCdoYWNrLXJlbW90ZS5qcycpKSB7XG4gICAgICAgIG5zLmtpbGwoJ2hhY2stcmVtb3RlLmpzJywgJ2hvbWUnKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBzY3JpcHQgb2Ygc2NyaXB0cykge1xuICAgICAgICBpZiAobnMuaXNSdW5uaW5nKHNjcmlwdCkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbnMudHByaW50KGBMYXVuY2hpbmcgc2NyaXB0OiAke3NjcmlwdH1gKTtcbiAgICAgICAgbnMucnVuKHNjcmlwdCk7XG5cbiAgICAgICAgYXdhaXQgbnMuc2xlZXAoMjUwKTtcbiAgICB9XG5cbiAgICBhd2FpdCBucy5zbGVlcCgyICogMTAwMCk7XG5cbiAgICBjb25zdCBoYWNraW5nU2NyaXB0ID0gJ2hhY2stcmVtb3RlLmpzJztcbiAgICBjb25zdCBzY3JpcHRSYW0gPSBucy5nZXRTY3JpcHRSYW0oaGFja2luZ1NjcmlwdCk7XG4gICAgY29uc3Qgc2VydmVyTWF4UmFtID0gbnMuZ2V0U2VydmVyTWF4UmFtKCdob21lJyk7XG4gICAgY29uc3Qgc2VydmVyVXNlZFJhbSA9IG5zLmdldFNlcnZlclVzZWRSYW0oJ2hvbWUnKTtcbiAgICBjb25zdCBhdmFpbGFibGVSYW0gPSBzZXJ2ZXJNYXhSYW0gLSBzZXJ2ZXJVc2VkUmFtO1xuICAgIGNvbnN0IHNjcmlwdE51bVRocmVhZHMgPSAofn4oYXZhaWxhYmxlUmFtIC8gc2NyaXB0UmFtKSk7XG5cbiAgICBpZiAoc2NyaXB0TnVtVGhyZWFkcyA+IDApIHtcbiAgICAgICAgbnMudHByaW50KGBMYXVuY2hpbmcgc2NyaXB0OiAke2hhY2tpbmdTY3JpcHR9IHdpdGggJHtzY3JpcHROdW1UaHJlYWRzfSB0aHJlYWRzYCk7XG4gICAgICAgIG5zLmV4ZWMoaGFja2luZ1NjcmlwdCwgJ2hvbWUnLCBzY3JpcHROdW1UaHJlYWRzKTtcbiAgICB9XG5cbiAgICBucy5zaW5ndWxhcml0eS51bml2ZXJzaXR5Q291cnNlKCdSb3RobWFuIFVuaXZlcnNpdHknLCAnQ29tcHV0ZXIgU2NpZW5jZScpO1xufVxuIl19