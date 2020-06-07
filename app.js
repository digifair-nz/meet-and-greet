require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const expressWs = require('express-ws')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

require('./models/db')
const User = require('mongoose').model('User')

const app = express()
app.server = require('http').createServer(app)

const url = require('url')
const jwt = require('jsonwebtoken')

app.use(function(req, res, next) {
    console.log(req.url)
    next()
})

const wsInstance = expressWs(app, app.server, {
    wsOptions: {
        verifyClient: function({ req }, done) {
            console.log('attempt1')
            const { query: { token } } = url.parse(req.url, true)
    
            try {
                req.jwt = jwt.verify(token, process.env.TOKEN_SECRET)
                console.log('verified')
                done(true)
            }
            catch (err) {
                return done(false, 403, 'Invalid token')
            }
        }
    }
})
app.ws('/', function(ws, req) {
    console.log('attempt2')
    ws.jwt = req.jwt
    const user = User.findById(req.jwt._id)
    ws.hasBeenNotified = user.previousSessions || {}
    console.log('sending connected')
    ws.send(JSON.stringify({
        messageType: 'connected',
    }))
    console.log('b', JSON.stringify(wsInstance.getWss().clients))
})
setInterval(() => {
    console.log(JSON.stringify(wsInstance.getWss().clients))
}, 1000)

const userRouter = require('./routes/user')(wsInstance)
const companyRouter = require('./routes/company')(wsInstance)
const clubRouter = require('./routes/club')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'digifair/build')))

app.use('/user', userRouter)
app.use('/company', companyRouter)
app.use('/club', clubRouter)

app.get('/*', (req, res) => {
    return res.sendFile(path.join(__dirname + '/digifair/build/index.html'))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    return res.status(err.status || 500).json(err.status)
})

module.exports = app