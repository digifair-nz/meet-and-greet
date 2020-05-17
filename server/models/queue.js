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
    data: {
        type: [mongoose.Types.ObjectId],
        default: []
    },
    blacklist: {
        type: [mongoose.Types.ObjectId],
        default: []
    },
    inSession: {
        type: Boolean,
        default: false
    }
})

mongoose.model('Queue', QueueSchema)