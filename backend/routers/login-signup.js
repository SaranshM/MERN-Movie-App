require("../db-connection/mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user")

const login_signup = new express.Router();

const post = bodyParser.urlencoded({ extended: false });

login_signup.post("/signup_post", post, async (req, res) => {
  console.log("Fetching request data...", req.body)
  let { email, password } = req.body;
  try {
    email = email.toLowerCase()

    console.log("Checking if user exists...")
    const check_existing_user_email = await User.findOne({email:email})
    if(check_existing_user_email) throw Error("Account exists")

    console.log("CHecking password formalt...")
    const pwd_regex = /(?=^.{8,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/;
    if (!password.match(pwd_regex)) throw Error("Invalid password");
    const hashed_password = bcrypt.hashSync(password, 8);

    console.log("Creating new user...")
    const new_user = new User({
      name: email.split("@")[0],
      email: email,
      password: hashed_password
    });
    const saved_id = await new_user.save();

    console.log("Generating session token...")
    const auth_token = jwt.sign({ _id: saved_id._id }, process.env.JWT_SECRET);
    saved_id.tokens = [auth_token];
    saved_id.temporarytoken = auth_token;
    await saved_id.save();
    const response_client = {
      _id: saved_id._id,
      email: saved_id.email,
      name: saved_id.name,
      token: saved_id.tokens[0],
    };

    console.log("Response client...",response_client)
    return res.send({ error: false, msg: "no error", data: response_client });
  } catch (err) {
    console.error(err)
    return res.send({ error: true, msg: err.name + ": " + err.message });
  }
});

login_signup.post("/login_post", post, async (req, res) => {
    console.log("Fetching request object...", req.body)
    let { email, password } = req.body;
    try {
        email = email.toLowerCase()

        console.log("Checking if user exists...")
        const find_email = await User.findOne({ email: email });
        if (!find_email) throw Error("Account does not exist");

        console.log("Checking if password is correct...")
        if (!bcrypt.compareSync(password, find_email.password)) throw Error("Invalid password");

        console.log("Generating session token...")
        const auth_token = jwt.sign(
            { _id: find_email._id },
            process.env.JWT_SECRET
        );
        find_email.tokens.push(auth_token);
        await find_email.save();
        const response_client = {
          _id: find_email._id,
          token: auth_token,
          name: find_email.name,
          email: email
        };

        console.log("Response", response_client)
        return res.send({ error: false, msg: "no error", data: response_client });
    } catch (err) {
        console.log(err);
        // Return error
        return res.send({ error: true, msg: err.name + ": " + err.message });
    }
});

login_signup.post("/logout", post, async (req, res) => {
    console.log("Fetching request object", req.body);
    const { token, _id } = req.body;
    try {
        console.log("Logging out...")
        const user = await User.findOne({ _id: _id });
        user.tokens = user.tokens.filter((token_instance) => {
            return token_instance != token;
        });
        await user.save();
        return res.send({ error: false, msg: "no error" });
        } catch (err) {
        console.log(err);
        // Return error
        return res.send({ error: true, msg: err.name + ": " + err.message });
    }
});

login_signup.post("/auth", post, async (req, res) => {
  console.log("Fetching request object", req.body);
  const { token, _id } = req.body;
  try {
      console.log("Authenticating...")
      const user = await User.findOne({ _id: _id });
      if(!user) throw Error("Access denied")
      const session = user.tokens.find((token_instance) => {
          return token_instance == token;
      });
      if(!session) throw Error("Access denied")
      return res.send({ error: false, msg: "no error" });
  } catch (err) {
      console.log(err);
      // Return error
      return res.send({ error: true, msg: err.name + ": " + err.message });
  }
});

login_signup.post("/auto_login", post, async (req, res) => {
  console.log("Fetching request object", req.body);
  const { token, _id } = req.body;
  try {
      console.log("Authenticating...")
      const user = await User.findOne({ _id: _id });
      if(!user) throw Error("Access denied")
      const session = user.tokens.find((token_instance) => {
          return token_instance == token;
      });
      if(!session) throw Error("Access denied")
      return res.send({ error: false, msg: "no error", data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: token
        } 
      });
  } catch (err) {
      console.log(err);
      // Return error
      return res.send({ error: true, msg: err.name + ": " + err.message });
  }
});

module.exports = login_signup;
