const request = require('supertest');
const app = require('../index');
const BlogPost = require('../models/post');

const { cleanDb, initDb } = require('./utils');

describe('Posts', () => {
  beforeAll(() => initDb());

  afterAll(() => cleanDb());

  test('It should get all posts', async () => {
    const response = await request(app.listen()).get('/');
    expect(response.statusCode).toBe(200);
  });

  test('It should create post', async () => {
    const values = { title: 'Test koa', content: 'Some data', tags: ['test'] };
    const blogCount = await BlogPost.count();
    const res = await request(app.listen()).post('/admin/create').send(values);
    const newBlogCount = await BlogPost.count();

    expect(res.statusCode).toBe(200);
    expect(blogCount + 1).toBe(newBlogCount);
  });
});
