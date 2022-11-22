/** @param {NS} ns */
export async function scan(ns) {
	let servers_to_scan = ['home'];
    let serverList = [];

    while (servers_to_scan.length>0) {
        const server = servers_to_scan.pop();
        const neighbors = ns.scan(server);

        for (const neighbor of neighbors) {
            if (neighbor!='home' && !serverList.includes(neighbor)) {
                servers_to_scan.push(neighbor);
                serverList.push(neighbor);
            }
        }
    }

    return serverList;
}