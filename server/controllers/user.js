const mongoose = require('mongoose')
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
    catch (err) {
        console.log(err)
    }
}

module.exports = {
    getEvent
}