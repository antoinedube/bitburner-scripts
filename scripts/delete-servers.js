/** @param {NS} ns */
export async function main(ns) {
    for (let i=0; i<25; i++) {
        const index = i+1;
        ns.tprint('Deleting: ' + 'neighbor-' + index);
        ns.killall('neighbor-' + index);
		ns.deleteServer('neighbor-' + index);
    }
}