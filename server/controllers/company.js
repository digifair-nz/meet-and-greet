// contains controllers for all endpints which may be accessed by companies on the platform (i.e. those users who run the sessions,
// rather than those who queue for them)

module.exports = function(wsInstance) {
    const mongoose = require('mongoose')
    const Room = mongoose.model('Room')
    const User = mongoose.model('User')
    const Queue = mongoose.model('Queue')
    
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

    async function requestNextStudent(req, res) {
        
    }
    
    /**
     * Sends a ready notification to the first eligible member of the queue to notify them that they may join a room associated with that queue.
     * If the user does not accept the invitation then the next user is notified.
     * If no user is found who accepts the invitation throughout the entire queue
     * @param {Document} queue The mongoose queue document to use
     */
    async function findAndNotifyEligibleUser(queue) { 
        for(let i = 0; i < queue.members.length; i++) {
            const user = await User.findById(queue.members[i])
            if(!user.inSession) {
                const client = wsInstance.getWss().clients.find(client => client.payload._id == user._id)
                if(client.hasHadSession[queue.companyId]) {
                    continue
                }
                client.hasHadSession[queue.companyId] = true

                client.send(JSON.stringify({
                    messageType: 'ready',
                    companyId: queue.companyId
                }))
                await timeout(10000)

                try {
                    const updatedUser = await User.findById(queue.members[i])
                    if(updatedUser.inSession && updatedUser.sessionPartner.toString == queue._id.toString()) {
                        return
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
        }
    }
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    return {
        createRoom
    }
}