require("../db-connection/mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user")
const axios = require("axios").default
const genres = require("../utils/genres")
const auth = require("../middleware/auth")

const starred = new express.Router();

const post = bodyParser.urlencoded({ extended: false });

starred.post("/star", auth, async (req, res) => {
    try {
        console.log("Fetching request object...", req.body)
        const { id, _id } = req.body

        console.log("Star the movie...")
        const user = await User.findOne({ _id: _id })
        user.starred.push(id)
        await user.save()

        console.log("Response...")
        return res.send({ error: false, msg: "no error" });
    } catch (err) {
        console.error(err)
        return res.send({ error: true, msg: err.name + ": " + err.message });
    }
});

starred.post("/unstar", auth, async (req, res) => {
    try {
        console.log("Fetching request object...", req.body)
        const { id, _id } = req.body

        console.log("Unstar the movie...")
        const user = await User.findOne({ _id: _id })
        user.starred = user.starred.filter((movie) => { return movie != id })
        await user.save()

        console.log("Response...")
        return res.send({ error: false, msg: "no error" });
    } catch (err) {
        console.error(err)
        return res.send({ error: true, msg: err.name + ": " + err.message });
    }
});

starred.post("/starred", auth, async (req, res) => {
    try {
        console.log("Fetching request object...", req.body)
        let { _id, page } = req.body

        console.log("Fetching starred movies...")
        const user = await User.findOne({ _id: _id })
        let starred_movies = []
        let len = user.starred.length
        for(let i = 0; i < len; i++) {
            const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${user.starred[i]}?api_key=${process.env.MOVIE_API_KEY}&language=en-US`)
            if(data.error) throw Error("Can't fetch data")
            starred_movies.push({
                id: user.starred[i],
                title: data.title,
                release_date: data.release_date,
                vote_average: data.vote_average,
                vote_count: data.vote_count,
                poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`
            })
        }

        console.log("Paginating Data...")
        page = parseInt(page)
        let limit = parseInt(process.env.LIMIT)
        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        let starred_movies_slice = starred_movies.slice(startIndex,endIndex)

        console.log("Response...", starred_movies_slice)
        return res.send({ error: false, msg: "no error", data: { starred_movies: starred_movies_slice } });
    } catch (err) {
        console.error(err)
        return res.send({ error: true, msg: err.name + ": " + err.message });
    }
});

module.exports = starred;
