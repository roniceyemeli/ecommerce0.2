const router = require('express').Router();
const productCtrl = require('../controllers/productCtrl');
// const auth = require("../middlewares/auth");
// const authAdmin = require("../middlewares/authAdmin");


router.route('/products')
    .get(productCtrl.getProducts)
    .post(productCtrl.newProducts)


router.route('/products/:id')
    .delete(productCtrl.deleteProducts)
    .put(productCtrl.updateProducts)


module.exports = router;