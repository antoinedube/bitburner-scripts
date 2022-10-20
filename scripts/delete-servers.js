/** @param {NS} ns */
export async function main(ns) {
    for (let i=0; i<25; i++) {
        ns.tprint('Deleting: ' + 'neighbor-' + i + '1');
        ns.killall('neighbor-' + i + '1');
		ns.deleteServer('neighbor-' + i + '1');
    }
}