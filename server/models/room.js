const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    }
    // vonage session id
})

mongoose.model('Room', RoomSchema)

module.exports = RoomSchema