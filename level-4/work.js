import {getRankedServers} from './ranker.js';
import {targetSearch} from './target-search.js';

/**
 * Continually finds the best server to work, and distributes that work.
 * @param {NS} ns The core namespace.
 */
export async function main(ns) {
  while (true) {
    // find the best target for the current level
    let bestTarget = getRankedServers(ns)?.[0];
    if (!bestTarget) {
      throw new Error('Unable to find the best server to target.');
    }

    // run the search/attack logic
    await targetSearch(ns, bestTarget.name);

    // wait a while to not crash the script
    await ns.sleep(5000);
  }
}