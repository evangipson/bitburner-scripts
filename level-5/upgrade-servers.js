import { getServerName } from './get-server-name';

/**
 * Converts `number` into it's respective letter in the alphabet.
 * @param {*} number The number to get the character for.
 */
const intToChar = (number) => String.fromCharCode(64 + number);

/**
 * Upgrades player servers by either purchasing a new one, or upgrading an existing one.
 * @param {NS} ns The core namespace.
 */
export async function main(ns) {
    // if there aren't 25 player servers yet, buy a new one
    let pservs = ns.getPurchasedServers();
    if (pservs.length < ns.getPurchasedServerLimit() && ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(8)) {
        const letterOfAlphabet = intToChar(pservs.length);
        const serverName = getServerName(letterOfAlphabet);
        ns.purchaseServer(`pserv-${serverName}`, 8);
        ns.toast(`Purchased pserv-${serverName}, a new 8GB server.`, 'success');
        return;
    }

    // upgrade the smallest server
    pservs.sort((a, b) => ns.getServerMaxRam(a) - ns.getServerMaxRam(b));
    let target = pservs[0];
    let currentRam = ns.getServerMaxRam(target);
    let nextRam = currentRam * 2;
    if (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(nextRam)) {
        ns.killall(target);
        ns.deleteServer(target);
        ns.purchaseServer(target, nextRam);
        ns.toast(`Upgraded ${target} to ${nextRam}GB`, 'success');
    }
}