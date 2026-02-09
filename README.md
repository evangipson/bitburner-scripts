# bitburner-scripts
A collection of scripts for the game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/).

## Scripts
- [`core.js`](./core.js): Commonly used functions for hacking, weakening, and growing servers.

## Examples
- Using [`core.js`](./core.js), you can create a script to grow, hack, and weaken a server back to it's minimum security level easily:
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

## Learnings
- Each `ns` task must be immediately `await`-ed
    - Typical [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) concurrency (i.e.: `Promise.all(...)`) **cannot** be used to fire off many async tasks at once, it violates the rules of the game