// contains controllers for all endpints which may be accessed by companies on the platform (i.e. those users who run the sessions,
// rather than those who queue for them)

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

function forceEndSession({ broadcastQueueUpdate }) {
    return async function forceEndSession(req, res) {
        const room = await Room.findById()
    }
}

module.exports = {
    createRoom
}