// long stack trace (+clarify from co) if needed
// if (process.env.TRACE) {
//   require('./libs/trace');
// }

const Koa = require('koa');

const app = new Koa();
require('dotenv').config();// eslint-disable-line import/no-extraneous-dependencies

// const config = require('config');
// const mongoose = require('./libs/mongoose');

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
// app.keys = [config.secret];

const path = require('path');
const fs = require('fs');

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach((middleware) => {
  app.use(require(`./middlewares/${middleware}`));// eslint-disable-line
});

const guestRouter = require('./routes/guest');

app.use(guestRouter.routes());

module.exports = app;
