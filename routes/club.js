const router = require('express').Router();
const clubCtrl = require('../controllers/club')
const loginCtrl = require('../controllers/security/authentication')
const authCtrl = require('../controllers/security/authorisation')

router.post('/register', loginCtrl.registerAdmin)
router.post('/login', loginCtrl.adminLogin)

router.route('/event')
    // .get(authCtrl.asClub, clubCtrl.getEvent)
    .post(authCtrl.asClub, clubCtrl.createEvent)

// router.route('/event/_id')
//     .put(authCtrl.asClub, clubCtrl.updateEvent)
//     .delete(authCtrl.asClub, clubCtrl.deleteEvent)

module.exports = router