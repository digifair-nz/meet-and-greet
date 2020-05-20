const router = require('express').Router();
const userCtrl = require('../controllers/user')
const loginCtrl = require('../controllers/security/authentication')
const authCtrl = require('../controllers/security/authorisation')
const queueCtrl = require('../controllers/queue')

router.post('/login/:_id', loginCtrl.defaultLogin)

router.get('/', authCtrl.asStudent, userCtrl.getEvent)


router.post('/queue', queueCtrl.createQueue)

router.post('/enqueue/:_id', authCtrl.asStudent, queueCtrl.enqueue)
// router.post('/enqueue', authCtrl.asStudent, queueCtrl.enqueueAll)
router.post('/dequeue/:_id', authCtrl.asStudent, queueCtrl.dequeue)
// router.post('/dequeue', authCtrl.asStudent, queueCtrl.dequeueAll)

// router.post('/end/:_id', authCtrl.asStudent, queueCtrl.requeueStudent)
router.post('/accept/:_id', authCtrl.asStudent, queueCtrl.acceptQueue)

module.exports = router