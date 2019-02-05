const expect = require('chai').expect
const mongoUnit = require('mongo-unit')
const job = require('./job')
const data = require('./tests/db/chat.json')
const USER_ID = '5ba6532c43c528a283a86f54'
const CHAT_ID = '5ba6532c43c528a283a86f57'

describe('job', () => {
  beforeEach(() => mongoUnit.load(data))
  afterEach(() => mongoUnit.drop())

  it('should create new job', async () => {
    const response = await job.createJob({
      user: { id: USER_ID },
      job: {title: "testTitle", car: 'nissan', address: 'testAdress', 
      location: {}, datetime: '23/23/1332 12:32', description: 'okey', 
      price: 21}
    })
    console.log(response)
    expect(response.jobTitle).eql('testTitle')
  })
})