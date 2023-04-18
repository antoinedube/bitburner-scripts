import { scan } from "./scan.js";

/** @param {NS} ns */
export async function main(ns) {
    const fullServerList = await scan(ns);
    const serverList = fullServerList.filter(name => name.startsWith('neighbor-'));

    for (const server of serverList) {
        ns.tprint('Deleting: ' + server);
        ns.killall(server);
        ns.deleteServer(server);
    }
}
