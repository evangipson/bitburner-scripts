/** a `Promise` that waits for `ms` milliseconds before resolving. */
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/** 
 * Simulates a die roll and returns the total result of the roll, minimum is `1`,
 * maximum is `sides`.
 * @param {number} sides The amount of sides for the die, defaults to `6`.
 */
const rollDie = (sides = 6) => Math.floor(Math.random() * sides) + 1;

/** grows a server if a d100 rolls over 80. */
async function growServer(ns, server) {
    if (rollDie(100) < 80) {
        return;
    }
    await ns.grow(server);
    ns.toast(`grew ${server}!`);
}

/** hacks a server and shows a toast message containing the money earned. */
async function hackServer(ns, server) {
    const moneyEarned = await ns.hack(server);
    ns.toast(`hacked ${server} for $${moneyEarned}!`);
}

/** weakens a server until it's at it's minimum security level */
async function weakenServer(ns, server, minSecurityLevel) {
    while (ns.getServerSecurityLevel(server) > minSecurityLevel) {
        await ns.weaken(server);
    }
}

/**
 * Hacks and weakens a `server` using `ns`, reports how much was earned and security.
 * @param {NS} ns The core namespace.
 * @param {string} server The name of the server to hack and weaken.
 */
export async function hackAndWeaken(ns, server) {
    await growServer(ns, server);
    await hackServer(ns, server);
    const minSecurityLevel = ns.getServerMinSecurityLevel(server);
    await weakenServer(ns, server, minSecurityLevel);
}