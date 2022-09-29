export async function main(ns) {
    const target = ns.getHostname();
    ns.print('weakening server: ' + target);

    while (true) {
        await ns.weaken(target);
    }
}