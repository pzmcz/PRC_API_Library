const PREFIX = '[ERLC-API]:';

const originalConsoleMethods = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
};

function createPrefixedConsoleMethod(method) {
    return function(...args) {
        originalConsoleMethods[method].apply(console, [PREFIX, ...args]);
    };
}

console.log = createPrefixedConsoleMethod('log');
console.error = createPrefixedConsoleMethod('error');
console.warn = createPrefixedConsoleMethod('warn');
console.info = createPrefixedConsoleMethod('info');

module.exports = console;