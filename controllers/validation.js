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
            if(res) res.status(400).json({ message: 'No object provided for validation.' })
            return false
        }
        for(const s of source) {
            const { error } = schema.validate(s)
            if(error) {
                if(res) res.status(400).json({ message: (process.env.NODE_ENV == 'development' ? error.details[0].message : 'Validation error') })
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
const stringSchema = Joi.object({
    string: Joi.string()
})
const emailSchema = Joi.object({
    email: Joi.string().required().email(),
})
const companySchema = Joi.object({
    email: Joi.string().required().email(),
    name: Joi.string()
})

module.exports = {
    isEvent: isValid(eventSchema),
    isId: isValid(idSchema),
    isString: isValid(stringSchema),
    isIdArray: isValidArray(idSchema),
    isEmail: isValid(emailSchema),
    isCompany: isValid(companySchema)
}