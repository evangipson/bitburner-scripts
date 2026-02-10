# bitburner-scripts
A collection of scripts for the game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/) broken into "levels" of understanding.

## Levels
### Level 1
My initial attempt at automating hacking, growing, and weakening a server.

Very basic attempt which grows a server 20% of the time, always hacks, and always weakens, while `await`-ing each weaken/hack/grow.

#### Scripts
- [`core.js`](./level-1/core.js): Commonly used functions for hacking, weakening, and growing servers

#### Examples
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

#### Learnings
- Each `ns` task must be immediately `await`-ed
    - Typical [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) concurrency (i.e.: `Promise.all(...)`) **cannot** be used to fire off many async tasks at once, it violates the rules of the game

### Level 2
My second attempt at automating hacking, growing, and weakening a server.

Starts to use batching to fire off a worker script for weaken/hack/grow.

#### Scripts
- [`orchestrator.js`](./level-2/orchestrator.js): Uses batching to concurrently grow and drain a server
- [`workGrow.js`](./level-2/workGrow.js): Grows a server
- [`workHack.js`](./level-2/workHack.js): Hacks a server
- [`workWeak.js`](./level-2/workWeak.js): Weakens a server

#### Examples
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

#### Learnings
- home RAM gets eaten very quick by the [`orchestrator`](./level-2/orchestrator.js)

### Level 3
My third attempt at automating hacking, growing, and weakening a server.

Uses batching to fire off worker scripts for weaken/hack/grow distributed to many servers simulataneously. Also hacks any available unhacked server to distribute even more threads.

#### Scripts
- [`target-search.js`](./level-3/target-search.js): Uses batching to nuke any available server, then distributes hack/weaken/grow scripts to grow & drain a server in a distributed fashion
- [`workGrow.js`](./level-3/workGrow.js): Grows a server (same as level 2)
- [`workHack.js`](./level-3/workHack.js): Hacks a server (same as level 2)
- [`workWeak.js`](./level-3/workWeak.js): Weakens a server (same as level 2)

#### Examples
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