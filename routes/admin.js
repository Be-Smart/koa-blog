const Router = require('koa-router');
const pick = require('lodash/pick');
const compose = require('koa-compose');
const BlogPost = require('../models/post');
const mongoose = require('../libs/mongoose');

const adminRouter = new Router({
  prefix: '/admin',
});

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

adminRouter.post('/create', async (ctx) => {
  const fields = pick(ctx.request.body, BlogPost.getPostFields);
  const post = await BlogPost.create(fields);

  ctx.body = post.toObject();
});

adminRouter.post('/update/:id', middlewares, async (ctx) => {
  const fields = pick(ctx.request.body, BlogPost.getPostFields);
  Object.assign(ctx.currentPost, fields);

  await ctx.currentPost.save();

  ctx.body = ctx.currentPost.toObject();
});

adminRouter.post('/delete/:id', middlewares, async (ctx) => {
  const removedPost = await ctx.currentPost.remove();
  ctx.body = removedPost;
});

// adminRouter.post('/user', async (ctx) => {
//   const User = require('../models/user');// eslint-disable-line
//   const fields = pick(ctx.request.body, ['name', 'email', 'password']);
//   ctx.body = await User.create(fields);
// });

module.exports = adminRouter;
