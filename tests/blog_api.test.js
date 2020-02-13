const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
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

    test('returns six blogs', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(6)
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
            .send(newBlog)

        const blogs = await api.get('/api/blogs')
        expect(blogs.body[6].title).toBe(newBlog.title)
    })

    test('sets likes to 0 by default', async () => {
        const newBlog = {
            title: "Basic Food for Basic Noobs",
            author: "Gordon Ramsay",
            url: "https://www.noobseat.com/"
        }

        const result = await api.post('/api/blogs').send(newBlog)
        expect(result.body.likes).toBe(0)
    })

    test('requires title', async () => {
        const newBlog = {
            author: "Jane Austen",
            url: "https://www.realistic-life-in-england.com/"
        }

        await api.post('/api/blogs').send(newBlog).expect(400)
    })

    test('requires url', async () => {
        const newBlog = {
            title: "How to find a husband",
            author: "Jane Austen"
        }

        await api.post('/api/blogs').send(newBlog).expect(400)
    })
})

afterAll(() => {
    mongoose.connection.close()
})