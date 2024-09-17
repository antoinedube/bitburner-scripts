import { scanAllNetwork } from "./scan.js";
/** @param {NS} ns */
async function spendHashesOnAction(ns, action, target, amount) {
    if (ns.hacknet.hashCapacity() <= ns.hacknet.hashCost(action, amount)) {
        ns.print(`Hash capacity is too low for ${action}`);
        return;
    }
    while (ns.hacknet.numHashes() < ns.hacknet.hashCost(action, amount)) {
        await ns.sleep(1000);
    }
    if (!ns.hacknet.spendHashes(action, target, amount)) {
        ns.print(`Error while executing ${action} on ${target} with n=${amount}`);
    }
}
/** @param {NS} ns */
function selectRandomServer(ns) {
    const serversToAvoid = ['CSEC', 'I.I.I.I', 'run4theh111z', 'avmnite-02h', '.', 'darkweb', 'The-Cave', 'w0r1d_d43m0n'];
    const fullServerList = scanAllNetwork(ns, 'home');
    const filteredServerList = fullServerList.filter(name => !name.startsWith('neighbor-') && !name.startsWith('hacknet-') && !serversToAvoid.includes(name));
    const serverIndex = Math.floor(Math.random() * filteredServerList.length);
    return filteredServerList[serverIndex];
}
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog('ALL');
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
    const ten_trillions = 10 * 1000 * 1000 * 1000 * 1000; // k -> m -> g -> t
    const hacking_level_boundary = 3000;
    while (true) {
        // Change probabilities based on hacking level
        // Low hacking level: more spending on money
        // High hacking level: more spending on reducing security / increasing money on servers
        const r = Math.random();
        if (r < 0.1) {
            const target = selectRandomServer(ns);
            const minLevel = ns.getServerMinSecurityLevel(target);
            if (minLevel > 1.0 && ns.getHackingLevel() > hacking_level_boundary) {
                await spendHashesOnAction(ns, "Reduce Minimum Security", target, 1);
                const minLevelAfter = ns.getServerMinSecurityLevel(target);
                ns.print(`Reduced minimum security level on ${target} from ${ns.formatNumber(minLevel)} to ${ns.formatNumber(minLevelAfter)}`);
            }
        }
        else if (r < 0.2) {
            const target = selectRandomServer(ns);
            const maxMoney = ns.getServerMaxMoney(target);
            if (maxMoney < ten_trillions && ns.getHackingLevel() > hacking_level_boundary) {
                await spendHashesOnAction(ns, "Increase Maximum Money", target, 1);
                const maxMoneyAfter = ns.getServerMaxMoney(target);
                ns.print(`Increased maximum money on ${target} from ${ns.formatNumber(maxMoney)}\$ to ${ns.formatNumber(maxMoneyAfter)}\$`);
            }
        }
        else if (r < 0.25) {
            if (ns.getHackingLevel() > hacking_level_boundary) {
                await spendHashesOnAction(ns, "Improve Studying", "target", 1);
                ns.print('Improved studying');
            }
        }
        else {
            const sellAmount = ns.hacknet.numHashes() / 5.0;
            if (sellAmount < 1) {
                await spendHashesOnAction(ns, "Sell for Money", "target", 1);
                ns.print(`Sold hashes for money (${ns.formatNumber(1)})`);
            }
            else {
                await spendHashesOnAction(ns, "Sell for Money", "target", sellAmount);
                ns.print(`Sold hashes for money (${ns.formatNumber(sellAmount)})`);
            }
        }
        await ns.sleep(1000);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlbmQtaGFzaGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc2NyaXB0cy9zcGVuZC1oYXNoZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUUzQyxxQkFBcUI7QUFDckIsS0FBSyxVQUFVLG1CQUFtQixDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU07SUFDNUQsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRTtRQUNyRSxFQUFFLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ25ELE9BQU87S0FDUDtJQUVELE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDcEUsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3JCO0lBRUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQUU7UUFDcEQsRUFBRSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsTUFBTSxPQUFPLE1BQU0sV0FBVyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0tBQzFFO0FBQ0YsQ0FBQztBQUVELHFCQUFxQjtBQUNyQixTQUFTLGtCQUFrQixDQUFDLEVBQUU7SUFDN0IsTUFBTSxjQUFjLEdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFFdEgsTUFBTSxjQUFjLEdBQUcsY0FB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RSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2FBQzlCO1NBQ0Q7YUFDSTtZQUNKLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDO1lBRWhELElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtnQkFDbkIsTUFBTSxtQkFBbUIsQ0FBQyxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM3RCxFQUFFLENBQUMsS0FBSyxDQUFDLDBCQUEwQixFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUMxRDtpQkFBTTtnQkFDTixNQUFNLG1CQUFtQixDQUFDLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ3RFLEVBQUUsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25FO1NBQ0Q7UUFFRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDckI7QUFDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgc2NhbkFsbE5ldHdvcmsgfSBmcm9tIFwiLi9zY2FuLmpzXCI7XG5cbi8qKiBAcGFyYW0ge05TfSBucyAqL1xuYXN5bmMgZnVuY3Rpb24gc3BlbmRIYXNoZXNPbkFjdGlvbihucywgYWN0aW9uLCB0YXJnZXQsIGFtb3VudCkge1xuXHRpZiAobnMuaGFja25ldC5oYXNoQ2FwYWNpdHkoKSA8PSBucy5oYWNrbmV0Lmhhc2hDb3N0KGFjdGlvbiwgYW1vdW50KSkge1xuXHRcdG5zLnByaW50KGBIYXNoIGNhcGFjaXR5IGlzIHRvbyBsb3cgZm9yICR7YWN0aW9ufWApO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHdoaWxlIChucy5oYWNrbmV0Lm51bUhhc2hlcygpIDwgbnMuaGFja25ldC5oYXNoQ29zdChhY3Rpb24sIGFtb3VudCkpIHtcblx0XHRhd2FpdCBucy5zbGVlcCgxMDAwKTtcblx0fVxuXG5cdGlmICghbnMuaGFja25ldC5zcGVuZEhhc2hlcyhhY3Rpb24sIHRhcmdldCwgYW1vdW50KSkge1xuXHRcdG5zLnByaW50KGBFcnJvciB3aGlsZSBleGVjdXRpbmcgJHthY3Rpb259IG9uICR7dGFyZ2V0fSB3aXRoIG49JHthbW91bnR9YCk7XG5cdH1cbn1cblxuLyoqIEBwYXJhbSB7TlN9IG5zICovXG5mdW5jdGlvbiBzZWxlY3RSYW5kb21TZXJ2ZXIobnMpIHtcblx0Y29uc3Qgc2VydmVyc1RvQXZvaWQgPSBbJ0NTRUMnLCAnSS5JLkkuSScsICdydW40dGhlaDExMXonLCAnYXZtbml0ZS0wMmgnLCAnLicsICdkYXJrd2ViJywgJ1RoZS1DYXZlJywgJ3cwcjFkX2Q0M20wbiddO1xuXG5cdGNvbnN0IGZ1bGxTZXJ2ZXJMaXN0ID0gc2NhbkFsbE5ldHdvcmsobnMsICdob21lJyk7XG5cdGNvbnN0IGZpbHRlcmVkU2VydmVyTGlzdCA9IGZ1bGxTZXJ2ZXJMaXN0LmZpbHRlcihuYW1lID0+ICFuYW1lLnN0YXJ0c1dpdGgoJ25laWdoYm9yLScpICYmICFuYW1lLnN0YXJ0c1dpdGgoJ2hhY2tuZXQtJykgJiYgIXNlcnZlcnNUb0F2b2lkLmluY2x1ZGVzKG5hbWUpKTtcblx0Y29uc3Qgc2VydmVySW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBmaWx0ZXJlZFNlcnZlckxpc3QubGVuZ3RoKTtcblx0cmV0dXJuIGZpbHRlcmVkU2VydmVyTGlzdFtzZXJ2ZXJJbmRleF07XG59XG5cbi8qKiBAcGFyYW0ge05TfSBucyAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4obnMpIHtcblx0bnMuZGlzYWJsZUxvZygnQUxMJyk7XG5cblx0Lypcblx0XHRjb25zdCB1cGdyYWRlcyA9IG5zLmhhY2tuZXQuZ2V0SGFzaFVwZ3JhZGVzKCk7XG5cblx0XHRbXG5cdFx0XHRcIlNlbGwgZm9yIE1vbmV5XCIsXG5cdFx0XHRcIlNlbGwgZm9yIENvcnBvcmF0aW9uIEZ1bmRzXCIsXG5cdFx0XHRcIlJlZHVjZSBNaW5pbXVtIFNlY3VyaXR5XCIsXG5cdFx0XHRcIkluY3JlYXNlIE1heGltdW0gTW9uZXlcIixcblx0XHRcdFwiSW1wcm92ZSBTdHVkeWluZ1wiLFxuXHRcdFx0XCJJbXByb3ZlIEd5bSBUcmFpbmluZ1wiLFxuXHRcdFx0XCJFeGNoYW5nZSBmb3IgQ29ycG9yYXRpb24gUmVzZWFyY2hcIixcblx0XHRcdFwiRXhjaGFuZ2UgZm9yIEJsYWRlYnVybmVyIFJhbmtcIixcblx0XHRcdFwiRXhjaGFuZ2UgZm9yIEJsYWRlYnVybmVyIFNQXCIsXG5cdFx0XHRcIkdlbmVyYXRlIENvZGluZyBDb250cmFjdFwiLFxuXHRcdFx0XCJDb21wYW55IEZhdm9yXCJcblx0XHRdXG5cdCovXG5cblx0Y29uc3QgdGVuX3RyaWxsaW9ucyA9IDEwICogMTAwMCAqIDEwMDAgKiAxMDAwICogMTAwMDsgIC8vIGsgLT4gbSAtPiBnIC0+IHRcblx0Y29uc3QgaGFja2luZ19sZXZlbF9ib3VuZGFyeSA9IDMwMDA7XG5cblx0d2hpbGUgKHRydWUpIHtcblx0XHQvLyBDaGFuZ2UgcHJvYmFiaWxpdGllcyBiYXNlZCBvbiBoYWNraW5nIGxldmVsXG5cdFx0Ly8gTG93IGhhY2tpbmcgbGV2ZWw6IG1vcmUgc3BlbmRpbmcgb24gbW9uZXlcblx0XHQvLyBIaWdoIGhhY2tpbmcgbGV2ZWw6IG1vcmUgc3BlbmRpbmcgb24gcmVkdWNpbmcgc2VjdXJpdHkgLyBpbmNyZWFzaW5nIG1vbmV5IG9uIHNlcnZlcnNcblx0XHRjb25zdCByID0gTWF0aC5yYW5kb20oKTtcblx0XHRpZiAociA8IDAuMSkge1xuXHRcdFx0Y29uc3QgdGFyZ2V0ID0gc2VsZWN0UmFuZG9tU2VydmVyKG5zKTtcblx0XHRcdGNvbnN0IG1pbkxldmVsID0gbnMuZ2V0U2VydmVyTWluU2VjdXJpdHlMZXZlbCh0YXJnZXQpO1xuXHRcdFx0aWYgKG1pbkxldmVsID4gMS4wICYmIG5zLmdldEhhY2tpbmdMZXZlbCgpID4gaGFja2luZ19sZXZlbF9ib3VuZGFyeSkge1xuXHRcdFx0XHRhd2FpdCBzcGVuZEhhc2hlc09uQWN0aW9uKG5zLCBcIlJlZHVjZSBNaW5pbXVtIFNlY3VyaXR5XCIsIHRhcmdldCwgMSk7XG5cdFx0XHRcdGNvbnN0IG1pbkxldmVsQWZ0ZXIgPSBucy5nZXRTZXJ2ZXJNaW5TZWN1cml0eUxldmVsKHRhcmdldCk7XG5cdFx0XHRcdG5zLnByaW50KGBSZWR1Y2VkIG1pbmltdW0gc2VjdXJpdHkgbGV2ZWwgb24gJHt0YXJnZXR9IGZyb20gJHtucy5mb3JtYXROdW1iZXIobWluTGV2ZWwpfSB0byAke25zLmZvcm1hdE51bWJlcihtaW5MZXZlbEFmdGVyKX1gKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHIgPCAwLjIpIHtcblx0XHRcdGNvbnN0IHRhcmdldCA9IHNlbGVjdFJhbmRvbVNlcnZlcihucyk7XG5cdFx0XHRjb25zdCBtYXhNb25leSA9IG5zLmdldFNlcnZlck1heE1vbmV5KHRhcmdldCk7XG5cdFx0XHRpZiAobWF4TW9uZXkgPCB0ZW5fdHJpbGxpb25zICYmIG5zLmdldEhhY2tpbmdMZXZlbCgpID4gaGFja2luZ19sZXZlbF9ib3VuZGFyeSkge1xuXHRcdFx0XHRhd2FpdCBzcGVuZEhhc2hlc09uQWN0aW9uKG5zLCBcIkluY3JlYXNlIE1heGltdW0gTW9uZXlcIiwgdGFyZ2V0LCAxKTtcblx0XHRcdFx0Y29uc3QgbWF4TW9uZXlBZnRlciA9IG5zLmdldFNlcnZlck1heE1vbmV5KHRhcmdldCk7XG5cdFx0XHRcdG5zLnByaW50KGBJbmNyZWFzZWQgbWF4aW11bSBtb25leSBvbiAke3RhcmdldH0gZnJvbSAke25zLmZvcm1hdE51bWJlcihtYXhNb25leSl9XFwkIHRvICR7bnMuZm9ybWF0TnVtYmVyKG1heE1vbmV5QWZ0ZXIpfVxcJGApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAocjwwLjI1KSB7XG5cdFx0XHRpZiAobnMuZ2V0SGFja2luZ0xldmVsKCkgPiBoYWNraW5nX2xldmVsX2JvdW5kYXJ5KSB7XG5cdFx0XHRcdGF3YWl0IHNwZW5kSGFzaGVzT25BY3Rpb24obnMsIFwiSW1wcm92ZSBTdHVkeWluZ1wiLCBcInRhcmdldFwiLCAxKTtcblx0XHRcdFx0bnMucHJpbnQoJ0ltcHJvdmVkIHN0dWR5aW5nJyk7XHRcdFx0XHRcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb25zdCBzZWxsQW1vdW50ID0gbnMuaGFja25ldC5udW1IYXNoZXMoKSAvIDUuMDtcblxuXHRcdFx0aWYgKHNlbGxBbW91bnQgPCAxKSB7XG5cdFx0XHRcdGF3YWl0IHNwZW5kSGFzaGVzT25BY3Rpb24obnMsIFwiU2VsbCBmb3IgTW9uZXlcIiwgXCJ0YXJnZXRcIiwgMSk7XG5cdFx0XHRcdG5zLnByaW50KGBTb2xkIGhhc2hlcyBmb3IgbW9uZXkgKCR7bnMuZm9ybWF0TnVtYmVyKDEpfSlgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGF3YWl0IHNwZW5kSGFzaGVzT25BY3Rpb24obnMsIFwiU2VsbCBmb3IgTW9uZXlcIiwgXCJ0YXJnZXRcIiwgc2VsbEFtb3VudCk7XG5cdFx0XHRcdG5zLnByaW50KGBTb2xkIGhhc2hlcyBmb3IgbW9uZXkgKCR7bnMuZm9ybWF0TnVtYmVyKHNlbGxBbW91bnQpfSlgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRhd2FpdCBucy5zbGVlcCgxMDAwKTtcblx0fVxufVxuIl19