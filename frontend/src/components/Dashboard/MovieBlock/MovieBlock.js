import React, { useContext, useEffect, useState } from "react"
import './MovieBlock.css'
import MovieBlockRow from "../MovieBlockRow/MovieBlockRow"
import Error from "../../Error/Error"
import Loader from "../../Loader/Loader"

const MovieBlock = (props) => {
    console.log(props)
    const clickHandler = () => {
        props.onMoreMovies(props.heading)
    }

    return (
        <div className = "movie-block">
            <h2 className = "movie-block__title">{props.heading}</h2>
            {props.loader && <Loader />}
            {!props.loader && !props.error.errorState && props.movies.length == 0 && (
                <div className = "movie-block__error">
                    <h2>No movies found!</h2>
                </div>
            )}
            {!props.loader && !props.error.errorState && props.movies.map((arr) => {
                return <MovieBlockRow movies = {arr} />
            })}
            {!props.loader && props.error.errorState && (
                <div className = "movie-block__error">
                    <h4>{props.error.errorMsg}</h4>
                </div>
            )}
            {!props.loader && !props.error.errorState && props.movies.length == 0 ? (
                <div></div>
            ) : (
                <div className = "more" onClick = {clickHandler}>More</div>
            )}
        </div>
    )
}

export default MovieBlock