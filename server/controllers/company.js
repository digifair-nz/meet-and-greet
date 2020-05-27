// contains controllers for all endpints which may be accessed by companies on the platform (i.e. those users who run the sessions,
// rather than those who queue for them)

module.exports = function(wsInstance) {
    const mongoose = require('mongoose')
    const Room = mongoose.model('Room')
    const User = mongoose.model('User')
    const Queue = mongoose.model('Queue')
    const validate = require('./validation')
    
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

    
    async function forceEndSession(req, res) {
        const room = await Room.findById()
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
        if(!validate.isId(req.params, res)) {
            return
        }
        try {
            // retrieve the required objects from the database and error if they can't be found
            const room = await Room.findById(req.params._id)
            if(!room) {
                return res.status(404).json({ message: 'Could not kick student as room could not be found.' })
            }
            const user = await User.findById(room.sessionPartner)
            if(!room.sessionPartner || !user) {
                return res.status(403).json({ message: 'Could not kick student as there is no student in the session.' })
            }
            const queue = await Queue.findOne({ eventId: req.payload.eventId, companyId: req.payload.companyId })
            if(!queue) {
                return res.status(404).json({ message: 'Could not kick student as queue could not be found.' })
            }
            // add the user to the blacklist if they aren't already in it
            if(!queue.blacklist.contains(room.sessionPartner)) {
                queue.blacklist.push(room.sessionPartner)
                await queue.save()
            }
            // if the user has not left the room themselves, then remove them from the room properly
            if(user.sessionPartner == room.sessionPartner) {
                user.sessionPartner = null
                user.inSession = false
                await user.save()
            }
            // empty room and generate a new session id so that the student cannot rejoin the call
            room.sessionPartner = null
            room.kickedStudent = true
            const sessionId = await room.newSessionId()
            const token = opentok.generateToken(room.sessionId, {
                expireTime: (new Date().getTime()/ 1000) + 5 * 60,
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
    
    /**
     * Sends a ready notification to the first eligible member of the queue to notify them that they may join a room associated with that queue.
     * If the user does not accept the invitation then the next user is notified.
     * If no user is found who accepts the invitation throughout the entire queue then false is returned, if a user accepts then true is returned
     * @param {Document} queue The mongoose queue document to use
     */
    async function findAndNotifyEligibleUser(queue) {
        // loop through all of the members of the queue to find someone to join the session
        for(let i = 0; i < queue.members.length; i++) {
            const user = await User.findById(queue.members[i])
            // if the user is busy then skip over them
            if(user.inSession) {
                continue
            }
            // if the user has already been notified previously then skip over them
            // this might happen if two rooms are looking for new students at the same time
            const client = wsInstance.getWss().clients.find(client => client.payload._id == user._id)
            if(client.hasBeenNotified[queue.companyId]) {
                continue
            }
            // make sure the client is marked as having been notified
            client.hasBeenNotified[queue.companyId] = true

            // at this point we know that the client is eligible to join the session, so notify them that they must make a request within 10 seconds
            client.send(JSON.stringify({
                messageType: 'ready',
                companyId: queue.companyId
            }))
            await timeout(10000)

            try {
                // check to see if the user joined the session that they were told that they were eligible for
                const updatedUser = await User.findById(queue.members[i])
                if(updatedUser.inSession && updatedUser.sessionPartner.toString == queue._id.toString()) {
                    // if they did join the session then...
                    return true
                }
                // remove from queue and add to blacklist
                queue.blacklist.push(...queue.members.splice(i, 1))          
                await queue.save()
                user.previousSessions[client.payload.eventID][queue.companyId] = true
                await user.save()
            }
            catch (error) {
                console.log(error)
                continue
            }
        }
        return false
    }
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    return {
        createRoom,
        kickStudent,
    }
}