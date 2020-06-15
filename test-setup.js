const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)

const User = mongoose.model('User')
const Company = mongoose.model('Company')
const Event = mongoose.model('Event')
const Room = mongoose.model('Room')
const Queue = mongoose.model('Queue')

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

async function seedDatabase(opentok = false) {
    const user1 = new User({
        email: 'Peter@gmail.com',
        name: 'Peter'
    })
    const user2 = new User({
        email: 'Michael@gmail.com',
        name: 'Michael'
    })
    const user3 = new User({
        email: 'Jiaru@gmail.com',
        name: 'Jiaru'
    })
    const user4 = new User({
        email: 'Roger@gmail.com',
        name: 'Roger'
    })
    const user4 = new User({
        email: 'Roger@gmail.com',
        name: 'Roger'
    })
    const user5 = new User({
        email: 'Rogan@gmail.com',
        name: 'Rogan'
    })
    const event = new Event({
        name: "Test event",
        expirationDate: 'December 17, 1995 03:24:00'
    })
    const company1 = new Company({
        name: "Google",
        logoURL: "https://firebasestorage.googleapis.com/v0/b/digifairnz.appspot.com/o/googleLogo.png?alt=media&token=0bb51a33-acd0-4294-992b-c1a5dd40630e",
    })
    const company2 = new Company({
        name: "Xero",
        logoURL: "https://firebasestorage.googleapis.com/v0/b/digifairnz.appspot.com/o/xeroLogo.png?alt=media&token=91557793-95e2-47a2-b75b-c52f6152daa1",
    })
    const company3 = new Company({
        name: "Imagr",
        logoURL: "https://firebasestorage.googleapis.com/v0/b/digifairnz.appspot.com/o/imagrLogo.png?alt=media&token=f502a483-cc74-4249-964a-d140086e804c",
    })
    const company4 = new Company({
        name: "Soul Machines",
        logoURL: "https://firebasestorage.googleapis.com/v0/b/digifairnz.appspot.com/o/soulMachinesLogo.png?alt=media&token=60992d33-6ba3-4b9b-8d63-701e9f76688e",
    })
    const company5 = new Company({
        name: "Soul Machines 2",
        logoURL: "https://firebasestorage.googleapis.com/v0/b/digifairnz.appspot.com/o/soulMachinesLogo.png?alt=media&token=60992d33-6ba3-4b9b-8d63-701e9f76688e",
    })
    const room1 = new Room({
        eventId: event._id,
        companyId: company1._id,
        name: 'Room 1',
        email: '1@gmail.com'
    })
    const room2 = new Room({
        eventId: event._id,
        companyId: company1._id,
        name: 'Room 2',
        email: '2@gmail.com',
    })
    const room3 = new Room({
        eventId: event._id,
        companyId: company1._id,
        name: 'Room 3',
        email: '3@gmail.com',
    })
    const room4 = new Room({
        eventId: event._id,
        companyId: company2._id,
        name: 'Room 4',
        email: '4@gmail.com',
    })
    const room5 = new Room({
        eventId: event._id,
        companyId: company2._id,
        name: 'Room 5',
        email: '5@gmail.com',
    })
    const queue1 = new Queue({
        eventId: event._id,
        companyId: company1._id
    })
    const queue2 = new Queue({
        eventId: event._id,
        companyId: company2._id
    })
    const queue3 = new Queue({
        eventId: event._id,
        companyId: company3._id
    })
    const queue4 = new Queue({
        eventId: event._id,
        companyId: company4._id
    })
    const queue5 = new Queue({
        eventId: event._id,
        companyId: company5._id
    })

    try {
        await user1.save()
        await user2.save()
        await user3.save()
        await user4.save()
        await user5.save()
        await company1.save()
        await company2.save()
        await company3.save()
        await company4.save()
        await company5.save()
        if(opentok) {
            await room1.newSessionId()
            await room2.newSessionId()
            await room3.newSessionId()
            await room4.newSessionId()
            await room5.newSessionId()
        }
        else {
            await room1.save()
            await room2.save()
            await room3.save()
            await room4.save()
            await room5.save()
        }
        await queue1.save()
        await queue2.save()
        await queue3.save()
        await queue4.save()
        await queue5.save()
        
        event.companiesAttending = [company1._id, company2._id, company3._id, company4._id, company5._id]
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
    seedDatabase,
    dropAllCollections,
    removeAllCollections
}