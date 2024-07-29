// src/managers/debugManager.ts

// This will hold our boolean in memory
let debugEnabled: boolean | null = false;

/**
 * Save a boolean to the in-memory store.
 * @param val The boolean value to save.
 */
export function saveDebugStatus(val: boolean): void {
    debugEnabled = val;
}

/**
 * Retrieve the stored boolean.
 * @returns The stored boolean or null if not set.
 */
export function DEBUG(): boolean | null {
    return debugEnabled;
}