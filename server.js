const express = require('express');
const path = require('path');
require('dotenv').config({path:"./config/.env"});
const connectDB = require("./config/connectDB");
const cors = require('cors')
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}));
connectDB();

if(process.env.NODE.ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) =>{
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

// Routes
app.use('/user', require('./routes/userRouter'));
app.use('/api', require('./routes/categoryRouter'));
app.use('/api', require('./routes/uploadRouter'));
app.use('/api', require('./routes/productRouter'));
app.use('/api', require('./routes/paymentRouter'));








const PORT = process.env.PORT || 5000
app.listen(PORT, (err) =>{
    err ? console.error(err) : console.log(`server is running on port ${PORT}`)
})