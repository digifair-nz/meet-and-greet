const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

function isValid(schema) {
    return function(source, res) {
        console.log('h1')
        const { error } = schema.validate(source)
        console.log('h2')
        if(error) {
            console.log('h3')
            if(res) res.status(400).json(error.details[0].message)
            console.log('h4')
            return false
        }
        console.log('h5')
        return true
    }
}
function isValidArray(schema) {
    return function(source, res) {
        if(!source || !Array.isArray(source)) {
            if(res) res.status(400).json('No object provided for validation.')
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