const validate = require('./validation')

const mongoose = require('mongoose')
const Queue = mongoose.model('Queue')

const get = require('./database_interface')

async function enqueue(req, res) {
    const result = await get.enqueueStatus.from(req, res)

    if(!result.success) {
        return res.status(500).json({ message: `Failed to enqueue` })
    }
    const positionInQueue = result.data.data.length - 1
    return res.status(200).json({ position: positionInQueue })
}

// async function enqueueAll(req, res) {
//     const result = await get.enqueueAllStatus.from(req, res)

//     if(!result.success) {
//         return res.status(500).json({ message: `Failed to enqueue` })
//     }
//     result.data.map(queue => {
//         return {
//             position: queue.data.length - 1, companyId: queue.companyId
//         }
//     })
//     const positionInQueues = result.data
//     return res.status(200).json( { positions: positionInQueues })
// }

function dequeue({ broadcastQueueUpdate }) {
    return async function dequeue(req, res) {
        const result = await get.dequeueStatus.from(req, res)
    
        if(!result.success) {
            return res.status(500).json({ message: result.error })
        }
        broadcastQueueUpdate(result.data.data)

        return res.status(200).send()
    }
}

function leaveSession({ broadcastQueueUpdate }) {
    return async function leaveSession(req, res) {

    }
}

async function createQueue(req, res) {
    if(!validate.isId({ _id: req.body.eventId}, res) || !validate.isId({ _id: req.body.companyId }, res)) {
        return
    }
    const queue = new Queue({
        eventId: req.body.eventId,
        companyId: req.body.companyId
    })
    try {
        await queue.save()
        return res.status(200).send()
    }
    catch (error) {
        return res.status(500).send()
    }
}

async function acceptQueue(req, res) {
    const result = await get.queue.from(req, res)
    
    if(!result.success) {
        return res.status(500).json({ message: `Failed to accept queue` })
    }

    if(result.data.inSession) {
        return res.status(403).json({ message: `Room in session` })
    }

    const queue = result.data.data
    const index = queue.indexOf(req.payload._id)

    if(index != 0) {
        req.body._ids = queue.slice(0, index)
        const queueMembersResult = await get.usersByIds.from(req, res)
        if(!queueMembersResult.success) {
            return res.status(500).json({ message: `Failed to accept queue` })
        }
        const isFirst = queueMembersResult.data.reduce((total, value) => total && value.inSession, true)

        if(!isFirst) {
            return res.status(403).json({ message: `Queue accept request denied` })
        }
    }

    try {
        result.data.inSession = true
        await result.data.save()

        const userResult = await get.user.from(req, res)
        if(!userResult.success) throw userResult.error

        if(userResult.data.inSession) throw 'User already in session'
        userResult.data.inSession = true
        await userResult.data.save()

        return res.status(200).json({ message: `Success joining room as ${userResult.data.email}` })
    }
    catch (error) {
        return res.status(500).json({ message: error })
    }
}

module.exports = {
    enqueue,
    dequeue,
    createQueue,
    acceptQueue
}