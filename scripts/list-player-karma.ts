import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
  const karma = ns.heart.break();
  ns.tprint(`karma: ${karma.toFixed(3)}`);
}
