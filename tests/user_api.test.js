const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    _id: "5e457e129162ea6f49a784af",
    username: "lentsikka",
    name: "Lennu",
    passwordHash: "$2b$10$7/A55bnVnAeIKvH6BcViIulI5McSxqKyGflNbXroUjMA714.NgEhm",
    __v: 0
  },
  {
    _id: "5e457ce03521ea6cbe0be68a",
    username: "violet",
    name: "Violet Gray",
    passwordHash: "$2b$10$/9MHQN0bScx/zNos3h9Lj.To0uj.aZYjqikEGhFlXA66.AVZl7VMK",
    __v: 0,
    blogs: [
      "5a422a851b54a676234d17f7",
      "5a422a851b54a927234d17f7"
    ]
  }
]

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(initialUsers)
})

describe('POST / call', () => {
  test('does not add short usernames', async () => {
    const newUser = {
      username: "ye",
      name: "Yes man",
      password: "noooo"
    }

    const response = await api.post('/api/users').send(newUser)
    expect(response.status).toBe(400)
    expect(response.body.error).toBe('User validation failed: username: Path `username` (`ye`) is shorter than the minimum allowed length (3).')
  })

  test('requires username', async () => {
    const newUser = {
      name: "Yes man",
      password: "noooo"
    }

    const response = await api.post('/api/users').send(newUser)
    expect(response.status).toBe(400)
    expect(response.body.error).toBe('User validation failed: username: Path `username` is required.')
  })

  test('requires unique username', async () => {
    const newUser = {
      username: "lentsikka",
      name: "Yes man",
      password: "noooo"
    }

    const response = await api.post('/api/users').send(newUser)
    expect(response.status).toBe(400)
    expect(response.body.error).toBe('E11000 duplicate key error collection: test.users index: username_1 dup key: { username: \"lentsikka\" }')
  })

  test('does not add short passwords', async () => {
    const newUser = {
      username: "yes",
      name: "Yes man",
      password: "no"
    }

    const response = await api.post('/api/users').send(newUser)
    expect(response.status).toBe(400)
    expect(response.body.error).toBe('password not long enough')
  })

  test('requires password', async () => {
    const newUser = {
      username: "yes",
      name: "Yes man"
    }

    const response = await api.post('/api/users').send(newUser)
    expect(response.status).toBe(400)
    expect(response.body.error).toBe('password not long enough')
  })
})

afterAll(() => {
  mongoose.connection.close()
})