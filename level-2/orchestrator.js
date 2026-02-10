/**
 * Uses batching to concurrently grow and drain a `target` server.
 * @param {NS} ns The core namespace.
 * @param {string} target The name of the server to target.
 */
export async function orchestrate(ns, target) {
    const host = "home";

    while (true) {
        // check server state
        let curSec = ns.getServerSecurityLevel(target);
        let minSec = ns.getServerMinSecurityLevel(target);
        let curMoney = ns.getServerMoneyAvailable(target);
        let maxMoney = ns.getServerMaxMoney(target);

        // determine priority
        if (curSec > minSec + 2) {
            // lower security
            const threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / 1.75);
            if (threads > 0) {
                ns.exec("workWeak.js", host, threads, target);
            }
        }
        else if (curMoney < maxMoney * 0.9) {
            // maximize money
            const threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / 1.75);
            if (threads > 0) {
                ns.exec("workGrow.js", host, threads, target);
            }
        }
        else {
            // hack (use 50% of RAM for hack, the rest for grow/weak to maintain balance)
            let availableRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
            let hackThreads = Math.floor((availableRam * 0.5) / 1.7);
            if (hackThreads > 0) {
                ns.exec("workHack.js", host, hackThreads, target);
                ns.toast(`Launching hack with ${hackThreads} threads!`, "success");
            }
        }

        // concurrency gap (instead of waiting for the script, wait for the duration of weaken since it's is always the longest task)
        await ns.sleep(ns.getWeakenTime(target) + 300);
    }
}