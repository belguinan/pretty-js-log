import fs from 'node:fs';

interface ColorSet {
    id: string;
    datetime: string;
    message: string;
    level: string;
}

interface LevelColors {
    default: ColorSet;
    info: ColorSet;
    warn: ColorSet;
    error: ColorSet;
    debug: ColorSet;
    [key: string]: ColorSet;
}

interface MessageFactoryOptions {
    id?: string;
    level?: string;
    args?: any[];
    colors?: ColorSet;
}

interface LogFactoryOptions {
    id?: string;
    path?: string;
    colors?: ColorSet;
    toStdout?: boolean;
}

/**
 * Local timezone offset
 * 
 * @type {number}
 */
const tzOffset = (new Date()).getTimezoneOffset() * 60000;

/**
 * ANSI color codes
 * 
 * @type {Object}
 */
const COLORS = Object.freeze({
    reset: '\u001b[0m',
    gray: '\u001b[90m',
    red: '\u001b[31m',
    green: '\u001b[32m',
    yellow: '\u001b[33m',
    blue: '\u001b[34m',
    magenta: '\u001b[35m',
    cyan: '\u001b[36m',
    white: '\u001b[37m',
});

/**
 * Default color for log levels
 * 
 * @type {LevelColors}
 */
const LEVELS: LevelColors = Object.freeze({
    default: {
        id: COLORS.blue,
        datetime: COLORS.green,
        message: COLORS.white,
        level: COLORS.white
    },
    info: {
        id: COLORS.blue,
        datetime: COLORS.white,
        message: COLORS.blue,
        level: COLORS.blue
    },
    warn: {
        id: COLORS.blue,
        datetime: COLORS.white,
        message: COLORS.yellow,
        level: COLORS.yellow
    },
    error: {
        id: COLORS.blue,
        datetime: COLORS.red,
        message: COLORS.red,
        level: COLORS.red
    },
    debug: {
        id: COLORS.blue,
        datetime: COLORS.green,
        message: COLORS.white,
        level: COLORS.magenta
    }
});

/**
 * Format params passed for logging
 * 
 * @param {any[]} args - Arguments to format
 * @returns {string} Formatted string
 */
function formatArgs(args: any[]): string {
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
 * @param {MessageFactoryOptions} options - Message options
 * @param {string} [options.id] - Log identifier
 * @param {string} [options.level] - Log level
 * @param {any[]} [options.args] - Arguments to log
 * @param {ColorSet} [options.colors] - Color settings
 * @returns {string} Formatted log message
 */
function messageFactory({ id = '', level, args = [], colors }: MessageFactoryOptions): string {
    const timestamp = (new Date(Date.now() - tzOffset)).toISOString().replace("T", " ").replace('Z', '');

    let message = `${COLORS.reset}${colors?.datetime}[${timestamp}]${COLORS.reset}`;
    
    if (id) {
        message += `${COLORS.reset} - ${colors?.id}[id:${id}]${COLORS.reset}`;
    }
    
    if (level) {
        message += `${COLORS.reset} - ${colors?.level}[${level.length === 4 ? level + ' ' : level}]${COLORS.reset}`;
    }

    message += `${COLORS.reset} - ${colors?.message}${formatArgs(args)}${COLORS.reset}`;
    
    return message;
}

/**
 * Remove ANSI color codes from text
 * 
 * @param {string} text - Text with ANSI codes
 * @returns {string} Text without ANSI codes
 */
function stripAnsiCodes(text: string): string {
    return text.replace(/\u001b\[\d{1,2}m|\u001b\[0m/g, '');
}

/**
 * Write message to stdout
 * 
 * @param {string} message - Message to write
 */
function writeToStdout(message: string): void {
    console.log(message);
}

/**
 * Write message to file
 * 
 * @param {string} message - Message to write
 * @param {string} path - File path
 */
function writeToFile(message: string, path: string): void {
    fs.appendFileSync(path, stripAnsiCodes(message) + '\n', "utf8");
}

/**
 * Create a logger instance
 * 
 * @param {LogFactoryOptions} options - Logger options
 * @param {string} [options.id] - Log identifier
 * @param {string} [options.path] - File path for logging
 * @param {ColorSet} [options.colors] - Color settings
 * @param {boolean} [options.toStdout=true] - Whether to log to stdout
 * @returns {Object} Logger instance
 */
interface Logger {
    (...args: any[]): void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    debug: (...args: any[]) => void;
}

function logFactory({ id, path, colors, toStdout = true }: LogFactoryOptions): Logger {
    const createLogHandler = (colors: ColorSet, level: string) => (...args: any[]) => {
        const message = messageFactory({
            id: id,
            colors,
            level,
            args
        });

        if (toStdout !== false) {
            writeToStdout(message);
        }

        if (path) {
            writeToFile(message, path);
        }
    };

    const logger = createLogHandler(colors || LEVELS['default'], 'default') as Logger;
    
    logger.info = createLogHandler(LEVELS.info, 'info');
    logger.warn = createLogHandler(LEVELS.warn, 'warn');
    logger.error = createLogHandler(LEVELS.error, 'error');
    logger.debug = createLogHandler(LEVELS.debug, 'debug');

    return logger;
}

export { logFactory };
export type { LogFactoryOptions, MessageFactoryOptions, LevelColors, ColorSet };
