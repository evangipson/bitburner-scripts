/**
 * Monitors a server by outputting server stats and income per hour.
 * @param {NS} ns The core namespace.
 */
export async function main(ns) {
  const target = ns.args[0] || "n00dles";
  ns.disableLog("ALL");
  ns.ui.openTail();

  let totalStolen = 0;
  let lastMoney = ns.getServerMoneyAvailable(target);
  const startTime = Date.now();

  while (true) {
    ns.clearLog();

    // gather data
    let curMoney = ns.getServerMoneyAvailable(target);
    let maxMoney = ns.getServerMaxMoney(target);
    let curSec = ns.getServerSecurityLevel(target);
    let minSec = ns.getServerMinSecurityLevel(target);
    let elapsedSeconds = (Date.now() - startTime) / 1000;

    // income math
    if (curMoney < lastMoney) {
      totalStolen += (lastMoney - curMoney);
    }
    lastMoney = curMoney;

    let ips = elapsedSeconds > 0 ? (totalStolen / elapsedSeconds) : 0;
    if (isNaN(ips)) ips = 0;

    // dashboard start
    ns.print(`--- MONITORING: ${target} ---`);
    ns.print(`Time Active: ${ns.tFormat(Date.now() - startTime)}`);
    ns.print(`--------------------------------`);

    // financials
    ns.print(`Money: $${ns.formatNumber(curMoney)} / $${ns.formatNumber(maxMoney)}`);
    ns.print(`Stolen: $${ns.formatNumber(totalStolen)}`);
    ns.print(`IPS:    $${ns.formatNumber(ips)}/sec`);

    // security
    ns.print(`--------------------------------`);
    ns.print(`Security: ${curSec.toFixed(2)} (Min: ${minSec})`);

    let secDiff = curSec - minSec;
    let secStatus = secDiff > 2 ? "WEAKEN NEEDED" : "STABLE";
    ns.print(`Status:   ${secStatus}`);

    // timings
    ns.print(`--------------------------------`);
    ns.print(`H: ${ns.tFormat(ns.getHackTime(target))} | W: ${ns.tFormat(ns.getWeakenTime(target))}`);

    await ns.sleep(500);
  }
}