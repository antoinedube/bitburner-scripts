/** @param {NS} ns */
export async function main(ns) {
    if (ns.gang) {
        ns.tprint("ns.gang is true");
    } else {
        ns.tprint("ns.gang is false");
    }
}
