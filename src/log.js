const fs = require('node:fs');

/**
 * Local timezone offset
 * 
 * @type {int}
 */
const tzOffset = (new Date()).getTimezoneOffset() * 60000;

/**
 * ANSI color codes
 * 
 * @type {Object}
 */
const COLORS = {
    reset: '\u001b[0m',
    gray: '\u001b[90m',
    red: '\u001b[31m',
    green: '\u001b[32m',
    yellow: '\u001b[33m',
    blue: '\u001b[34m',
    magenta: '\u001b[35m',
    cyan: '\u001b[36m',
    white: '\u001b[37m',
};

/**
 * Default color for log levels
 * 
 * @type {Object}
 */
const defaultColors = {
    default: {
        id: COLORS.blue,
        datetime: COLORS.green,
        message: COLORS.white
    },
    info: {
        id: COLORS.blue,
        datetime: COLORS.white,
        message: COLORS.blue
    },
    warn: {
        id: COLORS.blue,
        datetime: COLORS.white,
        message: COLORS.yellow
    },
    error: {
        id: COLORS.blue,
        datetime: COLORS.red,
        message: COLORS.red
    },
    debug: {
        id: COLORS.blue,
        datetime: COLORS.green,
        message: COLORS.white
    }
}

/**
 * Format params passed for logging
 * 
 * @param {any[]} args
 * 
 * @returns {string}
 */
function formatArgs(args) {
    return args
        .map(arg => {
            if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2);
            }
            return String(arg);
        })
        .join(' ');
}

/**
 * Log message factory
 * 
 * @param  {String} options.id    
 * @param  {Array}  options.args  
 * @param  {Array} options.colors
 * 
 * @return {String}               
 */
function messageFactory({ id = '', args = [], colors}) {

    const timestamp = (new Date(Date.now() - tzOffset)).toISOString().replace("T", " ").replace('Z', '')

    let message =  `${COLORS.reset}${colors.datetime}[${timestamp}]${COLORS.reset}`;
    
    if (id) {
        message += `${COLORS.reset} - ${colors.id}[id:${id}]${COLORS.reset}`;
    }
    
    message += `${COLORS.reset} - ${colors.message}${formatArgs(args)}${COLORS.reset}`;
    
    return message;
}

/**
 * Remvoe ANSI color codes
 * 
 * @param  {String} text
 * @return {String}     
 */
function stripAnsiCodes(text) {
    return text.replace(/\u001b\[\d{1,2}m|\u001b\[0m/g, '');
}

/**
 * Write to stdout and file
 * 
 * @param {String} message 
 */
function writeToStdout(message, toStdout) {
    if (toStdout === false) {
        return;
    }

    console.log(message);
}

/**
 * @param  {String} message
 * @param  {String} path   
 * 
 * @return {Void}        
 */
function writeToFile(message, path) {
    if (! path) {
        return;
    }

    fs.appendFileSync(path, stripAnsiCodes(message) + '\n', "utf8");
}

function logFactory({id, path, toStdout = true, colors}) {

    const colorTheme = Object.keys(colors || {}).length === 0 ? defaultColors : colors
    
    const logger = (...args) => {
        const message = messageFactory({
            colors: colorTheme.default || colorTheme,
            id: id || false,
            args
        });

        writeToStdout(message, toStdout || false);
        writeToFile(message, path);
    }
    
    logger.info = (...args) => {
        const message = messageFactory({
            colors: colorTheme.info,
            id: id || false,
            args
        });

        writeToStdout(message, toStdout || false);
        writeToFile(message, path);
    }
    
    logger.debug = (...args) => {
        const message = messageFactory({
            colors: colorTheme.debug,
            id: id || false,
            args
        });

        writeToStdout(message, toStdout || true);
        writeToFile(message, path);
    }
    
    logger.error = (...args) => {
        const message = messageFactory({
            colors: colorTheme.error,
            id: id || false,
            args
        });

        writeToStdout(message, toStdout || true);
        writeToFile(message, path);
    }
    
    logger.warn = (...args) => {
        const message = messageFactory({
            colors: colorTheme.warn,
            id: id || false,
            args
        });

        writeToStdout(message, toStdout || true);
        writeToFile(message, path);
    }
    
    return logger;
}

module.exports = { logFactory }