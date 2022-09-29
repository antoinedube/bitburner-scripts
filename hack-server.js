export async function main(ns) {
    const target = ns.getHostname();
    ns.print('hacking server: ' + target);

    while (true) {
        await ns.hack(target);
    }
}