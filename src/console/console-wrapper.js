const winston = require('winston');
const { format, transports } = winston;

winston.addColors({
    "info": 'green',
    "warn": 'yellow',
    "error": 'red',
    "debug": 'cyan'
});

const customFormat = format.combine(
    format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => {
        let prefix = '[ERLC-API]:';
        if (level === 'error') {
            prefix = 'ERR!';
        }
        return `${timestamp} ${prefix} ${message}`;
    })
);

const logger = winston.createLogger({
    level: 'debug',
    format: customFormat,
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                customFormat
            )
        })
    ]
});

console.log = (...args) => logger.info(...args);
console.error = (...args) => logger.error(...args);
console.warn = (...args) => logger.warn(...args);
console.info = (...args) => logger.info(...args);

module.exports = logger;