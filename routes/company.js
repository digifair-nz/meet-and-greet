module.exports = function(wsInstance) {
    const router = require('express').Router();
    const companyCtrl = require('../controllers/company')(wsInstance)
    const loginCtrl = require('../controllers/security/authentication')
    const authCtrl = require('../controllers/security/authorisation')
    
    // router.get('/', companyCtrl.getEvent)
    // router.post('/room', companyCtrl.createRoom)
    // router.delete('/room', companyCtrl.deleteRoom)
    
    router.post('/login/:_id', loginCtrl.companyLogin)

    router.get('/next', companyCtrl.getNextStudent)
    router.post('/kick', companyCtrl.kickStudent)
    // router.post('/end', companyCtrl.leaveRoom)
    
    return router
}