/** @param {NS} ns */
export async function main(ns) {
	let servers_to_scan = ['home'];
	let hacked_servers = [];

	let counter = 0;

	while (servers_to_scan.length>0) {
		const server = servers_to_scan.pop();

		hacked_servers.push(server);
		const neighbors = ns.scan(server);

		ns.print('on server: ' + server);
		ns.print('\tneighbors:\n' + JSON.stringify(neighbors));

		for (const neighbor of neighbors) {
			if (!hacked_servers.includes(neighbor)) {
				ns.print('Copying script to ' + neighbor);
				ns.scp(['hack-server.js', 'grow-server.js', 'weaken-server.js'], neighbor);
			}
			
			ns.print('Hacking ' + neighbor + ' from ' + server);
			ns.exec('hack-server.js', server, 1, neighbor);
			
			ns.print('Growing ' + neighbor + ' from ' + server);
			ns.exec('grow-server.js', server, 1, neighbor);
			
			ns.print('Weakening ' + neighbor + ' from ' + server);
			ns.exec('weaken-server.js', server, 1, neighbor);
			
			
			if (!servers_to_scan.includes(neighbor) && !hacked_servers.includes(neighbor)) {
				servers_to_scan.push(neighbor);
			}
		}

		if (counter>=100) {
			ns.print('Counter is at ' + counter);
			break;
		}

		counter++;
	}
}