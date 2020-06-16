const mongoose = require('mongoose')
const OpenTok = require('opentok')
const opentok = new OpenTok(process.env.VONAGE_API_KEY, process.env.VONAGE_SECRET)

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
    email: {
        type: String,
        required: true
    },
    queue: {
        type: [mongoose.Types.ObjectId],
        default: []
    },
    inSession: {
        type: Boolean,
        default: true
    },
    sessionPartner: {
        type: mongoose.Types.ObjectId,
    },
    sessionId: String
})
RoomSchema.methods.newSessionId = async function(_id) {
    return new Promise((resolve, reject) => {
        opentok.createSession({ mediaMode: 'routed' }, async (err, session) => {
            if(err) {
                return reject(err)
            }
            this.sessionId = session.sessionId
            await this.save()
            resolve(session.sessionId)
        })
    })
}
mongoose.model('Room', RoomSchema)