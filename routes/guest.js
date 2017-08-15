const Router = require('koa-router');
const BlogPost = require('../models/post');
const compose = require('koa-compose');
const mongoose = require('../libs/mongoose');

const guestRouter = new Router();

async function validateId(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) ctx.throw(404);
  await next();
}

async function getPost(ctx, next) {
  ctx.currentPost = await BlogPost.findById(ctx.params.id);
  if (!ctx.currentPost) { ctx.throw(404); }
  await next();
}

const middlewares = compose([validateId, getPost]);

guestRouter.get('/', async (ctx) => {
  const posts = await BlogPost.find({});
  if (!posts) { ctx.throw(404); }

  ctx.body = ctx.render('allposts', { posts });
});

guestRouter.get('/post/:id', middlewares, async (ctx) => {
  console.log(ctx.currentPost);
  ctx.body = ctx.render('blogPost', { post: ctx.currentPost });
});

module.exports = guestRouter;
