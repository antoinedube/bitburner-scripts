/** @param {NS} ns */
export async function main(ns) {
  const karma = ns.heart.break();
  ns.tprint(`karma: ${karma.toFixed(2)}`);
}
