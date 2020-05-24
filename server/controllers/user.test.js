const app = require('../app')
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
	test('Enqueue and then dequeue user for company of event', async function() {
		const eventId = await setup.seedDatabase()
		const token = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
		const event = await Event.findById(eventId)
		const companyId = event.companiesAttending[0].toString()
		const response1 = await request.post('/user/enqueue/' + companyId).set('auth-token', token)
		
		expect(response1.status).toBe(200)
		expect(response1.body.queuePosition).toBe(1)
		
		const response2 = await request.post('/user/dequeue/' + companyId).set('auth-token', token)
		const queue = await Queue.findOne({ eventId, companyId })

		expect(response2.status).toBe(200)
		expect(queue.members.length).toBe(0)
	})
	test('Dequeue user and test that it shifts other users forwards', async function() {
        const eventId = await setup.seedDatabase()
        const token1 = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
        const token2 = (await request.post('/user/login/' + eventId).send({ email: 'Michael@gmail.com'})).headers['auth-token']
        const event = await Event.findById(eventId)
        const companyId = event.companiesAttending[0].toString()
        await request.post('/user/enqueue/' + companyId).set('auth-token', token1)
		await request.post('/user/enqueue/' + companyId).set('auth-token', token2)
		const dequeueResponse = await request.post('/user/dequeue/' + companyId).set('auth-token', token1)

        const idsInQueue = (await Queue.findOne({ eventId, companyId })).members.map(member => member._id.toString())
        const idOfSecondUser = (await User.findOne({ email: 'Michael@gmail.com' }))._id.toString()

		expect(dequeueResponse.status).toBe(200)
		expect(idsInQueue.length).toBe(1)
		expect(idsInQueue[0]).toBe(idOfSecondUser)
	})

	test('Enqueue user twice for the same company of the same event', async function() {
		const eventId = await setup.seedDatabase()
		const token = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
		const event = await Event.findById(eventId)
		const companyId = event.companiesAttending[0].toString()
		const response1 = await request.post('/user/enqueue/' + companyId).set('auth-token', token)
		
		expect(response1.status).toBe(200)
		expect(response1.body.queuePosition).toBe(1)
		
		const response2 = await request.post('/user/enqueue/' + companyId).set('auth-token', token)
		const queue = await Queue.findOne({ eventId, companyId })

		expect(response2.status).toBe(403)
		expect(queue.members.length).toBe(1)
	})
	test('Dequeue user who is not queued', async function() {
		const eventId = await setup.seedDatabase()
		const token = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
		const event = await Event.findById(eventId)
		const companyId = event.companiesAttending[0].toString()
		await request.post('/user/enqueue/' + companyId).set('auth-token', token)
		await request.post('/user/dequeue/' + companyId).set('auth-token', token)
		const response = await request.post('/user/dequeue/' + companyId).set('auth-token', token)
		const queue = await Queue.findOne({ eventId, companyId })
		
		expect(response.status).toBe(403)
		expect(queue.members.length).toBe(0)
	})
	test('Enqueue user to company not attending event', async function() {
		const eventId = await setup.seedDatabase()
		const token = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
		const event = await Event.findById(eventId)
		const companyIdsAttending = event.companiesAttending.map(company => company._id.toString())
		const allCompanyIds = (await Company.find({})).map(company => company._id.toString())
		const companyNotAttendingId = allCompanyIds.filter(id => !companyIdsAttending.includes(id))[0]

		const response = await request.post('/user/enqueue/' + companyNotAttendingId).set('auth-token', token)
		const queue = await Queue.findOne({ eventId, companyNotAttendingId })
		
		expect(response.status).toBe(400)
		expect(queue).toBe(null)
	})
})

describe('Session tests', function() {
    describe('Joining session tests', function() {
        test('Attempt to join empty session for which the user is at the front of the queue for', async function() {
            const eventId = await setup.seedDatabase()
            const token = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
            const event = await Event.findById(eventId)
            const companyId = event.companiesAttending[0].toString()
            await request.post('/user/enqueue/' + companyId).set('auth-token', token)
            const response = await request.post('/user/accept/' + companyId).set('auth-token', token)
    
            const user = await User.findOne({ email: 'Peter@gmail.com' })
            const room = await Room.findOne({ name: 'Room 1' })
            const otherRooms = await Room.find({ name: { $ne: 'Room 1' } })
            const queue = await Queue.findOne({ companyId, eventId })
            
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('vonageToken')
            expect(user.inSession).toBe(true)
            expect(room.inSession).toBe(true)
            expect(queue.members.length).toBe(0)
    
            expect(otherRooms.map(room => room.inSession)).toEqual([false, false])
        })
        test('Attempt to join empty session for which the user is first in queue who is not in session ', async function() {
            const eventId = await setup.seedDatabase()
            const token1 = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
            const token2 = (await request.post('/user/login/' + eventId).send({ email: 'Michael@gmail.com'})).headers['auth-token']
            const event = await Event.findById(eventId)
            const companyId = event.companiesAttending[0].toString()
            await request.post('/user/enqueue/' + companyId).set('auth-token', token1)
            await request.post('/user/enqueue/' + companyId).set('auth-token', token2)
            const user1 = await User.findOne({ email: 'Peter@gmail.com' })
            user1.inSession = true
            await user1.save()
            const response = await request.post('/user/accept/' + companyId).set('auth-token', token2)
            const user2 = await User.findOne({ email: 'Michael@gmail.com' })
            
            const room = await Room.findOne({ name: 'Room 1' })
            const otherRooms = await Room.find({ name: { $ne: 'Room 1' } })
    
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('vonageToken')
            expect(user2.inSession).toBe(true)
            expect(room.inSession).toBe(true)
            expect(room.sessionPartner.toString()).toEqual(user2._id.toString())
            expect(otherRooms.map(room => room.inSession)).toEqual([false, false])
        })
        test('Attempt to join empty session for which the user is not the first in queue for', async function() {
            const eventId = await setup.seedDatabase()
            const token1 = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
            const token2 = (await request.post('/user/login/' + eventId).send({ email: 'Michael@gmail.com'})).headers['auth-token']
            const event = await Event.findById(eventId)
            const companyId = event.companiesAttending[0].toString()
            await request.post('/user/enqueue/' + companyId).set('auth-token', token1)
            await request.post('/user/enqueue/' + companyId).set('auth-token', token2)
            const response = await request.post('/user/accept/' + companyId).set('auth-token', token2)
            const user2 = await User.findOne({ email: 'Michael@gmail.com' })
            
            const room = await Room.findOne({ name: 'Room 1' })
            const queue = await Queue.findOne({ companyId, eventId })
    
            expect(response.status).toBe(403)
            expect(response.body).not.toHaveProperty('vonageToken')
            expect(user2.inSession).toBe(false)
            expect(room.inSession).toBe(false)
            expect(queue.members.length).toBe(2)
        })
        test('Attempt to join empty session while the user is in session', async function() {
            const eventId = await setup.seedDatabase()
            const token = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
            const event = await Event.findById(eventId)
            const companyId = event.companiesAttending[0].toString()
            await request.post('/user/enqueue/' + companyId).set('auth-token', token)
            const user = await User.findOne({ email: 'Peter@gmail.com' })
            user.inSession = true
            await user.save()
            const response = await request.post('/user/accept/' + companyId).set('auth-token', token)
    
            const room = await Room.findOne({ name: 'Room 1' })
            
            expect(response.status).toBe(403)
            expect(response.body).not.toHaveProperty('vonageToken')
            expect(room.inSession).toBe(false)
        })
        test('Attempt to join occupied session which the user is at the front of the queue for', async function() {
            const eventId = await setup.seedDatabase()
            const token = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
            const event = await Event.findById(eventId)
            const companyId = event.companiesAttending[0].toString()
            await request.post('/user/enqueue/' + companyId).set('auth-token', token)
            const rooms = await Room.find({})
            for(const room of rooms) {
                room.inSession = true
                await room.save()
            }
            const response = await request.post('/user/accept/' + companyId).set('auth-token', token)
            const user = await User.findOne({ email: 'Peter@gmail.com' })
            
            expect(response.status).toBe(403)
            expect(response.body).not.toHaveProperty('vonageToken')
            expect(user.inSession).toBe(false)
        })
    })

    describe('Leaving session tests', function() {
        test('Attempt to leave a session the user is a part of', async function() {
            const eventId = await setup.seedDatabase()
            const token = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
            const event = await Event.findById(eventId)
            const companyId = event.companiesAttending[0].toString()
            await request.post('/user/enqueue/' + companyId).set('auth-token', token)
            await request.post('/user/accept/' + companyId).set('auth-token', token)
            const response = await request.post('/user/end/' + companyId).set('auth-token', token)

            const user = await User.findOne({ email: 'Peter@gmail.com' })
            const room = await Room.findOne({ name: 'Room 1' })
            const queue = await Queue.findOne({ companyId, eventId })
            
            expect(response.status).toBe(200)
            expect(user.inSession).toBe(false)
            expect(user.sessionPartner).toBe(null)
            expect(queue.blacklist[0].toString()).toBe(user._id.toString())
        })
        test('Attempt to leave a session which another user is part of', async function() {
            const eventId = await setup.seedDatabase()
            const token1 = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
            const token2 = (await request.post('/user/login/' + eventId).send({ email: 'Michael@gmail.com'})).headers['auth-token']
            const event = await Event.findById(eventId)
            const companyId = event.companiesAttending[0].toString()
            await request.post('/user/enqueue/' + companyId).set('auth-token', token1)
            await request.post('/user/accept/' + companyId).set('auth-token', token1)
            await request.post('/user/enqueue/' + companyId).set('auth-token', token2)
            let user2 = await User.findOne({ email: 'Michael@gmail.com' })
            const room = await Room.findOne({ name: 'Room 1' })
            user2.inSession = true
            user2.sessionPartner = room._id
            await user2.save()
            const response = await request.post('/user/end/' + companyId).set('auth-token', token2)

            user2 = await User.findOne({ email: 'Michael@gmail.com' })
            const queue = await Queue.findOne({ companyId, eventId })
            const user1 = await User.findOne({ email: 'Peter@gmail.com' })
            
            expect(response.status).toBe(403)
            expect(user2.inSession).toBe(true)
            expect(room.inSession).toBe(true)
            expect(room.sessionPartner.toString()).toBe(user1._id.toString())
            
            expect(queue.blacklist[0]).toBe(undefined)
        })
        test('Attempt to leave a session twice', async function() {
            const eventId = await setup.seedDatabase()
            const token = (await request.post('/user/login/' + eventId).send({ email: 'Peter@gmail.com'})).headers['auth-token']
            const event = await Event.findById(eventId)
            const companyId = event.companiesAttending[0].toString()
            await request.post('/user/enqueue/' + companyId).set('auth-token', token)
            await request.post('/user/accept/' + companyId).set('auth-token', token)
            await request.post('/user/end/' + companyId).set('auth-token', token)
            const response = await request.post('/user/end/' + companyId).set('auth-token', token)

            const user = await User.findOne({ email: 'Peter@gmail.com' })
            const room = await Room.findOne({ name: 'Room 1' })
            const queue = await Queue.findOne({ companyId, eventId })
            
            expect(response.status).toBe(403)
            expect(user.inSession).toBe(false)
            expect(user.sessionPartner).toBe(null)
            expect(queue.blacklist[0].toString()).toBe(user._id.toString())
        })
    })
})