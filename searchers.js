module.exports = function(wsInstance) {
    const userCtrl = require('./controllers/user')(wsInstance)

    const mongoose = require('mongoose')
    const Queue = mongoose.model('Queue')
    const User = mongoose.model('User')
    const Room = mongoose.model('Room')
    const Company = mongoose.model('Company')

    let currentSearchers = []
    const activeNotificationsGlobal = []
    
    const searcherProto = {
        init: async function init(queueId) {
            this.queueId = queueId
            this.activeNotifications = []

            const queue = await Queue.findById(queueId)
            this.companyId = queue.companyId
            this.eventId = queue.eventId

            this.search()
        },
        search: async function search() {
            try {
                // console.log(JSON.stringify(wsInstance.getWss().clients))
                let count = 0
                for(const client of wsInstance.getWss().clients) {
                    count++
                }
                console.log('Clients: ' + count)
                // console.log('running...')
                await timeout(process.env.SEARCH_FREQUENCY)
                // if the flag for searcher teardown has been set, stop searching
                if(this.stopSearching) {
                    console.log('stopping here')
                    return
                }

                const isGoogle = (await Company.findById(this.companyId)) == 'Google'
                const rooms = await Room.find({ eventId: this.eventId, companyId: this.companyId })
                // console.log(`Pre rooms: event id: ${this.eventId}, company id: ${this.companyId}`)
                // console.log(`Rooms: ${rooms}`)
                console.log(`Rooms 2: ${rooms.map(room => room.inSession)}`)
                const availableRooms = rooms.reduce((total, value) => total + !value.inSession, 0)
                // console.log('running 2')
                if(availableRooms == 0 || availableRooms <= this.activeNotifications) {
                    if(isGoogle) {
                        console.log(`No rooms or enough active notifications. Available rooms: ${availableRooms}, activeNotifications: ${this.activeNotifications}. Rooms: ${rooms.map(room => room.inSession)}. Company: ${this.companyId}. Global notifications: ${activeNotificationsGlobal}`)
                    }
                    return this.search()
                }
                console.log('running three')

                if(isGoogle) {
                    console.log('made it here for google')
                }

                const queue = await Queue.findById(this.queueId)
                if(isGoogle) {
                    console.log(queue)
                }
                if(queue.members.length == 0) {
                    console.log(`No one in queue to search for.`)
                    console.log(queue)
                    return this.search()
                }
                console.log('made it past')
                for(let i = 0; i < queue.members.length; i++) {
                    const user = await User.findById(queue.members[i])

                    if(this.activeNotifications.length >= availableRooms) {
                        console.log(`Enough active notifications have been sent.`)
                        return this.search()
                    }
                    // make sure that the user hasn't been notified and is eligible to join a session
                    console.log('should stop here: ', this.activeNotifications, user._id, this.activeNotifications.includes(user._id), this.activeNotifications[0] == user._id.toString())
                    if(user.inSession || this.activeNotifications.includes(user._id.toString())) {
                        console.log(`User not eligible for ${user.name}: ${user.inSession}, ${this.activeNotifications}, ${user._id}`)
                        continue
                    }
                    if(activeNotificationsGlobal.includes(user._id.toString())) {
                        console.log(`User has already received a notification for another queue.`)
                        continue
                    }
                    // make sure the user's websocket connection exists
                    let client
                    for(const c of wsInstance.getWss().clients) {
                        if(c.jwt._id == user._id.toString()) {
                            client = c
                            break
                        }
                    }
                    if(!client) {
                        console.log(`Client not found for ${user.name}.`)

                        if(queue.members.includes(user._id)) {
                            queue.members.splice(queue.members.indexOf(user._id), 1)
                            console.log('removed from queue 1')
                        }
                        await queue.save()
                        continue
                    }
                    // mark the user as notified and send the notification
                    this.activeNotifications.push(user._id.toString())
                    activeNotificationsGlobal.push(user._id.toString())
                    setTimeout(async () => {
                        this.activeNotifications.splice(this.activeNotifications.indexOf(user._id), 1)
                        const updatedQueue = await Queue.findOne(this.queueId)
                        if(updatedQueue.members.includes(user._id)) {
                            console.log('removed from queue 2')
                            updatedQueue.members.splice(updatedQueue.members.indexOf(user._id), 1)
                            await updatedQueue.save()
                        }
                        userCtrl.broadcastQueueUpdate(updatedQueue)
                        activeNotificationsGlobal.splice(activeNotificationsGlobal.indexOf(user._id))
                    }, 10000)
                    console.log(user._id, this.activeNotifications, this.activeNotifications.includes(user._id), availableRooms)
                    console.log('Sent notification for user ' + user.name)
                    client.send(JSON.stringify({
                        messageType: 'ready',
                        companyId: queue.companyId
                    }))
                    
                    console.log(`Found user (${user.name}) and sent notification for company ${queue.companyId}.`)
                }
                this.search()
            }
            catch(error) {
                console.log(error)
            }
        },
        stop() {
            this.stopSearching = true
        }
    }
    function createQueueSearcher(queueId) {
        const searcher = Object.create(searcherProto)
        searcher.init(queueId)
        return searcher
    }

    async function setupAll() {
        currentSearchers.forEach(searcher => searcher.stop())
        
        const queues = await Queue.find({})
        for(const queue of queues) {
            const searcher = createQueueSearcher(queue._id)
            currentSearchers.push(searcher)
        }
    }

    timeout = x => new Promise(resolve => setTimeout(resolve, x))

    return {
        createQueueSearcher,
        setupAll
    }
}
