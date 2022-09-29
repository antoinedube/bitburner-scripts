/** @param {NS} ns */

export async function main(ns) {
    const target = ns.getHostname();
    ns.print('growing server: ' + target);

    while (true) {
        await ns.grow(target);
    }
}
