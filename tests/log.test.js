const { logFactory } = require('../src/log.js');

describe('pretty-js-log', () => {

    console.log = jest.fn();

    beforeEach(() => {
        console.log.mockClear();
    });

    test('should create a logger instance', () => {
        const logger = logFactory({});
        expect(logger).toBeDefined();
        expect(typeof logger).toBe('function');
    });

    test('should log a simple message', () => {
        const logger = logFactory({});
        logger('Hello world');
        expect(console.log).toHaveBeenCalled();
    });

    test('should ignore logging a message', () => {
        const logger = logFactory({
            toStdout: false
        });
        logger('Hello world');
        expect(console.log).not.toHaveBeenCalled();
    });

    test('should log info message', () => {
        const logger = logFactory({});
        logger.info('Info message');
        expect(console.log).toHaveBeenCalled();
    });

    test('should log error message', () => {
        const logger = logFactory({});
        logger.error('Error message');
        expect(console.log).toHaveBeenCalled();
    });

    test('should log warning message', () => {
        const logger = logFactory({});
        logger.warn('Warning message');
        expect(console.log).toHaveBeenCalled();
    });

    test('should log debug message', () => {
        const logger = logFactory({});
        logger.debug('Debug message');
        expect(console.log).toHaveBeenCalled();
    });

    test('should format object properly', () => {
        const logger = logFactory({});
        const testObject = { name: 'test' };
        logger(testObject);
        expect(console.log).toHaveBeenCalled();
    });
});