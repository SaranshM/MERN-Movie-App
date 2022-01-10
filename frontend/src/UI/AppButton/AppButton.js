import React from "react"
import './AppButton.css'

const AppButton = (props) => {

    const clickHandler = () => {
        if(props.type != "submit") {
            if(props.purpose == "logout") {
                props.onLogout()
            }
            if(props.purpose == "starred") {
                props.onStarred()
            }
        }
    }

    return (
        <div className = "app-button">
            <button type = {props.type} className = "app-button__button" onClick = {clickHandler}>{props.text}</button>
        </div>
    )
}

export default AppButton