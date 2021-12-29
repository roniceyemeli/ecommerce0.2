const router = require('express').Router();
const paymentCtrl = require('../controllers/paymentCtrl');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');


router.route('/payment')
    .get(auth, authAdmin, paymentCtrl.getPayments)
    .post(auth, paymentCtrl.addPayments)



module.exports = router;