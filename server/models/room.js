const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    companyId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    queue: {
        type: [mongoose.Types.ObjectId],
        default: []
    },
    inSession: {
        type: Boolean,
        default: false
    },
    sessionPartner: {
        type: mongoose.Types.ObjectId,
    }
    // vonage session id
})

mongoose.model('Room', RoomSchema)