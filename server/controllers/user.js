// controllers for all endpoints which may be accessed by standard users of the application (i.e. users who are not companies nor clubs)

const validate = require('./validation')

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
        }).select('name description logoURL _id')
        if(!companies) {
            return res.status(404).json({ message: 'Companies attending the event could not be found' })
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
    // validate the room id
    if(!validate.isId(req.params, res)) {
        return
    }
    try {
        // find the room in the database
        let queue = await Queue.findOne({ eventId: req.payload.eventId, companyId: req.params._id })
        if(!queue) {
            queue = await createQueue(req.payload.eventId, req.params._id)
        }

        // fail if the user is already queued
        if(queue.members.includes(req.payload._id)) {
            return res.status(403).json({ message: 'Failed to enqueue as user is already in queue.'})
        }
        
        // fail if the user is attempting to queue more than once (not allowed)
        if(queue.blacklist.includes(req.payload._id)) {
            return res.status(403).json({ message: 'Failed to enqueue as user has previously had session with room.' })
        }

        // add the user to the queue
        queue.members.push(req.payload._id)
        await queue.save()

        return res.status(200).json({ message: 'Successfully enqueued to ' + queue.companyId, queuePosition: queue.members.length })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: error })
    }
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
function dequeue({ broadcastQueueUpdate }) {
    return async function dequeue(req, res) {
        // validate the room id
        if(!validate.isId(req.params, res)) {
            return
        }
        try {
            // find the room in the database
            const queue = await Queue.findOne({ eventId: req.payload.eventId, companyId: req.params._id })
            if(!queue) {
                return res.status(404).json({ message: 'Queue not found in dequeue attempt' })
            }
            // fail if the user is not in the queue
            const index = queue.members.indexOf(req.payload._id)
            if(index == -1) {
                return res.status(403).json({ message: 'Could not dequeue as user was not queued' })
            }
            // remove the user from the queue
            queue.members.splice(index, 1)
            await queue.save()

            // notify other queue members that their position in the queue may have changed
            broadcastQueueUpdate(queue)
            return res.status(200).json({ message: 'Successfully dequeued from ' + queue.companyId })
        }
        catch (error) {
            return res.status(500).json({ message: error })
        }
    }
}
module.exports = {
    getEvent
}