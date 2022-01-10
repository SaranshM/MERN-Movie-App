import React, { useContext } from "react"
import './Dropdown.css'
import genres from "../../../store/genres"
import SessionContext from "../../../store/session-context"
import SearchBar from "../SearchBar/SearchBar"

const Dropdown = (props) => {

    const ctx = useContext(SessionContext)

    const changeHandler = (event) => {
        // ctx.setPage("genre")
        ctx.setAppState((prevState) => {
            return {
                ...prevState,
                page: "genre"
            }
        })
        props.onChangeGenre(event.target.value)
    }
    
    return (
        <div className = "dropdown">
            <select name="genre" id="genre" onChange = {changeHandler} defaultValue = "None">
                <option value="None">None</option>
                {genres.map((genre) => {
                    return <option value={genre.name}>{genre.name}</option>
                })}
            </select>
        </div>
    )
}

export default Dropdown