import { scanAllNetwork, buildPath } from "./scan";
import { buildHackingProgramList, countAvailablePrograms } from "./hacking-programs";
async function openPorts(ns, hackingPrograms, target) {
    for (const program of hackingPrograms) {
        if (ns.fileExists(program.executableName, "home")) {
            const executable = program['functionName'].bind(ns);
            executable(target);
        }
    }
}
function launchScript(ns, script, server) {
    const scriptRam = ns.getScriptRam(script);
    const availableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    const scriptNumThreads = ~~(availableRam / scriptRam);
    if (scriptNumThreads > 0) {
        ns.exec(script, server, scriptNumThreads);
    }
}
export async function main(ns) {
    ns.disableLog('ALL');
    const replace = false; // Replace an existing script
    while (true) {
        const fullServerList = scanAllNetwork(ns, 'home');
        const filteredServerList = fullServerList.filter(name => !name.startsWith('neighbor-') && !name.startsWith('hacknet-'));
        for (const server of filteredServerList) {
            ns.print(`Current server: ${server}`);
            const playerHackingLevel = ns.getHackingLevel();
            const hackingPrograms = buildHackingProgramList(ns);
            const numberAvailablePrograms = countAvailablePrograms(ns, hackingPrograms);
            // Check server level vs player level
            const machineHackingLevel = ns.getServerRequiredHackingLevel(server);
            ns.print(`Level player: ${playerHackingLevel}, level machine: ${machineHackingLevel}`);
            // Check number of ports required vs number of programs available
            const requiredNumberOfPorts = ns.getServerNumPortsRequired(server);
            ns.print(`Required num ports: ${requiredNumberOfPorts}, number available programs: ${numberAvailablePrograms}`);
            if (playerHackingLevel < machineHackingLevel) {
                ns.print('----------\n');
                continue;
            }
            if (numberAvailablePrograms < requiredNumberOfPorts) {
                ns.print('----------\n');
                continue;
            }
            if (!ns.hasRootAccess(server)) {
                await openPorts(ns, hackingPrograms, server);
                ns.nuke(server);
                if (server == 'w0r1d_d43m0n') {
                    ns.tprint('\n#########################################\n#  w0r1d_d43m0n is now root-accessible  #\n#########################################');
                }
            }
            ns.print(`hasRootAccess: ${ns.hasRootAccess(server)}`);
            const isBackdoorInstalled = ns.getServer(server).backdoorInstalled;
            ns.print(`isBackdoorInstalled: ${isBackdoorInstalled}`);
            if (ns.hasRootAccess(server) && !isBackdoorInstalled && server != 'w0r1d_d43m0n') {
                const path = await buildPath(ns, server);
                for (let item of path) {
                    // ns.print(`Connecting to ${item} from ${ns.singularity.getCurrentServer()}`);
                    if (!ns.singularity.connect(item)) {
                        ns.print(`Error while connecting to ${item}`);
                    }
                    ;
                }
                ns.print('Installing backdoor');
                await ns.singularity.installBackdoor();
                ns.print('Backdoor installed');
                for (let item of path.reverse()) {
                    if (!ns.singularity.connect(item)) {
                        ns.print(`Error while connecting to ${item}`);
                    }
                    ;
                }
            }
            if (replace) {
                ns.killall(server);
            }
            if (replace || !ns.fileExists('hack-server.js', server)) {
                const scpStatus = ns.scp('hack-server.js', server, 'home');
                if (!scpStatus) {
                    ns.print(`Failed to copy hack-server.js on ${server}`);
                }
            }
            if (!ns.isRunning('hack-server.js', server)) {
                launchScript(ns, 'hack-server.js', server);
            }
            ns.print('----------\n');
        }
        if (replace) {
            break;
        }
        await ns.sleep(1000 * 5);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF1bmNoLWhhY2tpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zY3JpcHRzL2xhdW5jaC1oYWNraW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQ25ELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxzQkFBc0IsRUFBd0IsTUFBTSxvQkFBb0IsQ0FBQztBQUUzRyxLQUFLLFVBQVUsU0FBUyxDQUFDLEVBQU0sRUFBRSxlQUF1QyxFQUFFLE1BQWM7SUFDdEYsS0FBSyxNQUFNLE9BQU8sSUFBSSxlQUFlLEVBQUU7UUFDckMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDakQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwRCxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDcEI7S0FDRjtBQUNILENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxFQUFNLEVBQUUsTUFBYyxFQUFFLE1BQWM7SUFDMUQsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQyxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5RSxNQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsQ0FBQztJQUV0RCxJQUFJLGdCQUFnQixHQUFHLENBQUMsRUFBRTtRQUN4QixFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztLQUMzQztBQUNILENBQUM7QUFFRCxNQUFNLENBQUMsS0FBSyxVQUFV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LENBQUMsQ0FBQyxDQUFDO0tBQzFCO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5TIH0gZnJvbSBcIkBuc1wiO1xuXG5pbXBvcnQgeyBzY2FuQWxsTmV0d29yaywgYnVpbGRQYXRoIH0gZnJvbSBcIi4vc2NhblwiO1xuaW1wb3J0IHsgYnVpbGRIYWNraW5nUHJvZ3JhbUxpc3QsIGNvdW50QXZhaWxhYmxlUHJvZ3JhbXMsIEhhY2tpbmdQcm9ncmFtRGV0YWlsIH0gZnJvbSBcIi4vaGFja2luZy1wcm9ncmFtc1wiO1xuXG5hc3luYyBmdW5jdGlvbiBvcGVuUG9ydHMobnM6IE5TLCBoYWNraW5nUHJvZ3JhbXM6IEhhY2tpbmdQcm9ncmFtRGV0YWlsW10sIHRhcmdldDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGZvciAoY29uc3QgcHJvZ3JhbSBvZiBoYWNraW5nUHJvZ3JhbXMpIHtcbiAgICBpZiAobnMuZmlsZUV4aXN0cyhwcm9ncmFtLmV4ZWN1dGFibGVOYW1lLCBcImhvbWVcIikpIHtcbiAgICAgIGNvbnN0IGV4ZWN1dGFibGUgPSBwcm9ncmFtWydmdW5jdGlvbk5hbWUnXS5iaW5kKG5zKTtcbiAgICAgIGV4ZWN1dGFibGUodGFyZ2V0KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbGF1bmNoU2NyaXB0KG5zOiBOUywgc2NyaXB0OiBzdHJpbmcsIHNlcnZlcjogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IHNjcmlwdFJhbSA9IG5zLmdldFNjcmlwdFJhbShzY3JpcHQpO1xuICBjb25zdCBhdmFpbGFibGVSYW0gPSBucy5nZXRTZXJ2ZXJNYXhSYW0oc2VydmVyKSAtIG5zLmdldFNlcnZlclVzZWRSYW0oc2VydmVyKTtcbiAgY29uc3Qgc2NyaXB0TnVtVGhyZWFkcyA9IH5+KGF2YWlsYWJsZVJhbSAvIHNjcmlwdFJhbSk7XG5cbiAgaWYgKHNjcmlwdE51bVRocmVhZHMgPiAwKSB7XG4gICAgbnMuZXhlYyhzY3JpcHQsIHNlcnZlciwgc2NyaXB0TnVtVGhyZWFkcyk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnM6IE5TKTogUHJvbWlzZTx2b2lkPiB7XG4gIG5zLmRpc2FibGVMb2coJ0FMTCcpO1xuXG4gIGNvbnN0IHJlcGxhY2UgPSBmYWxzZTsgIC8vIFJlcGxhY2UgYW4gZXhpc3Rpbmcgc2NyaXB0XG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBjb25zdCBmdWxsU2VydmVyTGlzdCA9IHNjYW5BbGxOZXR3b3JrKG5zLCAnaG9tZScpO1xuICAgIGNvbnN0IGZpbHRlcmVkU2VydmVyTGlzdCA9IGZ1bGxTZXJ2ZXJMaXN0LmZpbHRlcihuYW1lID0+ICFuYW1lLnN0YXJ0c1dpdGgoJ25laWdoYm9yLScpICYmICFuYW1lLnN0YXJ0c1dpdGgoJ2hhY2tuZXQtJykpO1xuXG4gICAgZm9yIChjb25zdCBzZXJ2ZXIgb2YgZmlsdGVyZWRTZXJ2ZXJMaXN0KSB7XG4gICAgICBucy5wcmludChgQ3VycmVudCBzZXJ2ZXI6ICR7c2VydmVyfWApO1xuXG4gICAgICBjb25zdCBwbGF5ZXJIYWNraW5nTGV2ZWwgPSBucy5nZXRIYWNraW5nTGV2ZWwoKTtcbiAgICAgIGNvbnN0IGhhY2tpbmdQcm9ncmFtcyA9IGJ1aWxkSGFja2luZ1Byb2dyYW1MaXN0KG5zKTtcbiAgICAgIGNvbnN0IG51bWJlckF2YWlsYWJsZVByb2dyYW1zID0gY291bnRBdmFpbGFibGVQcm9ncmFtcyhucywgaGFja2luZ1Byb2dyYW1zKTtcblxuICAgICAgLy8gQ2hlY2sgc2VydmVyIGxldmVsIHZzIHBsYXllciBsZXZlbFxuICAgICAgY29uc3QgbWFjaGluZUhhY2tpbmdMZXZlbCA9IG5zLmdldFNlcnZlclJlcXVpcmVkSGFja2luZ0xldmVsKHNlcnZlcik7XG4gICAgICBucy5wcmludChgTGV2ZWwgcGxheWVyOiAke3BsYXllckhhY2tpbmdMZXZlbH0sIGxldmVsIG1hY2hpbmU6ICR7bWFjaGluZUhhY2tpbmdMZXZlbH1gKTtcblxuICAgICAgLy8gQ2hlY2sgbnVtYmVyIG9mIHBvcnRzIHJlcXVpcmVkIHZzIG51bWJlciBvZiBwcm9ncmFtcyBhdmFpbGFibGVcbiAgICAgIGNvbnN0IHJlcXVpcmVkTnVtYmVyT2ZQb3J0cyA9IG5zLmdldFNlcnZlck51bVBvcnRzUmVxdWlyZWQoc2VydmVyKTtcbiAgICAgIG5zLnByaW50KGBSZXF1aXJlZCBudW0gcG9ydHM6ICR7cmVxdWlyZWROdW1iZXJPZlBvcnRzfSwgbnVtYmVyIGF2YWlsYWJsZSBwcm9ncmFtczogJHtudW1iZXJBdmFpbGFibGVQcm9ncmFtc31gKTtcblxuICAgICAgaWYgKHBsYXllckhhY2tpbmdMZXZlbCA8IG1hY2hpbmVIYWNraW5nTGV2ZWwpIHtcbiAgICAgICAgbnMucHJpbnQoJy0tLS0tLS0tLS1cXG4nKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChudW1iZXJBdmFpbGFibGVQcm9ncmFtcyA8IHJlcXVpcmVkTnVtYmVyT2ZQb3J0cykge1xuICAgICAgICBucy5wcmludCgnLS0tLS0tLS0tLVxcbicpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFucy5oYXNSb290QWNjZXNzKHNlcnZlcikpIHtcbiAgICAgICAgYXdhaXQgb3BlblBvcnRzKG5zLCBoYWNraW5nUHJvZ3JhbXMsIHNlcnZlcik7XG4gICAgICAgIG5zLm51a2Uoc2VydmVyKTtcblxuICAgICAgICBpZiAoc2VydmVyID09ICd3MHIxZF9kNDNtMG4nKSB7XG4gICAgICAgICAgbnMudHByaW50KCdcXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xcbiMgIHcwcjFkX2Q0M20wbiBpcyBub3cgcm9vdC1hY2Nlc3NpYmxlICAjXFxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBucy5wcmludChgaGFzUm9vdEFjY2VzczogJHtucy5oYXNSb290QWNjZXNzKHNlcnZlcil9YCk7XG5cbiAgICAgIGNvbnN0IGlzQmFja2Rvb3JJbnN0YWxsZWQgPSBucy5nZXRTZXJ2ZXIoc2VydmVyKS5iYWNrZG9vckluc3RhbGxlZDtcbiAgICAgIG5zLnByaW50KGBpc0JhY2tkb29ySW5zdGFsbGVkOiAke2lzQmFja2Rvb3JJbnN0YWxsZWR9YCk7XG4gICAgICBpZiAobnMuaGFzUm9vdEFjY2VzcyhzZXJ2ZXIpICYmICFpc0JhY2tkb29ySW5zdGFsbGVkICYmIHNlcnZlciAhPSAndzByMWRfZDQzbTBuJykge1xuICAgICAgICBjb25zdCBwYXRoID0gYXdhaXQgYnVpbGRQYXRoKG5zLCBzZXJ2ZXIpO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHBhdGgpIHtcbiAgICAgICAgICAvLyBucy5wcmludChgQ29ubmVjdGluZyB0byAke2l0ZW19IGZyb20gJHtucy5zaW5ndWxhcml0eS5nZXRDdXJyZW50U2VydmVyKCl9YCk7XG4gICAgICAgICAgaWYgKCFucy5zaW5ndWxhcml0eS5jb25uZWN0KGl0ZW0pKSB7XG4gICAgICAgICAgICBucy5wcmludChgRXJyb3Igd2hpbGUgY29ubmVjdGluZyB0byAke2l0ZW19YCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5zLnByaW50KCdJbnN0YWxsaW5nIGJhY2tkb29yJyk7XG4gICAgICAgIGF3YWl0IG5zLnNpbmd1bGFyaXR5Lmluc3RhbGxCYWNrZG9vcigpO1xuICAgICAgICBucy5wcmludCgnQmFja2Rvb3IgaW5zdGFsbGVkJyk7XG5cbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBwYXRoLnJldmVyc2UoKSkge1xuICAgICAgICAgIGlmICghbnMuc2luZ3VsYXJpdHkuY29ubmVjdChpdGVtKSkge1xuICAgICAgICAgICAgbnMucHJpbnQoYEVycm9yIHdoaWxlIGNvbm5lY3RpbmcgdG8gJHtpdGVtfWApO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHJlcGxhY2UpIHtcbiAgICAgICAgbnMua2lsbGFsbChzZXJ2ZXIpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVwbGFjZSB8fCAhbnMuZmlsZUV4aXN0cygnaGFjay1zZXJ2ZXIuanMnLCBzZXJ2ZXIpKSB7XG4gICAgICAgIGNvbnN0IHNjcFN0YXR1cyA9IG5zLnNjcCgnaGFjay1zZXJ2ZXIuanMnLCBzZXJ2ZXIsICdob21lJyk7XG4gICAgICAgIGlmICghc2NwU3RhdHVzKSB7XG4gICAgICAgICAgbnMucHJpbnQoYEZhaWxlZCB0byBjb3B5IGhhY2stc2VydmVyLmpzIG9uICR7c2VydmVyfWApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghbnMuaXNSdW5uaW5nKCdoYWNrLXNlcnZlci5qcycsIHNlcnZlcikpIHtcbiAgICAgICAgbGF1bmNoU2NyaXB0KG5zLCAnaGFjay1zZXJ2ZXIuanMnLCBzZXJ2ZXIpO1xuICAgICAgfVxuXG4gICAgICBucy5wcmludCgnLS0tLS0tLS0tLVxcbicpO1xuICAgIH1cblxuICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBhd2FpdCBucy5zbGVlcCgxMDAwICogNSk7XG4gIH1cbn1cbiJdfQ==