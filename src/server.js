const http = require('http');

const config = require('./util/config');
const logger = require('./util/logger').AppLogger;
const app = require('./app');

const server = http.createServer(app);
const port = config.get('app.port') || '9890';

server.listen(port);

server.on('listening', () => {
  logger.log('App listening on port %s', port);
});

server.on('error', err => {
  logger.error('PMS Error: %o', err);
});

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at %O', p, reason.message);
  throw new Error('Unhandled Rejection');
});

process.on('uncaughtException', err => {
  logger.error('Unhandled Exception:', err);
  server.close();
  setTimeout(process.exit, 1000).unref();
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
