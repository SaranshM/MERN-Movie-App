require("../db-connection/mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user")
const axios = require("axios").default
const genres = require("../utils/genres")
const auth = require("../middleware/auth")

const movies = new express.Router();

const post = bodyParser.urlencoded({ extended: false });

movies.post("/trending_movies", auth, async (req, res) => {
    try {
        console.log("Fetching request object...", req.body)
        let { page } = req.body

        console.log("Fetching trending movies...")
        const { data } = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.MOVIE_API_KEY}`)
        if(data.error) throw Error("Can't fetch data")

        console.log("FIltering data...")
        let trending_movies = []
        for(let i = 0; i < data.results.length; i++) {
            trending_movies.push({
                id: data.results[i].id,
                title: data.results[i].title,
                release_date: data.results[i].release_date,
                vote_average: data.results[i].vote_average,
                vote_count: data.results[i].vote_count,
                poster: `https://image.tmdb.org/t/p/w500${data.results[i].poster_path}`
            })
        }

        console.log("Paginating Data...")
        page = parseInt(page)
        let limit = parseInt(process.env.LIMIT)
        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        let trending_movies_slice = trending_movies.slice(startIndex,endIndex)

        console.log("Response...", trending_movies_slice)
        return res.send({ error: false, msg: "no error", data: { trending_movies_slice } });
    } catch (err) {
        console.error(err)
        return res.send({ error: true, msg: err.name + ": " + err.message });
    }
});

movies.post("/genre", auth, async (req, res) => {
    try {
        console.log("Fetching request object...", req.body)
        let { genre, page } = req.body

        const genre_obj = genres.find((elem) => { return elem.name == genre })

        console.log("Fetching genre specific movies...")
        const { data } = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genre_obj.id}&with_watch_monetization_types=flatrate`)
        if(data.error) throw Error("Can't fetch data")

        console.log("FIltering data...")
        let genre_movies = []
        let len = data.results.length >= process.env.LIMIT ? process.env.LIMIT : data.results.length
        for(let i = 0; i < len; i++) {
            genre_movies.push({
                id: data.results[i].id,
                title: data.results[i].title,
                release_date: data.results[i].release_date,
                vote_average: data.results[i].vote_average,
                vote_count: data.results[i].vote_count,
                poster: `https://image.tmdb.org/t/p/w500${data.results[i].poster_path}`
            })
        }

        console.log("Response...", genre_movies)
        return res.send({ error: false, msg: "no error", data: { genre_movies } });
    } catch (err) {
        console.error(err)
        return res.send({ error: true, msg: err.name + ": " + err.message });
    }
});

movies.post("/popular", auth, async (req, res) => {
    try {
        console.log("Fetching request object...", req.body)
        let { page } = req.body

        console.log("Fetching popular movies...")
        const { data } = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=${page}`)
        if(data.error) throw Error("Can't fetch data")

        console.log("FIltering data...")
        let popular_movies = []
        let len = data.results.length >= process.env.LIMIT ? process.env.LIMIT : data.results.length
        for(let i = 0; i < len; i++) {
            popular_movies.push({
                id: data.results[i].id,
                title: data.results[i].title,
                release_date: data.results[i].release_date,
                vote_average: data.results[i].vote_average,
                vote_count: data.results[i].vote_count,
                poster: `https://image.tmdb.org/t/p/w500${data.results[i].poster_path}`
            })
        }

        console.log("Response...", popular_movies)
        return res.send({ error: false, msg: "no error", data: { popular_movies } });
    } catch (err) {
        console.error(err)
        return res.send({ error: true, msg: err.name + ": " + err.message });
    }
});

movies.post("/top_rated", auth, async (req, res) => {
    try {
        console.log("Fetching request object...", req.body)
        let { page } = req.body

        console.log("Fetching top_rated movies...")
        const { data } = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=${page}`)
        if(data.error) throw Error("Can't fetch data")

        console.log("FIltering data...")
        let top_rated_movies = []
        let len = data.results.length >= process.env.LIMIT ? process.env.LIMIT : data.results.length
        for(let i = 0; i < len; i++) {
            top_rated_movies.push({
                id: data.results[i].id,
                title: data.results[i].title,
                release_date: data.results[i].release_date,
                vote_average: data.results[i].vote_average,
                vote_count: data.results[i].vote_count,
                poster: `https://image.tmdb.org/t/p/w500${data.results[i].poster_path}`
            })
        }

        console.log("Response...", top_rated_movies)
        return res.send({ error: false, msg: "no error", data: { top_rated_movies } });
    } catch (err) {
        console.error(err)
        return res.send({ error: true, msg: err.name + ": " + err.message });
    }
});

movies.post("/movie", auth, async (req, res) => {
    try {
        console.log("Fetching request object...", req.body)
        let { id, _id } = req.body

        console.log("Fetching movie...")
        const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.MOVIE_API_KEY}&language=en-US`)
        if(data.error) throw Error("Can't fetch data")

        console.log("Fetching user...")
        const user = await User.findOne({ _id: _id })
        let starred = user.starred.find((movie) => { return movie == id })

        console.log("FIltering data...")
        let movie = {
            id: data.id,
            title: data.title,
            release_date: data.release_date,
            vote_average: data.vote_average,
            vote_count: data.vote_count,
            poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
            starred: starred ? true : false,
            overview: data.overview
        }

        console.log("Response...", movie)
        return res.send({ error: false, msg: "no error", data: { movie } });
    } catch (err) {
        console.error(err)
        return res.send({ error: true, msg: err.name + ": " + err.message });
    }
});

movies.post("/search", auth, async (req, res) => {
    try {
        console.log("Fetching request object...", req.body)
        let { page, query } = req.body

        console.log("Fetching movies from query...")
        const { data } = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${query}&page=${page}&include_adult=false`)
        if(data.error) throw Error("Can't fetch data")

        console.log("FIltering data...")
        let search_movies = []
        let len = data.results.length >= process.env.LIMIT ? process.env.LIMIT : data.results.length
        for(let i = 0; i < len; i++) {
            search_movies.push({
                id: data.results[i].id,
                title: data.results[i].title,
                release_date: data.results[i].release_date,
                vote_average: data.results[i].vote_average,
                vote_count: data.results[i].vote_count,
                poster: `https://image.tmdb.org/t/p/w500${data.results[i].poster_path}`
            })
        }

        console.log("Response...", search_movies)
        return res.send({ error: false, msg: "no error", data: { search_movies } });
    } catch (err) {
        console.error(err)
        return res.send({ error: true, msg: err.name + ": " + err.message });
    }
});

module.exports = movies;
