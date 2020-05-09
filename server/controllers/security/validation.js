const Joi = require('@hapi/joi')
Joi.objectId = require('joi-objectid')(Joi)

function validateAs(schema) {
    return function(data) {
        return schema.validate(data)
    }
}

const clubSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
        .required()
        .email(),
    password: Joi.string()
        .min(6)
        .required()
})
const validateClub = validateAs(clubSchema)

const userSchema = Joi.object({
    email: Joi.string()
        .required()
        .email(),
})
const validateUser = validateAs(userSchema)

const clubLoginSchema = Joi.object({
    email: Joi.string()
        .required()
        .email(),
    password: Joi.string()
        .min(6)
        .required()
})
const validateClubLogin = validateAs(clubLoginSchema)

const idSchema = Joi.object({
    _id: Joi.objectId().required()
})
const validateId = validateAs(idSchema)

module.exports = {
    asClub: validateClub,
    asUser: validateUser,
    asId: validateId,
    asClubLogin: validateClubLogin
}