import React, { useContext, useEffect, useState } from "react"
import SessionContext from "../../../store/session-context"
import './Overlay.css'
import Error from "../../Error/Error"
import MovieModal from "../MovieModal/MovieModal"

const Overlay = (props) => {
    
    const ctx = useContext(SessionContext)

    const unStarHandler = (id) => {
        props.onUnStar(id)
    }

    return (
        <React.Fragment>
            <div className = "overlay" onClick = {props.onCloseOverlay}></div>
            {ctx.appState.error.errorState && (
                <Error/>
            )}
            {ctx.appState.movieModal.movieModalState && (
                <MovieModal onUnStar = {unStarHandler}/>
            )}
        </React.Fragment>
    )
}

export default Overlay