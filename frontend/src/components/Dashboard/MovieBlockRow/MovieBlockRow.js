import React, { useContext, useEffect } from "react"
import './MovieBlockRow.css'
import MovieSmall from "../MovieSmall/MovieSmall"

const MovieBlockRow = (props) => {
    return (
        <div className = "movie-block-row">
            {props.movies.map((movie) => {
                return <MovieSmall movie = {movie} key = {movie.id}/>
            })}
        </div>
    )
}

export default MovieBlockRow