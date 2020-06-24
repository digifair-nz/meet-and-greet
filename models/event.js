const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'No description'
    },
    expirationTime: String,
    // time and date too
    // clubId: {
    //     type: mongoose.Types.ObjectId,
    //     required: true
    // },
    companiesAttending: {
        type: [mongoose.Types.ObjectId],
        default: []
    },
    version: {
        type: Number,
        default: 1
    }
})

mongoose.model('Event', EventSchema)