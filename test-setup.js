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

async function testSeed() {
    console.log('...?')
    const userNames = ['Michaeled Shaimerden', 'Mercury Lin', 'Johniel', 'Annie', 'Ann Susan', 'Cecilia', 'Ric', 'Yoon Jung', 'Sherine', 'Jaay', 'Gene', 'Andrew', 'Pearly', 'Cristi', 'Richard Lee', 'Jordan', 'Mj', 'Jessie', 'Sultan', 'Naveen', 'Jerry', 'Henry', 'Nathanael Rais', 'Piyush', 'Spp', 'Vincent', 'David', 'Anahita', 'Thomas', 'Andrei', 'Dyego Oliveira', 'Cherie', 'Nidhi', 'Joe Gu', 'Taine', 'Ryan', 'Doris', 'Ryan', 'Di Kun', 'Sherman', 'Mridula', 'Dave Shin', 'Karl', 'Jafar', 'Joshua', 'George', 'Anton Rozhanskii', 'Fernando', 'Sunny', 'Sharon', 'Chetan', 'Bernie', 'Vimi', 'Matt', 'Melissa', 'Saedeepu', 'Raman', 'Songyan', 'Ehsaas', 'Nishat', 'Ethan', 'Jay', 'Kombe', 'Jin', 'Helen', 'Liam', 'Martin', 'James', 'Sahil', 'Dan', 'Clarissa', 'Cj', 'Satnam', 'Anna', 'Kabilan', 'Lawrence', 'Zaine', 'Negar', 'Sabrina Teoh', 'Patricia Virgen', 'Puru', 'Philip', 'Stepan Belousov', 'Zoe', 'Julie', 'Alex', 'Tasha', 'Amaryah', 'Callum', 'Mahuya', 'Justine', 'Shantal Jose', 'Rongomai', 'Suman', 'Praveen', 'Emily', 'Yvonne']

    const userEmails = ['michael@tadesign.co.nz', 'lin8231@outlook.com', 'accounts@johniel.nz', 'annie.e.freeman@gmail.com', 'annsusan1923@gmail.com', 'ceciliayin@yahoo.com', 'ricjohn.genoguin@gmail.com', 'byyoonj@gmail.com', 'sherine.balaha@gmail.com', 'sriramemailsyou@gmail.com', 'gene.d.culling@gmail.com', 'a.khomushin@gmail.com', 'choongpl@gmail.com', 'ilagancris@myvuw.ac.nz', 'richard_875@me.com', 'jordan.gelling@yahoo.co.nz', 'rhymermj@gmail.com', 'nzjessierongen@gmail.com', 'smob123@hotmail.com', 'thebanterage@gmail.com', 'jerryyangliufan@hotmail.com', 'henryb679@outlook.com', 'nathanael@nathansoftware.com', 'sharmapiyush4613@gmail.com', 'sooryaprakml@gmail.com', 'tranhieunz@gmail.com', 'davidcorner90@gmail.com', 'anahita.karpour@gmail.com', 'thomas@rainfords.net', 'tatarov.andrey@gmail.com', 'dyegomendonca@gmail.com', 'cheriedeng@gmail.com', 'nidhipatel01@hotmail.com', 'xiaozhougu@hotmail.com', 'tainejcollins@gmail.com', 'ryanbircham@gmail.com', 'hlee441@aucklanduni.ac.nz', 'rtan265@gmail.com', 'me@dikunong.nz', 'shermanchin33@gmail.com', 'mridulamanderwad@gmail.com', 'wndyddld12@gmail.com', 'karl.cc14@gmail.com', 'jmaa831@aucklanduni.ac.nz', 'joshuaglennmurphy@gmail.com', 'gbla987@aucklanduni.ac.nz', 'anton_rozhanskii@yahoo.com', 'jparrax17@gmail.com', 'sunnyfengnz@gmail.com', 'sharonmathews00@gmail.com', 'takyarchetan@gmail.com', 'berniemaecruz@gmail.com', 'vimu94@gmail.com', 'matthewnsinclair@gmail.com', 'melissalokvw+sot@gmail.com', 'saedeepu23@gmail.com', 'er.ramankumari@gmail.com', 'songyanstteng@hotmail.com', 'ehsaas.grover@hotmail.com', 'dr.nishats@yahoo.com', 'ewpbaker@gmail.com','sjaybpatel@gmail.com','kombe.kampanga@hotmail.com','hajoung222@gmail.com','kimyen.hoang97@gmail.com','liam.scott.russell@gmail.com','martintiangco@gmail.com','yddjames@gmail.com','sahilbhatiani28@gmail.com','goodssendev@gmail.com','clarissabudiharto@gmail.com', 'cuciocj@gmail.com','bsatnam98@gmail.com','anna.henson@outlook.co.nz','kabilan-k@hotmail.com','lawrence.shum11@gmail.com','manizaine@gmail.com','negarmohamadhasan@gmail.com','sabrina_teoh@hotmail.com','ckt1418@aut.ac.nz','purubest@gmail.com','philip.machado@gmail.com','stepan@belousov.nz','pluie2000@hotmail.com','wenlijun07@gmail.com','me@alexverkerk.com','tashaselby27@outlook.com','amaryahhalo.h@gmail.com','cal.macaskill@gmail.com','mahuya78@gmail.com','justine.limranola@gmail.com','eireenshan@gmail.com','rongomaiwahine21@gmail.com','mail@sumanmhr.com','praveenbandarageofficial@gmail.com','ezemilyzhang@gmail.com','yvonnexu032@gmail.com']

    const recruiterNames = ['Alan Doak', 'Alex Corkin', 'Bevan Dunning', 'Cara Hill', 'Daniel Donbavand', 'Gus Watson', 'Ico', 'James Freeman', 'Janelle Baptist', 'Melonie Cole', 'Nick', 'Prae Songprasit', 'Sarah Lock', 'Shaun Field', 'Simon Murcott', 'Tom Bojesen-Trepka', 'Walter Lim']

    const recruiterEmails = ['alan@sharesies.co.nz', 'alexcorkin@gmail.com', 'bevan.dunning@gmail.com', 'cara.hill@ackama.com', 'donbavand@gmail.com', 'gus@sharesies.co.nz', 'icos@amazon.com', 'j.daniel.freeman@gmail.com', 'janelle.baptist@gmail.com', 'melonie@mindshift.kiwi', 'nickcho@amazon.com', 'prae@lackofcolours.com', 'sarlock@amazon.com', 'shaun.field@nintex.com', 'simon.murcott@lyniate.com', 'tombt@amazon.com', 'waltissomewhere@gmail.com']

    const recruiterNames2 = ['Chris Crow', 'Nuri Gocay', 'James Freeman', 'Lena Plaksina', 'Lora Vardarova', 'Oliver Jacks', 'Prae Songprasit', 'Sarah Moyne', 'Sam Jarman', 'Simon Murcott', 'Walter Lim']

    const recruiterEmails2 = ['cpcrow@gmail.com', 'gocad@amazon.com', 'j.daniel.freeman@gmail.com', 'lena.plaksina@gmail.com', 'lora.vardarova@gmail.com', 'oliver.jacks@pushpay.com', 'prae@lackofcolours.com', 's.moyne@auckland.ac.nz', 'sam@samjarman.co.nz', 'simon.murcott@lyniate.com', 'waltissomewhere@gmail.com']

    const event = new Event({
        name: "CV Reviews",
        expirationTime: 'July 9, 2020 13:00:00'
    })
    const event2 = new Event({
        name: "CV Reviews",
        expirationTime: 'July 9, 2020 19:00:00'
    })
    console.log('1')
    for(let i = 0; i < userNames.length; i++) {
        const user = new User({
            name: userNames[i],
            email: userEmails[i]
        })
        await user.save()
        console.log('2')
    }
    
    const companies = []
    for(let i = 0; i < recruiterNames.length; i++) {
        const company = new Company({
            name: recruiterNames[i].split(' ')[0],
            logoURL: ' '
        })
        companies.push(company._id)
        const room = new Room({
            eventId: event._id,
            companyId: company._id,
            name: recruiterNames[i],
            email: recruiterEmails[i]
        })
        const queue = new Queue({
            eventId: event._id,
            companyId: company._id    
        })
        await queue.save()
        await company.save()
        await room.newSessionId()
        console.log('3')
    }
    event.companiesAttending = companies
    const companies2 = []
    console.log('4')
    for(let i = 0; i < recruiterNames2.length; i++) {
        const company = new Company({
            name: recruiterNames2[i].split(' ')[0],
            logoURL: ' '
        })
        companies2.push(company._id)
        const room = new Room({
            eventId: event2._id,
            companyId: company._id,
            name: recruiterNames2[i],
            email: recruiterEmails2[i]
        })
        const queue = new Queue({
            eventId: event2._id,
            companyId: company._id    
        })
        await queue.save()
        await company.save()
        await room.newSessionId()
        console.log('5')
    }
    event2.companiesAttending = companies2
    
    await event.save()
    await event2.save()
    console.log('6')
    return {
        event1: event._id,
        event2: event2._id
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
    seedDatabase: testSeed,
    dropAllCollections,
    removeAllCollections
}