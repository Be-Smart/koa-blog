const Router = require('koa-router');

const guestRouter = new Router();

guestRouter.get('/', async (ctx) => {
  ctx.body = ctx.render('layout');
});

guestRouter.get('/post/:id', async (ctx) => {
  ctx.body = ctx.render('blogPost');
});

module.exports = guestRouter;
