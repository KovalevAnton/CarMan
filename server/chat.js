const _ = require('lodash')
const shortid = require('shortid')
const auth = require('./auth')
const database = require('./db')
const USER_CHATS = 'userChats'
const MESSAGES = 'messages'
const online = {}

function init(server) {
  const io = require('socket.io')(server)
  io.use((socket, next) => {
    console.log('io socket handshake: ')
    if (socket.handshake.query && socket.handshake.query.token) {
      const decoded = auth.decodeToken(socket.handshake.query.token)
      socket.decoded = decoded;
      next();
    } else {
      next(new Error('Authentication error'));
    }
  })
  io.on('connection', onConnection)
}

function onConnection(socket) {
  console.log('onConnection socket: ', socket.decoded)
  const user = socket.decoded
  if (!user) {
    socket.disconnect()
    return 'invalid token'
  }
  online[user._id] = socket

  socket.on('disconnect', () => {
    console.info('user disconnected:', user._id)
    online[user._id] = null
  })

  socket.on('message', (data) => {
    console.info(`message:send  data, ${JSON.stringify(data)}`)
    processMessage({ user, data, online })
  })
}

async function processMessage({ user, data, online }) {
  console.log('data', data)
  try {
    const parsed = JSON.parse(data)
    const db = await database.db()
    const message = {
      _id: shortid.generate(),
      chatId: parsed.chatId,
      text: parsed.text,
      author: user,
      timestamp: Date.now(),
    }
    const chatId = parsed.chatId
    await db.collection(MESSAGES).insertOne(message)
    await db.collection(USER_CHATS).updateMany({ chatId }, {
      $set: {
        lastMessageText: message.text,
        lastMessageId: message._id,
        lastMessageAuthor: user.name,
        lastMessageAuthorId: user._id,
        lastMessageTimestamp: message.timestamp
      }
    })
    //todo: temp common broadcast
    _.each(online, socket => {
      socket && socket.send(message)
    })
  } catch (e) {
    console.error('cannot send message, ', e)
  }
}

async function getChat(chatId) {
  const db = await database.db()
  const userChats = await db.collection(USER_CHATS).find({ chatId }).toArray()
  return {
    chatId: _.get(userChats, '0.chatId'),
    chatName: _.get(userChats, '0.chatName'),
    users: _.map(userChats, item => ({ _id: item.userId, name: item.userName }))
  }
}

async function getChats(user) {
  const db = await database.db()
  const userChats = await db.collection(USER_CHATS).find({ userId: user._id }).toArray()
  return userChats
}

async function createChat({ user, request }) {
  const { users, chatName } = request
  const chatId = shortid.generate()
  const db = await database.db()
  await db.collection(USER_CHATS).insertOne({
    chatId, chatName,
    userId: user._id, userName: user.name
  })
  if (_.get(users, 'length') > 0) {
    for (let contact of users) {
      await db.collection(USER_CHATS).insertOne({
        chatId, chatName,
        userId: contact._id, userName: contact.name
      })
    }
  }
  return getChat(chatId)
}

async function updateChatName({ user, request }) {
  const { chatId, chatName } = request
  const db = await database.db()
  const response = await db.collection(USER_CHATS).updateMany(
    { chatId },
    { $set: { chatName } },
  )
  if (!response.result.ok) {
    return Promise.reject('invalid params')
  }
  return getChat(chatId)
}
async function addUser({ user, request }) {
  const { chat } = request
  const newUser = request.user
  if (!chat || !newUser) {
    return Promise.reject('invalid params')
  }
  const db = await database.db()
  const response = await db.collection(USER_CHATS)
    .find({ chatId: chat.chatId, userId: newUser._id }).toArray()
  if (response.length > 0) {
    return Promise.reject('user already added')
  }
  await db.collection(USER_CHATS).insertOne({
    chatId: chat.chatId, chatName: chat.chatName,
    userId: newUser._id, userName: newUser.name
  })
  //todo: notify this user
  return { ok: 'success' }
}

async function getMessages({ user, chatId }) {
  if (chatId) {
    const db = await database.db()
    const messages = await db.collection(MESSAGES).find({ chatId }).toArray()
    return messages
  } else {
    return Promise.reject('Invalid param')
  }
}

module.exports = {
  init,
  getChat,
  getChats,
  createChat,
  updateChatName,
  addUser,
  getMessages,

  //private method only
  processMessage,
}