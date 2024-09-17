import { scanAllNetwork, buildPath } from "./scan.js";
import { buildHackingProgramList, countAvailablePrograms } from "./hacking-programs.js";
/** @param {NS} ns */
async function openPorts(ns, hackingPrograms, target) {
    for (const program of hackingPrograms) {
        if (ns.fileExists(program.executableName, "home")) {
            const executable = program['functionName'].bind(ns);
            await executable(target);
        }
    }
}
/** @param {NS} ns */
function launchScript(ns, script, server) {
    const scriptRam = ns.getScriptRam(script);
    const availableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    const scriptNumThreads = ~~(availableRam / scriptRam);
    if (scriptNumThreads > 0) {
        ns.exec(script, server, scriptNumThreads);
    }
}
/** @param {NS} ns */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF1bmNoLWhhY2tpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zY3JpcHRzL2xhdW5jaC1oYWNraW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3RELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRXhGLHFCQUFxQjtBQUNyQixLQUFLLFVBQVUsU0FBUyxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUUsTUFBTTtJQUNsRCxLQUFLLE1BQU0sT0FBTyxJQUFJLGVBQWUsRUFBRTtRQUNyQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNqRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzFCO0tBQ0Y7QUFDSCxDQUFDO0FBRUQscUJBQXFCO0FBQ3JCLFNBQVMsWUFBWSxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTTtJQUN0QyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlFLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxDQUFDO0lBRXRELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxFQUFFO1FBQ3hCLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0tBQzNDO0FBQ0gs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Q1A7UUFFRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQzFCO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNjYW5BbGxOZXR3b3JrLCBidWlsZFBhdGggfSBmcm9tIFwiLi9zY2FuLmpzXCI7XG5pbXBvcnQgeyBidWlsZEhhY2tpbmdQcm9ncmFtTGlzdCwgY291bnRBdmFpbGFibGVQcm9ncmFtcyB9IGZyb20gXCIuL2hhY2tpbmctcHJvZ3JhbXMuanNcIjtcblxuLyoqIEBwYXJhbSB7TlN9IG5zICovXG5hc3luYyBmdW5jdGlvbiBvcGVuUG9ydHMobnMsIGhhY2tpbmdQcm9ncmFtcywgdGFyZ2V0KSB7XG4gIGZvciAoY29uc3QgcHJvZ3JhbSBvZiBoYWNraW5nUHJvZ3JhbXMpIHtcbiAgICBpZiAobnMuZmlsZUV4aXN0cyhwcm9ncmFtLmV4ZWN1dGFibGVOYW1lLCBcImhvbWVcIikpIHtcbiAgICAgIGNvbnN0IGV4ZWN1dGFibGUgPSBwcm9ncmFtWydmdW5jdGlvbk5hbWUnXS5iaW5kKG5zKTtcbiAgICAgIGF3YWl0IGV4ZWN1dGFibGUodGFyZ2V0KTtcbiAgICB9XG4gIH1cbn1cblxuLyoqIEBwYXJhbSB7TlN9IG5zICovXG5mdW5jdGlvbiBsYXVuY2hTY3JpcHQobnMsIHNjcmlwdCwgc2VydmVyKSB7XG4gIGNvbnN0IHNjcmlwdFJhbSA9IG5zLmdldFNjcmlwdFJhbShzY3JpcHQpO1xuICBjb25zdCBhdmFpbGFibGVSYW0gPSBucy5nZXRTZXJ2ZXJNYXhSYW0oc2VydmVyKSAtIG5zLmdldFNlcnZlclVzZWRSYW0oc2VydmVyKTtcbiAgY29uc3Qgc2NyaXB0TnVtVGhyZWFkcyA9IH5+KGF2YWlsYWJsZVJhbSAvIHNjcmlwdFJhbSk7XG5cbiAgaWYgKHNjcmlwdE51bVRocmVhZHMgPiAwKSB7XG4gICAgbnMuZXhlYyhzY3JpcHQsIHNlcnZlciwgc2NyaXB0TnVtVGhyZWFkcyk7XG4gIH1cbn1cblxuLyoqIEBwYXJhbSB7TlN9IG5zICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFpbihucykge1xuICBucy5kaXNhYmxlTG9nKCdBTEwnKTtcblxuICBjb25zdCByZXBsYWNlID0gZmFsc2U7ICAvLyBSZXBsYWNlIGFuIGV4aXN0aW5nIHNjcmlwdFxuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgY29uc3QgZnVsbFNlcnZlckxpc3QgPSBzY2FuQWxsTmV0d29yayhucywgJ2hvbWUnKTtcbiAgICBjb25zdCBmaWx0ZXJlZFNlcnZlckxpc3QgPSBmdWxsU2VydmVyTGlzdC5maWx0ZXIobmFtZSA9PiAhbmFtZS5zdGFydHNXaXRoKCduZWlnaGJvci0nKSAmJiAhbmFtZS5zdGFydHNXaXRoKCdoYWNrbmV0LScpKTtcblxuICAgIGZvciAoY29uc3Qgc2VydmVyIG9mIGZpbHRlcmVkU2VydmVyTGlzdCkge1xuICAgICAgbnMucHJpbnQoYEN1cnJlbnQgc2VydmVyOiAke3NlcnZlcn1gKTtcblxuICAgICAgY29uc3QgcGxheWVySGFja2luZ0xldmVsID0gbnMuZ2V0SGFja2luZ0xldmVsKCk7XG4gICAgICBjb25zdCBoYWNraW5nUHJvZ3JhbXMgPSBidWlsZEhhY2tpbmdQcm9ncmFtTGlzdChucyk7XG4gICAgICBjb25zdCBudW1iZXJBdmFpbGFibGVQcm9ncmFtcyA9IGNvdW50QXZhaWxhYmxlUHJvZ3JhbXMobnMsIGhhY2tpbmdQcm9ncmFtcyk7XG5cbiAgICAgIC8vIENoZWNrIHNlcnZlciBsZXZlbCB2cyBwbGF5ZXIgbGV2ZWxcbiAgICAgIGNvbnN0IG1hY2hpbmVIYWNraW5nTGV2ZWwgPSBucy5nZXRTZXJ2ZXJSZXF1aXJlZEhhY2tpbmdMZXZlbChzZXJ2ZXIpO1xuICAgICAgbnMucHJpbnQoYExldmVsIHBsYXllcjogJHtwbGF5ZXJIYWNraW5nTGV2ZWx9LCBsZXZlbCBtYWNoaW5lOiAke21hY2hpbmVIYWNraW5nTGV2ZWx9YCk7XG5cbiAgICAgIC8vIENoZWNrIG51bWJlciBvZiBwb3J0cyByZXF1aXJlZCB2cyBudW1iZXIgb2YgcHJvZ3JhbXMgYXZhaWxhYmxlXG4gICAgICBjb25zdCByZXF1aXJlZE51bWJlck9mUG9ydHMgPSBucy5nZXRTZXJ2ZXJOdW1Qb3J0c1JlcXVpcmVkKHNlcnZlcik7XG4gICAgICBucy5wcmludChgUmVxdWlyZWQgbnVtIHBvcnRzOiAke3JlcXVpcmVkTnVtYmVyT2ZQb3J0c30sIG51bWJlciBhdmFpbGFibGUgcHJvZ3JhbXM6ICR7bnVtYmVyQXZhaWxhYmxlUHJvZ3JhbXN9YCk7XG5cbiAgICAgIGlmIChwbGF5ZXJIYWNraW5nTGV2ZWwgPCBtYWNoaW5lSGFja2luZ0xldmVsKSB7XG4gICAgICAgIG5zLnByaW50KCctLS0tLS0tLS0tXFxuJyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobnVtYmVyQXZhaWxhYmxlUHJvZ3JhbXMgPCByZXF1aXJlZE51bWJlck9mUG9ydHMpIHtcbiAgICAgICAgbnMucHJpbnQoJy0tLS0tLS0tLS1cXG4nKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghbnMuaGFzUm9vdEFjY2VzcyhzZXJ2ZXIpKSB7XG4gICAgICAgIGF3YWl0IG9wZW5Qb3J0cyhucywgaGFja2luZ1Byb2dyYW1zLCBzZXJ2ZXIpO1xuICAgICAgICBucy5udWtlKHNlcnZlcik7XG5cbiAgICAgICAgaWYgKHNlcnZlciA9PSAndzByMWRfZDQzbTBuJykge1xuICAgICAgICAgIG5zLnRwcmludCgnXFxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcXG4jICB3MHIxZF9kNDNtMG4gaXMgbm93IHJvb3QtYWNjZXNzaWJsZSAgI1xcbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbnMucHJpbnQoYGhhc1Jvb3RBY2Nlc3M6ICR7bnMuaGFzUm9vdEFjY2VzcyhzZXJ2ZXIpfWApO1xuXG4gICAgICBjb25zdCBpc0JhY2tkb29ySW5zdGFsbGVkID0gbnMuZ2V0U2VydmVyKHNlcnZlcikuYmFja2Rvb3JJbnN0YWxsZWQ7XG4gICAgICBucy5wcmludChgaXNCYWNrZG9vckluc3RhbGxlZDogJHtpc0JhY2tkb29ySW5zdGFsbGVkfWApO1xuICAgICAgaWYgKG5zLmhhc1Jvb3RBY2Nlc3Moc2VydmVyKSAmJiAhaXNCYWNrZG9vckluc3RhbGxlZCAmJiBzZXJ2ZXIgIT0gJ3cwcjFkX2Q0M20wbicpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IGF3YWl0IGJ1aWxkUGF0aChucywgc2VydmVyKTtcbiAgICAgICAgZm9yIChsZXQgaXRlbSBvZiBwYXRoKSB7XG4gICAgICAgICAgLy8gbnMucHJpbnQoYENvbm5lY3RpbmcgdG8gJHtpdGVtfSBmcm9tICR7bnMuc2luZ3VsYXJpdHkuZ2V0Q3VycmVudFNlcnZlcigpfWApO1xuICAgICAgICAgIGlmICghbnMuc2luZ3VsYXJpdHkuY29ubmVjdChpdGVtKSkge1xuICAgICAgICAgICAgbnMucHJpbnQoYEVycm9yIHdoaWxlIGNvbm5lY3RpbmcgdG8gJHtpdGVtfWApO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBucy5wcmludCgnSW5zdGFsbGluZyBiYWNrZG9vcicpO1xuICAgICAgICBhd2FpdCBucy5zaW5ndWxhcml0eS5pbnN0YWxsQmFja2Rvb3IoKTtcbiAgICAgICAgbnMucHJpbnQoJ0JhY2tkb29yIGluc3RhbGxlZCcpO1xuXG4gICAgICAgIGZvciAobGV0IGl0ZW0gb2YgcGF0aC5yZXZlcnNlKCkpIHtcbiAgICAgICAgICBpZiAoIW5zLnNpbmd1bGFyaXR5LmNvbm5lY3QoaXRlbSkpIHtcbiAgICAgICAgICAgIG5zLnByaW50KGBFcnJvciB3aGlsZSBjb25uZWN0aW5nIHRvICR7aXRlbX1gKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICAgIG5zLmtpbGxhbGwoc2VydmVyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlcGxhY2UgfHwgIW5zLmZpbGVFeGlzdHMoJ2hhY2stc2VydmVyLmpzJywgc2VydmVyKSkge1xuICAgICAgICBjb25zdCBzY3BTdGF0dXMgPSBucy5zY3AoJ2hhY2stc2VydmVyLmpzJywgc2VydmVyLCAnaG9tZScpO1xuICAgICAgICBpZiAoIXNjcFN0YXR1cykge1xuICAgICAgICAgIG5zLnByaW50KGBGYWlsZWQgdG8gY29weSBoYWNrLXNlcnZlci5qcyBvbiAke3NlcnZlcn1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIW5zLmlzUnVubmluZygnaGFjay1zZXJ2ZXIuanMnLCBzZXJ2ZXIpKSB7XG4gICAgICAgIGxhdW5jaFNjcmlwdChucywgJ2hhY2stc2VydmVyLmpzJywgc2VydmVyKTtcbiAgICAgIH1cblxuICAgICAgbnMucHJpbnQoJy0tLS0tLS0tLS1cXG4nKTtcbiAgICB9XG5cbiAgICBpZiAocmVwbGFjZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgYXdhaXQgbnMuc2xlZXAoMTAwMCAqIDUpO1xuICB9XG59XG4iXX0=