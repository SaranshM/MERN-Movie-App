import React, { useContext } from "react"
import './AppHeader.css'
import NavBar from "../NavBar/NavBar"
import SessionContext from "../../store/session-context"

const AppHeader = (props) => {

    const ctx = useContext(SessionContext)

    const starredHandler = () => {
        props.onStarred()
    }

    const clickHandler = () => {
        if(ctx.appState.loggedIn) {
            ctx.setAppState((prevState) => {
                return {
                    ...prevState,
                    page: "dashboard"
                }
            })
        }
    }

    return (
        <div className = "app-header">
            <div className = "app-header__title-wrap" onClick = {clickHandler}>
                <h1>MERN Movie App</h1>
            </div>
            {props.loggedIn && (props.page == "dashboard" || props.page == "genre" || props.page == "search" || props.page == "starred") && <NavBar onStarred = {starredHandler}/>}
        </div>
    )
}

export default AppHeader