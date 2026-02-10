/**
 * Scans the network, copies worker scripts to every nuked server, and runs the scripts.
 * @param {NS} ns The core namespace.
 * @param {string} target The name of the server to target.
 */
export async function targetSearch(ns, target) {
    // define all scripts that are going to be copied and ran
    const workerScripts = ["workHack.js", "workGrow.js", "workWeak.js"];

    // crawl the network by finding every server reachable from home
    let servers = ["home"];
    for (let i = 0; i < servers.length; i++) {
        let hostname = servers[i];
        let discovered = ns.scan(hostname);
        for (let next of discovered) {
            if (!servers.includes(next)) {
                servers.push(next);
            }
        }
    }

    // prepare and use the ram
    for (let server of servers) {
        // nuke any servers if they aren't already nuked
        if (!ns.hasRootAccess(server)) {
            // calculate how many openable ports there are
            let openablePorts = 0;
            if (ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(server); openablePorts++; }
            if (ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(server); openablePorts++; }
            if (ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(server); openablePorts++; }
            if (ns.fileExists("HTTPWorm.exe", "home")) { ns.httpworm(server); openablePorts++; }
            if (ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(server); openablePorts++; }

            // skip this server for now, it's not crackable yet
            if (ns.getServerNumPortsRequired(server) > openablePorts) {
                continue;
            }

            // only nuke if our opened ports meet the server's requirement
            ns.nuke(server);
        }

        // copy scripts to the remote server
        ns.scp(workerScripts, server, "home");

        // reserve some RAM on home for this script
        let freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
        if (server == "home") {
            freeRam -= 20;
        }

        // don't bother continuing if there isn't enough RAM
        if (freeRam <= 1.75) {
            continue;
        }

        // distribute work
        let threads = Math.floor(freeRam / 1.75);
        let curSec = ns.getServerSecurityLevel(target);
        let curMoney = ns.getServerMoneyAvailable(target);
        // if security is high, weaken
        if (curSec > ns.getServerMinSecurityLevel(target) + 2) {
            ns.exec("workWeak.js", server, threads, target);
        }
        // if money is low, grow
        else if (curMoney < ns.getServerMaxMoney(target) * 0.8) {
            ns.exec("workGrow.js", server, threads, target);
        }
        // otherwise, hack
        else {
            ns.exec("workHack.js", server, threads, target);
        }
    }
}