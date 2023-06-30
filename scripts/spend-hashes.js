/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('getServerMoneyAvailable');
    ns.disableLog('sleep');
    /*
        const upgrades = ns.hacknet.getHashUpgrades();

        [
            "Sell for Money",
            "Sell for Corporation Funds",
            "Reduce Minimum Security",
            "Increase Maximum Money",
            "Improve Studying",
            "Improve Gym Training",
            "Exchange for Corporation Research",
            "Exchange for Bladeburner Rank",
            "Exchange for Bladeburner SP",
            "Generate Coding Contract",
            "Company Favor"
        ]
    */

    // Split between buy hashes and increase max money
    // if money on server <= 10t$
    // increase max money

    const amount = 1000;

    while (true) {
        const hashForMoneyCost = ns.hacknet.hashCost("Sell for Money", amount);
        if (ns.getServerMoneyAvailable("home") >= hashForMoneyCost) {
                ns.hacknet.spendHashes("Sell for Money", "target", amount);
        }

        await ns.sleep(250);
    }
}
