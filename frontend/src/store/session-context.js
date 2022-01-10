import React from "react"

const SessionContext = React.createContext({
    appState: {
        loggedIn: false,
        page: "landing",
        userDetails: {
          email: "",
          name: "",
          token: "",
          _id: ""
        },
        overlay: false,
        error: {
          errorState: false,
          errorMsg: ""
        },
        movieModal: {
          movieModalState: false,
          movieId: ""
        }
      },
      setAppState: () => {},
      logoutHandler: () => {}
})

export default SessionContext