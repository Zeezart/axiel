import React, { useState } from "react"
import { Link } from "react-router-dom"
import { auth, provider } from "../../firebase"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import illustration from "../../assets/signin.svg"
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
        <div id="signin">
            <div className="signin-form-container">
                <div className="illustration-image">
                    <img src={illustration}/>
                </div>
                <div className="form-div">
                    <h1><span>AXIEL</span></h1>
                    <p>Enter your details to join the room</p>
                    <form onSubmit={handleSignInAuth}>
                        <div className="input-div">
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email Address"
                                onChange={handleInputChange}
                                value={userInput.email} 
                            />
                        </div>

                        <div className="input-div">
                            <input
                                type="password"
                                name="password"
                                placeholder="password"
                                onChange={handleInputChange}
                                value={userInput.value}
                            />
                        </div>

                        <button type="submit" className="primary-btn">Sign In</button>
                        
                    </form>
                    
                    <p>or</p>
                    <button onClick={signInWithGoogle} className="secondary-btn">Sign in with Google</button>
                    <p className="paragraph-link">Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </div>
            </div>
        </div>
    )
}

export default SignIn