import React, { useContext } from "react"
import './NavBar.css'
import AppButton from "../../UI/AppButton/AppButton"
import SessionContext from "../../store/session-context"
import userEvent from "@testing-library/user-event"

const NavBar = (props) => {

    const ctx = useContext(SessionContext)

    const starredHandler = () => {
        props.onStarred()
    }

    return (
        <div className = "navbar">
            <AppButton type = "button" text = "Starred" purpose = "starred" onStarred = {starredHandler}/>
            <AppButton type = "button" text = "Logout" purpose = "logout" onLogout = {ctx.logoutHandler}/>
        </div>
    )
}

export default NavBar