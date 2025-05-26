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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc2NyaXB0cy9ib290c3RyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBTTtJQUMvQixNQUFNLE9BQU8sR0FBRztRQUNkLG1CQUFtQjtRQUNuQixpQkFBaUI7UUFDakIsd0JBQXdCO1FBQ3hCLGdCQUFnQjtRQUNoQixtQkFBbUI7UUFDbkIsZ0JBQWdCO1FBQ2hCLG9CQUFvQjtRQUNwQix5QkFBeUI7UUFDekIsNkJBQTZCO0tBQzlCLENBQUM7SUFFRixJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtRQUNsQyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ25DO0lBRUQsS0FBSyxJQUFJLE1BQU0sSUFBSSxPQUFPLEVBQUU7UUFDMUIsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3hCLFNBQVM7U0FDVjtRQUVELEVBQUUsQ0FBQyxNQUFNLENBQUMscUJBQXFCLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDekMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVmLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyQjtJQUVELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFFekIsTUFBTSxhQUFhLEdBQUcsZ0JBQWdCLENBQUM7SUFDdkMsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqRCxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2hELE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsRCxNQUFNLFlBQVksR0FBRyxZQUFZLEdBQUcsYUFBYSxDQUFDO0lBQ2xELE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUV4RCxJQUFJLGdCQUFnQixHQUFHLENBQUMsRUFBRTtRQUN4QixFQUFFLENBQUMsTUFBTSxDQUFDLHFCQUFxQixhQUFhLFNBQVMsZ0JBQWdCLFVBQVUsQ0FBQyxDQUFDO1FBQ2pGLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ2xEO0lBRUQsRUFBRSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQzVFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOUyB9IGZyb20gJ0Bucyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYWluKG5zOiBOUyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBzY3JpcHRzID0gW1xuICAgICdsYXVuY2gtaGFja2luZy5qcycsXG4gICAgJ3NwZW5kLWhhc2hlcy5qcycsXG4gICAgJ2J1eS1oYWNrbmV0LXNlcnZlcnMuanMnLFxuICAgICdidXktc2VydmVycy5qcycsXG4gICAgJ21hbmFnZS1zbGVldmVzLmpzJyxcbiAgICAnbWFuYWdlLWdhbmcuanMnLFxuICAgICdtYW5hZ2UtZmFjdGlvbnMuanMnLFxuICAgICdidXktZGFya3dlYi1wcm9ncmFtcy5qcycsXG4gICAgLyogJ21hbmFnZS1ibGFkZWJ1cm5lci5qcycgKi9cbiAgXTtcblxuICBpZiAobnMuaXNSdW5uaW5nKCdoYWNrLXJlbW90ZS5qcycpKSB7XG4gICAgbnMua2lsbCgnaGFjay1yZW1vdGUuanMnLCAnaG9tZScpO1xuICB9XG5cbiAgZm9yIChsZXQgc2NyaXB0IG9mIHNjcmlwdHMpIHtcbiAgICBpZiAobnMuaXNSdW5uaW5nKHNjcmlwdCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIG5zLnRwcmludChgTGF1bmNoaW5nIHNjcmlwdDogJHtzY3JpcHR9YCk7XG4gICAgbnMucnVuKHNjcmlwdCk7XG5cbiAgICBhd2FpdCBucy5zbGVlcCgyNTApO1xuICB9XG5cbiAgYXdhaXQgbnMuc2xlZXAoMiAqIDEwMDApO1xuXG4gIGNvbnN0IGhhY2tpbmdTY3JpcHQgPSAnaGFjay1yZW1vdGUuanMnO1xuICBjb25zdCBzY3JpcHRSYW0gPSBucy5nZXRTY3JpcHRSYW0oaGFja2luZ1NjcmlwdCk7XG4gIGNvbnN0IHNlcnZlck1heFJhbSA9IG5zLmdldFNlcnZlck1heFJhbSgnaG9tZScpO1xuICBjb25zdCBzZXJ2ZXJVc2VkUmFtID0gbnMuZ2V0U2VydmVyVXNlZFJhbSgnaG9tZScpO1xuICBjb25zdCBhdmFpbGFibGVSYW0gPSBzZXJ2ZXJNYXhSYW0gLSBzZXJ2ZXJVc2VkUmFtO1xuICBjb25zdCBzY3JpcHROdW1UaHJlYWRzID0gKH5+KGF2YWlsYWJsZVJhbSAvIHNjcmlwdFJhbSkpO1xuXG4gIGlmIChzY3JpcHROdW1UaHJlYWRzID4gMCkge1xuICAgIG5zLnRwcmludChgTGF1bmNoaW5nIHNjcmlwdDogJHtoYWNraW5nU2NyaXB0fSB3aXRoICR7c2NyaXB0TnVtVGhyZWFkc30gdGhyZWFkc2ApO1xuICAgIG5zLmV4ZWMoaGFja2luZ1NjcmlwdCwgJ2hvbWUnLCBzY3JpcHROdW1UaHJlYWRzKTtcbiAgfVxuXG4gIG5zLnNpbmd1bGFyaXR5LnVuaXZlcnNpdHlDb3Vyc2UoJ1JvdGhtYW4gVW5pdmVyc2l0eScsICdDb21wdXRlciBTY2llbmNlJyk7XG59XG4iXX0=