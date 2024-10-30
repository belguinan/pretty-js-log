# Pretty-js-log 📝

A lightweight and colorful logging package for Node.js and Bun applications. Makes your console output beautiful and saves logs to files!

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Features

- Colorful console output
- File logging support
- Multiple log levels (info, warn, error, debug)
- Support for both Node.js and Bun
- JSON object / Array formatting
- Custom IDs for tracking (like process ID)
- Timezone-aware timestamps

## Installation 🚀

```bash
# Using npm
npm install pretty-js-log
```

```bash
# Using bun
bun install pretty-js-log
```

## Quick Start 🎯

```javascript
const { logFactory } = require('pretty-js-log');

// Create a basic logger
const logger = logFactory({});

// Log some messages
logger('Hello World');
logger.info('This is an info message');
logger.warn('Warning! Something needs attention');
logger.error('Oops! Something went wrong');
logger.debug('Debug information');
```

## Output 🎑

![Pretty JS Log Demo](https://i.ibb.co/ZmYhVwT/pretty-js-log.png)

## Advanced Usage 🔧

### Save Logs to File

```javascript
const logger = logFactory({
    path: './logs/app.log',  // Logs will be saved here
    id: process.pid          // Add process ID to logs
});

logger('This will be saved to the file too!');
```

### Logging Objects

```javascript
const data = {
    user: 'john',
    age: 25
};

logger('User data:', data);  // Objects are automatically formatted
```

### Disable Console Output

If you want to write logs only to file without console output, use the `toStdout` option:

```javascript
const logger = logFactory({
    path: './logs/app.log',
    toStdout: false    // Logs will only be written to file
});

logger('This will only appear in the log file');
logger.info('Silent logging to file');
````

## Output Examples 🎨

When you run your logs, they'll look something like this in the console:

```
[2024-03-15 10:30:45] - [id:1234] - Hello World
[2024-03-15 10:30:46] - [id:1234] - This is an info message
[2024-03-15 10:30:47] - [id:1234] - Warning! Something needs attention
```

## Contributing 🤝

Feel free to open issues and submit PRs! This is an open-source project and we welcome contributions.

## License 📄

MIT License - feel free to use this in your projects!

## Todo 📋

- [x] Support logging into a file
- [ ] Add support daily logs
- [ ] File logging rotation based on file size or on dates.
- [ ] Add support for external logging API's endpoints.

## Author 👨‍💻

Belguinan Noureddine

GitHub: https://github.com/belguinan