import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
  for (let fragment of ns.stanek.activeFragments()) {
    ns.print(`Fragment: ${JSON.stringify(fragment)}`);

    if (fragment['type'] == 18) {
      ns.print('\t--> skipped: booster\n\n');
      continue;
    }

    const rootX = fragment['x'];
    const rootY = fragment['y'];
    await ns.stanek.chargeFragment(rootX, rootY);
    ns.print('\t--> charged\n\n');
  }
}
