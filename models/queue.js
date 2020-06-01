const mongoose = require('mongoose')

const QueueSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    companyId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    members: {
        type: [mongoose.Types.ObjectId],
        default: []
    },
    blacklist: {
        type: [mongoose.Types.ObjectId],
        default: []
    }
})

mongoose.model('Queue', QueueSchema)