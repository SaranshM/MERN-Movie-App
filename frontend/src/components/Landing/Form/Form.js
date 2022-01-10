import React, { useState, useContext } from "react"
import './Form.css'
import AppButton from "../../../UI/AppButton/AppButton"
import AppInput from "../../../UI/AppInput/AppInput"
import axios from "axios"
import Overlay from "../../Dashboard/Overlay/Overlay"
import SessionContext from "../../../store/session-context"

const Form = (props) => {

    const ctx = useContext(SessionContext)
    const [ formType, setFormType ] = useState("login")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ confirmPassword, setConfirmPassword ] = useState("")

    const loginFormHandler = () => {
        setEmail("")
        setPassword("")
        setFormType("login")
    }

    const signupFormHandler = () => {
        setEmail("")
        setPassword("")
        setFormType("signup")
    }

    const inputChangeHandler = (value, field) => {
        if(field == "email") {
            setEmail(value)
        }
        else if(field == "password") {
            setPassword(value)
        }
        else if(field == "confirm-password") {
            setConfirmPassword(value)
        }
    }

    const submitHandler = async (event) => {
        event.preventDefault()
        try {
            if(formType == "login") {
                if(email.length == 0 || password.length == 0) {
                    ctx.setAppState((prevState) => {
                        return {
                            ...prevState,
                            overlay: true,
                            error: {
                                errorState: true,
                                errorMsg: "Please fill all the form fields."
                            }
                        }
                    })
                    return
                }
                const reqData = {
                    email: email,
                    password: password
                }
                const resp = await axios.post("http://localhost:9000/login_post", reqData)
                if(resp.data.error) {
                    let msg
                    if(resp.data.msg == "Error: Account does not exist") {
                        msg = "Account does not exist. Please Signup."
                    }
                    else if(resp.data.msg == "Error: Invalid password") {
                        msg = "The entered password is wrong."
                    }
                    else {
                        msg = "Something went wrong, please refresh."
                    }
                    ctx.setAppState((prevState) => {
                        return {
                            ...prevState,
                            overlay: true,
                            error: {
                                errorState: true,
                                errorMsg: msg
                            }
                        }
                    })
                    return
                }
                console.log(resp.data.data)
                props.onLoginSignup(resp.data.data)
            }
            else if(formType == "signup") {
                if(email.length == 0 || password.length == 0 || confirmPassword.length == 0) {
                    ctx.setAppState((prevState) => {
                        return {
                            ...prevState,
                            overlay: true,
                            error: {
                                errorState: true,
                                errorMsg: "Please fill all the form fields."
                            }
                        }
                    })
                    return
                }
                if(password != confirmPassword) {
                    ctx.setAppState((prevState) => {
                        return {
                            ...prevState,
                            overlay: true,
                            error: {
                                errorState: true,
                                errorMsg: "Passwords do not match."
                            }
                        }
                    })
                    return
                }
                const reqData = {
                    email: email,
                    password: password
                }
                const resp = await axios.post("http://localhost:9000/signup_post", reqData)
                if(resp.data.error) {
                    let msg
                    if(resp.data.msg == "Error: Account exists") {
                        msg = "Account already exists with this email. Please login."
                    }
                    else if(resp.data.msg == "Error: Invalid password") {
                        msg = "The format of the entered password is wrong.\n Please include atleast 1 lowercase letter, 1 uppercase letter, 1 special symbol, 1 number and the length must be greater than or equal to 8."
                    }
                    else {
                        msg = "Something went wrong, please refresh."
                    }
                    ctx.setAppState((prevState) => {
                        return {
                            ...prevState,
                            overlay: true,
                            error: {
                                errorState: true,
                                errorMsg: msg
                            }
                        }
                    })
                    return
                }
                console.log(resp.data.data)
                props.onLoginSignup(resp.data.data)
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <React.Fragment>
            <div className = "form-wrap">
                <div className = "switch-forms">
                    <div className = {`form-type ${formType == "login" ? "clicked" : ""}`} onClick = {loginFormHandler}>Login</div>
                    <div className = {`form-type ${formType == "signup" ? "clicked" : ""}`} onClick = {signupFormHandler}>Signup</div>
                </div>
                {formType == "login" && (
                    <form className = "form" onSubmit = {submitHandler}>
                        <AppInput labelId = "email" label = "Email-ID" value = {email} placeholder = "Enter email-ID here..." type = "email" onInputChange = {inputChangeHandler}/>
                        <AppInput labelId = "password" label = "Password" value = {password} placeholder = "Enter password here..." type = "password" onInputChange = {inputChangeHandler}/>
                        <AppButton type = "submit" text = "Log-In" purpose = "login" />
                    </form>
                )}
                {formType == "signup" && (
                    <form className = "form" onSubmit = {submitHandler}>
                        <AppInput labelId = "email" label = "Email-ID" value = {email} placeholder = "Enter email-ID here..." type = "email" onInputChange = {inputChangeHandler}/>
                        <AppInput labelId = "password" label = "Password" value = {password} placeholder = "Enter password here..." type = "password" onInputChange = {inputChangeHandler}/>
                        <AppInput labelId = "confirm-password" label = "Confirm Password" value = {confirmPassword} placeholder = "Enter password here again..." type = "password" onInputChange = {inputChangeHandler}/>
                        <AppButton type = "submit" text = "Sign-Up" purpose = "signup" />
                    </form>
                )}
            </div>
        </React.Fragment>
    )
}

export default Form