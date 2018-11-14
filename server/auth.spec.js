const expect = require('chai').expect
const mongoUnit = require('mongo-unit')
const auth = require('./auth')
const data = require('./tests/db/auth.json')


describe('auth', () => {
  beforeEach(() => mongoUnit.load(data))
  afterEach(() => mongoUnit.drop())


  it('should login valid user', async () => {
    const response = await auth.login({ email: 'test1@test.com', password: 'test1' })
    expect(!!response.token).eql(true)
  })

  it('should register valid user', async () => {
    const response = await auth.register({ email: 'test100@test.com', name: 'test', password: 'test1' })
    expect(!!response.token).eql(true)
  })

  it('should check valid token', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1Mzc2NTYxNDIsIl9pZCI6IjViYTY1MzJjNDNjNTI4YTI4M2E4NmY1NCIsIm5hbWUiOiJ0ZXN0MSIsImVtYWlsIjoidGVzdDFAdGVzdC5jb20iLCJpYXQiOjE1Mzc2MjczNDJ9.z63m_Yu89FcpGdzTe9PRUxkSq0iN-jZMqzS1sdX_FUE'
    const response = await auth.check(token)
    expect(!!response.token).eql(true)
  })
  it('should find users', async () => {
    const response = await auth.findUsers({ user: { _id: '5ba6532c43c528a283a86f54' }, text: 'st' })
    expect(response.length).eql(2)
  })

  it('should check update user settigs', async () => {
    const _id = '5ba6532c43c528a283a86f54'
    const response = await auth.changeSettings(_id, { name: 'kkk23', email: "Kkk@kkk.kkk23", srcAvatar: "user ava src!" })
    expect(response.name).eql('kkk23')
    expect(response.email).eql('Kkk@kkk.kkk23')
    expect(response.srcAvatar).eql('user ava src!')
  })
})
