const mongoose = require('mongoose');

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        console.log('Database connected....')
    } catch (error) {
        console.error('error connecting to the database')
    }
}

module.exports = connectDB;