/**
 * Weakens a server using the first arg in the pipeline as the target.
 * @param {NS} ns The core namespace.
 */
export async function main(ns) {
    await ns.weaken(ns.args[0]);
}