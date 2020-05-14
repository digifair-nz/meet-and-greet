const mongoose = require('mongoose')

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logoURL: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'No description'
    }
})

mongoose.model('Company', CompanySchema)