const validate = require('./validation')
const Event = require('mongoose').model('Event')

function getEvent() {

}

async function createEvent(req, res) {
    if(!validate.isEvent(req.body, res)) return
    
    

    const event = new Event({
        name: req.body.name,
        description: req.body.description,
        clubId: req.payload._id,
        companiesAttending: req.body.companiesAttending
    })
    try {
        await event.save()
        return res.status(200).json(event)
    }
    catch(err) {
        res.status(400).json(err)
    }
}

module.exports = {
    createEvent
}