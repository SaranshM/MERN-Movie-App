import React from "react"
import './AppInput.css'

const AppInput = (props) => {

    const changeHandler = (event) => {
        props.onInputChange(event.target.value, props.labelId)
    }

    return (
        <div className = "app-input">
            <label htmlFor = {props.labelId}>{props.label}</label><br/>
            <input type = {props.type} value = {props.value} placeholder = {props.placeholder} className = "app-input__input" onChange = {changeHandler}/>
        </div>
    )
}

export default AppInput