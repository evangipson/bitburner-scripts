import { findServers } from './find-servers.js';

/**
 * Gets the estimated "score" (income per hour) of a `server`.
 * @param {NS} ns The core namespace.
 * @param {string} server The server to calculate the income per hour of.
 */
const getServerScore = (ns, server) =>
    (Math.pow(ns.getServerMaxMoney(server), 1.2) * Math.log(ns.getServerGrowth(server)) * ns.hackAnalyzeChance(server)) / ns.getHackTime(server);

/**
 * Gets all servers that can be currently connected to, ranked by income per hour.
 * @param {NS} ns The core namespace.
 */
export const getRankedServers = (ns) => {
    let hackingLevel = ns.getHackingLevel();
    return findServers(ns)
        .filter(x => ns.getServerRequiredHackingLevel(x) <= hackingLevel && ns.getServerMaxMoney(x) > 0)
        .map(x => ({ name: x, score: getServerScore(ns, x) }))
        .sort((a, b) => b.score - a.score);
}

/**
 * Ranks income per second for all potential server targets.
 * @param {NS} ns The core namespace.
 */
export async function main(ns) {
    let targets = getRankedServers(ns);
    ns.tprint("--- TOP 5 PROFITABLE TARGETS ---");
    for (let i = 0; i < Math.min(5, targets.length); i++) {
        ns.tprint(`${i + 1}: ${targets[i].name} (Score: ${ns.formatNumber(targets[i].score)})`);
    }
}