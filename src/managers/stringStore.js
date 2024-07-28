"use strict";
// stringStore.ts
// This will hold our string in memory
let storedString = null;
/**
 * Save a string to the in-memory store.
 * @param str The string to save.
 */
function saveString(str) {
    storedString = str;
}
/**
 * Retrieve the stored string.
 * @returns The stored string or null if not set.
 */
function getString() {
    return storedString;
}
// Export functions using CommonJS syntax
module.exports = {
    saveString,
    getString
};
