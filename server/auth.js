const { compareSync, hashSync } = require('bcrypt')
const { sign, decode } = require('jsonwebtoken')
const _ = require('lodash')
const shortid = require('shortid')
const database = require('./db')
const secret = 'todo: move to secrete'
const USERS = 'users'

function generateToken(user) {
  const { _id, name, email } = user
  return sign({
    exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60),
    _id, name, email,
  }, secret)
}

function decodeToken(token) {
  return decode(token, secret)
}

function generatePasswordHash(password) {
  return hashSync(password, 2)
}

function checkPassword(candidate, hash) {
  return compareSync(hash, candidate)
}

function userInfo(user) {
  const { _id, name, email, srcAvatar, role } = user
  return { _id, name, email, srcAvatar, role }
}

async function login(credentials) {
  const { email, password } = credentials
  if (!email || !password) {
    return Promise.reject('invalid params')
  }
  const db = await database.db()
  const user = await db.collection(USERS).findOne({ email })
  if (!user) {
    return Promise.reject('invalid params')
  }
  if (checkPassword(user.password, password)) {
    return { token: generateToken(user), user: userInfo(user) }
  } else {
    return Promise.reject('invalid username or password')
  }
}

async function register(request) {
  const { email, name, password, role } = request
  if (!email || !name || !password || !role) {
    return Promise.reject('invalid params', request)
  }
  const db = await database.db()
  const response = await db.collection(USERS).insertOne({
    _id: shortid.generate(), email, role, name, password: generatePasswordHash(password)
  })
  const userId = _.get(response, 'insertedId')
  if (!userId) {
    return Promise.reject('invalid params')
  }
  const user = await db.collection(USERS).findOne({ _id: userId })
  return { token: generateToken(user), user: userInfo(user) }
}

async function changeSettings(userId, request) {
  const { name, email, srcAvatar } = request
  if (!name || !email) {
    return Promise.reject('invalid params')
  }
  console.log(userId)
  const db = await database.db()
  const user = await db.collection(USERS).updateOne({ _id: userId },
    { $set: { name, email, srcAvatar } })
  if (!user) {
    return Promise.reject('invalid params')
  }
  const result = await db.collection(USERS).findOne({ _id: userId })
  return { name: result.name, email: result.email, srcAvatar: result.srcAvatar }
}

async function check(token) {
  if (!token) {
    return Promise.reject('invalid token')
  }
  const decoded = decodeToken(token)
  console.log('decoded', decodeToken(token))
  const userId = decoded._id
  if (!userId) {
    return Promise.reject('invalid token')
  }
  const db = await database.db()
  const user = await db.collection(USERS).findOne({ _id: userId }) //todo: update it
  return { token: generateToken(user), user: userInfo(user) }
}

async function findUsers({ user, text }) {
  if (!text) {
    return Promise.reject('invalid token')
  }
  const db = await database.db()
  const users = await db.collection(USERS).find({ name: { $regex: text, $options: 'i' } }).toArray()
  const results = _.filter(users, item => item._id !== user._id)
  return results
}

module.exports = {
  login,
  register,
  check,
  decodeToken,
  findUsers,
  changeSettings
}
