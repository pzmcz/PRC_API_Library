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
    format.printf(({ level, message, timestamp, isErlcConsole }) => {
        let prefix = '';
        if (isErlcConsole) {
            prefix = `[ERLC-API]: `;
        }
        if (level === 'error') {
            prefix = 'ERR! ';
        }
        return `${timestamp} ${prefix}${message}`;
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

const ErlcConsole = {
    log: (...args) => logger.info({ message: args.join(' '), isErlcConsole: true }),
    error: (...args) => logger.error({ message: args.join(' '), isErlcConsole: true }),
    warn: (...args) => logger.warn({ message: args.join(' '), isErlcConsole: true }),
    info: (...args) => logger.info({ message: args.join(' '), isErlcConsole: true }),
};

module.exports = { logger, ErlcConsole };