import React, { useState } from "react"
import { Link } from "react-router-dom"
import { auth, provider } from "../../firebase"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
// import Cookie from "universal-cookie"
// const cookie = new Cookie()

function SignIn(){

    //Handling geetting user's sign in details
    const [userInput, setUserInput] = useState({
        email:"",
        password:""
    })
    const handleInputChange = (e) => {
        const {name,value} = e.target
        setUserInput(prevValue=>{
            return{
                ...prevValue,
                [name]: value
            }
        })
    }

    //Handling signin authentication
        //sign in with email
    const handleSignInAuth =async (e) => {
        e.preventDefault()
        try{
            const result = await signInWithEmailAndPassword(auth, userInput.email, userInput.password)
            // cookie.set("auth-token", result.user.refreshToken)
        }catch{error => {
            console.log(error)
        }}
    }

        //sign in with google
    const signInWithGoogle = async () => {
        try{
            const result = await signInWithPopup(auth,provider)
            // cookie.set("auth-token", result.user.refreshToken)
        }catch{error => {
            console.log(error)
        }}
    }
    return(
        <>
            <form onSubmit={handleSignInAuth}>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email Address"
                    onChange={handleInputChange}
                    value={userInput.email} 
                />

                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={handleInputChange}
                    value={userInput.value}
                />

                <button type="submit">Sign In</button>
                
            </form>
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
            <p>or</p>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </>
    )
}

export default SignIn