const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

const User = mongoose.model('User')
const Company = mongoose.model('Company')
const Event = mongoose.model('Event')
const Room = mongoose.model('Room')

async function removeAllCollections () {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        await collection.deleteMany()
    }
}

async function dropAllCollections () {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName]
        try {
            await collection.drop()
        } catch (error) {
            // Sometimes this error happens, but you can safely ignore it
            if (error.message === 'ns not found') return
            // This error occurs when you use it.todo. You can
            // safely ignore this error too
            if (error.message.includes('a background operation is currently running')) return
            console.log(error.message)
        }
    }
}

async function seedDatabase() {
    const user1 = new User({
        email: 'Peter@gmail.com'
    })
    const user2 = new User({
        email: 'Michael@gmail.com'
    })
    const user3 = new User({
        email: 'Jiaru@gmail.com'
    })
    const event = new Event({
        name: "Test event",
    })
    const company1 = new Company({
        name: "Company 1",
        logoURL: "http://company1logo",
    })
    const company2 = new Company({
        name: "Company 2",
        logoURL: "http://company2logo",
    })
    const company3 = new Company({
        name: "Company 3",
        logoURL: "http://company3logo",
    })
    const room1 = new Room({
        eventId: event._id,
        companyId: company1._id,
        name: 'Room 1' 
    })
    const room2 = new Room({
        eventId: event._id,
        companyId: company1._id,
        name: 'Room 2' 
    })
    const room3 = new Room({
        eventId: event._id,
        companyId: company1._id,
        name: 'Room 3' 
    })

    try {
        await user1.save()
        await user2.save()
        await user3.save()
        await company1.save()
        await company2.save()
        await company3.save()
        await room1.save()
        await room2.save()
        await room3.save()
        
        event.companiesAttending = [company1._id, company2._id, company3._id]
        await event.save()

        return event._id
    }
    catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    init: function() {
        beforeAll(async function() {
            await dropAllCollections()
            // await mongoose.connect(process.env.LOCAL_DB_URI, { useNewUrlParser: true })
        })

        afterEach(async function() {
            await removeAllCollections()
        })
        afterAll(async function() {
            await dropAllCollections()
            await mongoose.connection.close()
        })
    },
    seedDatabase
}