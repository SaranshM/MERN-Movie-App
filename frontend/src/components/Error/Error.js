import React, { useContext, useEffect, useState } from "react"
import SessionContext from "../../store/session-context"
import './Error.css'

const Error = (props) => {

    const ctx = useContext(SessionContext)

    return (
        <div className = "error">
            <h2>Error</h2>
            <p>{ctx.appState.error.errorMsg}</p>
        </div>
    )
}

export default Error