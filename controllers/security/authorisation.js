const jwt = require('jsonwebtoken')
const Event = require('mongoose').model('Event')

function auth(validType, failureMessage) {
    return async function(req, res, next) {
        const token = req.header('auth-token')
        
        if(!token) return res.status(401).json('Access denied.')

        try {
            const authorised = jwt.verify(token, process.env.TOKEN_SECRET)

            if(authorised.accountType == validType) {
                req.payload = authorised

                const id = (await Event.findById(authorised.eventId)).version
                if(authorised.eventVersion != id) {
                    return res.status(401).json({
                        reloginRequired: true,
                        message: 'Event has been refreshed by the administrators, please relogin.'
                    })
                }

                next()
            }
            else {
                return res.status(401).json({ message: failureMessage })
            }

        }
        catch(err) {
            return res.status(400).json({ message: 'Invalid token.' })
        }
    }
}

const authoriseAsStudent = auth('student', 'Account is not a student account.')
const authoriseAsCompany = auth('company', 'Account is not a company account.')
const authoriseAsClub = auth('club', 'Account is not a club account.')

module.exports = {
    asStudent: authoriseAsStudent,
    asCompany: authoriseAsCompany,
    asClub: authoriseAsClub
}