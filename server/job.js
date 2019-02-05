const _ = require('lodash')
const shortid = require('shortid')
const auth = require('./auth')
const database = require('./db')
const USER_JOBS = 'userJobs'


async function createJob({ user, job }) {
    const jobId = shortid.generate()
    const db = await database.db()
    await db.collection(USER_JOBS).insertOne({
        jobId, 
        jobTitle: job.title, 
        jobCar: job.car,
        jobAddress: job.address,
        jobLocation: job.location,
        jobDatetime: job.datetime,
        jobDescription: job.description,
        jobPrice: job.price,
        customerId: user.id, 
        customerName: user.name,
        jobWorker: null
    })
    return getJob(jobId)
}

async function getJob(jobId) {
    const db = await database.db()
    const userJobs = await db.collection(USER_JOBS).find({ jobId }).toArray()
    return {
        jobId: _.get(userJobs, '0.jobId'),
        jobTitle: _.get(userJobs, '0.jobTitle'),
        jobCar: _.get(userJobs, '0.jobCar'),
        jobAddress: _.get(userJobs, '0.jobAddress'),
        jobLocation: _.get(userJobs, '0.jobLocation'),
        jobDatetime: _.get(userJobs, '0.jobDatetime'),
        jobDescription: _.get(userJobs, '0.jobDescription'),
        jobPrice: _.get(userJobs, '0.jobPrice'),
        customerName: _.get(userJobs, '0.customerName'),
        customerId: _.get(userJobs, '0.customerId'),
        jobWorker: _.get(userJobs, '0.jobWorker'),
    }
}

async function getJobs(user) {
    const db = await database.db()
    const userJobs = await db.collection(USER_JOBS).find({ customerId: user._id }).toArray()
    return userJobs
  }

module.exports = {
    createJob,
    getJob,
    getJobs
}