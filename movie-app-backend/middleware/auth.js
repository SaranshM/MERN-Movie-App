const jwt = require("jsonwebtoken");
const User = require("../models/user")

const auth = async (req, res, next) => {
    try {
        console.log("Headers...", req.headers)
        const { _id, token } = req.headers
        console.log(_id, token)
        console.log("Verifying the jwt...")
        jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: _id }).lean();
        if (!user) throw Error();
        if (user.tokens.indexOf(token) === -1) throw Error();
        next()
    } catch (err) {
        console.log(err);
        return res.send({ error: true, msg: "Error" + ": " + "Authorization Error" });
    }
    
}

module.exports = auth