/** @param {NS} ns */
export function buildHackingProgramList(ns) {
    return [
        { name: 'brute-ssh', functionName: ns.brutessh, executableName: "BruteSSH.exe" },
        { name: 'ftp-crack', functionName: ns.ftpcrack, executableName: "FTPCrack.exe" },
        { name: 'relay-smtp', functionName: ns.relaysmtp, executableName: "relaySMTP.exe" },
        { name: 'http-worm', functionName: ns.httpworm, executableName: "HTTPWorm.exe" },
        { name: 'sql-inject', functionName: ns.sqlinject, executableName: "SQLInject.exe" }
    ];
}
/** @param {NS} ns */
export function listAvailablePrograms(ns, hackingPrograms) {
    let availablePrograms = [];
    for (const program of hackingPrograms) {
        if (ns.fileExists(program.executableName, "home")) {
            availablePrograms.push(program);
        }
    }
    return availablePrograms;
}
/** @param {NS} ns */
export function countAvailablePrograms(ns, hackingPrograms) {
    const availablePrograms = listAvailablePrograms(ns, hackingPrograms);
    return availablePrograms.length;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFja2luZy1wcm9ncmFtcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NjcmlwdHMvaGFja2luZy1wcm9ncmFtcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQkFBcUI7QUFDckIsTUFBTSxVQUFVLHVCQUF1QixDQUFDLEVBQUU7SUFDeEMsT0FBTztRQUNMLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFO1FBQ2hGLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFO1FBQ2hGLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFO1FBQ25GLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFO1FBQ2hGLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFO0tBQ3BGLENBQUM7QUFDSixDQUFDO0FBRUQscUJBQXFCO0FBQ3JCLE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsZUFBZTtJQUN2RCxJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUMzQixLQUFLLE1BQU0sT0FBTyxJQUFJLGVBQWUsRUFBRTtRQUNyQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNqRCxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDakM7S0FDRjtJQUNELE9BQU8saUJBQWlCLENBQUM7QUFDM0IsQ0FBQztBQUVELHFCQUFxQjtBQUNyQixNQUFNLFVBQVUsc0JBQXNCLENBQUMsRUFBRSxFQUFFLGVBQWU7SUFDeEQsTUFBTSxpQkFBaUIsR0FBRyxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDckUsT0FBTyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7QUFDbEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAcGFyYW0ge05TfSBucyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkSGFja2luZ1Byb2dyYW1MaXN0KG5zKSB7XG4gIHJldHVybiBbXG4gICAgeyBuYW1lOiAnYnJ1dGUtc3NoJywgZnVuY3Rpb25OYW1lOiBucy5icnV0ZXNzaCwgZXhlY3V0YWJsZU5hbWU6IFwiQnJ1dGVTU0guZXhlXCIgfSxcbiAgICB7IG5hbWU6ICdmdHAtY3JhY2snLCBmdW5jdGlvbk5hbWU6IG5zLmZ0cGNyYWNrLCBleGVjdXRhYmxlTmFtZTogXCJGVFBDcmFjay5leGVcIiB9LFxuICAgIHsgbmFtZTogJ3JlbGF5LXNtdHAnLCBmdW5jdGlvbk5hbWU6IG5zLnJlbGF5c210cCwgZXhlY3V0YWJsZU5hbWU6IFwicmVsYXlTTVRQLmV4ZVwiIH0sXG4gICAgeyBuYW1lOiAnaHR0cC13b3JtJywgZnVuY3Rpb25OYW1lOiBucy5odHRwd29ybSwgZXhlY3V0YWJsZU5hbWU6IFwiSFRUUFdvcm0uZXhlXCIgfSxcbiAgICB7IG5hbWU6ICdzcWwtaW5qZWN0JywgZnVuY3Rpb25OYW1lOiBucy5zcWxpbmplY3QsIGV4ZWN1dGFibGVOYW1lOiBcIlNRTEluamVjdC5leGVcIiB9XG4gIF07XG59XG5cbi8qKiBAcGFyYW0ge05TfSBucyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpc3RBdmFpbGFibGVQcm9ncmFtcyhucywgaGFja2luZ1Byb2dyYW1zKSB7XG4gIGxldCBhdmFpbGFibGVQcm9ncmFtcyA9IFtdO1xuICBmb3IgKGNvbnN0IHByb2dyYW0gb2YgaGFja2luZ1Byb2dyYW1zKSB7XG4gICAgaWYgKG5zLmZpbGVFeGlzdHMocHJvZ3JhbS5leGVjdXRhYmxlTmFtZSwgXCJob21lXCIpKSB7XG4gICAgICBhdmFpbGFibGVQcm9ncmFtcy5wdXNoKHByb2dyYW0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXZhaWxhYmxlUHJvZ3JhbXM7XG59XG5cbi8qKiBAcGFyYW0ge05TfSBucyAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvdW50QXZhaWxhYmxlUHJvZ3JhbXMobnMsIGhhY2tpbmdQcm9ncmFtcykge1xuICBjb25zdCBhdmFpbGFibGVQcm9ncmFtcyA9IGxpc3RBdmFpbGFibGVQcm9ncmFtcyhucywgaGFja2luZ1Byb2dyYW1zKTtcbiAgcmV0dXJuIGF2YWlsYWJsZVByb2dyYW1zLmxlbmd0aDtcbn1cbiJdfQ==