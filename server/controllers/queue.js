const validate = require('./validation')

const mongoose = require('mongoose')
const Queue = mongoose.model('Queue')

const get = require('./database_interface')

async function enqueue(req, res) {
    const result = await get.enqueueStatus.from(req, res)

    if(!result.success) {
        return res.status(500).json({ message: result.error })
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

async function dequeue(req, res) {
    const result = await get.dequeueStatus.from(req, res)

    if(!result.success) {
        return res.status(500).json({ message: `Failed to dequeue` })
    }
    // notify on the websocket here
    return res.status(200).send()
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
    const queue = result.data.data

    if(!result.success) {
        return res.status(500).json({ message: `Failed to accept queue` })
    }
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
        else {
            return res.status(200).json({ message: `Bruh you're allowed` })
        }
    }
    return res.status(200).json({

    })
}


module.exports = {
    enqueue,
    dequeue,
    createQueue,
    acceptQueue
}