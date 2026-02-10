# bitburner-scripts
A collection of scripts for the game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/) broken into "levels" of understanding.

## Table of Contents
- [Level 1](#level-1): Very basic attempt which grows a server 20% of the time, always hacks, and always weakens, while `await`-ing each weaken/hack/grow
- [Level 2](#level-2): Starts to use batching to fire off a worker script for weaken/hack/grow
- [Level 3](#level-3): Uses batching to fire off worker scripts for weaken/hack/grow distributed to many servers simulataneously, and hacks any available unhacked server to distribute even more threads
- [Level 4](#level-4): Improves on [level 3](#level-3) by automating the target server to work on based on potential income per hour, and adds a monitoring script

## Level 1
My initial attempt at automating hacking, growing, and weakening a server.

Very basic attempt which grows a server 20% of the time, always hacks, and always weakens, while `await`-ing each weaken/hack/grow.

### Scripts
- [`core.js`](./level-1/core.js): Commonly used functions for hacking, weakening, and growing servers

### Examples
Using [`core.js`](./level-1/core.js), you can create a script to grow, hack, and weaken a server back to it's minimum security level easily:
```js
import {hackAndWeaken} from 'core.js';

/** @param {NS} ns */
export async function main(ns) {
    /* note: there is a better approach using batching,
     * but I haven't learned how to do that yet */
    while(true) {
        await hackAndWeaken(ns, 'n00dles');
    }
}
```

### Learnings
- Each `ns` task must be immediately `await`-ed
    - Typical [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) concurrency (i.e.: `Promise.all(...)`) **cannot** be used to fire off many async tasks at once, it violates the rules of the game

## Level 2
My second attempt at automating hacking, growing, and weakening a server.

Starts to use batching to fire off a worker script for weaken/hack/grow.

### Scripts
- [`orchestrator.js`](./level-2/orchestrator.js): Uses batching to concurrently grow and drain a server
- [`workGrow.js`](./level-2/workGrow.js): Grows a server
- [`workHack.js`](./level-2/workHack.js): Hacks a server
- [`workWeak.js`](./level-2/workWeak.js): Weakens a server

### Examples
Using [`orchestrator.js`](./level-2/orchestrator.js), you can create a script to grow, hack, and weaken a server simultaneously while respecting RAM limits of the host:
```js
import {orchestrate} from 'orchestrator.js';

/** @param {NS} ns */
export async function main(ns) {
  while(true) {
    await orchestrate(ns, 'n00dles');
  }
}
```

### Learnings
- home RAM gets eaten very quick by the [`orchestrator`](./level-2/orchestrator.js)

## Level 3
My third attempt at automating hacking, growing, and weakening a server.

Uses batching to fire off worker scripts for weaken/hack/grow distributed to many servers simulataneously. Also hacks any available unhacked server to distribute even more threads.

### Scripts
- [`target-search.js`](./level-3/target-search.js): Uses batching to nuke any available server, then distributes hack/weaken/grow scripts to grow & drain a server in a distributed fashion
- [`workGrow.js`](./level-3/workGrow.js): Grows a server (same as level 2)
- [`workHack.js`](./level-3/workHack.js): Hacks a server (same as level 2)
- [`workWeak.js`](./level-3/workWeak.js): Weakens a server (same as level 2)

### Examples
Using [`target-search.js`](./level-3/target-search.js), you can create a script to nuke any available server, then distribute hack/weaken/grow scripts to grow & drain a server in a distributed fashion:
```js
import {targetSearch} from 'target-search.js';

/** @param {NS} ns */
export async function main(ns) {
  while(true) {
    await targetSearch(ns, 'n00dles');
  }
}
```

### Learnings
- This approach works, but it would be better if the need to manually target servers was automated

## Level 4
My fourth attempt at automating hacking, growing, and weakening a server.

Improves on [level 3](#level-3) by automating the target server to work on based on potential income per hour, and adds a monitoring script.

### Scripts
- [`find-servers.js`](./level-4/find-servers.js): Finds all servers that can be connected to from the home node
- [`ranker.js`](./level-4/ranker.js): Ranks all servers that can be connected to from the home node by income per hour
- [`monitor.js`](./level-4/monitor.js): Opens a new window that is constantly updated to show server stats and income per second
- [`work.js`](./level-4/work.js): Finds the best server by income per hour and distributes work on all servers that can be connected to from the home node
- [`target-search.js`](./level-4/target-search.js): Uses batching to nuke any available server, then distributes hack/weaken/grow scripts to grow & drain a server in a distributed fashion (mostly the same as level 3)
- [`workGrow.js`](./level-4/workGrow.js): Grows a server (same as level 2)
- [`workHack.js`](./level-4/workHack.js): Hacks a server (same as level 2)
- [`workWeak.js`](./level-4/workWeak.js): Weakens a server (same as level 2)

### Examples
Using [`work.js`](./level-4/work.js), you can work on the best server continually (in terms of income per hour) by running:
```
[home /]> run work.js
```

Using [`monitor.js`](./level-4/monitor.js), you can monitor any server by running:
```
[home /]> run monitor.js [server]
```

Using [`ranker.js`](./level-4/ranker.js), you can get the top 5 profitable server candidates by running:
```
[home /]> run ranker.js
```