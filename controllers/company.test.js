const OpenTok = require('opentok')
const app = require('../app')
const opentok = new OpenTok(process.env.VONAGE_API_KEY, process.env.VONAGE_SECRET)
const supertest = require('supertest')
const request = supertest(app)
const mongoose = require('mongoose')

const User = mongoose.model('User')
const Event = mongoose.model('Event')
const Company = mongoose.model('Company')
const Queue = mongoose.model('Queue')
const Room = mongoose.model('Room')

const setup = require('../test-setup')
setup.init()

// describe('')