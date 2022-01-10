import React, { useContext } from "react"
import './SearchParams.css'
import Dropdown from "../Dropdown/Dropdown"
import SearchBar from "../SearchBar/SearchBar"

const SearchParams = (props) => {

    return (
        <div className = "search-params">
            <Dropdown onChangeGenre = {props.onChangeGenre}/>
            <div className = "vertical-line"></div>
            <SearchBar onSubmitQuery = {props.onSubmitQuery}/>
        </div>
    )
}

export default SearchParams