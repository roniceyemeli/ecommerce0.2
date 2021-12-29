const Users = require('../models/User');
const Payments = require('../models/PaymentModel')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken') ;


const userCtrl = {
    register: async (req,res) =>{
        try {
            const {name,email,password} = req.body;

            const user = await Users.findOne({email});
            if (user) return res.status(400).json({msg:"the email already exist"});

            if(password.length < 6){
                return res.status(400).json({msg:'password should be at least 6 charaters long'})
            }
            
            //password encryption
            const passwordHash = await bcrypt.hash(password,10)
            const newUser =  new Users({
                name, email, password:passwordHash
            })

            //save to mongoDB
            await newUser.save()

            // then create jsonwebtoken to authentification
            const accesstoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})

            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000
            })
            
            res.json({accesstoken})

        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    login: async(req,res) => {
        try {
            const {email, password} = req.body;

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg:"this user doesn't exist"})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg:"bad credentials"})
            
            //login success, we create access token and refresh token
            const accesstoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 //7d
            })

            res.json({accesstoken})

        } catch (error) {
            res.status(400).json({msg:error.message})
        }
    },
    logout: async(req,res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg:"Signed Out"})
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },
    refreshToken : (req,res) =>{
        try {
            const r_token = req.cookies.refreshtoken;
            if(!r_token) return res.status(400).json({msg:"please login or register"})

            jwt.verify(r_token, process.env.REFRESH_TOKEN, (err, user) =>{
                if (err) return res.status(400).json({msg:"please Login or Register"})

                const accesstoken = createAccessToken({id: user.id})

                res.json({accesstoken})
            })

        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    getUser: async(req,res) =>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg:"User doesn't exist"})

            res.json(user)
        } catch (error) {
            res.status(500).json({msg:error.message})
        }
    },
    addCart: async(req,res) =>{
        try {
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg:'User does not exist'})

            await Users.findOneAndUpdate({_id: req.user.id}, { cart: req.body.cart})

            return res.json({msg:'added to cart'})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    history: async(req, res) =>{
        try{
            const history = await Payments.find({user_id: req.user.id})

            res.json(history)
        }catch(error){
            return res.status(500).json({msg:error.message})
        }
    }
}

const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.TOKEN_ACCESS, {expiresIn:'1d'})
}
const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN, {expiresIn:'7d'})
}

module.exports = userCtrl;
