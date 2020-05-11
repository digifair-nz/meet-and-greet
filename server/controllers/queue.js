const validate = require('./validation')

const mongoose = require('mongoose')
const Company = mongoose.model('Company')

const get = require('./retrieval_helpers')

async function enqueue(req, res) {
    const queues = await get.company(req, res, req.params._id, 'queues')


}

function dequeue(req, res) {
    
}


module.exports = {
    enqueue,
    dequeue
}