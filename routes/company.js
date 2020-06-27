module.exports = function(wsInstance) {
    const router = require('express').Router();
    const companyCtrl = require('../controllers/company')(wsInstance)
    const loginCtrl = require('../controllers/security/authentication')
    const authCtrl = require('../controllers/security/authorisation')
    
    // router.get('/', companyCtrl.getEvent)
    // router.post('/room', companyCtrl.createRoom)
    // router.delete('/room', companyCtrl.deleteRoom)
    
    router.post('/login/:_id', loginCtrl.companyLogin)

    router.post('/next', authCtrl.asCompany, companyCtrl.getNextStudent)
    router.post('/kick', authCtrl.asCompany, companyCtrl.kickStudent)
    router.get('/status', authCtrl.asCompany, companyCtrl.getQueueStatus)
    router.get('/student-details', authCtrl.asCompany, companyCtrl.getStudentTalkJSDetails)
    // router.post('/end', companyCtrl.leaveRoom)
    
    return router
}