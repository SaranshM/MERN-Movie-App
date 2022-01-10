import React, { useContext, useRef } from "react"
import './SearchBar.css'
import AppButton from "../../../UI/AppButton/AppButton"
import SessionContext from "../../../store/session-context"

const SearchBar = (props) => {

    const query = useRef()
    const ctx = useContext(SessionContext)

    const submitHandler = (event) => {
        event.preventDefault()
        console.log(query.current.value)
        props.onSubmitQuery(query.current.value)
        // ctx.setPage("search")
        ctx.setAppState((prevState) => {
            return {
                ...prevState,
                page: "search"
            }
        })
    }

    return (
        <form className = "search-bar" onSubmit = {submitHandler}>
            <input type = "text" placeholder = "Enter query here..." ref = {query}/>
            <AppButton type = "submit" text = "Submit" purpose = "querysearch" />
        </form>
    )
}

export default SearchBar