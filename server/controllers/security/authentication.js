const mongoose = require('mongoose')
const User = mongoose.model('User')
const Event = mongoose.model('Event')
const Club = mongoose.model('Club')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validate = require('./validation')

/**
 * Login a user and respond with a jwt if their login details are correct
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
async function adminLogin(req, res) {
    // validate the request body with Joi
    const { error } = validate.asClubLogin(req.body)
    if(error) return res.status(400).json(error.details[0].message)
    
    const club = await Club.findOne({ email: req.body.email })
    if(!club) return res.status(400).json('Email not found.')
    // use bcrypt to check if the password is correct
    const validPassword = await bcrypt.compare(req.body.password, club.password)
    if(!validPassword) return res.status(400).json('Invalid password.')
    // sign and send the jwt
    const token = jwt.sign({ _id: club._id, accountType: 'club' }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
}

async function defaultLogin(req, res) {
    const { error } = validate.asUser(req.body)
    if(error) return res.status(400).json(error.details[0].message)

    {
        const { error } = validate.asId(req.params)
        if(error) return res.status(400).json(error.details[0].message)
    }

    const event = await Event.findById(req.params._id)
    if(!event) return res.status(400).json('Bad link.')

    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).json('Email not found')

    const token = jwt.sign({ _id: user._id, accountType: user.accountType, eventId: req.params._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
}

/**
 * Register a user with the details provided and respond with a jwt if the registration succeeds
 * @param {Object} req The request object
 * @param {Object} res The response object
 */
async function registerAdmin(req, res) {
    // validate the request body with Joi

    const { error } = validate.asClub(req.body)
    if(error) return res.status(400).json(error.details[0].message)

    const emailInUse = await Club.findOne( { email: req.body.email })
    if(emailInUse) return res.status(400).json('Email already exists.')
    // hash the given password with bcrypt
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const club = new Club({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        await club.save()
        // sign and send the jwt
        const token = jwt.sign({ _id: club._id, accountType: 'club' }, process.env.TOKEN_SECRET)
        return res.header('auth-token', token).send()
    }
    catch (err) {
        return res.status(400).json(err)
    }
}

module.exports = {
    adminLogin,
    defaultLogin,
    registerAdmin
}