const mongoose = require('mongoose')

const Company = mongoose.model('Company')
const Event = mongoose.model('Event')

async function getEvent(req, res) {
    const event = await Event.findById(req.payload.eventId)
    if(!event) return res.status(404).json('Event does not exist')

    try {
        const companies = await Company.find({
            '_id': {
                $in: event.companiesAttending
            }
        }).select('name description logoURL _id')
        return res.status(200).json(companies)
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = {
    getEvent
}