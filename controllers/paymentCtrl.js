const Payments = require('../models/PaymentModel');
const Users = require('../models/User');
const Products = require('../models/Product');



const paymentCtrl = {

    getPayments: async(req, res) =>{
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },
    addPayments: async(req, res) =>{
        try {
            const user = Users.findById(req.user.id).select('name email')
            if(!user) return res.status(400).json({msg:'User does not exist'})
            
            const {cart, paymentID, address} = req.body;

            const {_id, name, email} = user;

            const newPayment = new Payments({
                user_id: _id, name, email, cart, paymentID, address
            })

            cart.filter(item =>{
                return sold(item._id, item.quantity, item.sold)
            })
            
            console.log(newPayment)
            await newPayment.save()
            res.json({newPayment},'payment success')
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    }
}

const sold = async(id, quantity, oldSold) =>{
    await Products.findOneAndUpdate({_id: id}, {sold: quantity + oldSold})
}

module.exports = paymentCtrl