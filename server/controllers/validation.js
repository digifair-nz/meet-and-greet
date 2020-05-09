const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

function isValid(schema) {
    return function(source, res) {
        const { error } = schema.validate(source)
        if(error) {
            if(res) res.status(400).json(error.details[0].message)
            return false
        }
        return true
    }
}

const eventSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    companiesAttending: Joi.array().items(Joi.objectId()).required()
})

module.exports = {
    isEvent: isValid(eventSchema)
}