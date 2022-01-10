const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL_PROD, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})