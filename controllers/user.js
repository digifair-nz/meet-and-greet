// controllers for all endpoints which may be accessed by standard users of the application (i.e. users who are not companies nor clubs)
module.exports = function(wsInstance) {
    const validate = require('./validation')
    const company = require('./company')(wsInstance)
    const OpenTok = require('opentok')
    const opentok = new OpenTok(process.env.VONAGE_API_KEY, process.env.VONAGE_SECRET)
    
    const mongoose = require('mongoose')
    // require database schemas used
    const Company = mongoose.model('Company')
    const Event = mongoose.model('Event')
    const Room = mongoose.model('Room')
    const User = mongoose.model('User')
    const Queue = mongoose.model('Queue')
    
    /**
     * Gets the companies associated with the event represented by the eventId in the payload.
     * Fails if the event does not exist or the companies attending the event do not exist.
     * Sucess sends the list of the companies attending to the user client for display.
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    async function getCompaniesForEvent(req, res) {
        try {
            // get the event from the database
            const event = await Event.findById(req.payload.eventId)
            if(!event) {
                return res.status(404).json({ message: 'Event does not exist' })
            }
            // get the companies from the database
            const companies = await Company.find({
                '_id': {
                    $in: event.companiesAttending
                }
            }).select('name description logoURL _id').lean()
            if(!companies) {
                return res.status(404).json({ message: 'Companies attending the event could not be found' })
            }
            // add the position of the user in the queue to the companies array
            for(const company of companies) {
                const queue = await Queue.findOne({ eventId: req.payload.eventId, companyId: company._id })
                const queuePosition = queue.members.indexOf(req.payload._id)
                company.queuePosition = queuePosition + 1
                company.isQueued = queuePosition != -1
                company.hadSession = queue.blacklist.includes(req.payload._id)
            }
            // respond with the companies if failure did not occur
            return res.status(200).json(companies)
        }
        catch (error) {
            res.status(500).json({ message: error })
        }
    }
    
    /**
     * Attempt to enqueue the user represented by the payload id of the request to the queue represented by the id in req.params._id.
     * Fails if the user is already in the queue, or if the user has previously had a session with the company.
     * Success pushes user to the members field of the queue.
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    async function enqueue(req, res) {
        // validate the param id
        if(!validate.isId(req.params, res)) {
            return
        }
        try {
            const result = await enqueueSingle(req.payload.eventId, req.params._id, req.payload._id)
            
            console.log('y ', result)
            if(result.error) {
                return res.status(result.status).json({ message: result.message })
            }
            console.log(result.index)
            return res.status(200).json({ message: 'Successfully enqueued to ' + req.params._id, queuePosition: result.index })
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ message: error })
        }
    }

    async function enqueueAll(req, res) {
        const queues = await Queue.find({ eventId: req.payload.eventId })
        if(!queues) {
            return res.status(404).json({ message: 'Failed to enqueue to all as companies were not found.' })
        }
        console.log('got here')
        const indices = []
        for(const queue of queues) {
            console.log('here too')
            const result = await enqueueSingle(req.payload.eventId, queue.companyId, req.payload._id)
            if(result.error && result.critical) {
                return res.status(result.status).json({ message: result.message })
            }
            if(!result.error) {
                console.log('added')
                indices.push({ queueId: queue.companyId, queuePosition: result.index })
            }
        }
        if(indices.length == 0) {
            return res.status(403).json({ message: 'There are no companies available to which you may queue.' })
        }
        console.log(indices)
        return res.status(200).json({ message: 'Successfully enqueued to all', positions: indices })
    }

    /**
     * Enqueue a user to a company for a specific event. This function is used by the enqueueSingle and enqueueAll functions
     * @param {ObjectId} eventId The id of the event for which the user is enqueuing
     * @param {ObjectId} companyId The id of the company to which the user is enqueuing
     * @param {ObjectId} userId The id of the user to enqueue
     */
    async function enqueueSingle(eventId, companyId, userId) {
        try {
            let queue = await Queue.findOne({ eventId, companyId })
            if(!queue) {
                queue = await createQueue(eventId, companyId)
            }
            
            // fail if the user is already queued
            if(queue.members.includes(userId)) {
                console.log('failed 1', queue._id)
                return {
                    error: true,
                    status: 403,
                    message: 'Failed to enqueue as user is already in queue.',
                    critical: false
                }
            }
            
            // fail if the user is attempting to queue more than once (not allowed)
            console.log(queue.blacklist)
            if(queue.blacklist.includes(userId)) {
                console.log('failed 2', queue._id)
                return {
                    error: true,
                    status: 403,
                    message: 'Failed to enqueue as user has previously had session with room.',
                    critical: false
                }
            }
            // add the user to the queue
            queue.members.push(userId)
            await queue.save()

            return {
                error: false,
                index: queue.members.length
            }
        }
        catch (error) {
            return {
                error: true,
                critical: true,
                message: error
            }
        }
    }
    
    async function dequeueAll(req, res) {
        const queues = await Queue.find({ eventId: req.payload.eventId })
        if(!queues) {
            return res.status(404).json({ message: 'Failed to dequeue from all as companies were not found.' })
        }
        for(const queue of queues) {
            console.log('here too')
            const result = await dequeueSingle(req.payload.eventId, queue.companyId, req.payload._id)
            if(result.error && result.critical) {
                console.log(result.message)
                return res.status(result.status).json({ message: result.message })
            }
        }
        return res.status(200).json({ message: 'Successfully dequeued from all' })   
    }

    /**
     * Attempt to dequeue the user represented by the payload id of the request to the queue represented by the id in req.params._id.
     * Fails if the queue cannot be found or the user is not queued.
     * Success removes the user from the members field of the queue and causes the queue position socket to broadcast an event to all
     * users queued to the respective company.
     * Note that the dequeue function is a higher order function. This allows it to be passed the broadcastQueueUpdate function to interact
     * with the socket.
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    async function dequeue(req, res) {
        // validate the room id
        if(!validate.isId(req.params, res)) {
            return
        }
        try {
            const result = await dequeueSingle(req.payload.eventId, req.params._id, req.payload._id)
            
            console.log('y ', result)
            if(result.error) {
                console.log(result.message)
                return res.status(result.status).json({ message: result.message })
            }
            console.log(result.index)
            return res.status(200).json({ message: result.message })
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ message: error })
        }
    }

    async function dequeueSingle(eventId, companyId, userId) {
        try {
            // find the room in the database
            const queue = await Queue.findOne({ eventId, companyId })
            if(!queue) {
                return {
                    error: true,
                    status: 404,
                    message: 'Queue not found in dequeue attempt.',
                    critical: false
                }
            }
            // fail if the user is not in the queue
            const index = queue.members.indexOf(userId)
            if(index == -1) {
                return {
                    error: true,
                    status: 403,
                    message: 'Could not dequeue as user was not queued.',
                    critical: false
                }
            }
            // remove the user from the queue
            queue.members.splice(index, 1)
            await queue.save()

            // notify other queue members that their position in the queue may have changed
            broadcastQueueUpdate(queue)
            return {
                error: false,
                message: 'Successfully dequeued from ' + queue.companyId
            }
        }
        catch (error) {
            return {
                error: true,
                critical: true,
                message: error
            }
        }
    }
    
    /**
     * Attempt to join the session as the user represented by the payload id for the room represented by req.params._id.
     * Fails if the session to join cannot be found, the session is occupied, the user cannot be found, the user is not in the
     * queue for the session, the user is not at the front of the queue for the session, or the user themselves is in a session.
     * Success sets the inSession fields on both the user and the room to true, the sessionPartners of the user and the room are set to each
     * other, and a response is sent to the user client containing the token and sessionId needed to join the session
     * and the sessionId they require to join the session
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    async function joinSession(req, res) {
        // validate the room id
        if(!validate.isId(req.params, res)) {
            return
        }
        try {
            // find the rooms, queue and user from the database
            const rooms = await Room.find({ eventId: req.payload.eventId, companyId: req.params._id })
            if(!rooms) {
                return res.status(404).json({ message: 'Could not find the session to join' })
            }
            const queue = await Queue.findOne({ eventId: req.payload.eventId, companyId: req.params._id })
            if(!queue) {
                return res.status(404).json({ message: 'Could not find the queue for the session.' })
            }
            const user = await User.findById(req.payload._id)
            if(!user) {
                return res.status(404).json({ message: 'User could not be found' })
            }
            // fail if the user is not available
            if(user.inSession) {
                console.log(`User is in a session already: ${user.inSession}, ${user.name}`)
                return res.status(403).json({ message: 'Failed to join session as user is already in a session' })
            }
            
            const index = queue.members.indexOf(req.payload._id)
            // fail if the user is not in the queue
            if(index == -1) {
                console.log(`User is not queued: ${user.name}, ${queue._id}`)
                return res.status(403).json({ message: 'Failed to join session as user is not queued.' })
            }
            // if the user is not at the front of the queue, check if the users ahead of them in the queue are occupied
            // if they are, then we can proceed as if they were at the front of the queue
            if(!await userIsEligibleToJoinSession(queue, index)) {
                console.log(`User not eligible: ${user.name}`)
                return res.status(403).json({ message: 'Failed to join session as user is not at the front of the queue' })
            }
            // at this point we know that the user is in first position to join any available room, so we check for an available room
            for(const room of rooms) {
                // upon finding an available room, join it
                if(!room.inSession) {
                    room.inSession = true
                    room.sessionPartner = user._id
                    await room.save()
                    // remove the user from the queue and add to the blacklist  
                    queue.blacklist.push(queue.members.splice(index, 1))
                    await queue.save()
                    user.inSession = true
                    user.sessionPartner = room._id
                    await user.save()
                    
                    // notify other members in the queue of the shift in queue position 
                    broadcastQueueUpdate(queue)
    
                    let token = null
                    if(room.sessionId) {
                        token = opentok.generateToken(room.sessionId, {
                            expireTime: (new Date().getTime()/ 1000) + 300 * 60
                        })
                    }
                    console.log('Sending user credentials: ' + room.sessionId)
                    return res.status(200).json({
                        message: `Success joining room as ${user.email}.`,
                        credentials: {
                            apiKey: process.env.VONAGE_API_KEY,
                            sessionId: room.sessionId || null,
                            token: token
                        },
                        talkJSData: {
                            name: room.name,
                            id: room._id,
                            appId: process.env.TALKJS_APP_ID
                        }
                    })
                }
            }
            // if we are here then we know that there is no available room
            console.log(`Session not available: ${user.name}`)
            return res.status(403).json({ message: 'Failed to join session as the session is currently not available.' })
        }
        catch (error) {
            console.log(`Accept error:`, error)
            return res.status(500).json({ message: error })
        }
    }

    async function userIsEligibleToJoinSession(queue, index) {
        if(index != 0) {
            // get the users earlier in the queue
            const userIdsEarlierInQueue = queue.members.slice(0, index)
            const usersEarlierInQueue = await User.find({
                '_id': {
                    $in: userIdsEarlierInQueue
                }
            })
            if(!usersEarlierInQueue) {
                throw new Error('Unexpected error joining session')
            }
            // fail if the user is not the first non-occupied user in the queue
            const isFirstNonOccupied = usersEarlierInQueue.reduce((total, value) => total && value.inSession, true)
            if(!isFirstNonOccupied) {
                return false
            }
        }
        return true
    }
    
    /**
     * Attempt to leave the session as the user represented by the payload id for the room represented by req.params._id.
     * Fails if the user cannot be found, the session to leave cannot be found, the user or the room are not in active sessions with each other,
     * or the blacklist cannot be found.
     * Sucess sets the inSession status of the user and the sessionPartner of the user to false and adds the user to the blacklist for the room
     * (if they are not already in the blacklist).
     * @param {Object} req The request object
     * @param {Object} res The response object
     */
    async function leaveSession(req, res) {
        try {
            // get the user from the database
            const user = await User.findById(req.payload._id)
            if(!user) {
                return res.status(404).json({ message: 'User could not be found' })
            }
            // make sure the user is in a session
            if(!user.inSession || !user.sessionPartner) {
                return res.status(403).json({ message: 'Leave session failed as user is not in an active session' })
            }
            // make sure the room is in a session with the user
            const room = await Room.findById(user.sessionPartner)
            if(!room) {
                return res.status(404).json({ message: 'Could not find the session to leave' })
            }
            if(!room.inSession || room.sessionPartner.toString() != user._id.toString()) {
                return res.status(403).json({ message: 'Leave session failed as user is not in session with the given room.' })
            }
            // get the queue from the database to add the user to the blacklist
            const queue = await Queue.findOne({ eventId: room.eventId, companyId: room.companyId })
            if(!queue) {
                return res.status(404).json({ message: 'Leave session failed as the blacklist could not be found.' })
            }
    
            // at this point we know that the user and the room are in session with one another and we can remove the user from the session
    
            user.inSession = false
            user.sessionPartner = null
            await user.save()
            // add the user to the blacklist if they are not already in it
            if(!queue.blacklist.includes(req.payload._id)) {
                queue.blacklist.push(req.payload._id)
                await queue.save()
            }
    
            return res.status(200).json({ message: 'Successfully left the session' })
        }
        catch (error) {
            return res.status(500).json({ message: error })
        }
    
    }
    
    async function createQueue(eventId, companyId) {
        const queue = new Queue({
            eventId, companyId, blacklist: [], members: []
        })
        try {
            await queue.save()
            return queue
        }
        catch (error) {
            console.log(error)
            return false
        }
    }
    
    const notInQueue = -1
    function broadcastQueueUpdate(queue) {
        for(const client of wsInstance.getWss().clients) {
            const index = queue.members.indexOf(client.jwt._id)
            if(index == notInQueue) {
                continue
            }
            client.send(JSON.stringify({
                messageType: 'update',
                companyId: queue.companyId,
                queuePosition: queue.members.indexOf(client.jwt._id) + 1
            }))
        }
    }

    return {
        getCompaniesForEvent,
        enqueue,
        enqueueAll,
        dequeue,
        dequeueAll,
        joinSession,
        leaveSession,
        broadcastQueueUpdate
    }
}
