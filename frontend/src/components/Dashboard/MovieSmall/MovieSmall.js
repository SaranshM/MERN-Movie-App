import React, { useContext, useEffect } from "react"
import SessionContext from "../../../store/session-context"
import './MovieSmall.css'

const MovieSmall = (props) => {

    const ctx = useContext(SessionContext)

    const clickHandler = () => {
        ctx.setAppState((prevState) => {
            return {
                ...prevState,
                overlay: true,
                movieModal: {
                    movieModalState: true,
                    movieId: props.movie.id
                }
            }
        })
    }

    return (
        <div className = "movie-small" onClick = {clickHandler} style = {{backgroundImage: `url(${props.movie.poster})`, backgroundColor: "black", backgroundSize: "cover", backgroundRepeat: "no-repeat"}}>
            <div className = "movie-small-overlay">
                <div className = "movie-small__wrap">
                    <h2 className = "movie-small__title">{props.movie.title}</h2>
                    <p className = "movie-small__release-date">{props.movie.release_date}</p>
                    <p className = "movie-small__ratings"><span>{props.movie.vote_average}</span>&nbsp;/&nbsp;10 || {props.movie.vote_count} votes</p>
                </div>
            </div>
        </div>
    )
}

export default MovieSmall