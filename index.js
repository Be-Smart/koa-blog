const Koa = require('koa');

const app = new Koa();
require('dotenv').config();// eslint-disable-line import/no-extraneous-dependencies

const path = require('path');
const fs = require('fs');

const middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach((middleware) => {
  app.use(require(`./middlewares/${middleware}`));// eslint-disable-line
});

const guestRouter = require('./routes/guest');
const adminRouter = require('./routes/admin');

app.use(guestRouter.routes());
app.use(adminRouter.routes());

module.exports = app;
