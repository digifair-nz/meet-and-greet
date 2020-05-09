const jwt = require('jsonwebtoken')

function auth(validType, failureMessage) {
    return function(req, res, next) {
        const token = req.header('auth-token')
        
        if(!token) return res.status(401).json('Access denied.')

        try {
            const authorised = jwt.verify(token, process.env.TOKEN_SECRET)

            if(authorised.accountType == validType) {
                req.payload = authorised
                next()
            }
            else {
                return res.status(401).json(failureMessage)
            }
        }
        catch(err) {
            return res.status(400).json('Invalid token.')
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