// initialize template system early, to let error handler use them
// koa-views is a wrapper around many template systems!
// most of time it's better to use the chosen template system directly
const pug = require('pug');
const path = require('path');
const moment = require('moment');

module.exports = async (ctx, next) => {
  const context = {};

  /* default helpers */
  context.locals = {
    moment,
    /* at the time of ctx middleware, user is unknown, so we make it a getter */
    get user() {
      return ctx.req.user; // passport sets ctx
    },

    get flash() {
      return ctx.flash();
    },

    get csrf() {
      return ctx.csrf;
    },
  };

  ctx.render = (templatePath, locals = {}) => {
    // warning!
    // _.assign does NOT copy defineProperty
    // so I use ctx.locals as a root and merge all props in it, instead of cloning ctx.locals
    const localsFull = Object.create(context.locals);

    Object.keys(locals).forEach((key) => {
      localsFull[key] = locals[key];
    });

    const templatePathResolved = path.join('templates', `${templatePath}.pug`);

    return pug.renderFile(templatePathResolved, localsFull);
  };

  await next();
};
