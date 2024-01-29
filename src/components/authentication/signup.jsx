import React, { useState,useContext } from "react"
import { Link } from "react-router-dom"
import { auth, db } from "../../firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { addDoc, collection, setDoc, doc } from "firebase/firestore"
import illustration from "../../assets/signin.svg"
import { AuthContext } from "../authContext"

function SignUp(){

    const {userDetails, setUserDetails} = useContext(AuthContext)
    const handleInputChange = (e) => {
        const {name,value} = e.target
        setUserDetails(prevValue=>{
            return{
                ...prevValue,
                [name]: value
            }
        })
    }

    const [error, setError] = useState(false)
    //Handling signin authentication

    const usersRef = collection(db, "users")
    // const usersChatRef = collection(db, "usersChat")
    
    const handleSignUpAuth =async (e) => {
        e.preventDefault()
        try{
            await createUserWithEmailAndPassword(auth, userDetails.email, userDetails.password)
            // saving user in firestore database
            await addDoc(usersRef, {
                uid: auth.currentUser.uid,
                displayName: userDetails.displayName,
                email: auth.currentUser.email
            })
            
        }catch{error => {
            console.error(error)
            setError(true)

            
        }}
        console.log(error)
    }
    return(
        <>
            {error ? <p>Something went wrong;<br/>Ensure you are connected to internet or you provide the information according to the instruction</p> : null}
            <div id="signin">
            <div className="signin-form-container">
                <div className="illustration-image">
                    <img src={illustration}/>
                </div>
                <div className="form-div">
                    <h1>Chatroom: <span>KHAYR</span></h1>
                    <p>Enter your details to join the room</p>
                    <form onSubmit={handleSignUpAuth}>
                        <div className="input-div">
                            <input 
                                type="text" 
                                name="displayName" 
                                placeholder="Username"
                                onChange={handleInputChange}
                                value={userDetails.displayName} 
                            />
                        </div>
                        <div className="input-div">
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email Address"
                                onChange={handleInputChange}
                                value={userDetails.email} 
                            />
                        </div>

                        <div className="input-div">
                            <input
                                type="password"
                                name="password"
                                placeholder="password"
                                onChange={handleInputChange}
                                value={userDetails.value}
                            />
                            {userDetails.password.length < 6 ? <p style={{textAlign: "left", color: "red"}}><small>minimum of 8 characters</small></p> : null}
                        </div>

                        <button type="submit" className="primary-btn">Create Account</button>
                        
                    </form>
                    <p className="paragraph-link">Already have an account? <Link to="/">Sign In</Link></p>
                </div>
            </div>
        </div>
        </>
    )
}

export default SignUp