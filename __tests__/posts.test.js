const request = require('supertest');
const app = require('../index');
const BlogPost = require('../models/post');

const { cleanDb, initDb } = require('./utils');

describe('Posts', () => {
  beforeAll(() => initDb());

  afterAll(() => cleanDb());

  describe('GET /', () => {
    test('It should get all posts', async () => {
      const response = await request(app.listen()).get('/');
      expect(response.statusCode).toBe(200);
    });
  });

  describe('GET /post/:id', () => {
    let post;

    beforeEach(async () => {
      post = new BlogPost({ title: 'Write code', content: 'Post about koa', tags: ['code'] });
      await post.save();
    });

    test('It should get post by id', async () => {
      const response = await request(app.listen()).get(`/post/${post._id}`);// eslint-disable-line no-underscore-dangle
      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST /admin/create', () => {
    test('It should create post', async () => {
      const values = { title: 'Test koa', content: 'Some data', tags: ['test'] };
      const blogCount = await BlogPost.count();
      const response = await request(app.listen()).post('/admin/create').send(values);
      const newBlogCount = await BlogPost.count();

      expect(response.statusCode).toBe(200);
      expect(blogCount + 1).toBe(newBlogCount);
    });
  });

  describe('POST /admin/update/:id', () => {
    let post;

    beforeEach(async () => {
      post = new BlogPost({ title: 'Write on koa', content: 'Awesome Koa', tags: ['code'] });
      await post.save();
    });

    test('It should update post by id', async () => {
      const { _id: id } = post;
      const newValues = { title: 'Write more code' };
      const response = await request(app.listen()).post(`/admin/update/${id}`).send(newValues);
      const updatedPost = await BlogPost.findById(id);

      expect(response.statusCode).toBe(200);
      expect(updatedPost.title).toBe('Write more code');
    });
  });

  describe('POST /admin/delete/:id', () => {
    let post;

    beforeEach(async () => {
      post = new BlogPost({ title: 'Advanced post', content: 'Helpfull content', tags: ['tips'] });
      await post.save();
    });

    test('It should remove post by id', async () => {
      const { _id: id } = post;
      const response = await request(app.listen()).post(`/admin/delete/${id}`);
      const deletedPost = await BlogPost.findById(id);

      expect(response.statusCode).toBe(200);
      expect(deletedPost).toBeNull();
    });
  });
});
