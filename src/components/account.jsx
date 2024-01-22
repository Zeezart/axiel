import React, { useContext } from "react"
import { auth } from "../firebase"
import {signOut} from "firebase/auth"
import { AuthContext } from "./authContext"
import SearchUsers from "./searchUsers"
 
function Account(){
    const logOut = async() => {
        try{
            await signOut(auth)
        }catch{error => {
            console.log(error)
        }}
    }

    const currentUser = useContext(AuthContext)
    console.log(currentUser)
    return(
        <>
            <h1>WELCOME {currentUser&& currentUser.email}</h1>
            <SearchUsers />
            <button onClick={logOut}>Log Out</button>
        </>
    )
}

export default Account