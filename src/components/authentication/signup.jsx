import React, { useState } from "react"
import { Link } from "react-router-dom"
import { auth, db } from "../../firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { addDoc, collection, setDoc, doc } from "firebase/firestore"
import illustration from "../../assets/signin.svg"

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
            
            
            
            // await addDoc(usersChatRef, {
            //     uid: auth.currentUser.uid
            // })
        }catch{error => {
            console.log(error)
        }}
    }
    return(
        <>
            
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