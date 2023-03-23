const app = require('express')();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');

const logger = require('./util/logger').AccessLogger;
const router = require('./api');
const {
  clientErrorHandler,
  serverErrorHandler,
  notFoundErrorHandler,
} = require('./api/error');

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(cors());
app.use(morgan('combined', { stream: logger.stream }));
app.use(router);
app.use(clientErrorHandler);
app.use(serverErrorHandler);
app.use(notFoundErrorHandler);

module.exports = app;
