const mongoose = require('mongoose')

const RoomSchema = require('./room')
const QueueSchema = require('./queue')

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: Buffer,
        required: true
    },
    description: {
        type: String,
        default: 'No description'
    },
    rooms: [RoomSchema]
})

mongoose.model('Company', CompanySchema)