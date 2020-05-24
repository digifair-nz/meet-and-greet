module.exports = function(params) {
    const router = require('express').Router();
    const userCtrl = require('../controllers/user')
    const loginCtrl = require('../controllers/security/authentication')
    const authCtrl = require('../controllers/security/authorisation')
    
    // login
    router.post('/login/:_id', loginCtrl.defaultLogin)
    
    // endpoint to get the companies attending the event
    router.get('/', authCtrl.asStudent, userCtrl.getCompaniesForEvent)
    
    // endpoints for enqueuing and dequeuing
    router.post('/enqueue/:_id', authCtrl.asStudent, userCtrl.enqueue)
    // router.post('/enqueue', authCtrl.asStudent, userCtrl.enqueueAll)
    router.post('/dequeue/:_id', authCtrl.asStudent, userCtrl.dequeue(params))
    // router.post('/dequeue', authCtrl.asStudent, userCtrl.dequeueAll)
    
    // endpoints for joining and leaving sessions
    router.post('/accept/:_id', authCtrl.asStudent, userCtrl.joinSession(params))
    router.post('/end/:_id', authCtrl.asStudent, userCtrl.leaveSession)

    return router
}