const Router = require('koa-router');
const pick = require('lodash/pick');
const compose = require('koa-compose');
const BlogPost = require('../models/post');
const mongoose = require('../libs/mongoose');

const adminRouter = new Router({
  prefix: '/admin',
});

async function validateId(ctx, next) {
  ctx.postId = ctx.params.id;
  if (!mongoose.Types.ObjectId.isValid(ctx.postId)) ctx.throw(404);
  await next();
}

async function getPost(ctx, next) {
  ctx.currentPost = await BlogPost.findById(ctx.postId);
  if (!ctx.currentPost) { ctx.throw(404); }
  await next();
}

const middlewares = compose([validateId, getPost]);

adminRouter.get('/update/:id', middlewares, (ctx) => {
  // Object.assign(ctx.currentPost, { tags: ctx.currentPost.tags.join(',') });
  ctx.body = ctx.render('edit', { post: ctx.currentPost });
});

adminRouter.get('/create', (ctx) => {
  ctx.body = ctx.render('create');
});

adminRouter.post('/create', async (ctx) => {
  const fields = pick(ctx.request.body, BlogPost.getPostFields);

  // TO DO helper method for tags
  const tags = fields.tags.split(',');
  Object.assign(fields, { tags });

  const post = await BlogPost.create(fields);
  if (!post) { ctx.throw(); }

  ctx.redirect('/');
});

adminRouter.post('/update/:id', middlewares, async (ctx) => {
  const fields = pick(ctx.request.body, BlogPost.getPostFields);
  Object.assign(ctx.currentPost, fields);

  const updatedPost = await ctx.currentPost.save();
  if (!updatedPost) { ctx.throw(); }

  ctx.redirect(`/post/${ctx.postId}`);
});

adminRouter.get('/delete/:id', middlewares, async (ctx) => {
  const removedPost = await ctx.currentPost.remove();
  if (!removedPost) { ctx.throw(); }

  ctx.redirect('/');
});

// adminRouter.post('/user', async (ctx) => {
//   const User = require('../models/user');// eslint-disable-line
//   const fields = pick(ctx.request.body, ['name', 'email', 'password']);
//   ctx.body = await User.create(fields);
// });

module.exports = adminRouter;
