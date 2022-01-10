import React, { useContext, useEffect, useState, useCallback } from "react"
import './MovieModal.css'
import axios from "axios"
import SessionContext from "../../../store/session-context"
import Loader from "../../Loader/Loader"

const MovieModal = (props) => {

    const ctx = useContext(SessionContext)
    const [ movieState, setMovieState ] = useState({
        id: "",
        title: "Title",
        release_date: "00-00-00",
        vote_average: 0,
        vote_count: 0,
        overview: "Dummy Text",
        poster: ""
    })
    const [ starred, setStarred ] = useState(false)
    const [ modalError, setModalError ] = useState({
        errorState: false,
        errorMsg: ""
    })
    const [ modalLoader, setModalLoader ] = useState(false)

    const getMovie = useCallback(async () => {
        setModalLoader(true)
        const movieResponse = await axios.post("http://localhost:9000/movie", { _id: ctx.appState.userDetails._id, id: ctx.appState.movieModal.movieId }, { 
            headers: {
                "_id": ctx.appState.userDetails._id, 
                "token": ctx.appState.userDetails.token 
            }
        })
        setModalLoader(false)
        if(movieResponse.data.error) {
            if(movieResponse.data.msg == "Can't fetch data") {
                setModalError({
                    errorState: true,
                    errorMsg: "Unable to fetch data right now. Please try again later."
                })
                return
            }
            else {
                setModalError({
                    errorState: true,
                    errorMsg: "Something went wrong, please refresh."
                })
                return
            }
        }
        const { movie } = movieResponse.data.data
        console.log("movie", movie)
        setMovieState({
            id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            overview: movie.overview,
            poster: movie.poster
        })
        setStarred(movie.starred)
    }, [])

    const starClickHandler = async () => {
        if(!starred) {
            const starResponse = await axios.post("http://localhost:9000/star", { _id: ctx.appState.userDetails._id, id: movieState.id }, { 
                headers: {
                    "_id": ctx.appState.userDetails._id, 
                    "token": ctx.appState.userDetails.token 
                }
            })
            if(starResponse.data.error) {
                return
            }
            setStarred(true)
        }
        else if(starred) {
            const starResponse = await axios.post("http://localhost:9000/unstar", { _id: ctx.appState.userDetails._id, id: movieState.id }, { 
                headers: {
                    "_id": ctx.appState.userDetails._id, 
                    "token": ctx.appState.userDetails.token 
                }
            })
            if(starResponse.data.error) {
                return
            }
            props.onUnStar(movieState.id)
            setStarred(false)
        }
    }

    useEffect(() => {
        getMovie()
    }, [])

    return (
        <div className = "movie-modal">
            {modalLoader && <Loader />}
            {modalError.errorState && (
                <div className = "movie-modal__error">
                    <h4>{modalError.errorMsg}</h4>
                </div>
            )}
            {!modalError.errorState && !modalLoader && (
                <React.Fragment>
                    <div className = "poster">
                        <img src = {!movieState.poster || movieState.poster == "" ? "https://img-premium.flaticon.com/png/512/1823/premium/1823458.png?token=exp=1632477527~hmac=7bfcd24f58a0f9b1283b10187cc522e8" : movieState.poster} className = "poster-img" />
                    </div>
                    <div className = "movie-details">
                        <p className = "movie-details-title">{movieState.title}</p>
                        <hr className = "line-title"/>
                        <div className = "movie-details-top">
                            <div className = "movie-details-info">
                                <p className = "movie-details-date">{movieState.release_date}</p>
                                <p className = "movie-details-avg"><span>{movieState.vote_average}</span>&nbsp;/&nbsp;10 || {movieState.vote_count} votes</p>
                            </div>
                            <div className = {`star ${starred ? "starred" : "unstarred"}`} onClick = {starClickHandler}></div>
                        </div>
                        <hr className = "line-top"/>
                        <div className = "movie-details-overview">
                            <p className = "movie-details-overview-text">{movieState.overview}</p>
                        </div>
                    </div>
                </React.Fragment>
            )}
        </div>
    )
}

export default MovieModal