/**
 * Finds all available servers that can be connected to from home.
 * @param {NS} ns The core namespace.
 */
export const findServers = (ns) => {
    let servers = ["home"];
    for (let i = 0; i < servers.length; i++) {
        for (let next of ns.scan(servers[i])) {
            if (!servers.includes(next)) {
                servers.push(next);
            }
        }
    }
    return servers;
}