# Pretty-js-log 📝

A lightweight and colorful logging package for Node.js and Bun applications. Makes your console output beautiful and saves logs to files!

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

# Using yarn
yarn add pretty-js-log

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

## Author 👨‍💻

Belguinan Noureddine
GitHub: https://github.com/belguinan