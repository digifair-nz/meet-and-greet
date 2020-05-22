require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const expressWs = require('express-ws')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

require('./models/db')

const app = express()
app.server = require('http').createServer(app)

const url = require('url')
const jwt = require('jsonwebtoken')
const wsInstance = expressWs(app, app.server, {
    wsOptions: {
        verifyClient: function({ req }, done) {
            const { query: { token } } = url.parse(req.url, true)
    
            try {
                req.jwt = jwt.verify(token, process.env.TOKEN_SECRET)
                done(true)
            }
            catch (err) {
                return done(false, 403, 'Invalid token')
            }
        }
    }
})

app.ws('/', function(ws, req) {
    ws.jwt = req.jwt
    ws.send('Connected')
})
const notInQueue = -1
app.broadcastQueueUpdate = function(queue) {
    for(const client of wsInstance.getWss().clients) {
        const index = queue.members.indexOf(client.jwt._id)
        if(index == notInQueue) {
            continue
        }
        client.send({ companyId: queue.companyId, queuePosition: queue.members.indexOf(client.jwt._id) })
    }
}

const userRouter = require('./routes/user')({ broadcastQueueUpdate: app.broadcastQueueUpdate })
const clubRouter = require('./routes/club')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/user', userRouter)
app.use('/club', clubRouter)

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