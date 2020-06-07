module.exports = function(wsInstance) {
    const router = require('express').Router();
    const userCtrl = require('../controllers/user')(wsInstance)
    const loginCtrl = require('../controllers/security/authentication')
    const authCtrl = require('../controllers/security/authorisation')
    
    // login

    router.use(function(req, res, next) {
        console.log('c')
        next()
    })

    router.post('/login/:_id', loginCtrl.studentLogin)
    
    // endpoint to get the companies attending the event
    router.get('/', authCtrl.asStudent, userCtrl.getCompaniesForEvent)
    
    // endpoints for enqueuing and dequeuing
    router.post('/enqueue/:_id', authCtrl.asStudent, userCtrl.enqueue)
    // router.post('/enqueue', authCtrl.asStudent, userCtrl.enqueueAll)
    router.post('/dequeue/:_id', authCtrl.asStudent, userCtrl.dequeue)
    // router.post('/dequeue', authCtrl.asStudent, userCtrl.dequeueAll)
    
    // endpoints for joining and leaving sessions
    router.post('/accept/:_id', authCtrl.asStudent, userCtrl.joinSession)
    router.post('/end/:_id', authCtrl.asStudent, userCtrl.leaveSession)

    const temp = require('../test-setup')
    router.post('/setup', async (req, res) => {
        await temp.removeAllCollections()
        const eventId = await temp.seedDatabase(true)
        return res.status(200).json({ message: 'Success.', eventId })
    })

    return router
}