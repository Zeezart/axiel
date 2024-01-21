import React, { useState } from "react"
import { Link } from "react-router-dom"
import { auth } from "../../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"

function SignUp(){

    //Handling geetting user's sign in details
    const [userDetails, setUserDetails] = useState({
        displayName:"",
        email:"",
        password:""
    })
    const handleInputChange = (e) => {
        const {name,value} = e.target
        setUserDetails(prevValue=>{
            return{
                ...prevValue,
                [name]: value
            }
        })
    }

    //Handling signin authentication
    const handleSignUpAuth =async (e) => {
        e.preventDefault()
        try{
            await createUserWithEmailAndPassword(auth, userDetails.email, userDetails.password)
            console.log(auth)
        }catch{error => {
            console.log(error)
        }}
    }
    return(
        <>
            <form onSubmit={handleSignUpAuth}>
                <input 
                    type="text" 
                    name="displayName" 
                    placeholder="Username"
                    onChange={handleInputChange}
                    value={userDetails.displayName} 
                />
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email Address"
                    onChange={handleInputChange}
                    value={userDetails.email} 
                />

                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={handleInputChange}
                    value={userDetails.value}
                />

                <button type="submit">Create Account</button>
            </form>
            <p>Already have an account? <Link to="/">Sign In</Link></p>
        </>
    )
}

export default SignUp