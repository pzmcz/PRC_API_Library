const PREFIX = '[ERLC-API]:';

const originalConsoleMethods = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info
};

function createPrefixedConsoleMethod(method) {
    return function(...args) {
        if (args.some(arg => typeof arg === 'string' && arg.includes('You are being rate limited!'))) {
            originalConsoleMethods[method].apply(console, [`${PREFIX} Rate limit exceeded. Please try again later.`]);
        } else {
            originalConsoleMethods[method].apply(console, [PREFIX, ...args]);
        }
    };
}

console.log = createPrefixedConsoleMethod('log');
console.error = createPrefixedConsoleMethod('error');
console.warn = createPrefixedConsoleMethod('warn');
console.info = createPrefixedConsoleMethod('info');

module.exports = console;