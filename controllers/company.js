// contains controllers for all endpints which may be accessed by companies on the platform (i.e. those users who run the sessions,
// rather than those who queue for them)

module.exports = function(wsInstance) {
    const mongoose = require('mongoose')
    const Room = mongoose.model('Room')
    const User = mongoose.model('User')
    const Queue = mongoose.model('Queue')
    const validate = require('./validation')
    const OpenTok = require('opentok')
    const opentok = new OpenTok(process.env.VONAGE_API_KEY, process.env.VONAGE_SECRET)
    
    /**
     * Creates one room for the event represented by req.body.eventId and for the company represented by req.body.companyId.
     * The room has the name given by req.body.name
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    async function createRoom(req, res) {
        // validate the room properties
        if(!validate.isId({ _id: req.body.eventId}, res)
        || !validate.isId({ _id: req.body.companyId }, res)
        || !validate.isString({ string: req.body.name }, res)) {
            return
        }
        // create the room
        const room = new Room({
            eventId: req.body.eventId,
            companyId: req.body.companyId,
            name: req.body.name
        })
        try {
            // save the room
            await room.save()
            return res.status(200).json({ message: 'Successfully created room.'})
        }
        catch (error) {
            return res.status(500).json({ message: error })
        }
    }

    /**
     * Marks the room as available to join and searches through the room's queue to find and notify a user who is eligible to join.
     * Fails if there is still a student in the room, the next student has already been requested, or if the room or queue can't be found.
     * If it succeeds then the room's inSession property is set to false and a new set of vonage credentials are generated for the company
     * member IF they haven't already been regenerated previously when the company member kicked the student.
     * This function searches 
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    async function getNextStudent(req, res) {
        try {
            // retrieve the required objects from the database and error if they can't be found
            console.log(req.payload._id)
            const room = await Room.findById(req.payload._id)
            if(!room) {
                return res.status(404).json({ message: 'Could not request next student as room could not be found.' })
            }
            if(room.sessionPartner) {
                return res.status(403).json({ message: 'Could not request next student as there is still a student within the session.' })
            }
            if(!room.inSession) {
                return res.status(403).json({ message: 'Could not request next student as room is already in open state.' })
            }
            const queue = await Queue.findOne({ eventId: req.payload.eventId, companyId: req.payload.companyId })
            if(!queue) {
                return res.status(404).json({ message: 'Could not request next student as queue could not be found.' })
            }
            // open the room for new students
            room.inSession = false
            await room.save()
            return res.status(200).json({
                message: 'Searching for student to join the session...'
            })
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ message: error })
        }
    }

    /**
     * Kicks the student from the given session and changes the session id so that the student is not able to reconnect, even if they have manually
     * saved their token.
     * Fails if the room or queue cannot be foun, or if the student is not in the session.
     * Success adds the student to the blacklist of the queue if they are not already in it, sets the sessionPartner and inSession properties of
     * the user to null and false respectively, sets the sessionPartner of the room to null, marks the room as having kicked a user, and
     * regenerates the vonage credentials for the company member who runs the specified session the student has just been kicked from.
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    async function kickStudent(req, res) {
        try {
            // retrieve the required objects from the database and error if they can't be found
            const room = await Room.findById(req.payload._id)
            if(!room) {
                return res.status(404).json({ message: 'Could not kick student as room could not be found.' })
            }
            // remove the user as the session partner
            const user = await User.findById(room.sessionPartner)

            room.sessionPartner = null
            room.save()
            const queue = await Queue.findOne({ eventId: req.payload.eventId, companyId: req.payload.companyId })
            if(!queue) {
                return res.status(404).json({ message: 'Could not kick student as queue could not be found.' })
            }
            // add the user to the blacklist if they aren't already in it
            if(!queue.blacklist.includes(room.sessionPartner)) {
                queue.blacklist.push(room.sessionPartner)
                await queue.save()
            }
            // if the user has not left the room themselves, then remove them from the room properly
            if(user && user.sessionPartner == room.sessionPartner) {
                user.sessionPartner = null
                user.inSession = false
                await user.save()
            }
            // empty room and generate a new session id so that the student cannot rejoin the call
            const sessionId = await room.newSessionId()
            const token = opentok.generateToken(room.sessionId, {
                expireTime: (new Date().getTime()/ 1000) + 300 * 60,
                role: 'moderator'
            })
            return res.status(200).json({
                message: 'Successfully kicked student',
                credentials: {
                    apiKey: process.env.VONAGE_API_KEY,
                    sessionId,
                    token
                }
            })
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ message: error })
        }
    }
    
    // const allSearchings = {}
    // async function findAndNotifyEligibleUsers(queue) {
    //     console.log('hit searching function')
    //     // make sure that there is not currently another function executing the notification code
    //     if(allSearchings[queue._id]) {
    //         return false
    //     }
    //     if(!allSearchings[queue._id]) {
    //         allSearchings[queue._id] = true
    //     }
    //     console.log('searching engaged')
    //     let currentNotifications
    //     let rooms
    //     let availableRooms
    //     let allRoomsFilled = false
        
    //     while(!allRoomsFilled && queue.members.length > 0) {
    //         console.log('Looping with length: ' + queue.members.length)
    //         const currentlyNotifiedUsers = []
    //         currentNotifications = []
    //         rooms = await Room.find({ eventId: queue.eventId, companyId: queue.companyId })
    //         availableRooms = rooms.reduce((total, value) => total + !value.inSession, 0)
    //         console.log(`Available rooms: ${availableRooms}`)

    //         let invalidUsersCount = 0

    //         for(let i = 0; i < queue.members.length; i++) {
    //             const user = await User.findById(queue.members[i])
    //             // make sure that there are available rooms and that too many notifications are not sent
    //             if(availableRooms == 0 || currentlyNotifiedUsers.length >= availableRooms) {
    //                 console.log(`Failed 1: ${availableRooms}, ${currentlyNotifiedUsers.length}, ${availableRooms}`)
    //                 break
    //             }
    //             // make sure that the user hasn't been notified and is eligible to join a session
    //             if(user.inSession || currentlyNotifiedUsers.includes(user._id)) {
    //                 console.log(`Failed 2: ${user.inSession}, ${currentlyNotifiedUsers}, ${user._id}`)
    //                 invalidUsersCount ++
    //                 continue
    //             }
    //             // make sure the user's websocket connection exists
    //             let client
    //             for(const c of wsInstance.getWss().clients) {
    //                 if(c.jwt._id == user._id) {
    //                     client = c
    //                     break
    //                 }
    //             }
    //             if(!client) {
    //                 console.log('Failed 3')
    //                 invalidUsersCount ++
    //                 continue
    //             }
    //             // mark the user as notified and send the notification
    //             currentlyNotifiedUsers.push(user._id)
    //             client.send(JSON.stringify({
    //                 messageType: 'ready',
    //                 companyId: queue.companyId
    //             }))
    //             currentNotifications.push(getUserResponse(queue, user._id))
    //             console.log('Sent notification')
    //         }
    //         if(invalidUsersCount == queue.members.length) {
    //             await timeout(5000)
    //         }

    //         allRoomsFilled = (await Promise.all(currentNotifications)).reduce((total, value) => total + value, 0) == availableRooms
    //         console.log('pre-a', allRoomsFilled)
    //         console.log('a', await Promise.all(currentNotifications))
    //         console.log('b', (await Promise.all(currentNotifications)).reduce((total, value) => total + value, 0))
    //         queue = await Queue.findById(queue._id)
    //         console.log('c', availableRooms)

    //         console.log('d', queue.members.length)
    //     }

    //     allSearchings[queue._id] = false
    // }

    // async function getUserResponse(queue, userId) {
    //     return new Promise(async resolve => {
    //         await timeout(10000)
    //         const user = await User.findById(userId)

    //         console.log('----------')
    //         console.log(user.inSession, user.sessionPartner, queue._id)
    //         console.log('----------')

    //         const room = await Room.findOne({
    //             eventId: queue.eventId,
    //             companyId: queue.companyId,
    //             sessionPartner: user._id
    //         }).lean()

    //         if(user.inSession && room) {
    //             // if they did join the session then...
    //             return resolve(true)
    //         }
    //         return resolve(false)
    //     })
    // }

    // /**
    //  * Sends a ready notification to the first eligible member of the queue to notify them that they may join a room associated with that queue.
    //  * If the user does not accept the invitation then the next user is notified.
    //  * If no user is found who accepts the invitation throughout the entire queue then false is returned, if a user accepts then true is returned
    //  * @param {Document} queue The mongoose queue document to use
    //  */
    // async function findAndNotifyEligibleUser(queue) {
    //     // loop through all of the members of the queue to find someone to join the session
    //     for(let i = 0; i < queue.members.length; i++) {
    //         const user = await User.findById(queue.members[i])
    //         // if the user is busy then skip over them
    //         if(user.inSession) {
    //             console.log('1')
    //             continue
    //         }
    //         // if the user has already been notified previously then skip over them
    //         // this might happen if two rooms are looking for new students at the same time
    //         let client
    //         for(const c of wsInstance.getWss().clients) {
    //             if(c.jwt._id == user._id) {
    //                 client = c
    //                 break
    //             }
    //         }
    //         if(!client) {
    //             console.log('2')
    //             continue
    //         }
    //         if(client.hasBeenNotified && client.hasBeenNotified[queue.companyId]) {
    //             console.log('3')   
    //             continue
    //         }
    //         // make sure the client is marked as having been notified
    //         if(!client.hasBeenNotified) {
    //             client.hasBeenNotified = {}
    //         }
    //         client.hasBeenNotified[queue.companyId] = true
    //         // at this point we know that the client is eligible to join the session, so notify them that they must make a request within 10 seconds
    //         client.send(JSON.stringify({
    //             messageType: 'ready',
    //             companyId: queue.companyId
    //         }))
    //         await timeout(10000)

    //         try {
    //             // check to see if the user joined the session that they were told that they were eligible for
    //             const updatedUser = await User.findById(queue.members[i])
    //             if(updatedUser.inSession && updatedUser.sessionPartner.toString == queue._id.toString()) {
    //                 // if they did join the session then...
    //                 return true
    //             }
    //             // remove from queue and add to blacklist
    //             const updatedIndex = queue.members.indexOf(updatedUser._id)
    //             if(updatedIndex != -1) {
    //                 queue.members.splice(updatedIndex, 1)
    //             }
    //             await queue.save()
                
    //             // if(!user.previousSessions[client.jwt.eventId]) {
    //             //     user.previousSessions[client.jwt.eventId] = {}
    //             // }
    //             // user.previousSessions[client.jwt.eventId][queue.companyId] = true
    //             await user.save()
    //         }
    //         catch (error) {
    //             console.log(error)
    //             continue
    //         }
    //     }
    //     return false
    // }
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async function getStudentTalkJSDetails(req, res) {
        const room = await Room.findById(req.payload._id)
        if(!room) {
            return res.status(404).json({ message: 'Room could not be found.' })
        }
        const user = await User.findById(room.sessionPartner)
        if(!user) {
            return res.status(404).json({ message: 'User could not be found.' })
        }
        return res.status(200).json({
            talkJSData: {
                name: user.name,
                id: user._id,
                appId: process.env.TALKJS_APP_ID
            }
        })
    }

    return {
        createRoom,
        kickStudent,
        getNextStudent,
        // findAndNotifyEligibleUsers,
        getStudentTalkJSDetails
    }
}