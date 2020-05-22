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
