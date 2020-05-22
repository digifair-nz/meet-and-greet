const app = require('../app')
const supertest = require('supertest')
const request = supertest(app)
const mongoose = require('mongoose')

const User = mongoose.model('User')
const Event = mongoose.model('Event')
const Company = mongoose.model('Company')
const Queue = mongoose.model('Queue')

const setup = require('../test-setup')
setup.init()

describe('Login tests', function() {
    test('Login with correct details to correct event', async function() {
        const eventId = await setup.seedDatabase()
        const response = await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})
        
        expect(response.status).toBe(200)
        expect(response.headers).toHaveProperty('auth-token')
    })
    test('Login with incorrect email to correct event', async function() {
        const eventId = await setup.seedDatabase()
        const response = await request.post('/user/login/' + eventId).send({ email: 'test@gmail.com' })
        
        expect(response.status).toBe(404)
        expect(response.headers).not.toHaveProperty('auth-token')
    })
    test('Login with invalid email to correct event', async function() {
        const eventId = await setup.seedDatabase()
        const response = await request.post('/user/login/' + eventId).send({ email: 'test' })
        
        expect(response.status).toBe(400)
        expect(response.headers).not.toHaveProperty('auth-token')
    })
    test('Login without providing email to correct event', async function() {
        const eventId = await setup.seedDatabase()
        const response = await request.post('/user/login/' + eventId).send()
        
        expect(response.status).toBe(400)
        expect(response.headers).not.toHaveProperty('auth-token')
    })
    
    test('Login with correct email but additional properties to correct event', async function() {
        const eventId = await setup.seedDatabase()
        const response = await request.post('/user/login/' + eventId).send({ email: 'peter@gmail.com', username: 'test' })

        expect(response.status).toBe(400)
        expect(response.headers).not.toHaveProperty('auth-token')
    })
    test('Login with correct email to invalid event id', async function() {
        await setup.seedDatabase()
        const response = await request.post('/user/login/' + 'test').send({ email: 'peter@gmail.com' })

        expect(response.status).toBe(400)
        expect(response.headers).not.toHaveProperty('auth-token')
    })
    test('Login with correct email to non-existent event', async function() {
        const eventId = await setup.seedDatabase()
        const response = await request.post('/user/login/' + '5ec768ea3fb5b9519c384f09').send({ email: 'peter@gmail.com' })

        expect(response.status).toBe(400)
        expect(response.headers).not.toHaveProperty('auth-token')
    })
})

describe('Get companies tests', function() {
    test('Get companies for logged in user', async function() {
        const eventId = await setup.seedDatabase()
        const token = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
        const companies = (await request.get('/user/').set('auth-token', token)).body
        const event = await Event.findById(eventId)
        const expected = event.companiesAttending.map(i => i.toString())
    
        expect(companies.map(company => company._id)).toEqual(expected)
    })

    describe('Test the authorisation', function() {
        test('Get companies for correct event with invalid token', async function() {
            const eventId = await setup.seedDatabase()
            const result = await request.get('/user/').set('auth-token', 'test')
        
            expect(result.status).toBe(400)
        })
        
        test('Get companies for correct event with no token', async function() {
            const eventId = await setup.seedDatabase()
            const result = await request.get('/user/')
        
            expect(result.status).toBe(401)    
        })
    })
})

describe('Queueing tests', function() {
    test('Enqueue user for queue of a company of an event', async function() {
        const eventId = await setup.seedDatabase()
        const token = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
        const event = await Event.findById(eventId)
        const companyId = event.companiesAttending[0].toString()
        const response = await request.post('/user/enqueue/' + companyId).set('auth-token', token)
        
        const idOfUserInQueue = (await Queue.findOne({ eventId, companyId })).members[0]._id.toString()
        const idOfUser = (await User.findOne({ email: 'Peter@gmail.com' }))._id.toString()

        expect(response.status).toBe(200)
        expect(response.body.queuePosition).toBe(1)
        expect(idOfUserInQueue).toBe(idOfUser)

    })
    test('Enqueue two users for a company of an event', async function() {
        const eventId = await setup.seedDatabase()
        const token1 = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
        const token2 = (await request.post('/user/login/' + eventId).send({ email: 'Michael@gmail.com'})).headers['auth-token']
        const event = await Event.findById(eventId)
        const companyId = event.companiesAttending[0].toString()
        const response1 = await request.post('/user/enqueue/' + companyId).set('auth-token', token1)
        const response2 = await request.post('/user/enqueue/' + companyId).set('auth-token', token2)

        const idsInQueue = (await Queue.findOne({ eventId, companyId })).members.map(member => member._id.toString())
        const idOfFirstUser = (await User.findOne({ email: 'Peter@gmail.com' }))._id.toString()
        const idOfSecondUser = (await User.findOne({ email: 'Michael@gmail.com' }))._id.toString()

        expect(response1.status).toBe(200)
        expect(response1.body.queuePosition).toBe(1)
        expect(response2.status).toBe(200)
        expect(response2.body.queuePosition).toBe(2)
        
        expect(idsInQueue).toEqual([idOfFirstUser, idOfSecondUser])
    })
    test('Enqueue user for queue of two different companies of an event', async function() {
        const eventId = await setup.seedDatabase()
        const token = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
        const event = await Event.findById(eventId)
        const companyId1 = event.companiesAttending[0].toString()
        const companyId2 = event.companiesAttending[1].toString()
        const response1 = await request.post('/user/enqueue/' + companyId1).set('auth-token', token)
        const response2 = await request.post('/user/enqueue/' + companyId2).set('auth-token', token)

        const idOfUser = (await User.findOne({ email: 'Peter@gmail.com' }))._id.toString()
        const idOfUserInQueue1 = (await Queue.findOne({ eventId, companyId: companyId1 })).members[0]._id.toString()
        const idOfUserInQueue2 = (await Queue.findOne({ eventId, companyId: companyId2 })).members[0]._id.toString()

        expect(response1.status).toBe(200)
        expect(response1.body.queuePosition).toBe(1)
        expect(response2.status).toBe(200)
        expect(response2.body.queuePosition).toBe(1)

        expect(idOfUserInQueue1).toBe(idOfUser)
        expect(idOfUserInQueue2).toBe(idOfUser)
    })
    // // finish this one
    // test('Enqueue and then dequeue user for company of event', async function() {
    //     const eventId = await setup.seedDatabase()
    //     const token = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
    //     const event = await Event.findById(eventId)
    //     const response1 = await request.post('/user/enqueue/' + event.companiesAttending[0].toString()).set('auth-token', token)
        
    //     expect(response1.status).toBe(200)
    //     expect(response1.body.queuePosition).toBe(1)
        
    //     const response2 = await request.post('/user/dequeue/' + event.companiesAttending[0].toString()).set('auth-token', token)

    // })
})