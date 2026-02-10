import { findServers } from './find-servers.js';

/** A collection of all the scripts that are involved in work distribution. */
const workerScripts = ['workHack.js', 'workGrow.js', 'workWeak.js'];

/**
 * Tries to nuke a `server`.
 * @param {NS} ns The core namespace.
 * @param {string} server The name of the server to nuke.
 */
const tryNukeServer = (ns, server) => {
    if (ns.hasRootAccess(server)) {
        return;
    }

    // MUST call the ns.brutessh, ns.ftpcrack, etc. EXPLICITLY so the RAM checker sees them
    let openPorts = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(server); openPorts++; }
    if (ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(server); openPorts++; }
    if (ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(server); openPorts++; }
    if (ns.fileExists("HTTPWorm.exe", "home")) { ns.httpworm(server); openPorts++; }
    if (ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(server); openPorts++; }
    if (ns.getServerNumPortsRequired(server) <= openPorts) {
        ns.nuke(server);
    }
};

/**
 * Distributes work (hack/grow/weaken) on a `server` for a `target`.
 * @param {NS} ns The core namespace.
 * @param {number} freeRam The amount of free RAM on the `server`.
 * @param {string} target The name of the target server.
 * @param {string} server The name of the server to distribute work to.
 */
const distributeWork = (ns, freeRam, target, server) => {
    let threads = Math.floor(freeRam / 1.75);
    let curSec = ns.getServerSecurityLevel(target);
    let curMoney = ns.getServerMoneyAvailable(target);
    // if security is high, weaken
    if (curSec > ns.getServerMinSecurityLevel(target) + 2) {
        ns.exec('workWeak.js', server, threads, target);
    }
    // if money is low, grow
    else if (curMoney < ns.getServerMaxMoney(target) * 0.8) {
        ns.exec('workGrow.js', server, threads, target);
    }
    // otherwise, hack
    else {
        ns.exec('workHack.js', server, threads, target);
    }
};

/**
 * Scans the network, nukes servers, copies workers, and runs them.
 * @param {NS} ns The core namespace.
 * @param {string} target The name of the server to target.
 */
export async function targetSearch(ns, target) {
    // for each connectable server from home
    for (let server of findServers(ns)) {
        // try to nuke the server (if it isn't already nuked)
        tryNukeServer(ns, server);

        // if we don't have root access even after nuking, there is nothing to do
        if (!ns.hasRootAccess(server)) {
            continue;
        }

        // copy scripts to the remote server if they don't already exist
        if (!ns.fileExists(workerScripts[0], server)) {
            ns.scp(workerScripts, server, 'home');
        }

        // reserve some RAM on home for this script
        let freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
        if (server == 'home') {
            freeRam -= 20;
        }

        // distribute work if there is enough RAM
        if (freeRam >= 1.75) {
            distributeWork(ns, freeRam, target, server);
        }
    }
}