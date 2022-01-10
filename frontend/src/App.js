import React, { useState, useEffect } from "react"
import AppHeader from "./components/AppHeader/AppHeader";
import Form from "./components/Landing/Form/Form";
import SessionContext from "./store/session-context";
import axios from "axios"
import Dashboard from "./components/Dashboard/Dashboard";
import Error from "./components/Error/Error";
import Overlay from "./components/Dashboard/Overlay/Overlay";
import Loader from "./components/Loader/Loader";

function App() {

  const [ appState, setAppState ] = useState({
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
  })
  const [ loading, setLoading ] = useState(false)

  useEffect(async () => {
    const reqData = {
      _id: localStorage["movie_app_id"],
      token: localStorage["movie_app_token"]
    }
    try {
      setLoading(true)
      const { data } = await axios.post("http://localhost:9000/auto_login", reqData)
      setLoading(false)
      console.log(data)
      if(!data.error) {
        setAppState((prevState) => { 
          return {
            ...prevState,
            userDetails: {
              email: data.data.email,
              name: data.data.name,
              token: data.data.token,
              _id: data.data._id
            },
            loggedIn: true,
            page: "dashboard"
          } 
        })
      }
      else if(data.error) {
        throw Error("Something went wrong")
      }
    }
    catch(err) {
      console.log(err)
    }
  }, [])

  const loginSignupHandler = async (userObj) => {
    setAppState((prevState) => { 
      return {
        ...prevState,
        userDetails: {
          _id: userObj._id,
          email: userObj.email,
          name: userObj.name,
          token: userObj.token
        },
        loggedIn: true,
        page: "dashboard"
      } 
    })
    localStorage["movie_app_id"] = userObj._id
    localStorage["movie_app_token"] = userObj.token
    console.log(userObj)
  }

  const logoutHandler = async () => {
    try {
      const reqData = {
          _id: appState.userDetails._id,
          token: appState.userDetails.token
      }
      const resp = await axios.post("http://localhost:9000/logout", reqData)
      console.log(resp.data.data)
      setAppState((prevState) => { 
        return {
          ...prevState,
          userDetails: {
            email: "",
            name: "",
            token: "",
            _id: ""
          },
          loggedIn: false,
          page: "landing"
        } 
      })
      localStorage["movie_app_id"] = ""
      localStorage["token"] = ""
    }
    catch (err) {
        console.log(err)
    }
  }

  const starredHandler = () => {
    setAppState((prevState) => { 
      return {
        ...prevState,
        page: "starred"
      } 
    })
  }

  const closeOverlayHandler = () => {
    setAppState((prevState) => {
        return {
            ...prevState,
            overlay: false,
            error: {
                errorState: false,
                errorMsg: ""
            },
            movieModal: {
                movieModalState: false,
                movieId: ""
            }
        }
    })
}

  return (
      <SessionContext.Provider value = {{
        appState: appState,
        setAppState: setAppState,
        logoutHandler: logoutHandler
      }}>
      {console.log("ap state", appState)}
      {appState.error.errorState && (
        <Overlay onCloseOverlay = {closeOverlayHandler} onUnStar = {() => {}}/>
      )}
      {loading ? <Loader /> : (
        <div className = "app">
          <AppHeader loggedIn = {appState.loggedIn} page = {appState.page} onStarred = {starredHandler}/>
          {!appState.loggedIn && (appState.page == "landing") && <Form onLoginSignup = {loginSignupHandler}/>}
          {appState.loggedIn && (appState.page == "dashboard" || appState.page == "genre" || appState.page == "search" || appState.page == "starred") && <Dashboard starred = {appState.page == "starred" ? true : false}/>}
        </div>
      )}
    </SessionContext.Provider>
  );
}

export default App;
