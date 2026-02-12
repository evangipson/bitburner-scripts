import wordBank from './word-bank.json';

/**
 * Picks a random element from `arr`.
 * @param {Array} array An array to pick a random element from.
 */
const pick = (array) => array[Math.floor(Math.random() * array.length)];

/**
 * Generates a name for a server.
 * @param {char} letter The starting letter of the server name.
 */
export const getServerName = (letter) => {
    const char = letter.toUpperCase();
    const entry = wordBank[char];
    if (!entry) {
        return "Invalid Letter";
    }

    const adjective = pick(entry.adjectives);
    const animal = pick(entry.animals);
    return `${adjective}-${animal}`.toLowerCase();
};