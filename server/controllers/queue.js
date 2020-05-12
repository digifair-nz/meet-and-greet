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


module.exports = {
    enqueue,
    dequeue,
    createQueue
}