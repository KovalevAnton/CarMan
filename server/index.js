const micro = require('micro');
const { router, get, post, put } = require('microrouter');
const cors = require('micro-cors')({ allowMethods: ['GET', 'POST', 'PUT'] });
const fs = require('fs');
const path = require('path');
const auth = require('./auth')
const chat = require('./chat')

const document = path.join(__dirname, 'main.html')
const html = fs.readFileSync(document)

const server = micro(
  cors(
    router(
      get('/index.html', async (req, res) => {
        console.log('Serving index.html')
        res.end(html)
      }),
      post('/auth/login', async (req, res) => {
        try {
          const body = await micro.json(req)
          const response = await auth.login(body)
          micro.send(res, 200, response);
        } catch (e) {
          console.error('login error: ', e)
          micro.send(res, 400, { error: 'incorrect password' })
        }
      }),
      post('/auth/check', async (req, res) => {
        try {
          const token = req.headers['authorization']
          const response = await auth.check(token)
          micro.send(res, 200, response);
        } catch (e) {
          console.error('check error: ', e)
          micro.send(res, 400, { error: 'incorrect token' })
        }
      }),
      post('/auth/register', async (req, res) => {
        try {
          const body = await micro.json(req)
          const response = await auth.register(body)
          micro.send(res, 200, response)
        } catch (e) {
          console.error('register error: ', e)
          micro.send(res, 400, { error: 'incorrect params' })
        }
      }),
      post('/auth/changeSettings', async (req, res) => {
        try {
          const token = req.headers['authorization']
          const user = auth.decodeToken(token)
          const body = await micro.json(req)
          const response = await auth.changeSettings(user._id, body)
          micro.send(res, 200, response)
        } catch (e) {
          console.error('changeSettings error: ', e)
          micro.send(res, 400, { error: 'incorrect params' })
        }
      }),
      post('/auth/forget-password', (req, res) => {
        micro.send(res, 200, { status: 'new password is sent to your email' })
      }),
      get('/users/search/:text', async (req, res) => {
        try {
          const token = req.headers['authorization']
          const user = auth.decodeToken(token)
          const response = await auth.findUsers({user, text:req.params.text})
          micro.send(res, 200, response)
        } catch (e) {
          console.error('search error: ', e)
          micro.send(res, 400, { error: 'incorrect params' })
        }
      }),
      get('/chat', async (req, res) => {
        try {
          const token = req.headers['authorization']
          const user = auth.decodeToken(token)
          const response = await chat.getChats(user)
          micro.send(res, 200, response);
        } catch (e) {
          console.error('get chats error: ', e)
          micro.send(res, 400, { error: 'get chats error' })
        }
      }),
      get('/chat/:chatId', async (req, res) => {
        try {
          const token = req.headers['authorization']
          const user = auth.decodeToken(token)
          const response = await chat.getChat(req.params.chatId)
          micro.send(res, 200, response);
        } catch (e) {
          console.error('get chats error: ', e)
          micro.send(res, 400, { error: 'get chats error' })
        }
      }),
      post('/chat', async (req, res) => {
        try {
          const token = req.headers['authorization']
          const user = auth.decodeToken(token)
          const body = await micro.json(req)
          const response = await chat.createChat({ user, request: body })
          micro.send(res, 200, response);
        } catch (e) {
          console.error('create chat error: ', e)
          micro.send(res, 400, { error: 'create chat error' })
        }
      }),
      put('/chat', async (req, res) => {
        try {
          const token = req.headers['authorization']
          const user = auth.decodeToken(token)
          const body = await micro.json(req)
          const response = await chat.updateChat({ user, request: body })
          micro.send(res, 200, response);
        } catch (e) {
          console.error('update chat error: ', e)
          micro.send(res, 400, { error: 'update chat error' })
        }
      }),
      post('/chat/addUser', async (req, res) => {
        try {
          const token = req.headers['authorization']
          const user = auth.decodeToken(token)
          const body = await micro.json(req)
          const response = await chat.addUser({ user, request: body })
          micro.send(res, 200, response);
        } catch (e) {
          console.error('create chat error: ', e)
          micro.send(res, 400, { error: 'create chat error' })
        }
      }),
      get('/messages/:chatId', async (req, res) => {
        try {
          const token = req.headers['authorization']
          const user = auth.decodeToken(token)
          const response = await chat.getMessages({ user, chatId: req.params.chatId })
          micro.send(res, 200, response);
        } catch (e) {
          console.error('get messages error: ', e)
          micro.send(res, 400, { error: 'get messages error' })
        }
      })
    )
  )
)

chat.init(server)

server.listen(4000, () => console.log('Listening on localhost:4000'))
