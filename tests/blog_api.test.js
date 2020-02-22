const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: "5e457ce03521ea6cbe0be68a",
    __v: 0
  },
  {
    _id: "5a422a851b54a927234d17f7",
    title: "FASHION 101 FOR NOOBS",
    author: "Linus",
    url: "https://fashion.com/",
    likes: 200,
    user: "5e457ce03521ea6cbe0be68a",
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('GET / call', () => {
  test('returns json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns two blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(2)
  })

  test('returns blogs with ids instead of _ids', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined
  })
})

describe('POST / call', () => {
  test('adds a blog', async () => {
    const newBlog = {
      title: "Being Awesome",
      author: "Michelle Obama",
      url: "https://awesome.com/",
      likes: 100
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpb2xldCIsImlkIjoiNWU0NTdjZTAzNTIxZWE2Y2JlMGJlNjhhIiwiaWF0IjoxNTgxNzY3ODQ2fQ.Mbn0zpB9IOcnlLK5piqsvbEfN6WrGgXeTscBDKUhj7w')
      .send(newBlog)

    const blogs = await api.get('/api/blogs')
    expect(blogs.body[2].title).toBe(newBlog.title)
  })

  test('sets likes to 0 by default', async () => {
    const newBlog = {
      title: "Basic Food for Basic Noobs",
      author: "Gordon Ramsay",
      url: "https://www.noobseat.com/"
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpb2xldCIsImlkIjoiNWU0NTdjZTAzNTIxZWE2Y2JlMGJlNjhhIiwiaWF0IjoxNTgxNzY3ODQ2fQ.Mbn0zpB9IOcnlLK5piqsvbEfN6WrGgXeTscBDKUhj7w')
      .send(newBlog)
    expect(result.body.likes).toBe(0)
  })

  test('requires title', async () => {
    const newBlog = {
      author: "Jane Austen",
      url: "https://www.realistic-life-in-england.com/"
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpb2xldCIsImlkIjoiNWU0NTdjZTAzNTIxZWE2Y2JlMGJlNjhhIiwiaWF0IjoxNTgxNzY3ODQ2fQ.Mbn0zpB9IOcnlLK5piqsvbEfN6WrGgXeTscBDKUhj7w')
      .send(newBlog).expect(400)
  })

  test('requires url', async () => {
    const newBlog = {
      title: "How to find a husband",
      author: "Jane Austen"
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpb2xldCIsImlkIjoiNWU0NTdjZTAzNTIxZWE2Y2JlMGJlNjhhIiwiaWF0IjoxNTgxNzY3ODQ2fQ.Mbn0zpB9IOcnlLK5piqsvbEfN6WrGgXeTscBDKUhj7w')
      .send(newBlog).expect(400)
  })
})

describe('DELETE /:id call', () => {
  test('does not delete without token', async () => {
    const response = await api.delete('/api/blogs/5a422a851b54a676234d17f7')
    expect(response.status).toBe(401)
    expect(response.body.error).toBe('invalid token')
  })
})

afterAll(() => {
  mongoose.connection.close()
})