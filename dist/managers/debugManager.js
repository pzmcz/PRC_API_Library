"use strict";
// src/managers/debugManager.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDebugStatus = saveDebugStatus;
exports.DEBUG = DEBUG;
// This will hold our boolean in memory
let debugEnabled = false;
/**
 * Save a boolean to the in-memory store.
 * @param val The boolean value to save.
 */
function saveDebugStatus(val) {
    debugEnabled = val;
}
/**
 * Retrieve the stored boolean.
 * @returns The stored boolean or null if not set.
 */
function DEBUG() {
    return debugEnabled;
}
