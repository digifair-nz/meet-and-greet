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
function isValidArray(schema) {
    return function(source, res) {
        if(!source || !Array.isArray(source)) {
            if(res) res.status(400).json('Invalid request.')
            return false
        }
        for(const s of source) {
            const { error } = schema.validate(s)
            if(error) {
                if(res) res.status(400).json(error.details[0].message)
                return (res ? false : error)
            }
        }
        return true
    }
}

const eventSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    companiesAttending: Joi.array().items(Joi.objectId()).required()
})
const idSchema = Joi.object({
    _id: Joi.objectId().required()
})

module.exports = {
    isEvent: isValid(eventSchema),
    isId: isValid(idSchema),
    isIdArray: isValidArray(idSchema)
}