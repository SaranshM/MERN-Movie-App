const helmet = require('helmet')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const { permittedCrossDomainPolicies } = require('helmet');
const login_signup = require('../routers/login-signup');
const movies = require('../routers/movies');
const starred = require('../routers/starred');

const app = express();
const post = bodyParser.urlencoded({extended:false,limit:'50mb'});
const port = process.env.PORT || 9000;

app.use(helmet())
app.use(bodyParser.json({limit:'50mb'}));
app.use(cors());
app.use(login_signup);
app.use(movies);
app.use(starred);

app.get("/", (req,res) => {
    res.send("Up")
})

app.listen(port, () => {
    console.log("Server is running on port " + port);
})


