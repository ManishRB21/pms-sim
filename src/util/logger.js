const path = require('path');
const fs = require('graceful-fs');
const winston = require('winston');
const cli = require('vorpal')();
const config = require('./config');

const cliLogger = {};

if (process.env.NODE_ENV === 'production') {
  if (!fs.existsSync('./log')) {
    fs.mkdirSync('./log');
  }

  winston.loggers.add('app', {
    file: {
      level: config.get('app.logger.level'),
      filename: path.join('./log', config.get('app.logger.appLogName')),
      tailable: true,
      maxsize: config.get('app.logger.maxSize'),
      maxFiles: config.get('app.logger.maxFiles'),
      zippedArchive: config.get('app.logger.isZipped'),
      json: config.get('app.logger.isJson'),
    },
  });
  winston.loggers.get('app').remove(winston.transports.Console);

  winston.loggers.add('access', {
    file: {
      level: config.get('app.logger.level'),
      filename: path.join('./log', config.get('app.logger.accessLogName')),
      maxsize: config.get('app.logger.maxSize'),
      maxFiles: config.get('app.logger.maxFiles'),
      zippedArchive: config.get('app.logger.isZipped'),
      json: false,
      formatter: options => options.message,
    },
  });
  winston.loggers.get('access').remove(winston.transports.Console);

  cliLogger.log = cli.log.bind(cli);
} else if (process.env.NODE_ENV === 'test') {
  winston.loggers.get('app').remove(winston.transports.Console);
  winston.loggers.get('access').remove(winston.transports.Console);
  cliLogger.log = () => {};
} else {
  winston.loggers.add('app', {
    console: {
      level: 'debug',
      colorize: true,
    },
  });

  winston.loggers.add('access', {
    console: {
      level: 'debug',
      colorize: true,
      formatter: options => options.message,
    },
  });

  cliLogger.log = cli.log.bind(cli);
}

module.exports.AppLogger = {
  log: winston.loggers.get('app').info,
  debug: winston.loggers.get('app').debug,
  warn: winston.loggers.get('app').warn,
  error: winston.loggers.get('app').error,
};

module.exports.AccessLogger = {
  stream: {
    write: message => winston.loggers.get('access').info(message),
  },
};

module.exports.CLILogger = {
  log: cliLogger.log,
};
