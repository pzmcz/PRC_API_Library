const winston = require('winston');
const { format, transports } = winston;

winston.addColors({
    info: 'green',
    warn: 'yellow',
    error: 'red',
    debug: 'cyan',
});

const customFormat = format.combine(
    format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => {        
        let prefix = '[ERLC-API]: ';
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

const log = (...args) => logger.info(args.join(' '));
const error = (...args) => logger.error(args.join(' '));
const warn = (...args) => logger.warn(args.join(' '));
const info = (...args) => logger.info(args.join(' '));

module.exports = {
    log,
    error,
    warn,
    info
};